<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\ApprovalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'first_name',
        'middle_name',
        'last_name',
        'dob',
        'gender',
        'street',
        'brgy',
        'municipality',
        'province',
        'postal_code',
        'contact_number',
        'role_id',
        'approval_status',
        'rejection_reason',
        'email_verified_at',
        'id_document_1_path',
        'id_document_2_path',
        'email_verified_via_otp',
        'phone_verified_via_otp',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
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
            'two_factor_confirmed_at' => 'datetime',
            'dob' => 'date',
            'approval_status' => ApprovalStatus::class,
        ];
    }

    /**
     * Get the role that owns the user.
     *
     * @return BelongsTo<Role, User>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the appeals for the user.
     *
     * @return HasMany<Appeal>
     */
    public function appeals(): HasMany
    {
        return $this->hasMany(Appeal::class);
    }
}
