<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    public function update(User $user, Property $property): bool
    {
        return $user->canPublishProperties() && $property->user_id === $user->id;
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->canPublishProperties() && $property->user_id === $user->id;
    }
}
