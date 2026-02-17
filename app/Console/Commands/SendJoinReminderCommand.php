<?php

namespace App\Console\Commands;

use App\Models\VisitSession;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendJoinReminderCommand extends Command
{
    protected $signature = 'visit-sessions:send-join-reminder';

    protected $description = 'Send 5-minute join reminder to visitors when their session is about to start';

    public function handle(): int
    {
        $tz = config('app.timezone');
        $now = Carbon::now($tz);
        $windowStart = $now->copy()->addMinutes(4);
        $windowEnd = $now->copy()->addMinutes(6);

        $sessions = VisitSession::whereNull('join_reminder_sent_at')
            ->whereBetween('scheduled_start', [$windowStart, $windowEnd])
            ->whereNotIn('status', ['completed', 'terminated'])
            ->get();

        foreach ($sessions as $session) {
            NotificationService::createJoinReminderNotification($session);
            $session->update(['join_reminder_sent_at' => $now]);
        }

        $this->info("Sent {$sessions->count()} join reminder(s).");

        return self::SUCCESS;
    }
}
