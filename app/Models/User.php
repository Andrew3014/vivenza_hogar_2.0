<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Database\Factories\UserFactory;
use App\Support\Roles;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'phone', 'password', 'role', 'whatsapp_number', 'whatsapp_visible', 'document_extension'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * This complements the PHP 8 attributes so that
     * mass-assignment works even if attribute-based
     * configuration is disabled.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'whatsapp_number',
        'whatsapp_visible',
        'document_extension',
        'is_account_verified',
        'account_verified_at',
        'account_status',
        'document_number',
        'avatar_url',
        'bio',
        'city',
        'state',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'account_verified_at' => 'datetime',
            'is_account_verified' => 'boolean',
            'whatsapp_visible' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->orderByDesc('end_date');
    }

    public function verification()
    {
        return $this->hasOne(UserVerification::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === Roles::ADMIN;
    }

    public function isAgent(): bool
    {
        return $this->role === Roles::AGENT;
    }

    public function isClient(): bool
    {
        return $this->role === Roles::CLIENT;
    }

    /** Clientes/vendedores y agentes pueden publicar propiedades. */
    public function canPublishProperties(): bool
    {
        return in_array($this->role, Roles::publishers(), true);
    }

    public function isStaff(): bool
    {
        return $this->isAdmin() || $this->isAgent();
    }

    public function subscriptionPriority(): int
    {
        return match ($this->activeSubscription?->plan) {
            'enterprise' => 3,
            'premium' => 2,
            'basic' => 1,
            default => 0,
        };
    }

    public function hasActiveSubscription(): bool
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>=', Carbon::now())
            ->exists();
    }

    public function isVerified(): bool
    {
        return $this->verification?->status === 'aprobado';
    }

    public function isPendingVerification(): bool
    {
        return $this->verification?->status === 'pendiente';
    }

    public function isRejectedVerification(): bool
    {
        return $this->verification?->status === 'rechazado';
    }

    /**
     * Get the WhatsApp contact URL for direct messaging
     * Only returns URL if user is verified and whatsapp is visible
     */
    public function getWhatsAppUrl(): ?string
    {
        if (!$this->isVerified() || !$this->whatsapp_visible || !$this->whatsapp_number) {
            return null;
        }

        // Format: https://wa.me/NUMBER (without spaces, only digits and country code)
        $cleanNumber = preg_replace('/[^0-9+]/', '', $this->whatsapp_number);
        return 'https://wa.me/' . $cleanNumber;
    }

    /**
     * Check if user has a visible WhatsApp number
     */
    public function hasVisibleWhatsApp(): bool
    {
        return $this->isVerified() && $this->whatsapp_visible && !empty($this->whatsapp_number);
    }
}
