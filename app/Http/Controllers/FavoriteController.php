<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $properties = $request->user()
            ->favoriteProperties()
            ->where('properties.status', 'aprobado')
            ->with(['location', 'images'])
            ->orderByPivot('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Favorites/Index', [
            'properties' => $properties,
        ]);
    }

    public function store(Request $request, Property $property): RedirectResponse
    {
        abort_unless($property->status === 'aprobado', 404);

        DB::transaction(function () use ($request, $property): void {
            $inserted = Favorite::query()->insertOrIgnore([
                'user_id' => $request->user()->id,
                'property_id' => $property->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($inserted === 1) {
                Property::query()
                    ->whereKey($property->id)
                    ->increment('favorites_count');
            }
        });

        return back()->with('success', 'Propiedad guardada en favoritos.');
    }

    public function destroy(Request $request, Property $property): RedirectResponse
    {
        DB::transaction(function () use ($request, $property): void {
            $deleted = Favorite::query()
                ->where('user_id', $request->user()->id)
                ->where('property_id', $property->id)
                ->delete();

            if ($deleted === 1) {
                Property::query()
                    ->whereKey($property->id)
                    ->where('favorites_count', '>', 0)
                    ->decrement('favorites_count');
            }
        });

        return back()->with('success', 'Propiedad eliminada de favoritos.');
    }
}
