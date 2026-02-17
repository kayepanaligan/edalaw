<?php

namespace App\Services;

use App\EburolStatus;
use App\Models\CallLog;
use App\Models\InmateTunnel;
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
        $this->createVideoCallLogForVisitor($session, $status);

        $actuallyUsed = $bothJoined || $session->chatLogs()->exists();
        if ($actuallyUsed) {
            InmateTunnel::where('visit_session_id', $session->id)->update(['is_used' => true]);
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

    private function createVideoCallLogForVisitor(VisitSession $session, string $sessionStatus): void
    {
        $visitor = $session->visitor;
        if (! $visitor) {
            return;
        }

        $callLogStatus = match ($sessionStatus) {
            'completed' => 'completed',
            'no_show' => 'missed',
            'unsuccessful' => 'failed',
            default => 'failed',
        };

        CallLog::create([
            'user_id' => $visitor->id,
            'visit_session_id' => $session->id,
            'phone_number' => null,
            'call_type' => 'video',
            'call_date' => $session->ended_at ?? now(),
            'duration' => $sessionStatus === 'completed' ? $session->duration_seconds : null,
            'notes' => $sessionStatus === 'completed' ? 'Virtual visit' : ($sessionStatus === 'no_show' ? 'No show' : 'Unsuccessful (recording not saved)'),
            'status' => $callLogStatus,
        ]);
    }
}
