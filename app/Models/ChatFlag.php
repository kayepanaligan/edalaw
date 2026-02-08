<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatFlag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'chat_message_id',
        'monitoring_session_id',
        'flagged_by',
        'reason',
        'severity',
        'notes',
        'recording_timestamp',
        'escalated_to_admin',
        'escalated_by',
        'escalated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'escalated_at' => 'datetime',
            'escalated_to_admin' => 'boolean',
        ];
    }

    /**
     * Get the chat message that was flagged.
     *
     * @return BelongsTo<ChatMessage, ChatFlag>
     */
    public function chatMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class);
    }

    /**
     * Get the monitoring session for this flag.
     *
     * @return BelongsTo<MonitoringSession, ChatFlag>
     */
    public function monitoringSession(): BelongsTo
    {
        return $this->belongsTo(MonitoringSession::class);
    }

    /**
     * Get the user who flagged this message.
     *
     * @return BelongsTo<User, ChatFlag>
     */
    public function flaggedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by');
    }

    /**
     * Get the user who escalated this flag.
     *
     * @return BelongsTo<User, ChatFlag>
     */
    public function escalatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'escalated_by');
    }
}
