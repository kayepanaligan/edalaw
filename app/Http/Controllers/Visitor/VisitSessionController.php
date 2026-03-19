<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\VisitSession;
use App\Services\VideoSdkService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitSessionController extends Controller
{
    /**
     * Show embedded VideoSDK prebuilt for this session.
     */

    public function acceptTerms(Request $request, VisitSession $session)
    {
        // mark terms as accepted (ensure your table has this column)
        $session->terms_accepted = true;
        $session->accepted_at = now(); // optional: track when accepted
        $session->save();

        // respond for Inertia / React
        return redirect()->route('visit-session.show', $session)
                        ->with('success', 'You have accepted the terms.');
    }

    public function videoRoom(Request $request, VisitSession $session)
    {
        $user = $request->user();
        $videoSdk = new VideoSdkService();

        // Validate the room exists
        $validation = $videoSdk->validateRoom($session->room_id);
        if (!$validation['success']) {
            return redirect()->route('visit-session.show', $session)
                ->withErrors(['session' => 'The video room is expired or unavailable.']);
        }

        // Generate participant JWT (v2)
        $participantId = 'user_' . $user->id;
        $tokenResult = $videoSdk->generateParticipantToken($session->room_id, $participantId);

        if (!$tokenResult['success']) {
            abort(500, 'Failed to generate VideoSDK token: ' . ($tokenResult['error'] ?? 'Unknown'));
        }

        // Pass data to React component via Inertia
        return Inertia::render('Visitor/VideoRoom', [
            'room_id'          => $session->room_id,
            'token'            => $tokenResult['token'], // raw JWT
            'participant_name' => $user->name,
            'participant_id'   => $participantId,
            'is_observer'      => false,
        ]);
    }
}