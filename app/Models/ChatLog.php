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

    // Set sent_at to created_at if not provided
    public static function boot()
    {
        parent::boot();
        
        static::creating(function ($chatLog) {
            if (!$chatLog->sent_at) {
                $chatLog->sent_at = now();
            }
        });
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
