<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Location;
use App\Models\Subscription;
use App\Support\PropertyTransactionTypes;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $transactionType = $request->input('transaction_type', $request->input('type'));
        $subscriptionPriority = Subscription::query()
            ->selectRaw("user_id, MAX(CASE plan WHEN 'enterprise' THEN 3 WHEN 'premium' THEN 2 WHEN 'basic' THEN 1 ELSE 0 END) as plan_priority")
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->groupBy('user_id');

        $query = Property::with([
            'location',
            'user',
            'user.activeSubscription',
            'images' => function ($query) {
                $query->first();
            },
        ])
        ->leftJoinSub($subscriptionPriority, 'subscription_priority', function ($join) {
            $join->on('properties.user_id', '=', 'subscription_priority.user_id');
        })
        ->select('properties.*')
        ->where('properties.status', 'aprobado')
        ->orderByRaw('COALESCE(subscription_priority.plan_priority, 0) DESC')
        ->orderBy('properties.is_featured', 'desc')
        ->orderBy('properties.created_at', 'desc');

        if ($transactionType) {
            $query->where('properties.transaction_type', $transactionType);
        }

        if ($request->filled('location_id')) {
            $query->where('properties.location_id', $request->location_id);
        }

        if ($request->filled('min_price')) {
            $query->where('properties.price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('properties.price', '<=', $request->max_price);
        }

        if ($request->boolean('featured')) {
            $query->where('properties.is_featured', true);
        }

        if ($request->filled('bedrooms')) {
            $query->where('properties.bedrooms', '>=', (int) $request->input('bedrooms'));
        }

        if ($request->filled('min_area')) {
            $query->where('properties.area', '>=', $request->input('min_area'));
        }

        if ($request->filled('max_area')) {
            $query->where('properties.area', '<=', $request->input('max_area'));
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->input('search')) . '%';
            $query->where(function ($builder) use ($search) {
                $builder->where('properties.title', 'like', $search)
                    ->orWhere('properties.description', 'like', $search)
                    ->orWhereHas('location', function ($locationQuery) use ($search) {
                        $locationQuery->where('name', 'like', $search)
                            ->orWhere('city', 'like', $search)
                            ->orWhere('state', 'like', $search);
                    });
            });
        }

        $properties = $query->paginate(12)->withQueryString();
        $locations = Location::select('id', 'name', 'city', 'state', 'latitude', 'longitude')->get();

        return Inertia::render('Home', [
            'properties' => $properties,
            'locations' => $locations,
            'filters' => array_merge(
                $request->only(['type', 'transaction_type', 'location_id', 'min_price', 'max_price', 'featured', 'bedrooms', 'min_area', 'max_area', 'search']),
                ['transaction_type' => $transactionType]
            ),
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $subscription = $user->subscriptions()->active()->first();

        if (! $subscription) {
            return Inertia::render('Property/Create', [
                'message' => 'Debes tener una suscripción activa para crear propiedades.',
            ]);
        }

        $locations = Location::select('id', 'name', 'city', 'state', 'latitude', 'longitude')->get();
        $subscriptionData = array_merge($subscription->toArray(), [
            'properties_left' => max(0, $subscription->max_properties - $user->properties()->count()),
        ]);

        return Inertia::render('Property/Create', [
            'locations' => $locations,
            'subscription' => $subscriptionData,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if (! $user->hasActiveSubscription()) {
            return back()->with('error', 'Suscripción no activa.');
        }

        $subscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->first();

        $propertyCount = $user->properties()->count();
        if ($propertyCount >= $subscription->max_properties) {
            return back()->with('error', "Alcanzaste el límite de {$subscription->max_properties} propiedades en tu plan.");
        }

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'title' => 'required|string|min:5|max:255',
            'description' => 'required|string|min:20',
            'price' => 'required|numeric|min:0',
            'type' => ['nullable', Rule::in(PropertyTransactionTypes::all())],
            'transaction_type' => ['nullable', Rule::in(PropertyTransactionTypes::all())],
            'currency' => 'nullable|in:USD,BOB',
            'anticretico_registered_ddrr' => 'nullable|boolean',
            'contract_duration_years' => 'nullable|integer|min:1|max:10',
            'min_stay_days' => 'nullable|integer|min:1|max:365',
            'requires_guarantee' => 'nullable|boolean',
            'guarantee_amount' => 'nullable|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'area' => 'nullable|numeric|min:0',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_featured' => 'boolean',
        ]);

        $transactionType = $validated['transaction_type'] ?? $validated['type'] ?? 'venta';
        $validated['transaction_type'] = $transactionType;
        $validated['type'] = $transactionType;
        $validated['currency'] = $validated['currency'] ?? 'USD';
        $validated['anticretico_registered_ddrr'] = $transactionType === 'anticretico'
            ? $request->boolean('anticretico_registered_ddrr')
            : false;
        $validated['contract_duration_years'] = $transactionType === 'anticretico'
            ? ($validated['contract_duration_years'] ?? 2)
            : null;
        $validated['min_stay_days'] = $transactionType === 'alquiler_diario'
            ? ($validated['min_stay_days'] ?? 1)
            : null;
        $validated['requires_guarantee'] = $transactionType === 'alquiler_diario'
            ? $request->boolean('requires_guarantee')
            : false;
        $validated['guarantee_amount'] = $transactionType === 'alquiler_diario' && $request->boolean('requires_guarantee')
            ? ($validated['guarantee_amount'] ?? null)
            : null;

        $validated['user_id'] = $user->id;
        $validated['status'] = 'pendiente';
        $validated['is_featured'] = $request->boolean('is_featured') && $subscription->can_featured;

        $property = Property::create($validated);

        return redirect()->route('properties.show', $property)
            ->with('success', 'Propiedad creada exitosamente. Está en revisión.');
    }

    public function show(Property $property): Response
    {
        $viewer = auth()->user();
        if ($property->status !== 'aprobado'
            && (! $viewer || ($viewer->id !== $property->user_id && ! $viewer->isStaff()))) {
            abort(404);
        }

        $property->load([
            'location',
            'user',
            'images',
        ]);

        $similarProperties = Property::with(['location', 'images'])
            ->where('status', 'aprobado')
            ->where('id', '!=', $property->id)
            ->where('transaction_type', $property->transaction_type ?? $property->type)
            ->where('location_id', $property->location_id)
            ->limit(3)
            ->get();

        return Inertia::render('Property/Show', [
            'property' => $property,
            'similarProperties' => $similarProperties,
        ]);
    }

    public function edit(Property $property): Response
    {
        $this->authorize('update', $property);

        $locations = Location::select('id', 'name', 'city', 'state', 'latitude', 'longitude')->get();

        return Inertia::render('Property/Edit', [
            'property' => $property,
            'locations' => $locations,
        ]);
    }

    public function update(Request $request, Property $property)
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'title' => 'required|string|min:5|max:255',
            'description' => 'required|string|min:20',
            'price' => 'required|numeric|min:0',
            'type' => ['nullable', Rule::in(PropertyTransactionTypes::all())],
            'transaction_type' => ['nullable', Rule::in(PropertyTransactionTypes::all())],
            'currency' => 'nullable|in:USD,BOB',
            'anticretico_registered_ddrr' => 'nullable|boolean',
            'contract_duration_years' => 'nullable|integer|min:1|max:10',
            'min_stay_days' => 'nullable|integer|min:1|max:365',
            'requires_guarantee' => 'nullable|boolean',
            'guarantee_amount' => 'nullable|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'area' => 'nullable|numeric|min:0',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_featured' => 'boolean',
        ]);

        $transactionType = $validated['transaction_type'] ?? $validated['type'] ?? $property->transaction_type ?? $property->type;
        $validated['transaction_type'] = $transactionType;
        $validated['type'] = $transactionType;
        $validated['currency'] = $validated['currency'] ?? $property->currency ?? 'USD';
        $validated['anticretico_registered_ddrr'] = $transactionType === 'anticretico'
            ? $request->boolean('anticretico_registered_ddrr')
            : false;
        $validated['contract_duration_years'] = $transactionType === 'anticretico'
            ? ($validated['contract_duration_years'] ?? 2)
            : null;
        $validated['min_stay_days'] = $transactionType === 'alquiler_diario'
            ? ($validated['min_stay_days'] ?? 1)
            : null;
        $validated['requires_guarantee'] = $transactionType === 'alquiler_diario'
            ? $request->boolean('requires_guarantee')
            : false;
        $validated['guarantee_amount'] = $transactionType === 'alquiler_diario' && $request->boolean('requires_guarantee')
            ? ($validated['guarantee_amount'] ?? null)
            : null;

        if (! auth()->user()->hasActiveSubscription()) {
            unset($validated['is_featured']);
        } else {
            $subscription = auth()->user()->subscriptions()
                ->where('status', 'active')
                ->where('end_date', '>=', now())
                ->first();

            if (! $subscription->can_featured) {
                $validated['is_featured'] = false;
            }
        }

        $property->update($validated);

        return redirect()->route('properties.show', $property)
            ->with('success', 'Propiedad actualizada exitosamente.');
    }

    public function destroy(Property $property)
    {
        $this->authorize('delete', $property);

        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', 'Propiedad eliminada exitosamente.');
    }

    public function userProperties(Request $request): Response
    {
        $properties = auth()->user()->properties()
            ->with('location')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Dashboard/User', [
            'properties' => $properties->getCollection()->values(),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'total' => $properties->total(),
            ],
            'user' => auth()->user()->load('subscriptions'),
        ]);
    }
}
