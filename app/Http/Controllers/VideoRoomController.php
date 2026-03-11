<?php

namespace App\Http\Controllers;

use App\Services\VideoSdkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoRoomController extends Controller
{
    /**
     * Show embedded VideoSDK prebuilt (for v2 rooms or when joining with token in URL).
     * Used by inmate and monitoring officer when app is configured for v2 rooms.
     * Query: room_id, token, name (optional).
     */
    public function show(Request $request, VideoSdkService $videoSdk)
    {
        $request->validate([
            'room_id' => ['required', 'string', 'max:255'],
        ]);

        $roomId = $request->query('room_id');
        $token = $request->query('token');
        $participantId = $request->query('participant_id') ?? (auth()->id() ? 'user-'.auth()->id() : uniqid('guest_'));
        $participantName = $request->query('name') ?? (auth()->user()->name ?? 'Participant');
        $isObserver = $request->query('observer') === '1';

        // If token is provided in URL, use it; otherwise generate one
        if (! $token) {
            $tokenData = $videoSdk->generateJoinTokenForPrebuiltApp(
                $roomId,
                (string) $participantId,
                ['allow_join'],
                120
            );

            if (! $tokenData['success']) {
                abort(500, 'Failed to generate VideoSDK token.');
            }
            $token = $tokenData['token'];
        }

        $token = preg_replace('/^Bearer\s+/i', '', (string) $token) ?? (string) $token;
        $token = trim($token);

        // For v1 meetings, don't pass apiKey to avoid SDK trying to use v2 infrastructure
        $isV1 = $videoSdk->isV2Rooms() === false;

        return Inertia::render('Visitor/VideoRoom', [
            'room_id' => $roomId,
            'token' => $token,
            'api_key' => $isV1 ? null : config('services.videosdk.api_key'), // Only pass apiKey for v2
            'participant_name' => $participantName,
            'participant_id' => $participantId,
            'is_observer' => $isObserver,
        ]);
    }
}
