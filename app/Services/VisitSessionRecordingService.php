<?php

namespace App\Services;

use App\Models\VideoRecording;
use App\Models\VisitSession;
use Illuminate\Support\Facades\Log;

class VisitSessionRecordingService
{
    public function __construct(
        private VideoSdkService $videoSdk
    ) {}

    /**
     * Start recording when both visitor and inmate have joined. Uses visitor's participant ID.
     */
    public function tryStartRecording(VisitSession $session, string $visitorParticipantId): bool
    {
        if ($session->recording_status === 'recording') {
            return true;
        }
        if ($session->recording_status !== 'pending') {
            return false;
        }
        if (! $session->visitor_joined_at || ! $session->inmate_joined_at) {
            return false;
        }
        if ($session->status !== 'active') {
            return false;
        }

        $result = $this->videoSdk->startRecording($session->room_id, $visitorParticipantId);

        if ($result['success']) {
            $session->update(['recording_status' => 'recording']);
            Log::info('Visit session recording started', ['visit_session_id' => $session->id]);

            return true;
        }

        Log::error('Visit session recording start failed', [
            'visit_session_id' => $session->id,
            'error' => $result['error'] ?? 'Unknown',
        ]);

        return false;
    }

    /**
     * Stop recording and create VideoRecording record. Store file in S3 when URL is available (e.g. from webhook).
     */
    public function stopRecordingAndSave(VisitSession $session, string $participantId): bool
    {
        if ($session->recording_status !== 'recording') {
            return true;
        }

        $result = $this->videoSdk->stopRecording($session->room_id, $participantId);

        if (! $result['success']) {
            Log::error('Visit session recording stop failed', [
                'visit_session_id' => $session->id,
                'error' => $result['error'] ?? 'Unknown',
            ]);
            $session->update(['recording_status' => 'failed']);

            return false;
        }

        $endedAt = now();
        $durationSeconds = $session->started_at ? $endedAt->diffInSeconds($session->started_at) : null;

        VideoRecording::create([
            'visit_session_id' => $session->id,
            'recording_url' => null,
            'file_path' => null,
            'duration_seconds' => $durationSeconds,
            'started_at' => $session->started_at,
            'ended_at' => $endedAt,
            'end_reason' => $session->end_reason ?? 'session_ended',
            'storage_disk' => config('filesystems.default'),
        ]);

        $session->update(['recording_status' => 'saved']);

        return true;
    }
}
