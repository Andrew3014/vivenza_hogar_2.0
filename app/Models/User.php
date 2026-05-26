<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'phone', 'password', 'role', 'whatsapp_number', 'whatsapp_visible'])]
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

    public function verification()
    {
        return $this->hasOne(UserVerification::class);
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

