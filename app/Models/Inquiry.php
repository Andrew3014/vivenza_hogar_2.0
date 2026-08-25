<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inquiry extends Model
{
    protected $fillable = [
        'property_id',
        'user_id',
        'name',
        'email',
        'message',
        'contact_via',
        'seller_phone',
        'buyer_verified',
        'inquiry_status',
        'priority',
    ];

    protected $casts = [
        'buyer_verified' => 'boolean',
    ];

    /**
     * Get the user (buyer) who made the inquiry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the property being inquired about
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the messages associated with this inquiry
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
