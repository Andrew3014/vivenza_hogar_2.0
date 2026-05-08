<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener o crear ubicaciones con coordenadas de La Paz
        $locations = [
            [
                'name' => 'Centro', 
                'city' => 'La Paz', 
                'state' => 'La Paz',
                'country' => 'Bolivia',
                'postal_code' => '00001',
                'latitude' => -16.5404,    // Centro de La Paz
                'longitude' => -68.1486
            ],
            [
                'name' => 'Sopocachi', 
                'city' => 'La Paz', 
                'state' => 'La Paz',
                'country' => 'Bolivia',
                'postal_code' => '00002',
                'latitude' => -16.5256,
                'longitude' => -68.1673
            ],
            [
                'name' => 'San Miguel', 
                'city' => 'La Paz', 
                'state' => 'La Paz',
                'country' => 'Bolivia',
                'postal_code' => '00003',
                'latitude' => -16.5148,
                'longitude' => -68.1527
            ],
            [
                'name' => 'Achumani', 
                'city' => 'La Paz', 
                'state' => 'La Paz',
                'country' => 'Bolivia',
                'postal_code' => '00004',
                'latitude' => -16.5589,
                'longitude' => -68.0974
            ],
            [
                'name' => 'Zona Sur', 
                'city' => 'La Paz', 
                'state' => 'La Paz',
                'country' => 'Bolivia',
                'postal_code' => '00005',
                'latitude' => -16.5806,
                'longitude' => -68.1213
            ],
        ];

        $locationIds = [];
        foreach ($locations as $loc) {
            $location = Location::updateOrCreate(
                ['name' => $loc['name'], 'city' => $loc['city']],
                $loc
            );
            $locationIds[] = $location->id;
        }

        // Obtener usuario agente (o crear uno)
        $user = User::where('role', 'agente')->first();
        if (! $user) {
            $user = User::factory()->create([
                'name' => 'Juan Agente',
                'email' => 'agente@example.com',
                'role' => 'agente',
                'phone' => '+591 789 123456',
            ]);
        }

        // Propiedades de ejemplo (idénticas al proyecto de tu compañero)
        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[0],
            'title' => 'Casa Amplia en Centro - 3 Dormitorios',
            'description' => 'Hermosa casa ubicada en el corazón de La Paz. Totalmente remodelada con acabados de primera calidad. Incluye sala grande, cocina moderna, 3 dormitorios, 2 baños. Acceso a garaje privado.',
            'price' => 350000,
            'type' => 'venta',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 280,
            'status' => 'aprobado',
            'is_featured' => true,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1570129477492-45abd003fa17?w=500&q=60', 'alt_text' => 'Casa principal'],
            ['image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=60', 'alt_text' => 'Sala de estar'],
        ]);

        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[1],
            'title' => 'Departamento Moderno en Sopocachi - 2 Dormitorios',
            'description' => 'Departamento de lujo en zona exclusiva. Vista panorámica de La Paz. Piso 8 con balcón, cocina integrada, 2 dormitorios, 2 baños completos, ascensor privado.',
            'price' => 280000,
            'type' => 'venta',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'area' => 180,
            'status' => 'aprobado',
            'is_featured' => false,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=60', 'alt_text' => 'Departamento exterior'],
            ['image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=60', 'alt_text' => 'Área común'],
        ]);

        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[2],
            'title' => 'Casa Familiar en Alquiler - San Miguel - 4 Dormitorios',
            'description' => 'Hermosa casa para familia grande. Jardín trasero amplio, piscina, 4 dormitorios, 3 baños. Perfecta para directivos o empresarios. Disponible inmediatamente.',
            'price' => 3500,
            'type' => 'alquiler',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area' => 450,
            'status' => 'aprobado',
            'is_featured' => true,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=60', 'alt_text' => 'Fachada principal'],
            ['image_url' => 'https://images.unsplash.com/photo-1522157215553-45f9bda00e6d?w=500&q=60', 'alt_text' => 'Piscina y jardín'],
        ]);

        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[3],
            'title' => 'Departamento Ejecutivo en Alquiler - Achumani',
            'description' => 'Departamento totalmente amueblado listo para habitar. 2 dormitorios, 2 baños, cocina equipada, sala integrada. Internet de alta velocidad incluido. Acceso a zonas comunes.',
            'price' => 2000,
            'type' => 'alquiler',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'area' => 120,
            'status' => 'aprobado',
            'is_featured' => false,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1501183007986-e0ae4e0c8d16?w=500&q=60', 'alt_text' => 'Interior moderno'],
        ]);

        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[4],
            'title' => 'Lote Comercial en Zona Sur - Oportunidad de Inversión',
            'description' => 'Lote de 1000m² en zona de alto desarrollo. Perfecto para proyecto comercial o residencial. Documentación en orden, acceso vehicular garantizado.',
            'price' => 180000,
            'type' => 'venta',
            'bedrooms' => 0,
            'bathrooms' => 0,
            'area' => 1000,
            'status' => 'aprobado',
            'is_featured' => false,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1486304873009-c773a42c63f1?w=500&q=60', 'alt_text' => 'Vista aérea del lote'],
        ]);

        Property::create([
            'user_id' => $user->id,
            'location_id' => $locationIds[0],
            'title' => 'Penthouse Exclusivo en Centro - Lujo Total',
            'description' => 'Penthouse de lujo con vista 360° de La Paz. Terraza amplia, jacuzzi, home theater, 3 amplio dormitorios, 3 baños de mármol. Acabados importados, domótica inteligente.',
            'price' => 750000,
            'type' => 'venta',
            'bedrooms' => 3,
            'bathrooms' => 3,
            'area' => 350,
            'status' => 'aprobado',
            'is_featured' => true,
        ])->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1512917774080-9a485d3fda84?w=500&q=60', 'alt_text' => 'Penthouse principal'],
            ['image_url' => 'https://images.unsplash.com/photo-1578926314433-ed85fc13356f?w=500&q=60', 'alt_text' => 'Terraza con vista'],
        ]);
    }
}
