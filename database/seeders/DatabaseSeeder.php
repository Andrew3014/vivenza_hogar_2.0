<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subscription;
use App\Models\PropertyImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ========================
        // USUARIO ADMINISTRADOR
        // ========================
        $admin = User::factory()->create([
            'name' => 'Admin Vivenza',
            'email' => 'admin@vivenza.com',
            'password' => 'password123', // hash automático por UserFactory
            'role' => 'admin',
            'phone' => '+591 700 000001',
        ]);

        // ========================
        // AGENTES CON SUSCRIPCIONES
        // ========================
        
        // Agente Premium
        $agente1 = User::factory()->create([
            'name' => 'Juan Agente Premier',
            'email' => 'juan@vivenza.com',
            'password' => 'password123',
            'role' => 'agente',
            'phone' => '+591 789 123456',
        ]);
        
        Subscription::create([
            'user_id' => $agente1->id,
            'plan' => 'premium',
            'max_properties' => 50,
            'status' => 'active',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addYear(),
        ]);

        // Agente Basic
        $agente2 = User::factory()->create([
            'name' => 'María Agente Basic',
            'email' => 'maria@vivenza.com',
            'password' => 'password123',
            'role' => 'agente',
            'phone' => '+591 787 234567',
        ]);
        
        Subscription::create([
            'user_id' => $agente2->id,
            'plan' => 'basic',
            'max_properties' => 10,
            'status' => 'active',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonths(3),
        ]);

        // Agente Enterprise
        $agente3 = User::factory()->create([
            'name' => 'Carlos Agente Enterprise',
            'email' => 'carlos@vivenza.com',
            'password' => 'password123',
            'role' => 'agente',
            'phone' => '+591 789 345678',
        ]);
        
        Subscription::create([
            'user_id' => $agente3->id,
            'plan' => 'enterprise',
            'max_properties' => 200,
            'status' => 'active',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addYears(2),
        ]);

        // ========================
        // 7 COMPRADORES/CLIENTES
        // ========================
        for ($i = 1; $i <= 7; $i++) {
            User::factory()->create([
                'name' => "Cliente Comprador $i",
                'email' => "cliente$i@vivenza.com",
                'password' => 'password123',
                'role' => 'cliente',
                'phone' => '+591 70' . str_pad($i, 7, '0', STR_PAD_LEFT),
            ]);
        }

        // Ejecutar seeder de propiedades
        $this->call(PropertySeeder::class);

        // Ejecutar seeder completo de Cochabamba (datos reales para testing)
        $this->call(CochabambaTestSeeder::class);

        // Escenario pequeño y repetible para pruebas de los tres roles,
        // operaciones Bolivia y mapa interactivo.
        $this->call(DemoScenarioSeeder::class);
    }
}
