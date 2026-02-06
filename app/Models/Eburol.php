<?php

namespace App\Models;

use App\EburolStatus;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Eburol extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'inmate_first_name',
        'inmate_middle_name',
        'inmate_last_name',
        'deceased_first_name',
        'deceased_middle_name',
        'deceased_last_name',
        'deceased_date_of_death',
        'relationship_to_inmate',
        'wake_start_date',
        'wake_end_date',
        'preferred_time',
        'wake_location',
        'additional_details',
        'death_certificate_path',
        'relationship_proof_path',
        'status',
        'admin_notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'deceased_date_of_death' => 'date',
            'wake_start_date' => 'date',
            'wake_end_date' => 'date',
            'status' => EburolStatus::class,
        ];
    }

    /**
     * Get the user that owns the e-burol request.
     *
     * @return BelongsTo<User, Eburol>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appeals for the e-burol.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany<Appeal>
     */
    public function appeals(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Appeal::class, 'appealable');
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::updated(function ($eburol) {
            // Check if status has changed
            if ($eburol->wasChanged('status') && $eburol->status !== EburolStatus::Pending) {
                NotificationService::createEburolNotification($eburol, $eburol->status->value);
            }
        });
    }
}
