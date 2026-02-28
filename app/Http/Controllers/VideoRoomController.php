<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

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
        $participantId = auth()->id() ?? uniqid('guest_');

        $tokenData = $videoSdk->generateParticipantToken(
            $roomId,
            (string) $participantId,
            ['allow_join']
        );

        if (!$tokenData['success']) {
            abort(500, 'Failed to generate VideoSDK token.');
        }

        return Inertia::render('Visitor/VideoRoom', [
            'room_id' => $roomId,
            'token' => $tokenData['token'],
            'participant_name' => auth()->user()->name ?? 'Participant',
        ]);
    }
}
