<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\Property;
use Illuminate\Console\Command;

class ExpireSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark expired subscriptions and clean up featured properties';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Iniciando proceso de expiración de suscripciones...');

        // 1. Marcar suscripciones vencidas como 'expired'
        $expired = Subscription::where('status', 'active')
            ->where('end_date', '<', now())
            ->update(['status' => 'expired']);

        $this->info("✅ {$expired} suscripciones marcadas como expiradas.");

        // 2. Remover featured de propiedades de usuarios sin suscripción activa
        $unfeatured = Property::where('is_featured', true)
            ->whereHas('user', function ($query) {
                $query->where(function ($subQuery) {
                    // Usuarios sin suscripción activa
                    $subQuery->whereHas('subscriptions', function ($subQuery2) {
                        $subQuery2->where('status', '!=', 'active')
                            ->orWhere('end_date', '<', now());
                    }, '<', 1)
                    ->orWhereDoesntHave('subscriptions');
                });
            })
            ->update(['is_featured' => false]);

        $this->info("✅ {$unfeatured} propiedades destaque removidas por falta de suscripción.");

        // 3. Notificar a usuarios con suscripciones por vencer (próximos 7 días)
        $expiring = Subscription::where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays(7)])
            ->with('user')
            ->get();

        foreach ($expiring as $subscription) {
            $user = $subscription->user;
            $daysLeft = now()->diffInDays($subscription->end_date);

            $this->info("📧 Notificación: {$user->email} - {$daysLeft} días restantes");
        }

        $this->info("✅ {$expiring->count()} usuarios notificados sobre expiración próxima.");

        // 4. Resumen
        $this->line('');
        $this->info('✅ Proceso completado exitosamente!');
        $this->line('');
        $this->table(
            ['Métrica', 'Cantidad'],
            [
                ['Suscripciones expiradas', $expired],
                ['Propiedades destaque removidas', $unfeatured],
                ['Usuarios notificados', $expiring->count()],
            ]
        );
    }
}
