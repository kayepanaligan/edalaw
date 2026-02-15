<?php

namespace App\Console\Commands;

use App\Models\VisitSession;
use App\Services\VisitSessionRecordingService;
use Illuminate\Console\Command;

class EndExpiredVisitSessionsCommand extends Command
{
    protected $signature = 'visit-sessions:end-expired';

    protected $description = 'End visit sessions past scheduled_end and stop recording';

    public function handle(VisitSessionRecordingService $recordingService): int
    {
        $sessions = VisitSession::whereIn('status', ['scheduled', 'active'])
            ->where('scheduled_end', '<', now())
            ->get();

        foreach ($sessions as $session) {
            if ($session->recording_status === 'recording' && $session->visitor_participant_id) {
                $recordingService->stopRecordingAndSave($session, $session->visitor_participant_id);
            }

            $endedAt = now();
            $durationSeconds = $session->started_at ? $endedAt->diffInSeconds($session->started_at) : null;

            $session->update([
                'status' => 'completed',
                'recording_status' => $session->recording_status === 'recording' ? 'saved' : $session->recording_status,
                'ended_at' => $endedAt,
                'duration_seconds' => $durationSeconds,
                'end_reason' => 'scheduled_end',
            ]);
        }

        $this->info("Ended {$sessions->count()} expired session(s).");

        return self::SUCCESS;
    }
}
