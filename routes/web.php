<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// PUBLIC ROUTES

Route::get('/', [PropertyController::class, 'index'])->name('home');
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/test-users', function () {
    return response()->json([
        'total_users' => \App\Models\User::count(),
        'users' => \App\Models\User::all()->toArray()
    ]);
});
Route::get('/test-admin-controller', function () {
    $adminController = new AdminController();
    $users = \App\Models\User::all()->toArray();
    return response()->json([
        'controller_method_returns' => 'Inertia::render',
        'expected_users_data' => $users,
        'users_count' => count($users),
    ]);
});
Route::get('/test-inertia-render', function () {
    // Simular lo que hace AdminController::users()
    $users = \App\Models\User::all();
    return \Inertia\Inertia::render('Admin/Users', [
        'users' => $users,
    ]);
});

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
});

// AGENT ROUTES

Route::middleware(['auth', 'verified', 'role:agente'])->group(function () {
    Route::get('/publicar', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');

    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::patch('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

    // Agent Panel Routes
    Route::prefix('agent')->name('agent.')->group(function () {
        Route::get('/propiedades', function () {
            $properties = auth()->user()->properties()->with('location')->get();
            return Inertia::render('Agent/Properties', [
                'properties' => $properties,
            ]);
        })->name('properties.index');

        Route::get('/verificaciones', [VerificationController::class, 'verificationsList'])->name('verifications.index');

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
    Route::get('/test-json', function () {
        $users = \App\Models\User::all();
        return response()->json([
            'users_collection' => $users,
            'users_array' => $users->toArray(),
            'count' => count($users),
        ]);
    });
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/usuarios', [AdminController::class, 'users'])->name('users');
    Route::get('/usuarios/crear', function () {
        return Inertia::render('Admin/CreateUser');
    })->name('users.create');
    Route::get('/usuarios/{user}/editar', function () {
        return Inertia::render('Admin/EditUser');
    })->name('users.edit');
    Route::get('/propiedades', [AdminController::class, 'properties'])->name('properties');
    Route::get('/suscripciones', [AdminController::class, 'subscriptions'])->name('subscriptions');
    Route::get('/reportes', [AdminController::class, 'reports'])->name('reports');
    Route::get('/configuracion', [AdminController::class, 'settings'])->name('settings');
});


require __DIR__.'/auth.php';
