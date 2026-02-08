<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\MonitoringSession;
use App\Models\SessionRecording;
use App\Services\DailyCoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DailyCoWebhookController extends Controller
{
    public function __construct(
        private DailyCoService $dailyCoService
    ) {}

    /**
     * Handle Daily.co webhook events.
     */
    public function handle(Request $request)
    {
        // Verify webhook signature if configured
        if (config('services.daily_co.webhook_secret')) {
            $signature = $request->header('X-Daily-Webhook-Signature');
            $expectedSignature = hash_hmac('sha256', $request->getContent(), config('services.daily_co.webhook_secret'));

            if (! hash_equals($expectedSignature, $signature)) {
                Log::warning('Daily.co webhook signature mismatch');

                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        $event = $request->input('event');
        $data = $request->input('data', []);

        Log::info('Daily.co webhook received', ['event' => $event, 'data' => $data]);

        match ($event) {
            'recording.completed' => $this->handleRecordingCompleted($data),
            'recording.started' => $this->handleRecordingStarted($data),
            'recording.uploaded' => $this->handleRecordingUploaded($data),
            'room.participant-joined' => $this->handleParticipantJoined($data),
            'room.participant-left' => $this->handleParticipantLeft($data),
            default => Log::info('Unhandled Daily.co webhook event', ['event' => $event]),
        };

        return response()->json(['status' => 'ok']);
    }

    /**
     * Handle recording completed event.
     */
    private function handleRecordingCompleted(array $data): void
    {
        $recordingId = $data['recording']['id'] ?? null;
        $roomName = $data['recording']['room_name'] ?? null;

        if (! $recordingId || ! $roomName) {
            Log::warning('Daily.co recording completed missing data', $data);

            return;
        }

        // Find the monitoring session by room name
        $session = MonitoringSession::where('session_token', $roomName)
            ->orWhereHas('visit', function ($query) use ($roomName) {
                $query->where('daily_co_room_name', $roomName);
            })
            ->orWhereHas('eburol', function ($query) use ($roomName) {
                $query->where('daily_co_room_name', $roomName);
            })
            ->first();

        if (! $session) {
            Log::warning('Daily.co recording completed - session not found', ['room_name' => $roomName]);

            return;
        }

        // Get recording details from Daily.co
        $recordingDetails = $this->dailyCoService->getRecording($recordingId);

        if (! $recordingDetails) {
            Log::warning('Daily.co recording details not found', ['recording_id' => $recordingId]);

            return;
        }

        // Download and store the recording
        $this->storeRecording($session, $recordingDetails);
    }

    /**
     * Store recording from Daily.co.
     */
    private function storeRecording(MonitoringSession $session, array $recordingDetails): void
    {
        $downloadUrl = $recordingDetails['download_link'] ?? null;
        $startTime = $recordingDetails['start_ts'] ?? null;
        $endTime = $recordingDetails['end_ts'] ?? null;
        $duration = $endTime && $startTime ? ($endTime - $startTime) / 1000 : null;

        if (! $downloadUrl) {
            Log::warning('Daily.co recording missing download URL', $recordingDetails);

            return;
        }

        try {
            // Download the recording file
            $fileContents = file_get_contents($downloadUrl);
            $fileName = "recordings/{$session->id}/{$recordingDetails['id']}.mp4";
            Storage::disk('public')->put($fileName, $fileContents);

            // Create recording record
            SessionRecording::create([
                'monitoring_session_id' => $session->id,
                'recording_type' => 'video',
                'file_path' => $fileName,
                'file_name' => "{$recordingDetails['id']}.mp4",
                'mime_type' => 'video/mp4',
                'file_size' => strlen($fileContents),
                'duration_seconds' => $duration ? (int) $duration : null,
                'recorded_at' => $startTime ? now()->setTimestamp($startTime / 1000) : now(),
                'metadata' => [
                    'daily_co_recording_id' => $recordingDetails['id'],
                    'room_name' => $recordingDetails['room_name'] ?? null,
                    'start_ts' => $startTime,
                    'end_ts' => $endTime,
                ],
            ]);

            Log::info('Daily.co recording stored', [
                'session_id' => $session->id,
                'recording_id' => $recordingDetails['id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to store Daily.co recording', [
                'error' => $e->getMessage(),
                'recording_id' => $recordingDetails['id'] ?? null,
            ]);
        }
    }

    /**
     * Handle recording started event.
     */
    private function handleRecordingStarted(array $data): void
    {
        Log::info('Daily.co recording started', $data);
    }

    /**
     * Handle recording uploaded event.
     */
    private function handleRecordingUploaded(array $data): void
    {
        Log::info('Daily.co recording uploaded', $data);
    }

    /**
     * Handle participant joined event.
     */
    private function handleParticipantJoined(array $data): void
    {
        Log::info('Daily.co participant joined', $data);
    }

    /**
     * Handle participant left event.
     */
    private function handleParticipantLeft(array $data): void
    {
        Log::info('Daily.co participant left', $data);
    }
}
