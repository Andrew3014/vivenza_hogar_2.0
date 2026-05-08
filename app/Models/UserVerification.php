<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserVerification extends Model
{
    protected $table = 'user_verifications';

    protected $fillable = [
        'user_id',
        'document_front_url',
        'document_back_url',
        'face_photo_url',
        'status',
        'rejection_reason',
        'verified_by_user_id',
        'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    /**
     * Get the user this verification belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who verified this verification
     */
    public function verifiedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }

    /**
     * Verificar si está pendiente
     */
    public function isPending(): bool
    {
        return $this->status === 'pendiente';
    }

    /**
     * Verificar si está aprobado
     */
    public function isApproved(): bool
    {
        return $this->status === 'aprobado';
    }

    /**
     * Verificar si está rechazado
     */
    public function isRejected(): bool
    {
        return $this->status === 'rechazado';
    }

    /**
     * Verificar si tiene todos los documentos
     */
    public function hasAllDocuments(): bool
    {
        return !is_null($this->document_front_url) && 
               !is_null($this->document_back_url) && 
               !is_null($this->face_photo_url);
    }
}
