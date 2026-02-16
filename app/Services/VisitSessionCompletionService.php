<?php

namespace App\Services;

use App\EburolStatus;
use App\Models\CallLog;
use App\Models\VisitSession;
use App\VisitStatus;

class VisitSessionCompletionService
{
    /**
     * Determine session outcome and persist: status, visit/eburol status, and optional CallLog.
     * Call this when a session is ended (by monitor or by scheduled_end).
     *
     * Rules:
     * - completed: both visitor and inmate joined, and a video recording was saved.
     * - no_show: at least one party did not join.
     * - unsuccessful: both joined but recording was not saved.
     */
    public function endSessionWithOutcome(
        VisitSession $session,
        string $endReason = 'monitor_ended'
    ): void {
        $bothJoined = $session->visitor_joined_at && $session->inmate_joined_at;
        $recordingSaved = $session->recording_status === 'saved'
            || $session->videoRecordings()->exists();

        if ($bothJoined && $recordingSaved) {
            $status = 'completed';
            $sessionEndReason = $endReason;
        } elseif (! $bothJoined) {
            $status = 'no_show';
            $sessionEndReason = 'no_show';
        } else {
            $status = 'unsuccessful';
            $sessionEndReason = 'recording_not_saved';
        }

        $session->update([
            'status' => $status,
            'end_reason' => $sessionEndReason,
        ]);

        $this->syncVisitOrEburolStatus($session, $status);
        if ($status === 'completed') {
            $this->createVideoCallLogForVisitor($session);
        }
    }

    private function syncVisitOrEburolStatus(VisitSession $session, string $sessionStatus): void
    {
        if ($session->visit_id) {
            $visit = $session->visit;
            if ($visit) {
                $visit->update([
                    'status' => $sessionStatus === 'completed' ? VisitStatus::Completed : VisitStatus::Missed,
                ]);
            }
        }
        if ($session->eburol_id) {
            $eburol = $session->eburol;
            if ($eburol) {
                $eburol->update([
                    'status' => $sessionStatus === 'completed' ? EburolStatus::Completed : EburolStatus::Rejected,
                ]);
            }
        }
    }

    private function createVideoCallLogForVisitor(VisitSession $session): void
    {
        $visitor = $session->visitor;
        if (! $visitor) {
            return;
        }

        CallLog::create([
            'user_id' => $visitor->id,
            'visit_session_id' => $session->id,
            'phone_number' => null,
            'call_type' => 'video',
            'call_date' => $session->ended_at ?? now(),
            'duration' => $session->duration_seconds,
            'notes' => 'Virtual visit',
            'status' => 'completed',
        ]);
    }
}
