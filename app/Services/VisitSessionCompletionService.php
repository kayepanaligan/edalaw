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
     * - completed: ALL participants (visitor AND inmate) joined at least once
     * - missed: ANY participant never joined (even for a second)
     */
    public function endSessionWithOutcome(
        VisitSession $session,
        string $endReason = 'monitor_ended'
    ): void {
        // Check if BOTH visitor and inmate joined at least once
        $allParticipantsJoined = $session->visitor_joined_at && $session->inmate_joined_at;

        if ($allParticipantsJoined) {
            // Everyone joined at least once → COMPLETED
            $status = 'completed';
            $sessionEndReason = $endReason;
        } else {
            // At least one participant never joined → MISSED
            $status = 'missed';
            $sessionEndReason = 'participant_no_show';
        }

        $session->update([
            'status' => $status,
            'end_reason' => $sessionEndReason,
        ]);

        $this->syncVisitOrEburolStatus($session, $status);
        $this->createVideoCallLogForVisitor($session, $status);

        // Mark tunnel as used only if session was actually used (both joined)
        if ($allParticipantsJoined) {
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

        // Map session status to call log status
        $callLogStatus = match ($sessionStatus) {
            'completed' => 'completed',
            'missed' => 'missed',
            default => 'failed',
        };

        CallLog::create([
            'user_id' => $visitor->id,
            'visit_session_id' => $session->id,
            'phone_number' => null,
            'call_type' => 'video',
            'call_date' => $session->ended_at ?? now(),
            'duration' => $sessionStatus === 'completed' ? $session->duration_seconds : null,
            'notes' => $sessionStatus === 'completed' 
                ? 'Virtual visit completed' 
                : 'Visit missed - participant did not join',
            'status' => $callLogStatus,
        ]);
    }
}
