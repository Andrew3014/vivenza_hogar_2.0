<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Subscription;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_properties' => Property::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'monthly_revenue' => Subscription::where('status', 'active')->count() * 100, // Simulado
            'recent_users' => User::latest()->take(5)->get(),
            'featured_properties' => Property::where('is_featured', true)->take(5)->get(),
        ];

        return Inertia::render('Admin/Dashboard', ['stats' => $stats]);
    }

    public function users(): Response
    {
        try {
            $users = User::select('id', 'name', 'email', 'role', 'phone', 'created_at')->get()->toArray();
            
            return Inertia::render('Admin/Users', [
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            \Log::error('AdminController::users error', ['message' => $e->getMessage()]);
            return Inertia::render('Admin/Users', [
                'users' => [],
            ]);
        }
    }

    public function properties(): Response
    {
        $properties = Property::with('user', 'location')->latest()->get()->toArray();
        return Inertia::render('Admin/Properties', ['properties' => $properties]);
    }

    public function subscriptions(): Response
    {
        $subscriptions = Subscription::with('user')->latest()->get()->toArray();
        return Inertia::render('Admin/Subscriptions', ['subscriptions' => $subscriptions]);
    }

    public function reports(): Response
    {
        return Inertia::render('Admin/Reports');
    }

    public function settings(): Response
    {
        return Inertia::render('Admin/Settings');
    }
}
