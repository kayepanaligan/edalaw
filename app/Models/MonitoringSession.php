<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MonitoringSession extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'visit_id',
        'eburol_id',
        'visitor_id',
        'session_type',
        'session_token',
        'status',
        'started_at',
        'ended_at',
        'duration_seconds',
        'connection_health',
        'visitor_camera_enabled',
        'visitor_microphone_enabled',
        'chat_locked',
        'video_locked',
        'enforcement_notes',
        'monitored_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'connection_health' => 'array',
        ];
    }

    /**
     * Get the visit for this session.
     *
     * @return BelongsTo<Visit, MonitoringSession>
     */
    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get the e-burol for this session.
     *
     * @return BelongsTo<Eburol, MonitoringSession>
     */
    public function eburol(): BelongsTo
    {
        return $this->belongsTo(Eburol::class);
    }

    /**
     * Get the visitor for this session.
     *
     * @return BelongsTo<User, MonitoringSession>
     */
    public function visitor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'visitor_id');
    }

    /**
     * Get the monitoring officer for this session.
     *
     * @return BelongsTo<User, MonitoringSession>
     */
    public function monitor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'monitored_by');
    }

    /**
     * Get the recordings for this session.
     *
     * @return HasMany<SessionRecording>
     */
    public function recordings(): HasMany
    {
        return $this->hasMany(SessionRecording::class);
    }

    /**
     * Get the chat messages for this session.
     *
     * @return HasMany<ChatMessage>
     */
    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Get the monitoring logs for this session.
     *
     * @return HasMany<MonitoringLog>
     */
    public function monitoringLogs(): HasMany
    {
        return $this->hasMany(MonitoringLog::class);
    }

    /**
     * Get the incidents for this session.
     *
     * @return HasMany<Incident>
     */
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    /**
     * Get the alerts for this session.
     *
     * @return HasMany<MonitoringAlert>
     */
    public function alerts(): HasMany
    {
        return $this->hasMany(MonitoringAlert::class);
    }
}
