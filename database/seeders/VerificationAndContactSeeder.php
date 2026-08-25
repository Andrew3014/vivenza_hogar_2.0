<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use App\Models\Inquiry;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class VerificationAndContactSeeder extends Seeder
{
    public function run(): void
    {
        // ========================
        // CREAR VERIFICACIONES DE IDENTIDAD
        // ========================
        
        $clients = User::where('role', 'cliente')->limit(5)->get();
        foreach ($clients as $client) {
            \DB::table('user_verifications')->insert([
                'user_id' => $client->id,
                'status' => ['pendiente', 'aprobado', 'rechazado'][rand(0, 2)],
                'document_front_url' => 'https://via.placeholder.com/600x400?text=Carnet+Frente',
                'document_back_url' => 'https://via.placeholder.com/600x400?text=Carnet+Reverso',
                'face_photo_url' => 'https://via.placeholder.com/600x400?text=Foto+Rostro',
                'verified_by_user_id' => User::where('role', 'admin')->first()->id,
                'verified_at' => rand(0, 1) ? Carbon::now()->subDays(rand(1, 30)) : null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        // ========================
        // CREAR INQUIRIES (CONTACTOS DE CLIENTES A PROPIEDADES)
        // ========================
        
        $juan = User::where('email', 'juan@vivenza.com')->first();
        $juanProps = $juan->properties()->limit(3)->get();
        
        foreach ($juanProps as $property) {
            for ($i = 0; $i < rand(2, 4); $i++) {
                $client = User::where('role', 'cliente')->inRandomOrder()->first();
                
                $inquiry = \DB::table('inquiries')->insert([
                    'property_id' => $property->id,
                    'user_id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'message' => $this->getRandomMessage(),
                    'contact_via' => 'whatsapp',
                    'seller_phone' => $juan->phone,
                    'buyer_verified' => rand(0, 1) ? true : false,
                    'inquiry_status' => ['pendiente', 'respondido'][rand(0, 1)],
                    'priority' => ['baja', 'media', 'alta'][rand(0, 2)],
                    'created_at' => Carbon::now()->subDays(rand(1, 30)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        // ========================
        // CREAR NOTIFICACIONES
        // ========================
        
        $notifications = [
            ['type' => 'new_inquiry', 'title' => 'Nuevo interesado', 'message' => 'Un cliente se interesó en tu propiedad'],
            ['type' => 'verification_approved', 'title' => 'Cuenta verificada', 'message' => 'Tu cuenta ha sido verificada exitosamente'],
            ['type' => 'property_approved', 'title' => 'Propiedad aprobada', 'message' => 'Tu propiedad ha sido aprobada'],
        ];

        foreach (User::where('role', '!=', 'admin')->limit(8)->get() as $user) {
            for ($i = 0; $i < rand(2, 5); $i++) {
                $notif = $notifications[rand(0, count($notifications) - 1)];
                \DB::table('notifications')->insert([
                    'user_id' => $user->id,
                    'type' => $notif['type'],
                    'title' => $notif['title'],
                    'message' => $notif['message'],
                    'data' => json_encode(['url' => '/panel']),
                    'read_at' => rand(0, 1) ? Carbon::now()->subDays(rand(1, 5)) : null,
                    'created_at' => Carbon::now()->subDays(rand(1, 30)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        echo "✅ Seeder de verificaciones y contactos completado!\n";
    }

    private function getRandomMessage(): string
    {
        $messages = [
            'Hola, me interesa esta propiedad. ¿Puedo visitarla?',
            'Está disponible para una visita este fin de semana?',
            'Me gustaría conocer más detalles sobre la propiedad.',
            'Cuál es el precio final y qué se incluye?',
            'Tengo mucho interés en esta propiedad, ¿podemos hablar?',
            'Es posible hacer una visita virtual?',
            'Necesito más información sobre la ubicación.',
        ];
        
        return $messages[rand(0, count($messages) - 1)];
    }
}
