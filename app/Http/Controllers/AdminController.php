<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\UserVerification;
use App\Models\Subscription;
use App\Support\Roles;
use App\Support\PropertyTransactionTypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            'monthly_revenue' => Subscription::where('status', 'active')->count() * 100, // Simulado
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
}
