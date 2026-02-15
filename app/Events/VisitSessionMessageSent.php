<?php

namespace App\Events;

use App\Models\ChatLog;
use App\Models\VisitSession;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VisitSessionMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public VisitSession $session,
        public ChatLog $chatLog
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('visit-session.'.$this->session->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->chatLog->id,
            'visit_session_id' => $this->chatLog->visit_session_id,
            'sender' => $this->chatLog->sender,
            'sender_id' => $this->chatLog->sender_id,
            'message' => $this->chatLog->message,
            'sent_at' => $this->chatLog->sent_at->toIso8601String(),
            'flagged' => $this->chatLog->flagged,
            'flag_reason' => $this->chatLog->flag_reason,
        ];
    }
}
