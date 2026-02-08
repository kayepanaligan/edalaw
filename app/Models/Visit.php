<?php

namespace App\Models;

use App\Services\NotificationService;
use App\VisitStatus;
use App\VisitType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'scheduled_date',
        'scheduled_time',
        'visit_type',
        'inmate_first_name',
        'inmate_middle_name',
        'inmate_last_name',
        'status',
        'notes',
        'meeting_link',
        'rejection_reason',
        'daily_co_room_id',
        'daily_co_room_name',
        'daily_co_room_url',
        'daily_co_config',
        'inmate_token',
        'room_created_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'visit_type' => VisitType::class,
            'status' => VisitStatus::class,
            'daily_co_config' => 'array',
            'room_created_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the visit.
     *
     * @return BelongsTo<User, Visit>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appeals for the visit.
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

        static::updated(function ($visit) {
            // Check if status has changed
            if ($visit->wasChanged('status') && $visit->status !== VisitStatus::Pending) {
                NotificationService::createVisitNotification($visit, $visit->status->value);
            }
        });
    }
}
