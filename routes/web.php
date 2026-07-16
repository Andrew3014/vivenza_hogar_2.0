<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\WhatsAppController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// PUBLIC ROUTES

Route::get('/', [PropertyController::class, 'index'])->name('home');
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/planes', function () {
    return Inertia::render('Plans/Index');
})->name('plans.index');

// AUTHENTICATED ROUTES

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/panel', function () {
        return Inertia::render('Dashboard/User', [
            'user' => auth()->user()->load('subscriptions', 'properties'),
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/my-properties', [PropertyController::class, 'userProperties'])->name('properties.user');

    Route::get('/pago', [PaymentController::class, 'index'])->name('payment.index');
    Route::get('/pago/suscripcion', [PaymentController::class, 'contactSubscription'])->name('payment.subscription');
    Route::get('/pago/soporte', [PaymentController::class, 'contactSupport'])->name('payment.support');
    Route::get('/pago/propiedad/{property}', [PaymentController::class, 'contactProperty'])->name('payment.property');
    Route::post('/pago/reporte', [PaymentController::class, 'reportIssue'])->name('payment.report');

    // Verification Routes
    Route::get('/verification', [VerificationController::class, 'show'])->name('verification.show');
    Route::post('/verification/submit', [VerificationController::class, 'submit'])->name('verification.submit');

    // WhatsApp Routes
    Route::post('/whatsapp/update', [WhatsAppController::class, 'updateWhatsAppNumber'])->name('user.update-whatsapp');
    Route::get('/whatsapp/agent/{userId}', [WhatsAppController::class, 'generateWhatsAppLink'])->name('whatsapp.generate-link');
    Route::get('/whatsapp/property/{propertyId}', [WhatsAppController::class, 'getAgentContact'])->name('whatsapp.agent-contact');
});

// PUBLISHER ROUTES (cliente/vendedor y agente)

Route::middleware(['auth', 'verified', 'role:agente,cliente'])->group(function () {
    Route::get('/publicar', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');

    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::patch('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

});

// AGENT OPERATIONS (support, verification and assisted moderation)
Route::middleware(['auth', 'verified', 'role:agente'])->group(function () {
    Route::prefix('agent')->name('agent.')->group(function () {
        Route::get('/propiedades', function () {
            $properties = auth()->user()->properties()->with('location')->get();
            return Inertia::render('Agent/Properties', [
                'properties' => $properties,
            ]);
        })->name('properties.index');

        Route::get('/verificaciones', [VerificationController::class, 'verificationsList'])->name('verifications.index');
        Route::post('/verificaciones/{userId}/aprobar', [VerificationController::class, 'approve'])->name('verifications.approve');
        Route::post('/verificaciones/{userId}/rechazar', [VerificationController::class, 'reject'])->name('verifications.reject');

        Route::get('/suscripciones', function () {
            $subscriptions = \App\Models\Subscription::with('user')->get();
            return Inertia::render('Agent/Subscriptions', [
                'subscriptions' => $subscriptions,
            ]);
        })->name('subscriptions.index');

        Route::get('/mensajes', function () {
            $inquiries = \App\Models\Inquiry::with('user', 'property')->get();
            return Inertia::render('Agent/Messages', [
                'inquiries' => $inquiries,
            ]);
        })->name('messages.index');
    });
});

// ADMIN ROUTES

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/usuarios', [AdminController::class, 'users'])->name('users');
    Route::get('/usuarios/crear', function () {
        return Inertia::render('Admin/CreateUser');
    })->name('users.create');
    Route::post('/usuarios', [AdminController::class, 'storeUser'])->name('users.store');
    Route::patch('/usuarios/{user}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::get('/usuarios/{user}/editar', function () {
        return Inertia::render('Admin/EditUser');
    })->name('users.edit');
    Route::get('/verificaciones', [VerificationController::class, 'verificationsList'])->name('verifications.index');
    Route::post('/verificaciones/{userId}/aprobar', [VerificationController::class, 'approve'])->name('verifications.approve');
    Route::post('/verificaciones/{userId}/rechazar', [VerificationController::class, 'reject'])->name('verifications.reject');
    Route::get('/propiedades', [AdminController::class, 'properties'])->name('properties');
    Route::patch('/propiedades/{property}', [AdminController::class, 'updateProperty'])->name('properties.update');
    Route::patch('/propiedades/{property}/status', [AdminController::class, 'updatePropertyStatus'])->name('properties.status');
    Route::get('/suscripciones', [AdminController::class, 'subscriptions'])->name('subscriptions');
    Route::get('/reportes', [AdminController::class, 'reports'])->name('reports');
    Route::get('/configuracion', [AdminController::class, 'settings'])->name('settings');
});


require __DIR__.'/auth.php';
