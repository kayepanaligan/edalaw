<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitMonitoredLog extends Model
{
    protected $fillable = [
        'visit_id',
        'meeting_id',
        'room_id',
        'jail_officer_id',
        'visitor_id',
        'visitor_name',
        'inmate_name',
        'visit_type',
        'session_started_at',
        'session_ended_at',
        'duration_seconds',
        'unique_participants_count',
        'participants',
        'session_stats',
        'traces',
        'errors',
        'status',
        'notes',
    ];

    protected $casts = [
        'session_started_at' => 'datetime',
        'session_ended_at' => 'datetime',
        'participants' => 'array',
        'session_stats' => 'array',
        'traces' => 'array',
        'errors' => 'array',
    ];

    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    public function jailOfficer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'jail_officer_id');
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'visitor_id');
    }

    public function getDurationAttribute(): string
    {
        $seconds = $this->duration_seconds;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $secs);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $secs);
        }

        return sprintf('%ds', $secs);
    }
}
