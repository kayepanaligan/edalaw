<?php

namespace App\Http\Controllers;

use App\Models\VisitSession;
use App\Services\VideoSdkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StaffVisitSessionJoinController extends Controller
{
    /**
     * Generate a join token and redirect staff (admin/BJMP) to the VideoSDK meeting.
     */
    public function join(Request $request, VisitSession $session): RedirectResponse
    {
        if (! $session->visit_id) {
            abort(404, 'Session not found.');
        }
        // Route is already protected by role middleware (super_admin or bjmp_officer).
        if ($session->scheduled_end->isPast()) {
            return redirect()->back()->with('error', 'This session has ended. The video call is no longer available.');
        }
        if ($session->isCompleted()) {
            return redirect()->back()->with('error', 'This session has ended.');
        }

        $videoSdk = new VideoSdkService;
        $participantId = 'staff-'.$request->user()->id.'-'.$session->id;
        $result = $videoSdk->generateParticipantToken($session->room_id, $participantId, ['allow_join'], 120);

        if (! ($result['success'] ?? false) || empty($result['token'])) {
            return redirect()->back()->with('error', 'Unable to generate join link. Please try again.');
        }

        $url = 'https://app.videosdk.live/meetings/'.$session->room_id.'?token='.urlencode($result['token']);

        return redirect()->away($url);
    }
}
