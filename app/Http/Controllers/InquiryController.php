<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Responder una consulta y marcarla como respondida.
     */
    public function reply(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'message_body' => ['required', 'string', 'max:2000'],
        ]);

        $inquiry->messages()->create([
            'sender_id' => $request->user()->id,
            'message_body' => $validated['message_body'],
            'read_at' => now(),
        ]);

        if ($inquiry->inquiry_status === 'pendiente') {
            $inquiry->update(['inquiry_status' => 'respondido']);
        }

        return back()->with('success', 'Respuesta enviada correctamente.');
    }

    /**
     * Cambiar manualmente el estado de una consulta.
     */
    public function markAsResponded(Request $request, Inquiry $inquiry)
    {
        $validated = $request->validate([
            'inquiry_status' => ['required', 'in:pendiente,respondido,finalizado,rechazado'],
        ]);

        $inquiry->update(['inquiry_status' => $validated['inquiry_status']]);

        return back()->with('success', 'Estado de la consulta actualizado.');
    }
}
