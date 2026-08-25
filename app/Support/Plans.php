<?php

namespace App\Support;

/**
 * Catálogo único de planes de suscripción.
 *
 * Los valores de `id` coinciden con el contenido real de `subscriptions.plan`
 * (basic, premium, enterprise). Toda pantalla (pública, pago, admin, agente)
 * debe consumir estos datos y no duplicar precios ni límites.
 */
final class Plans
{
    public const BASIC = 'basic';
    public const PREMIUM = 'premium';
    public const ENTERPRISE = 'enterprise';

    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        return [
            [
                'id' => self::BASIC,
                'name' => 'Básico',
                'price' => 50,
                'max_properties' => 5,
                'can_featured' => false,
                'description' => 'Perfecto para comenzar',
            ],
            [
                'id' => self::PREMIUM,
                'name' => 'Premium',
                'price' => 150,
                'max_properties' => 20,
                'can_featured' => true,
                'description' => 'Para agentes inmobiliarios',
            ],
            [
                'id' => self::ENTERPRISE,
                'name' => 'Enterprise',
                'price' => 500,
                'max_properties' => 100,
                'can_featured' => true,
                'description' => 'Para agencias inmobiliarias',
            ],
        ];
    }

    /** @return list<string> */
    public static function ids(): array
    {
        return array_column(self::all(), 'id');
    }

    public static function find(string $id): ?array
    {
        foreach (self::all() as $plan) {
            if ($plan['id'] === $id) {
                return $plan;
            }
        }

        return null;
    }

    public static function name(string $id): string
    {
        return self::find($id)['name'] ?? $id;
    }

    public static function price(string $id): int
    {
        return self::find($id)['price'] ?? 0;
    }
}
