<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Force MySQL connection
config(['database.default' => 'mysql']);

echo "=== USUARIOS ===\n";
echo "Total: " . \App\Models\User::count() . "\n";
foreach(\App\Models\User::all() as $u) {
    echo "- {$u->name} ({$u->email}) - Rol: {$u->role} - Verificado: " . ($u->is_account_verified ? 'Sí' : 'No') . " - Plan: " . ($u->activeSubscription?->plan ?? 'ninguno') . "\n";
}

echo "\n=== UBICACIONES ===\n";
echo "Total: " . \App\Models\Location::count() . "\n";
foreach(\App\Models\Location::all() as $l) {
    echo "- {$l->name}, {$l->city} ({$l->latitude}, {$l->longitude})\n";
}

echo "\n=== PROPIEDADES ===\n";
echo "Total: " . \App\Models\Property::count() . "\n";
foreach(\App\Models\Property::with('location')->get() as $p) {
    echo "- {$p->title} | {$p->transaction_type} | {$p->status} | {$p->location->name} | {$p->price} {$p->currency} | Imgs: {$p->images->count()}\n";
}

echo "\n=== SUSCRIPCIONES ===\n";
echo "Total: " . \App\Models\Subscription::count() . "\n";
foreach(\App\Models\Subscription::all() as $s) {
    echo "- User: {$s->user->name} | Plan: {$s->plan} | Max: {$s->max_properties} | Featured: " . ($s->can_featured ? 'Sí' : 'No') . " | Status: {$s->status}\n";
}

echo "\n=== VERIFICACIONES ===\n";
echo "Total: " . \App\Models\UserVerification::count() . "\n";
foreach(\App\Models\UserVerification::with('user')->get() as $v) {
    echo "- {$v->user->name}: {$v->status}\n";
}

echo "\n=== FAVORITOS ===\n";
echo "Total: " . \App\Models\Favorite::count() . "\n";