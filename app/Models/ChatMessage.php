<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatMessage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'monitoring_session_id',
        'sender_id',
        'sender_type',
        'message',
        'is_flagged',
        'sent_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'is_flagged' => 'boolean',
        ];
    }

    /**
     * Get the monitoring session for this message.
     *
     * @return BelongsTo<MonitoringSession, ChatMessage>
     */
    public function monitoringSession(): BelongsTo
    {
        return $this->belongsTo(MonitoringSession::class);
    }

    /**
     * Get the sender of this message.
     *
     * @return BelongsTo<User, ChatMessage>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the flags for this message.
     *
     * @return HasMany<ChatFlag>
     */
    public function flags(): HasMany
    {
        return $this->hasMany(ChatFlag::class);
    }
}
