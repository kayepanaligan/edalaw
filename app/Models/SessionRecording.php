<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionRecording extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'monitoring_session_id',
        'recording_type',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'duration_seconds',
        'recorded_at',
        'metadata',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /**
     * Get the monitoring session for this recording.
     *
     * @return BelongsTo<MonitoringSession, SessionRecording>
     */
    public function monitoringSession(): BelongsTo
    {
        return $this->belongsTo(MonitoringSession::class);
    }
}
