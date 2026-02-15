<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoRecording extends Model
{
    protected $fillable = [
        'visit_session_id',
        'recording_url',
        'file_path',
        'duration_seconds',
        'started_at',
        'ended_at',
        'end_reason',
        'storage_disk',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    public function visitSession(): BelongsTo
    {
        return $this->belongsTo(VisitSession::class);
    }
}
