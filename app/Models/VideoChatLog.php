<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoChatLog extends Model
{
    protected $fillable = [
        'meeting_id',
        'participant_id',
        'participant_name',
        'message',
        'timestamp'
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    /**
     * Get the visit session that this chat log belongs to
     */
    public function visitSession()
    {
        return $this->hasOne(VisitSession::class, 'room_id', 'meeting_id');
    }
}
