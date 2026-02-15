<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatLog extends Model
{
    protected $table = 'chat_logs';

    protected $fillable = [
        'visit_session_id',
        'sender',
        'sender_id',
        'message',
        'sent_at',
        'flagged',
        'flag_reason',
        'flagged_by',
        'flagged_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'flagged_at' => 'datetime',
            'flagged' => 'boolean',
        ];
    }

    public function visitSession(): BelongsTo
    {
        return $this->belongsTo(VisitSession::class);
    }

    public function senderUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function flaggedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by');
    }
}
