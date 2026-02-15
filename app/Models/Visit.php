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
        'monitoring_officer_id',
        'scheduled_date',
        'scheduled_time',
        'visit_type',
        'inmate_first_name',
        'inmate_middle_name',
        'inmate_last_name',
        'status',
        'notes',
        'relationship_proof_path',
        'additional_proof_path',
        'meeting_link',
        'access_key',
        'access_key_expires_at',
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
            'access_key_expires_at' => 'datetime',
            'daily_co_config' => 'array',
            'room_created_at' => 'datetime',
        ];
    }

    /**
     * Generate a unique access key for physical visits.
     * Returns a random 8-12 character alphanumeric key.
     */
    public static function generateAccessKey(): string
    {
        do {
            // Generate random length between 8-12 characters
            $length = random_int(8, 12);
            $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $key = '';
            for ($i = 0; $i < $length; $i++) {
                $key .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (self::where('access_key', $key)->exists());

        return $key;
    }

    /**
     * Whether the scheduled date and time have passed (no longer valid for approval or joining).
     */
    public function isScheduleInPast(): bool
    {
        $end = $this->scheduled_date->copy();
        if ($this->scheduled_time) {
            [$h, $m] = explode(':', $this->scheduled_time);
            $end->setTime((int) $h, (int) $m);
        } else {
            $end->endOfDay();

            return now()->isAfter($end);
        }
        if ($this->visit_type === VisitType::Virtual) {
            $end->addMinutes(10);
        } else {
            $end->addHour();
        }

        return now()->isAfter($end);
    }

    /**
     * Check if the access key is valid (exists and not expired).
     */
    public function isAccessKeyValid(): bool
    {
        if (! $this->access_key || ! $this->access_key_expires_at) {
            return false;
        }

        return now()->isBefore($this->access_key_expires_at);
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
     * Get the monitoring officer assigned to the visit.
     *
     * @return BelongsTo<User, Visit>
     */
    public function monitoringOfficer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'monitoring_officer_id');
    }

    /**
     * Get the visit sessions for this visit.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<VisitSession>
     */
    public function visitSessions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(VisitSession::class);
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
