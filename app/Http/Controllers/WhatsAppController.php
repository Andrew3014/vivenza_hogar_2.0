<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WhatsAppController extends Controller
{
    /**
     * Update user's WhatsApp number and visibility settings
     */
    public function updateWhatsAppNumber(Request $request)
    {
        $user = auth()->user();

        // Validate WhatsApp number
        $validated = $request->validate([
            'whatsapp_number' => [
                'nullable',
                'string',
                'regex:/^\+?[1-9]\d{1,14}$/', // E.164 format validation
            ],
            'whatsapp_visible' => 'boolean',
        ], [
            'whatsapp_number.regex' => 'Por favor ingresa un número de WhatsApp válido (ej: +34 612 345 678)',
        ]);

        // Only allow visible if user is verified and has a number
        if ($validated['whatsapp_visible'] && (!$user->isVerified() || !$validated['whatsapp_number'])) {
            $validated['whatsapp_visible'] = false;
        }

        // Update user
        $user->update($validated);

        return redirect()->back()->with('success', 'Número de WhatsApp actualizado correctamente');
    }

    /**
     * Get agent's WhatsApp contact info for a property
     * Used by the PropertyDetail page
     */
    public function getAgentContact($propertyId)
    {
        $property = \App\Models\Property::findOrFail($propertyId);
        $agent = $property->user;

        // Return only visible and verified WhatsApp info
        return response()->json([
            'name' => $agent->name,
            'whatsapp_number' => $agent->whatsapp_visible ? $agent->whatsapp_number : null,
            'is_verified' => $agent->isVerified(),
            'can_contact' => $agent->whatsapp_visible && $agent->isVerified(),
        ]);
    }

    /**
     * Get WhatsApp URL for direct messaging
     * Validates that user is verified before generating the link
     */
    public function generateWhatsAppLink(Request $request, $userId)
    {
        // Only authenticated and verified users can contact
        if (!auth()->check() || !auth()->user()->isVerified()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $agent = \App\Models\User::findOrFail($userId);

        if (!$agent->hasVisibleWhatsApp()) {
            return response()->json(['error' => 'Este usuario no tiene WhatsApp disponible'], 404);
        }

        return response()->json([
            'url' => $agent->getWhatsAppUrl(),
            'whatsapp_number' => $agent->whatsapp_number,
        ]);
    }
}
