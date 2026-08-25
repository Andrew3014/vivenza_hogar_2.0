<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    private const WHATSAPP_NUMBER = '59169422021';

    public function index(): Response
    {
        $user = auth()->user();
        $subscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->first();

        return Inertia::render('Payments/WhatsApp', [
            'user' => $user,
            'subscription' => $subscription,
            'whatsappNumber' => self::WHATSAPP_NUMBER,
            'plans' => $this->getPlans(),
        ]);
    }

    public function contactSubscription(Request $request)
    {
        $user = auth()->user();
        $plan = $request->query('plan', 'basic');
        $message = $this->buildSubscriptionMessage($user, $plan);
        return $this->redirectToWhatsApp($message);
    }

    public function contactSupport(Request $request)
    {
        $user = auth()->user();
        $subject = $request->query('subject', 'General');

        $message = "Hola 👋\n\n"
            . "Mi nombre es {$user->name}\n"
            . "Email: {$user->email}\n"
            . "Asunto: {$subject}\n\n"
            . "Quisiera más información sobre los servicios de Vivenza Inmobiliaria.\n\n"
            . "Gracias.";

        return $this->redirectToWhatsApp($message);
    }

    public function contactProperty($propertyId)
    {
        $property = \App\Models\Property::with('location')->findOrFail($propertyId);
        $user = auth()->user();

        $location = $property->location;
        $ubicacion = $location
            ? trim(implode(', ', array_filter([$location->city, $location->country])))
            : 'No especificada';

        $message = "Hola 👋\n\n"
            . "Estoy interesado en la siguiente propiedad:\n\n"
            . "📍 {$property->title}\n"
            . "💰 {$property->price} BOB\n"
            . "📌 Ubicación: {$ubicacion}\n\n"
            . "Mi nombre es: {$user->name}\n"
            . "Mi teléfono: " . ($user->phone ?? 'No especificado') . "\n\n"
            . "¿Podría brindarme más información?\n\n"
            . "Gracias.";

        return $this->redirectToWhatsApp($message);
    }

    public function reportIssue(Request $request)
    {
        $validated = $request->validate([
            'issue_type' => 'required|string',
            'description' => 'required|string|max:1000',
        ]);

        $user = auth()->user();

        $message = "Hola 👋\n\n"
            . "Necesito reportar un problema:\n\n"
            . "🔴 Tipo: {$validated['issue_type']}\n"
            . "📝 Descripción:\n"
            . "{$validated['description']}\n\n"
            . "Usuario: {$user->name}\n"
            . "Email: {$user->email}\n\n"
            . "Gracias por su atención.";

        return $this->redirectToWhatsApp($message);
    }

    private function buildSubscriptionMessage($user, $plan): string
    {
        $plans = $this->getPlans();
        $planDetails = $plans[$plan] ?? $plans['basic'];

        return "Hola 👋\n\n"
            . "Me gustaría contratar un plan de suscripción.\n\n"
            . "📦 Plan: " . ucfirst($plan) . "\n"
            . "✨ Características:\n"
            . "• Máx. propiedades: {$planDetails['max_properties']}\n"
            . "• Destacadas: " . ($planDetails['can_featured'] ? 'Sí ✅' : 'No ❌') . "\n"
            . "• Precio: {$planDetails['price']} BOB/mes\n\n"
            . "Datos del usuario:\n"
            . "👤 Nombre: {$user->name}\n"
            . "📧 Email: {$user->email}\n"
            . "📱 Teléfono: " . ($user->phone ?? 'No especificado') . "\n\n"
            . "Quisiera obtener más información y proceder con la contratación.\n\n"
            . "Gracias.";
    }

    private function redirectToWhatsApp($message)
    {
        $encodedMessage = urlencode($message);
        $whatsappUrl = "https://wa.me/" . self::WHATSAPP_NUMBER . "?text={$encodedMessage}";
        return redirect()->away($whatsappUrl);
    }

    private function getPlans(): array
    {
        $plans = [];

        foreach (\App\Support\Plans::all() as $plan) {
            $plans[$plan['id']] = $plan;
        }

        return $plans;
    }
}
