<?php

namespace App\Events;

use App\Models\VisitSession;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VisitSessionChatLockChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public VisitSession $session,
        public bool $chatLocked
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('visit-session.'.$this->session->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.lock_changed';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return ['chat_locked' => $this->chatLocked];
    }
}
