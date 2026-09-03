<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\UserVerification;
use App\Models\Subscription;
use App\Support\Roles;
use App\Support\PropertyTransactionTypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\ZipArchive;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_properties' => Property::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'verified_users' => UserVerification::where('status', 'aprobado')->count(),
            'pending_verifications' => UserVerification::where('status', 'pendiente')->count(),
            'monthly_revenue' => Subscription::where('status', 'active')
                ->get()
                ->sum(fn (Subscription $s) => \App\Support\Plans::price($s->plan)),
            'recent_users' => User::latest()->take(5)->get(),
            'featured_properties' => Property::where('is_featured', true)->take(5)->get(),
            'plan_distribution' => Subscription::selectRaw('plan, COUNT(*) as total')
                ->groupBy('plan')
                ->orderByDesc('total')
                ->get(),
        ];

        return Inertia::render('Admin/Dashboard', ['stats' => $stats]);
    }

    public function users(): Response
    {
        try {
            $users = User::with('verification')
                ->withCount(['properties', 'subscriptions'])
                ->select(
                    'id',
                    'name',
                    'email',
                    'role',
                    'phone',
                    'is_account_verified',
                    'account_status',
                    'document_number',
                    'whatsapp_number',
                    'whatsapp_visible',
                    'city',
                    'state',
                    'created_at'
                )
                ->latest()
                ->get()
                ->toArray();
            
            return Inertia::render('Admin/Users', [
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            \Log::error('AdminController::users error', ['message' => $e->getMessage()]);
            return Inertia::render('Admin/Users', [
                'users' => [],
            ]);
        }
    }

    public function properties(): Response
    {
        $properties = Property::with(['user.activeSubscription', 'location', 'reviewedByUser'])
            ->orderByDesc('is_featured')
            ->orderByDesc('views_count')
            ->latest()
            ->get()
            ->toArray();
        return Inertia::render('Admin/Properties', ['properties' => $properties]);
    }

    public function subscriptions(): Response
    {
        $subscriptions = Subscription::with('user')->latest()->get()->toArray();
        return Inertia::render('Admin/Subscriptions', ['subscriptions' => $subscriptions]);
    }

    public function reports(): Response
    {
        $reports = [
            'users_by_role' => User::selectRaw('role, COUNT(*) as total')->groupBy('role')->get(),
            'users_by_status' => User::selectRaw('account_status, COUNT(*) as total')->groupBy('account_status')->get(),
            'verification_status' => UserVerification::selectRaw('status, COUNT(*) as total')->groupBy('status')->get(),
            'properties_by_type' => Property::selectRaw('transaction_type, COUNT(*) as total')->groupBy('transaction_type')->get(),
            'properties_by_status' => Property::selectRaw('status, COUNT(*) as total')->groupBy('status')->get(),
            'featured_properties' => Property::where('is_featured', true)->count(),
            'premium_publishers' => User::withCount('properties')
                ->whereHas('subscriptions', function ($query) {
                    $query->where('status', 'active')
                        ->whereIn('plan', ['premium', 'enterprise']);
                })
                ->orderByDesc('properties_count')
                ->take(10)
                ->get(['id', 'name', 'email'])
                ->toArray(),
        ];

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('Admin/Settings');
    }

    /** Crear cuentas internas desde el panel (agente o administrador). */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(Roles::all())],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['account_status'] = 'activo';

        User::create($validated);

        return redirect()->route('admin.users')->with('success', 'Cuenta creada correctamente.');
    }

    /** Pantalla de edición de un usuario (sin exponer credenciales). */
    public function editUser(User $user): Response
    {
        return Inertia::render('Admin/EditUser', [
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'phone',
                'account_status',
            ]),
        ]);
    }

    /** Actualizar rol y estado sin exponer credenciales al frontend. */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'role' => ['sometimes', Rule::in(Roles::all())],
            'account_status' => ['sometimes', Rule::in(['activo', 'suspendido', 'eliminado'])],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        if (array_key_exists('password', $validated)) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'Cuenta actualizada correctamente.');
    }

    /** Corrección editorial de una publicación desde administración. */
    public function updateProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'min:5', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'min:20'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'transaction_type' => ['sometimes', Rule::in(PropertyTransactionTypes::all())],
            'currency' => ['sometimes', Rule::in(['USD', 'BOB'])],
            'review_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if (isset($validated['transaction_type'])) {
            $validated['type'] = $validated['transaction_type'];
        }

        $property->update($validated);

        return back()->with('success', 'Publicación corregida correctamente.');
    }

    /** Aprobar, rechazar o dejar pendiente una publicación. */
    public function updatePropertyStatus(Request $request, Property $property)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pendiente', 'aprobado', 'rechazado'])],
            'review_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $property->update([
            'status' => $validated['status'],
            'review_notes' => $validated['review_notes'] ?? null,
            'reviewed_at' => now(),
            'reviewed_by_user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Estado de publicación actualizado.');
    }

    /**
     * Descargar datos verificados de usuarios con propiedades aprobadas.
     * Genera un ZIP organizado por carpeta: {carnet_number}_{full_name}/
     */
    public function downloadVerifiedData(Request $request)
    {
        $verifiedUsers = User::whereHas('verification', function ($query) {
            $query->where('status', 'aprobado');
        })
        ->with(['verification', 'properties' => function ($query) {
            $query->where('status', 'aprobado')->with('images');
        }])
        ->get();

        $zip = new ZipArchive();
        $filename = 'verified_data_' . date('Y-m-d_H-i-s') . '.zip';
        $tempPath = storage_path('app/temp/' . $filename);

        if (!Storage::disk('local')->exists('temp')) {
            Storage::disk('local')->makeDirectory('temp');
        }

        if (!$zip->open($tempPath, ZipArchive::CREATE | ZipArchive::OVERWRITE)) {
            return back()->with('error', 'No se pudo crear el archivo ZIP.');
        }

        foreach ($verifiedUsers as $user) {
            $folderName = $this->sanitizeFolderName(
                ($user->document_number ?? 'sin_ci') . '_' . Str::slug($user->name)
            );

            // Datos del usuario y verificación
            $userData = [
                'user' => $user->only(['id', 'name', 'email', 'phone', 'document_number', 'document_extension', 'city', 'state']),
                'verification' => $user->verification?->only([
                    'document_front_url', 'document_back_url', 'face_photo_url', 'status', 'verified_at'
                ]),
                'properties' => [],
            ];

            foreach ($user->properties as $property) {
                $propertyData = $property->only([
                    'id', 'title', 'description', 'price', 'transaction_type', 'currency',
                    'status', 'bedrooms', 'bathrooms', 'area', 'latitude', 'longitude',
                    'parking_spaces', 'furnished', 'amenities', 'created_at'
                ]);
                $propertyData['images'] = $property->images->map(function ($img) {
                    return [
                        'url' => $img->url,
                        'alt_text' => $img->alt_text,
                    ];
                })->toArray();

                $userData['properties'][] = $propertyData;
            }

            // JSON con todos los datos
            $zip->addFromString("{$folderName}/data.json", json_encode($userData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

            // Imágenes de propiedades
            foreach ($user->properties as $property) {
                $propertyFolder = "{$folderName}/properties/property_{$property->id}";

                foreach ($property->images as $image) {
                    $relativePath = str_replace('/storage/', '', $image->url);
                    if (Storage::disk('public')->exists($relativePath)) {
                        $ext = pathinfo($image->url, PATHINFO_EXTENSION) ?: 'webp';
                        $zip->addFile(
                            Storage::disk('public')->path($relativePath),
                            "{$propertyFolder}/image_{$image->id}.{$ext}"
                        );
                    }
                }
            }

            // Documentos de verificación
            if ($user->verification) {
                $verificationFolder = "{$folderName}/verification";

                foreach (['document_front_url', 'document_back_url', 'face_photo_url'] as $field) {
                    if ($user->verification->$field) {
                        $relativePath = str_replace('/storage/', '', $user->verification->$field);
                        if (Storage::disk('public')->exists($relativePath)) {
                            $ext = pathinfo($user->verification->$field, PATHINFO_EXTENSION) ?: 'jpg';
                            $zip->addFile(
                                Storage::disk('public')->path($relativePath),
                                "{$verificationFolder}/{$field}.{$ext}"
                            );
                        }
                    }
                }
            }
        }

        $zip->close();

        return response()->download($tempPath)->deleteFileAfterSend(true);
    }

    /**
     * Purgar archivos físicos de usuarios verificados (después de descargar respaldo).
     * Mantiene solo datos esenciales en BD.
     */
    public function purgeVerifiedFiles(Request $request)
    {
        $request->validate([
            'confirm' => ['required', 'accepted'],
        ]);

        $verifiedUsers = User::whereHas('verification', function ($query) {
            $query->where('status', 'aprobado');
        })->with('properties.images', 'verification')->get();

        $purgedCount = 0;
        $freedSpace = 0;

        foreach ($verifiedUsers as $user) {
            // Eliminar imágenes de propiedades
            foreach ($user->properties as $property) {
                foreach ($property->images as $image) {
                    $relativePath = str_replace('/storage/', '', $image->url);
                    if (Storage::disk('public')->exists($relativePath)) {
                        $freedSpace += Storage::disk('public')->size($relativePath);
                        Storage::disk('public')->delete($relativePath);
                        $purgedCount++;
                    }
                    $image->delete();
                }

                // Marcar propiedad como purgada
                $property->update(['images_purged_at' => now(), 'images_purged_by' => auth()->id()]);
            }

            // Eliminar documentos de verificación
            if ($user->verification) {
                foreach (['document_front_url', 'document_back_url', 'face_photo_url'] as $field) {
                    if ($user->verification->$field) {
                        $relativePath = str_replace('/storage/', '', $user->verification->$field);
                        if (Storage::disk('public')->exists($relativePath)) {
                            $freedSpace += Storage::disk('public')->size($relativePath);
                            Storage::disk('public')->delete($relativePath);
                            $purgedCount++;
                        }
                    }
                    $user->verification->update([
                        'files_purged_at' => now(),
                        'files_purged_by' => auth()->id(),
                    ]);
                }
            }
        }

        return back()->with('success', "Purga completada. {$purgedCount} archivos eliminados. Espacio liberado: " . $this->formatBytes($freedSpace));
    }

    private function sanitizeFolderName(string $name): string
    {
        // Reemplazar caracteres no válidos para nombres de carpeta
        $name = preg_replace('/[^\p{L}\p{N}_-]/u', '_', $name);
        $name = preg_replace('/_{2,}/', '_', $name);
        return trim($name, '_');
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' bytes';
    }
}
