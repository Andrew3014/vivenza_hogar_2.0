<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'image_url',
        'alt_text',
    ];

    /**
     * Alias `url` para el frontend (cards y galerías usan image.url).
     */
    public function getUrlAttribute(): ?string
    {
        return $this->image_url;
    }

    /**
     * Alias `name` para el frontend (alt de la imagen).
     */
    public function getNameAttribute(): ?string
    {
        return $this->alt_text;
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
