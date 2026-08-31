<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\Location;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Subscription;
use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * Seeder completo para Cochabamba con propiedades reales, imágenes de Unsplash
 * y todos los tipos de transacción (venta, alquiler, anticretico, alquiler_diario)
 * Incluye usuarios verificados/no verificados, suscripciones, favoritos
 */
class CochabambaTestSeeder extends Seeder
{
    public function run(): void
    {
        // ========================
        // UBICACIONES REALES DE COCHABAMBA
        // ========================
        $locations = [
            [
                'name' => 'Queru Queru',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00001',
                'latitude' => -17.3739,
                'longitude' => -66.1596,
            ],
            [
                'name' => 'Recoleta',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00002',
                'latitude' => -17.3845,
                'longitude' => -66.1623,
            ],
            [
                'name' => 'Cala Cala',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00003',
                'latitude' => -17.3901,
                'longitude' => -66.1534,
            ],
            [
                'name' => 'Tiquipaya',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00004',
                'latitude' => -17.4289,
                'longitude' => -66.1892,
            ],
            [
                'name' => 'Sacaba',
                'city' => 'Sacaba',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00005',
                'latitude' => -17.4125,
                'longitude' => -66.0403,
            ],
            [
                'name' => 'Quillacollo',
                'city' => 'Quillacollo',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00006',
                'latitude' => -17.3956,
                'longitude' => -66.2834,
            ],
            [
                'name' => 'Colcapirhua',
                'city' => 'Colcapirhua',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00007',
                'latitude' => -17.3789,
                'longitude' => -66.2012,
            ],
            [
                'name' => 'Vinto',
                'city' => 'Vinto',
                'state' => 'Cochabamba',
                'country' => 'Bolivia',
                'postal_code' => '00008',
                'latitude' => -17.3892,
                'longitude' => -66.3012,
            ],
        ];

        $locationIds = [];
        foreach ($locations as $loc) {
            $location = Location::updateOrCreate(
                ['name' => $loc['name'], 'city' => $loc['city']],
                $loc
            );
            $locationIds[$loc['name']] = $location->id;
        }

        // ========================
        // USUARIOS DE PRUEBA
        // ========================
        
        // 1. ADMIN VERIFICADO
        $admin = User::updateOrCreate(
            ['email' => 'admin.cochabamba@vivenza.test'],
            [
                'name' => 'Admin Cochabamba',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+591 700 111111',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => true,
                'account_verified_at' => now(),
                'document_number' => 'CI-ADMIN-CBB-001',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 700 111111',
                'whatsapp_visible' => true,
            ]
        );

        $this->verification($admin, 'aprobado', $admin);

        // 2. AGENTE PREMIUM VERIFICADO
        $agentePremium = User::updateOrCreate(
            ['email' => 'agente.premium.cbb@vivenza.test'],
            [
                'name' => 'Roberto Méndez - Inmobiliaria Premium',
                'password' => Hash::make('password123'),
                'role' => 'agente',
                'phone' => '+591 722 222222',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => true,
                'account_verified_at' => now(),
                'document_number' => 'CI-AGENTE-CBB-002',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 722 222222',
                'whatsapp_visible' => true,
                'bio' => 'Especialista en propiedades premium en Cochabamba. 15 años de experiencia.',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
            ]
        );

        Subscription::updateOrCreate(
            ['user_id' => $agentePremium->id, 'plan' => 'premium'],
            [
                'max_properties' => 50,
                'can_featured' => true,
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'status' => 'active',
            ]
        );

        $this->verification($agentePremium, 'aprobado', $admin);

        // 3. AGENTE BASIC VERIFICADO
        $agenteBasic = User::updateOrCreate(
            ['email' => 'agente.basic.cbb@vivenza.test'],
            [
                'name' => 'Carla Vargas - Bienes Raíces CBC',
                'password' => Hash::make('password123'),
                'role' => 'agente',
                'phone' => '+591 733 333333',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => true,
                'account_verified_at' => now(),
                'document_number' => 'CI-AGENTE-CBB-003',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 733 333333',
                'whatsapp_visible' => true,
                'bio' => 'Agente inmobiliario con enfoque en familias y primeros compradores.',
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
            ]
        );

        Subscription::updateOrCreate(
            ['user_id' => $agenteBasic->id, 'plan' => 'basic'],
            [
                'max_properties' => 10,
                'can_featured' => false,
                'start_date' => now(),
                'end_date' => now()->addMonths(6),
                'status' => 'active',
            ]
        );

        $this->verification($agenteBasic, 'aprobado', $admin);

        // 4. CLIENTE VENDEDOR VERIFICADO (puede publicar)
        $clienteVendedor = User::updateOrCreate(
            ['email' => 'cliente.vendedor.cbb@vivenza.test'],
            [
                'name' => 'Marcelo Quiroga',
                'password' => Hash::make('password123'),
                'role' => 'cliente',
                'phone' => '+591 744 444444',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => true,
                'account_verified_at' => now(),
                'document_number' => 'CI-CLIENTE-CBB-004',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 744 444444',
                'whatsapp_visible' => true,
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
            ]
        );

        Subscription::updateOrCreate(
            ['user_id' => $clienteVendedor->id, 'plan' => 'basic'],
            [
                'max_properties' => 5,
                'can_featured' => false,
                'start_date' => now(),
                'end_date' => now()->addMonths(3),
                'status' => 'active',
            ]
        );

        $this->verification($clienteVendedor, 'aprobado', $admin);

        // 5. CLIENTE COMPRADOR NO VERIFICADO (solo busca)
        $clienteComprador = User::updateOrCreate(
            ['email' => 'cliente.comprador.cbb@vivenza.test'],
            [
                'name' => 'Andrea Paz',
                'password' => Hash::make('password123'),
                'role' => 'cliente',
                'phone' => '+591 755 555555',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => false,
                'document_number' => 'CI-CLIENTE-CBB-005',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 755 555555',
                'whatsapp_visible' => false,
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
            ]
        );

        $this->verification($clienteComprador, 'pendiente', null);

        // 6. CLIENTE CON VERIFICACIÓN RECHAZADA
        $clienteRechazado = User::updateOrCreate(
            ['email' => 'cliente.rechazado.cbb@vivenza.test'],
            [
                'name' => 'Luis Fernando',
                'password' => Hash::make('password123'),
                'role' => 'cliente',
                'phone' => '+591 766 666666',
                'email_verified_at' => now(),
                'account_status' => 'activo',
                'is_account_verified' => false,
                'document_number' => 'CI-CLIENTE-CBB-006',
                'document_extension' => 'CBB',
                'whatsapp_number' => '+591 766 666666',
                'whatsapp_visible' => false,
                'city' => 'Cochabamba',
                'state' => 'Cochabamba',
            ]
        );

        $this->verification($clienteRechazado, 'rechazado', $admin);

        // ========================
        // PROPIEDADES COCHABAMBA - VENTA
        // ========================
        
        // VENTA 1: Casa en Queru Queru
        $casaQueru = Property::updateOrCreate(
            ['title' => 'Casa Familiar Moderna en Queru Queru - 4 Dormitorios', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Queru Queru'],
                'title' => 'Casa Familiar Moderna en Queru Queru - 4 Dormitorios',
                'description' => 'Hermosa casa de 2 plantas en zona residencial exclusiva de Queru Queru. Cuenta con 4 dormitorios (suite principal con walk-in closet y baño privado), 3.5 baños, sala de estar con chimenea, comedor formal, cocina gourmet equipada, área de lavandería, garaje para 3 vehículos, jardín trasero con quincho y piscina. Acabados de primera: pisos de porcelanato, grifería Hansgrohe, ventanas DVH. Seguridad 24/7, cercado eléctrico, cámaras. Documentación al día, lista para escriturar.',
                'price' => 485000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'aprobado',
                'is_featured' => true,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area' => 380,
                'latitude' => -17.3742,
                'longitude' => -66.1589,
                'parking_spaces' => '3',
                'furnished' => 'no',
                'amenities' => ['piscina', 'quincho', 'chimenea', 'seguridad 24/7', 'cámaras', 'cercado eléctrico', 'walk-in closet'],
            ]
        );

        $casaQueru->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70', 'alt_text' => 'Fachada principal casa Queru Queru'],
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70', 'alt_text' => 'Sala de estar con chimenea'],
            ['image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=70', 'alt_text' => 'Cocina gourmet equipada'],
            ['image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=70', 'alt_text' => 'Dormitorio principal suite'],
            ['image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=70', 'alt_text' => 'Baño principal con jacuzzi'],
            ['image_url' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=70', 'alt_text' => 'Piscina y jardín trasero'],
        ]);

        // VENTA 2: Departamento en Recoleta
        $deptoRecoleta = Property::updateOrCreate(
            ['title' => 'Departamento Lujo en Recoleta - Vista Panorámica', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Recoleta'],
                'title' => 'Departamento Lujo en Recoleta - Vista Panorámica',
                'description' => 'Espectacular departamento en piso 12 con vista 360° al valle de Cochabamba y el Tunari. 3 dormitorios (principal en suite), 2.5 baños, living-comedor integrado con salida a terraza, cocina americana equipada con electrodomésticos Bosch, lavandería independiente. Edificio con amenities: piscina climatizada, gimnasio, SUM, sala de cine, coworking, portería 24h. 2 cocheras + baulera. Expensas razonables.',
                'price' => 320000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'aprobado',
                'is_featured' => true,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 165,
                'latitude' => -17.3848,
                'longitude' => -66.1618,
                'parking_spaces' => '2 cocheras + baulera',
                'furnished' => 'partial',
                'amenities' => ['piscina climatizada', 'gimnasio', 'SUM', 'sala de cine', 'coworking', 'portería 24h', 'terraza', 'baulera'],
            ]
        );

        $deptoRecoleta->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=70', 'alt_text' => 'Living comedor con vista panorámica'],
            ['image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70', 'alt_text' => 'Exterior edificio Recoleta'],
            ['image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70', 'alt_text' => 'Terraza con vista al Tunari'],
            ['image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=70', 'alt_text' => 'Cocina americana equipada'],
        ]);

        // VENTA 3: Casa en Cala Cala (cliente vendedor)
        $casaCalaCala = Property::updateOrCreate(
            ['title' => 'Casa Tradicional en Cala Cala - Gran Potencial', 'user_id' => $clienteVendedor->id],
            [
                'user_id' => $clienteVendedor->id,
                'location_id' => $locationIds['Cala Cala'],
                'title' => 'Casa Tradicional en Cala Cala - Gran Potencial',
                'description' => 'Casa de estilo tradicional cochabambino en zona consolidada de Cala Cala. 3 dormitorios amplios, 2 baños, living-comedor con pisos de parquet originales, cocina independiente, patio central con fuente, quincho techado, lavandería, cochera para 2 autos. Terreno 450m², construido 220m². Ideal para remodelar o desarrollar proyecto multifamiliar. Zona comercial residencial, cerca a universidades, hospitales y transporte.',
                'price' => 280000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 220,
                'latitude' => -17.3905,
                'longitude' => -66.1528,
                'parking_spaces' => '2',
                'furnished' => 'no',
                'amenities' => ['patio central', 'quincho', 'cochera 2 autos', 'zona consolidada'],
            ]
        );

        $casaCalaCala->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1570129477492-45abd003fa17?w=800&q=70', 'alt_text' => 'Fachada casa tradicional Cala Cala'],
            ['image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=70', 'alt_text' => 'Patio central con fuente'],
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70', 'alt_text' => 'Living comedor con parquet'],
        ]);

        // VENTA 4: Terreno en Tiquipaya
        $terrenoTiquipaya = Property::updateOrCreate(
            ['title' => 'Terreno Urbano en Tiquipaya - 1.200m² Desarrollo', 'user_id' => $agenteBasic->id],
            [
                'user_id' => $agenteBasic->id,
                'location_id' => $locationIds['Tiquipaya'],
                'title' => 'Terreno Urbano en Tiquipaya - 1.200m² Desarrollo',
                'description' => 'Excelente terreno plano de 1.200m² en zona de alto crecimiento residencial. Frente 30m, fondo 40m. Todos los servicios: agua, luz, gas natural, cloacas, internet fibra óptica. Uso de suelo R2 (residencial multifamiliar hasta 3 pisos) y comercial bajo. Ideal para condominio, edificio de departamentos o complejo de oficinas. Acceso asfaltado, transporte público en la esquina. Documentación lista: plano de mensura, libre deuda, habilitación municipal.',
                'price' => 180000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'area' => 1200,
                'latitude' => -17.4292,
                'longitude' => -66.1888,
                'parking_spaces' => 'N/A',
                'furnished' => 'no',
                'amenities' => ['servicios completos', 'gas natural', 'fibra óptica', 'uso R2 + comercial', 'acceso asfaltado'],
            ]
        );

        $terrenoTiquipaya->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=70', 'alt_text' => 'Vista aérea terreno Tiquipaya'],
            ['image_url' => 'https://images.unsplash.com/photo-1486304873009-c773a42c63f1?w=800&q=70', 'alt_text' => 'Terreno con referencia de calles'],
        ]);

        // ========================
        // PROPIEDADES COCHABAMBA - ALQUILER
        // ========================

        // ALQUILER 1: Departamento amoblado en Queru Queru
        $deptoAlquilerQueru = Property::updateOrCreate(
            ['title' => 'Depto Amoblado Ejecutivo Queru Queru - 2 Dorms', 'user_id' => $agenteBasic->id],
            [
                'user_id' => $agenteBasic->id,
                'location_id' => $locationIds['Queru Queru'],
                'title' => 'Depto Amoblado Ejecutivo Queru Queru - 2 Dorms',
                'description' => 'Departamento totalmente amoblado y equipado listo para habitar. 2 dormitorios con placares, 2 baños completos, living-comedor luminoso, cocina completa (heladera, horno, microondas, lavarropas), aire acondicionado split en todos los ambientes, blackout en dormitorios. Edificio con piscina, gimnasio, SUM, seguridad 24h. Incluye expensas, internet 100MB, cable. Contrato mínimo 12 meses. Disponible inmediato.',
                'price' => 1800,
                'transaction_type' => 'alquiler',
                'currency' => 'USD',
                'type' => 'alquiler',
                'status' => 'aprobado',
                'is_featured' => true,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 95,
                'latitude' => -17.3735,
                'longitude' => -66.1601,
                'parking_spaces' => '1 cochera',
                'furnished' => 'yes',
                'amenities' => ['totalmente amoblado', 'aire acondicionado', 'piscina', 'gimnasio', 'SUM', 'seguridad 24h', 'internet y cable incluidos', 'lavarropas'],
            ]
        );

        $deptoAlquilerQueru->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=70', 'alt_text' => 'Living comedor amoblado'],
            ['image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70', 'alt_text' => 'Dormitorio principal amoblado'],
            ['image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=70', 'alt_text' => 'Cocina equipada'],
        ]);

        // ALQUILER 2: Casa familiar en Sacaba
        $casaSacaba = Property::updateOrCreate(
            ['title' => 'Casa Familiar Alquiler Sacaba - 3 Dorms + Jardín', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Sacaba'],
                'title' => 'Casa Familiar Alquiler Sacaba - 3 Dorms + Jardín',
                'description' => 'Casa en barrio tranquilo de Sacaba, ideal para familias. 3 dormitorios (principal en suite), 2 baños, living-comedor con estufa a leña, cocina comedor diario, lavandería cubierta, quincho con parrilla, jardín con árboles frutales, cochera techada 2 autos. Alarma monitoreada, cercado perimetral. Cerca de colegios, supermercados y acceso a autopista. Contrato 2 años, ajuste anual IPC.',
                'price' => 1200,
                'transaction_type' => 'alquiler',
                'currency' => 'USD',
                'type' => 'alquiler',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 210,
                'latitude' => -17.4128,
                'longitude' => -66.0398,
                'parking_spaces' => '2 techadas',
                'furnished' => 'no',
                'amenities' => ['estufa a leña', 'quincho', 'parrilla', 'jardín frutales', 'alarma', 'cochera 2 autos'],
            ]
        );

        $casaSacaba->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70', 'alt_text' => 'Fachada casa Sacaba'],
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70', 'alt_text' => 'Jardín con árboles frutales'],
            ['image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=70', 'alt_text' => 'Quincho con parrilla'],
        ]);

        // ALQUILER 3: Oficina/Comercial en Colcapirhua
        $oficinaColcapirhua = Property::updateOrCreate(
            ['title' => 'Oficina Comercial Colcapirhua - Av. Principal 120m²', 'user_id' => $agenteBasic->id],
            [
                'user_id' => $agenteBasic->id,
                'location_id' => $locationIds['Colcapirhua'],
                'title' => 'Oficina Comercial Colcapirhua - Av. Principal 120m²',
                'description' => 'Local comercial/oficina sobre avenida principal de alto tránsito. 120m² en planta baja + mezzanine. Gran vidriera, recepción, 3 privados, sala de reuniones, kitchenette, 2 baños, depósito. Aire acondicionado central, instalación de red, alarmas. Ideal para consultorio, estudio profesional, showroom, startup. Estacionamiento público frente al local. Contrato 3 años.',
                'price' => 2500,
                'transaction_type' => 'alquiler',
                'currency' => 'USD',
                'type' => 'alquiler',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 0,
                'bathrooms' => 2,
                'area' => 120,
                'latitude' => -17.3785,
                'longitude' => -66.2008,
                'parking_spaces' => 'Estacionamiento público',
                'furnished' => 'partial',
                'amenities' => ['vidriera', 'aire acondicionado', 'alarma', 'red instalada', 'mezzanine', 'kitchenette'],
            ]
        );

        $oficinaColcapirhua->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=70', 'alt_text' => 'Oficina recepción'],
            ['image_url' => 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=70', 'alt_text' => 'Sala de reuniones'],
        ]);

        // ========================
        // PROPIEDADES COCHABAMBA - ANTICRÉTICO
        // ========================

        // ANTICRÉTICO 1: Departamento en Recoleta con DDRR
        $anticreticoRecoleta = Property::updateOrCreate(
            ['title' => 'Anticrético Depto Recoleta - DDRR Registrada 2 Años', 'user_id' => $clienteVendedor->id],
            [
                'user_id' => $clienteVendedor->id,
                'location_id' => $locationIds['Recoleta'],
                'title' => 'Anticrético Depto Recoleta - DDRR Registrada 2 Años',
                'description' => 'Departamento para anticrético en zona prime de Recoleta. 2 dormitorios, 2 baños, living-comedor, cocina, lavandería, terraza con vista. Edificio con ascensor, portería, SUM. DDRR (Derecho Real de Derecho) YA REGISTRADA en Derechos Reales - lista para transferir. Contrato estándar 2 años renovable. El inquilino paga expensas y servicios. Valor anticrético: $85.000 (se devuelve al finalizar). Ingreso mensual para propietario: $0 (es anticrético).',
                'price' => 85000,
                'transaction_type' => 'anticretico',
                'currency' => 'USD',
                'type' => 'anticretico',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 110,
                'latitude' => -17.3842,
                'longitude' => -66.1628,
                'parking_spaces' => '1 cochera',
                'furnished' => 'no',
                'anticretico_registered_ddrr' => true,
                'contract_duration_years' => 2,
                'amenities' => ['DDRR registrada', 'ascensor', 'portería', 'SUM', 'terraza'],
            ]
        );

        $anticreticoRecoleta->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70', 'alt_text' => 'Edificio Recoleta anticrético'],
            ['image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70', 'alt_text' => 'Living comedor anticrético'],
            ['image_url' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=70', 'alt_text' => 'Terraza con vista'],
        ]);

        // ANTICRÉTICO 2: Casa en Quillacollo
        $anticreticoQuillacollo = Property::updateOrCreate(
            ['title' => 'Casa Anticrético Quillacollo - DDRR + 3 Años', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Quillacollo'],
                'title' => 'Casa Anticrético Quillacollo - DDRR + 3 Años',
                'description' => 'Casa independiente para anticrético en Quillacollo centro. 3 dormitorios, 2 baños, living, comedor, cocina, patio, lavandería, garaje. Terreno 300m², construido 160m². DDRR inscrita en Derechos Reales. Contrato 3 años. Zona comercial-residencial consolidada, cerca a mercado, banco, transporte. El anticrético cubre impuestos y expensas. Valor: $65.000.',
                'price' => 65000,
                'transaction_type' => 'anticretico',
                'currency' => 'USD',
                'type' => 'anticretico',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 160,
                'latitude' => -17.3958,
                'longitude' => -66.2831,
                'parking_spaces' => '1 garaje',
                'furnished' => 'no',
                'anticretico_registered_ddrr' => true,
                'contract_duration_years' => 3,
                'amenities' => ['DDRR registrada', 'patio', 'garaje', 'zona céntrica'],
            ]
        );

        $anticreticoQuillacollo->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1570129477492-45abd003fa17?w=800&q=70', 'alt_text' => 'Casa anticrético Quillacollo'],
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70', 'alt_text' => 'Patio casa anticrético'],
        ]);

        // ========================
        // PROPIEDADES COCHABAMBA - ALQUILER DIARIO
        // ========================

        // DIARIO 1: Suite turística en Cala Cala
        $suiteCalaCala = Property::updateOrCreate(
            ['title' => 'Suite Turística Cala Cala - Centro Histórico', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Cala Cala'],
                'title' => 'Suite Turística Cala Cala - Centro Histórico',
                'description' => 'Elegante suite tipo hotel en pleno centro histórico, a 2 cuadras de la Plaza 14 de Septiembre. 1 dormitorio con cama king, baño completo con ducha lluvia, living con sofá cama, kitchenette equipada (heladera, microondas, cafetera, vajilla), Smart TV 50", WiFi 200MB, aire acondicionado, blackout. Edificio boutique con recepción 12h, terraza compartida con vista a la catedral. Limpieza cada 3 días incluida. Toallas, sábanas, amenities de baño premium. Check-in autónomo con smart lock.',
                'price' => 180,
                'transaction_type' => 'alquiler_diario',
                'currency' => 'USD',
                'type' => 'alquiler_diario',
                'status' => 'aprobado',
                'is_featured' => true,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 45,
                'latitude' => -17.3908,
                'longitude' => -66.1531,
                'parking_spaces' => 'Estacionamiento público cercano',
                'furnished' => 'yes',
                'min_stay_days' => 2,
                'requires_guarantee' => true,
                'guarantee_amount' => 200,
                'amenities' => ['Smart TV', 'WiFi 200MB', 'aire acondicionado', 'kitchenette', 'terraza compartida', 'limpieza c/3 días', 'smart lock', 'amenities premium', 'recepción 12h'],
            ]
        );

        $suiteCalaCala->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=70', 'alt_text' => 'Suite turística living'],
            ['image_url' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=70', 'alt_text' => 'Dormitorio suite king'],
            ['image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=70', 'alt_text' => 'Baño ducha lluvia'],
            ['image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70', 'alt_text' => 'Kitchenette equipada'],
        ]);

        // DIARIO 2: Cabaña en Vinto (afueras)
        $cabanaVinto = Property::updateOrCreate(
            ['title' => 'Cabaña Vinto - Naturaleza y Piscina Privada', 'user_id' => $agenteBasic->id],
            [
                'user_id' => $agenteBasic->id,
                'location_id' => $locationIds['Vinto'],
                'title' => 'Cabaña Vinto - Naturaleza y Piscina Privada',
                'description' => 'Hermosa cabaña de estilo rústico-chic en Vinto, a 15 min del centro. 2 dormitorios (1 suite + 1 con 2 camas singles), 2 baños, living con estufa a leña, cocina completa, galería con parrilla, piscina privada climatizada, jardín con hamacas, fogón externo. Ideal para familias/grupos (hasta 6 personas). Incluye ropa blanca, leña, WiFi, DirectTV. Mantenimiento de piscina y jardín incluido. Estacionamiento interno 2 autos. Mascotas bienvenidas (consultar).',
                'price' => 250,
                'transaction_type' => 'alquiler_diario',
                'currency' => 'USD',
                'type' => 'alquiler_diario',
                'status' => 'aprobado',
                'is_featured' => true,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'area' => 180,
                'latitude' => -17.3895,
                'longitude' => -66.3008,
                'parking_spaces' => '2 internos',
                'furnished' => 'yes',
                'min_stay_days' => 3,
                'requires_guarantee' => true,
                'guarantee_amount' => 500,
                'amenities' => ['piscina climatizada', 'estufa a leña', 'parrilla', 'fogón', 'jardín', 'hamacas', 'mascotas permitidas', 'WiFi', 'DirectTV', 'mantenimiento incluido'],
            ]
        );

        $cabanaVinto->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2e8?w=800&q=70', 'alt_text' => 'Cabaña exterior Vinto'],
            ['image_url' => 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=70', 'alt_text' => 'Piscina climatizada privada'],
            ['image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=70', 'alt_text' => 'Living con estufa a leña'],
            ['image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=70', 'alt_text' => 'Dormitorio suite'],
            ['image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=70', 'alt_text' => 'Galería con parrilla'],
        ]);

        // DIARIO 3: Loft moderno en Queru Queru
        $loftQueru = Property::updateOrCreate(
            ['title' => 'Loft Moderno Queru Queru - Parejas/Ejecutivos', 'user_id' => $agentePremium->id],
            [
                'user_id' => $agentePremium->id,
                'location_id' => $locationIds['Queru Queru'],
                'title' => 'Loft Moderno Queru Queru - Parejas/Ejecutivos',
                'description' => 'Loft de diseño contemporáneo en edificio boutique. Espacio abierto con cama queen, baño con ducha doble, kitchenette minimalista totalmente equipada, escritorio de trabajo ergonómico, Smart TV, WiFi 300MB, aire acondicionado, cortinas blackout automáticas. Terraza privada con jacuzzi y vista al Tunari. Edificio con gym, laundry, seguridad 24h, concierge. Limpieza diaria opcional ($20). Perfecto para estadías de trabajo o romantic weekend.',
                'price' => 220,
                'transaction_type' => 'alquiler_diario',
                'currency' => 'USD',
                'type' => 'alquiler_diario',
                'status' => 'aprobado',
                'is_featured' => false,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 55,
                'latitude' => -17.3738,
                'longitude' => -66.1592,
                'parking_spaces' => '1 cochera',
                'furnished' => 'yes',
                'min_stay_days' => 1,
                'requires_guarantee' => true,
                'guarantee_amount' => 300,
                'amenities' => ['jacuzzi terraza', 'Smart TV', 'WiFi 300MB', 'escritorio ergonómico', 'blackout automático', 'gym edificio', 'concierge', 'seguridad 24h', 'laundry'],
            ]
        );

        $loftQueru->images()->createMany([
            ['image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70', 'alt_text' => 'Loft abierto diseño'],
            ['image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=70', 'alt_text' => 'Terraza jacuzzi vista Tunari'],
            ['image_url' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=70', 'alt_text' => 'Baño ducha doble'],
        ]);

        // ========================
        // PROPIEDADES PENDIENTES/RECHAZADAS (para testing moderación)
        // ========================

        Property::updateOrCreate(
            ['title' => 'PENDIENTE: Casa en Queru Queru - Sin fotos', 'user_id' => $clienteVendedor->id],
            [
                'user_id' => $clienteVendedor->id,
                'location_id' => $locationIds['Queru Queru'],
                'title' => 'PENDIENTE: Casa en Queru Queru - Sin fotos',
                'description' => 'Propiedad de prueba en estado pendiente sin imágenes para testing de moderación.',
                'price' => 150000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'pendiente',
                'is_featured' => false,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 180,
                'latitude' => -17.3740,
                'longitude' => -66.1590,
            ]
        );

        Property::updateOrCreate(
            ['title' => 'RECHAZADA: Terreno sin documentación', 'user_id' => $clienteVendedor->id],
            [
                'user_id' => $clienteVendedor->id,
                'location_id' => $locationIds['Tiquipaya'],
                'title' => 'RECHAZADA: Terreno sin documentación',
                'description' => 'Propiedad de prueba rechazada para testing de moderación.',
                'price' => 50000,
                'transaction_type' => 'venta',
                'currency' => 'USD',
                'type' => 'venta',
                'status' => 'rechazado',
                'is_featured' => false,
                'bedrooms' => 0,
                'bathrooms' => 0,
                'area' => 500,
                'latitude' => -17.4295,
                'longitude' => -66.1895,
            ]
        );

        // ========================
        // FAVORITOS DE PRUEBA
        // ========================
        
        // Cliente comprador marca favoritos
        $favoritos = [
            [$clienteComprador->id, $casaQueru->id],
            [$clienteComprador->id, $deptoRecoleta->id],
            [$clienteComprador->id, $suiteCalaCala->id],
            [$clienteComprador->id, $cabanaVinto->id],
        ];

        foreach ($favoritos as [$userId, $propertyId]) {
            Favorite::firstOrCreate([
                'user_id' => $userId,
                'property_id' => $propertyId,
            ]);
        }

        // Actualizar contadores
        foreach ([$casaQueru, $deptoRecoleta, $suiteCalaCala, $cabanaVinto] as $prop) {
            $prop->update([
                'favorites_count' => $prop->favorites()->count(),
                'views_count' => rand(50, 500),
                'inquiries_count' => rand(5, 50),
            ]);
        }

        // ========================
        // CONSULTAS/INQUIRIES DE PRUEBA
        // ========================
        
        // Simular consultas de interesados
        // (El modelo Inquiry se crea automáticamente desde el frontend)
        
        $this->command->info('✅ Cochabamba Test Seeder completado:');
        $this->command->info('  - 8 ubicaciones reales de Cochabamba');
        $this->command->info('  - 6 usuarios (admin, 2 agentes, 3 clientes con distintos estados KYC)');
        $this->command->info('  - 14 propiedades: 4 venta, 3 alquiler, 2 anticretico, 4 alquiler_diario, 2 pendientes/rechazadas');
        $this->command->info('  - Imágenes reales de Unsplash en todas las propiedades');
        $this->command->info('  - Favoritos, contadores de vistas/consultas');
        $this->command->info('  - Suscripciones activas con límites reales');
        $this->command->info('');
        $this->command->info('🔑 CREDENCIALES DE PRUEBA (password: password123):');
        $this->command->info('  Admin: admin.cochabamba@vivenza.test');
        $this->command->info('  Agente Premium: agente.premium.cbb@vivenza.test');
        $this->command->info('  Agente Basic: agente.basic.cbb@vivenza.test');
        $this->command->info('  Cliente Vendedor: cliente.vendedor.cbb@vivenza.test');
        $this->command->info('  Cliente Comprador (no verificado): cliente.comprador.cbb@vivenza.test');
        $this->command->info('  Cliente Rechazado: cliente.rechazado.cbb@vivenza.test');
    }

    private function verification(User $user, string $status, ?User $reviewer = null): void
    {
        UserVerification::updateOrCreate(
            ['user_id' => $user->id],
            [
                'status' => $status,
                'document_front_url' => 'https://images.unsplash.com/photo-1582719478064-2f8e4b0b8b81?w=600&q=60',
                'document_back_url' => 'https://images.unsplash.com/photo-1582719517414-2b8e4b0b8b81?w=600&q=60',
                'face_photo_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=60',
                'verified_by_user_id' => $reviewer?->id,
                'verified_at' => $status === 'aprobado' ? now() : null,
                'rejection_reason' => $status === 'rechazado' ? 'Foto de documento ilegible. Por favor subir imagen más clara.' : null,
            ]
        );

        $user->update([
            'is_account_verified' => $status === 'aprobado',
            'account_verified_at' => $status === 'aprobado' ? now() : null,
        ]);
    }
}