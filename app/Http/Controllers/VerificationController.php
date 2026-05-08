<?php

namespace App\Http\Controllers;

use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    /**
     * Mostrar página de verificación
     */
    public function show()
    {
        $user = auth()->user();
        $verification = $user->verification;

        return inertia('Auth/VerifyIdentity', [
            'verification' => $verification,
        ]);
    }

    /**
     * Guardar fotos de verificación
     */
    public function submit(Request $request)
    {
        $request->validate([
            'document_front' => 'required|string',
            'document_back' => 'required|string',
            'face_selfie' => 'required|string',
        ]);

        $user = auth()->user();

        try {
            // Decodificar y guardar foto del frente del documento
            $documentFrontPath = $this->saveBase64Image(
                $request->input('document_front'),
                "verifications/user_{$user->id}/document_front"
            );

            // Decodificar y guardar foto del reverso del documento
            $documentBackPath = $this->saveBase64Image(
                $request->input('document_back'),
                "verifications/user_{$user->id}/document_back"
            );

            // Decodificar y guardar selfie
            $faceSelfie = $this->saveBase64Image(
                $request->input('face_selfie'),
                "verifications/user_{$user->id}/face_selfie"
            );

            // Crear o actualizar verificación
            $verification = UserVerification::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'document_front_url' => $documentFrontPath,
                    'document_back_url' => $documentBackPath,
                    'face_photo_url' => $faceSelfie,
                    'status' => 'pendiente',
                ]
            );

            return response()->json([
                'message' => 'Verificación enviada correctamente',
                'verification' => $verification,
            ]);
        } catch (\Exception $e) {
            \Log::error('Verification submission error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al procesar las fotos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Guardar imagen en base64
     */
    private function saveBase64Image($base64String, $path)
    {
        // Remover el prefijo data:image/jpeg;base64, si existe
        if (strpos($base64String, ',') !== false) {
            list(, $base64String) = explode(',', $base64String);
        }

        // Decodificar base64
        $imageData = base64_decode($base64String);

        if ($imageData === false) {
            throw new \Exception('Invalid base64 image data');
        }

        // Generar nombre de archivo
        $filename = $path . '_' . Str::random(8) . '.jpg';

        // Guardar en storage
        Storage::disk('public')->put($filename, $imageData);

        // Retornar ruta accesible
        return Storage::url($filename);
    }

    /**
     * Ver lista de verificaciones para agentes
     */
    public function verificationsList()
    {
        $verifications = UserVerification::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Agent/Verifications', [
            'verifications' => $verifications,
        ]);
    }

    /**
     * Ver detalles de verificación (para panel de admin)
     */
    public function details($userId)
    {
        $verification = UserVerification::where('user_id', $userId)->firstOrFail();
        $user = $verification->user;

        return inertia('Admin/VerificationDetails', [
            'user' => $user,
            'verification' => $verification,
        ]);
    }

    /**
     * Aprobar verificación
     */
    public function approve(Request $request, $userId)
    {
        $this->authorize('isAdmin');

        $verification = UserVerification::where('user_id', $userId)->firstOrFail();

        $verification->update([
            'status' => 'aprobado',
            'verified_by_user_id' => auth()->id(),
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Verificación aprobada');
    }

    /**
     * Rechazar verificación
     */
    public function reject(Request $request, $userId)
    {
        $this->authorize('isAdmin');

        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $verification = UserVerification::where('user_id', $userId)->firstOrFail();

        $verification->update([
            'status' => 'rechazado',
            'rejection_reason' => $request->input('reason'),
            'verified_by_user_id' => auth()->id(),
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Verificación rechazada');
    }
}
