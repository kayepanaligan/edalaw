<?php

namespace App\Models;

use App\AppealStatus;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Appeal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'appealable_type',
        'appealable_id',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
        'decision_notes',
        'submitted_at',
        'deadline',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AppealStatus::class,
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'deadline' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the appeal.
     *
     * @return BelongsTo<User, Appeal>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who reviewed the appeal.
     *
     * @return BelongsTo<User, Appeal>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the parent appealable model (Visit or Eburol).
     *
     * @return MorphTo<Model, Appeal>
     */
    public function appealable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the documents for the appeal.
     *
     * @return HasMany<AppealDocument>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(AppealDocument::class);
    }

    /**
     * Check if the appeal is still within the deadline.
     */
    public function isWithinDeadline(): bool
    {
        return $this->deadline->isFuture();
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::updated(function ($appeal) {
            // Check if status has changed
            if ($appeal->wasChanged('status') && $appeal->status !== AppealStatus::Pending) {
                NotificationService::createAppealStatusNotification($appeal);
            }
        });
    }
}
