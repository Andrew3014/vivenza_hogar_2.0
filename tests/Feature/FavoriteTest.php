<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Location;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_store_a_favorite(): void
    {
        $property = $this->approvedProperty();

        $this->post(route('favorites.store', $property))
            ->assertRedirect(route('login'));
    }

    public function test_user_can_store_a_property_only_once(): void
    {
        $user = User::factory()->create();
        $property = $this->approvedProperty();

        $this->actingAs($user)->post(route('favorites.store', $property));
        $this->actingAs($user)->post(route('favorites.store', $property));

        $this->assertDatabaseCount('favorites', 1);
        $this->assertDatabaseHas('favorites', [
            'user_id' => $user->id,
            'property_id' => $property->id,
        ]);
        $this->assertSame(1, $property->fresh()->favorites_count);
    }

    public function test_user_can_remove_only_their_own_favorite(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $property = $this->approvedProperty();

        Favorite::create(['user_id' => $owner->id, 'property_id' => $property->id]);
        $property->update(['favorites_count' => 1]);

        $this->actingAs($otherUser)->delete(route('favorites.destroy', $property));
        $this->assertDatabaseCount('favorites', 1);
        $this->assertSame(1, $property->fresh()->favorites_count);

        $this->actingAs($owner)->delete(route('favorites.destroy', $property));
        $this->assertDatabaseCount('favorites', 0);
        $this->assertSame(0, $property->fresh()->favorites_count);
    }

    public function test_unapproved_property_cannot_be_added_to_favorites(): void
    {
        $user = User::factory()->create();
        $property = $this->approvedProperty(['status' => 'pendiente']);

        $this->actingAs($user)
            ->post(route('favorites.store', $property))
            ->assertNotFound();

        $this->assertDatabaseCount('favorites', 0);
    }

    private function approvedProperty(array $overrides = []): Property
    {
        $owner = User::factory()->create();
        $location = Location::create([
            'name' => 'Sopocachi',
            'city' => 'La Paz',
            'state' => 'La Paz',
            'country' => 'Bolivia',
        ]);

        return Property::create(array_merge([
            'user_id' => $owner->id,
            'location_id' => $location->id,
            'title' => 'Departamento de prueba',
            'description' => 'Propiedad para probar favoritos.',
            'price' => 450000,
            'type' => 'venta',
            'transaction_type' => 'venta',
            'currency' => 'BOB',
            'status' => 'aprobado',
        ], $overrides));
    }
}
