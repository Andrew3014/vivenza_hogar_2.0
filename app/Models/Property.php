<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'location_id',
        'title',
        'description',
        'price',
        'transaction_type',
        'currency',
        'type',
        'status',
        'is_featured',
        'bedrooms',
        'bathrooms',
        'area',
        'latitude',
        'longitude',
        'featured_until',
        'views_count',
        'inquiries_count',
        'favorites_count',
        'amenities',
        'parking_spaces',
        'furnished',
        'rules',
        'anticretico_registered_ddrr',
        'contract_duration_years',
        'min_stay_days',
        'requires_guarantee',
        'guarantee_amount',
        'reviewed_at',
        'reviewed_by_user_id',
        'review_notes',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'currency' => 'string',
        'area' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'featured_until' => 'date',
        'views_count' => 'integer',
        'inquiries_count' => 'integer',
        'favorites_count' => 'integer',
        'amenities' => 'array',
        'anticretico_registered_ddrr' => 'boolean',
        'contract_duration_years' => 'integer',
        'min_stay_days' => 'integer',
        'requires_guarantee' => 'boolean',
        'guarantee_amount' => 'decimal:2',
        'type' => 'string',
        'transaction_type' => 'string',
        'status' => 'string',
        'is_featured' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewedByUser()
    {
        return $this->belongsTo(User::class, 'reviewed_by_user_id');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }
}
