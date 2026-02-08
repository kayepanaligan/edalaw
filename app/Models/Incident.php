<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Incident extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'monitoring_session_id',
        'reported_by',
        'title',
        'description',
        'classification',
        'status',
        'attached_chat_excerpts',
        'video_timestamps',
        'notes',
        'reviewed_by',
        'reviewed_at',
        'admin_response',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attached_chat_excerpts' => 'array',
            'video_timestamps' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * Get the monitoring session for this incident.
     *
     * @return BelongsTo<MonitoringSession, Incident>
     */
    public function monitoringSession(): BelongsTo
    {
        return $this->belongsTo(MonitoringSession::class);
    }

    /**
     * Get the user who reported this incident.
     *
     * @return BelongsTo<User, Incident>
     */
    public function reportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    /**
     * Get the user who reviewed this incident.
     *
     * @return BelongsTo<User, Incident>
     */
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
