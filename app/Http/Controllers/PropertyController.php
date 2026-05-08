<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Property::with([
            'location',
            'user',
            'images' => function ($query) {
                $query->first();
            },
        ])
        ->where('status', 'aprobado')
        ->orderBy('is_featured', 'desc')
        ->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $properties = $query->paginate(12)->withQueryString();
        $locations = Location::select('id', 'name', 'city')->get();

        return Inertia::render('Home', [
            'properties' => $properties,
            'locations' => $locations,
            'filters' => $request->only(['type', 'location_id', 'min_price', 'max_price', 'featured']),
        ]);
    }

    public function create(): Response
    {
        if (! auth()->user()->hasActiveSubscription()) {
            return Inertia::render('Properties/CreateError', [
                'message' => 'Debes tener una suscripción activa para crear propiedades.',
            ]);
        }

        $locations = Location::select('id', 'name', 'city')->get();

        return Inertia::render('Properties/Create', [
            'locations' => $locations,
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
            'type' => 'required|in:venta,alquiler',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'area' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
        ]);

        $validated['user_id'] = $user->id;
        $validated['status'] = 'pendiente';
        $validated['is_featured'] = $request->boolean('is_featured') && $subscription->can_featured;

        $property = Property::create($validated);

        return redirect()->route('properties.show', $property)
            ->with('success', 'Propiedad creada exitosamente. Está en revisión.');
    }

    public function show(Property $property): Response
    {
        $property->load([
            'location',
            'user',
            'images',
        ]);

        $similarProperties = Property::with(['location', 'images'])
            ->where('status', 'aprobado')
            ->where('id', '!=', $property->id)
            ->where('type', $property->type)
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

        $locations = Location::select('id', 'name', 'city')->get();

        return Inertia::render('Properties/Edit', [
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
            'type' => 'required|in:venta,alquiler',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'area' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
        ]);

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

        return Inertia::render('Properties/UserList', [
            'properties' => $properties,
        ]);
    }
}
