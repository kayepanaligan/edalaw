<?php

namespace App\Http\Controllers;

use App\Services\VideoSdkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoRoomController extends Controller
{

    public function token(VideoSdkService $videoSdk, $room)
    {
        $participantId = 'guest-' . uniqid();
        $tokenData = $videoSdk->generateParticipantToken($room, $participantId);

        if (! $tokenData['success']) {
            return response()->json(['error' => 'Token generation failed'], 500);
        }

        return response()->json(['token' => $tokenData['token']]);
    }
    
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

        return Inertia::render('Visitor/VideoRoom', [
            'room_id' => $roomId,
            'token' => $token,
            'api_key' => config('services.videosdk.api_key'),
            'participant_name' => $participantName,
            'participant_id' => $participantId,
            'is_observer' => $isObserver,
        ]);
    }
}
