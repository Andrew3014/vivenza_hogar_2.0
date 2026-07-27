<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Location;
use App\Models\Property;
use App\Models\Subscription;
use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Escenario pequeño y repetible para que backend y frontend prueben los tres
 * roles, los cuatro tipos de operación y el mapa.
 */
class DemoScenarioSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->user([
            'name' => 'Admin Demo',
            'email' => 'admin.demo@vivenza.test',
            'role' => 'admin',
            'document_number' => 'CI-DEMO-ADMIN',
        ]);

        $agent = $this->user([
            'name' => 'Agente Demo',
            'email' => 'agente.demo@vivenza.test',
            'role' => 'agente',
            'document_number' => 'CI-DEMO-AGENTE',
        ]);

        $client = $this->user([
            'name' => 'Cliente Vendedor Demo',
            'email' => 'cliente.demo@vivenza.test',
            'role' => 'cliente',
            'document_number' => 'CI-DEMO-CLIENTE',
        ]);

        $this->subscription($agent, 'premium', 50, true);
        $this->subscription($client, 'basic', 5, false);

        $this->verification($admin, 'aprobado', $admin);
        $this->verification($agent, 'aprobado', $admin);
        $this->verification($client, 'pendiente');

        $locations = [
            ['name' => 'Sopocachi', 'city' => 'La Paz', 'state' => 'La Paz', 'latitude' => -16.52560000, 'longitude' => -68.16730000],
            ['name' => 'San Miguel', 'city' => 'La Paz', 'state' => 'La Paz', 'latitude' => -16.51480000, 'longitude' => -68.15270000],
            ['name' => 'Equipetrol', 'city' => 'Santa Cruz de la Sierra', 'state' => 'Santa Cruz', 'latitude' => -17.76590000, 'longitude' => -63.19570000],
            ['name' => 'Queru Queru', 'city' => 'Cochabamba', 'state' => 'Cochabamba', 'latitude' => -17.37390000, 'longitude' => -66.15960000],
        ];

        $locations = collect($locations)->mapWithKeys(function (array $data) {
            $location = Location::updateOrCreate(
                ['name' => $data['name'], 'city' => $data['city']],
                $data + ['country' => 'Bolivia']
            );

            return [$data['name'] . '|' . $data['city'] => $location];
        });

        $saleProperty = $this->property($agent, $locations['Sopocachi|La Paz'], [
            'title' => 'Demo venta — departamento en Sopocachi',
            'description' => 'Departamento de prueba para validar filtros de venta, precio, dormitorios y marcador del mapa.',
            'price' => 560000,
            'transaction_type' => 'venta',
            'currency' => 'BOB',
            'status' => 'aprobado',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 145,
            'latitude' => -16.52610000,
            'longitude' => -68.16690000,
        ]);

        $this->property($agent, $locations['San Miguel|La Paz'], [
            'title' => 'Demo alquiler — casa familiar en San Miguel',
            'description' => 'Casa amoblada de prueba para validar alquiler mensual, amenidades y contacto con el agente.',
            'price' => 4200,
            'transaction_type' => 'alquiler',
            'currency' => 'BOB',
            'status' => 'aprobado',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area' => 280,
            'latitude' => -16.51430000,
            'longitude' => -68.15310000,
            'furnished' => 'partial',
        ]);

        $this->property($client, $locations['Equipetrol|Santa Cruz de la Sierra'], [
            'title' => 'Demo anticrético — departamento con DDRR',
            'description' => 'Publicación de prueba para revisar DDRR, duración contractual y moneda boliviana.',
            'price' => 280000,
            'transaction_type' => 'anticretico',
            'currency' => 'BOB',
            'status' => 'aprobado',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'area' => 95,
            'latitude' => -17.76620000,
            'longitude' => -63.19530000,
            'anticretico_registered_ddrr' => true,
            'contract_duration_years' => 2,
        ]);

        $this->property($client, $locations['Queru Queru|Cochabamba'], [
            'title' => 'Demo alquiler diario — suite turística',
            'description' => 'Publicación de prueba para estadía mínima, garantía y alquiler temporal.',
            'price' => 280,
            'transaction_type' => 'alquiler_diario',
            'currency' => 'BOB',
            'status' => 'aprobado',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'area' => 42,
            'latitude' => -17.37420000,
            'longitude' => -66.15910000,
            'min_stay_days' => 2,
            'requires_guarantee' => true,
            'guarantee_amount' => 500,
        ]);

        Favorite::firstOrCreate([
            'user_id' => $client->id,
            'property_id' => $saleProperty->id,
        ]);

        $saleProperty->update([
            'favorites_count' => $saleProperty->favorites()->count(),
        ]);
    }

    private function user(array $data): User
    {
        return User::updateOrCreate(
            ['email' => $data['email']],
            $data + [
                'phone' => '+591 700 123456',
                'password' => Hash::make('VivenzaDemo123!'),
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => false,
            ]
        );
    }

    private function subscription(User $user, string $plan, int $maxProperties, bool $canFeatured): void
    {
        Subscription::updateOrCreate(
            ['user_id' => $user->id, 'plan' => $plan],
            [
                'max_properties' => $maxProperties,
                'can_featured' => $canFeatured,
                'start_date' => now()->startOfDay(),
                'end_date' => now()->addYear(),
                'status' => 'active',
            ]
        );
    }

    private function verification(User $user, string $status, ?User $reviewer = null): void
    {
        UserVerification::updateOrCreate(
            ['user_id' => $user->id],
            [
                'status' => $status,
                'document_front_url' => 'https://placehold.co/600x400?text=CI+Frente',
                'document_back_url' => 'https://placehold.co/600x400?text=CI+Reverso',
                'face_photo_url' => 'https://placehold.co/600x400?text=Selfie',
                'verified_by_user_id' => $reviewer?->id,
                'verified_at' => $status === 'aprobado' ? now() : null,
            ]
        );

        $user->update([
            'is_account_verified' => $status === 'aprobado',
            'account_verified_at' => $status === 'aprobado' ? now() : null,
        ]);
    }

    private function property(User $owner, Location $location, array $data): Property
    {
        $type = $data['transaction_type'];

        return Property::updateOrCreate(
            ['title' => $data['title'], 'user_id' => $owner->id],
            $data + [
                'user_id' => $owner->id,
                'location_id' => $location->id,
                'type' => $type,
                'is_featured' => false,
            ]
        );
    }
}
