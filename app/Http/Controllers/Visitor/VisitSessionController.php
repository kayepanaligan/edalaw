<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\VisitSession;
use App\Services\VideoSdkService;
use App\Services\VisitSessionRecordingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class VisitSessionController extends Controller
{
    /**
     * Show the visit session page (join video call). If link not expired, visitor can stay and see schedule reminder when outside window.
     */
    public function show(Request $request, VisitSession $session): InertiaResponse|RedirectResponse
    {
        $user = $request->user();
        $visitor = $session->visit?->user ?? $session->eburol?->user;
        if (! $visitor || $visitor->id !== $user->id) {
            abort(403, 'You can only join your own session.');
        }
        if (! $session->terms_accepted_at) {
            return redirect()->back()->withErrors(['session' => 'You must accept the terms before joining.']);
        }
        if ($session->isCompleted()) {
            return redirect()->back()->withErrors(['session' => 'This session has ended.']);
        }

        $tz = config('app.timezone');
        $now = now($tz);
        $start = $session->scheduled_start->setTimezone($tz);
        $end = $session->scheduled_end->setTimezone($tz);
        $withinSchedule = $now->between($start, $end);

        $scheduleReminder = null;
        if (! $withinSchedule && $end->isFuture()) {
            $scheduleReminder = [
                'scheduled_start' => $start->toIso8601String(),
                'scheduled_end' => $end->toIso8601String(),
                'scheduled_label' => $start->format('M j, Y').', '.$start->format('g:i A').' – '.$end->format('g:i A'),
                'minutes_until_start' => (int) max(0, $now->diffInMinutes($start, false)),
                'hours_until_start' => (int) max(0, $now->diffInHours($start, false)),
            ];
        }

        $token = null;
        $participantId = 'visitor-'.$user->id.'-'.$session->id;
        $videoSdk = new VideoSdkService;
        if ($withinSchedule) {
            $result = $videoSdk->generateJoinTokenForPrebuiltApp($session->room_id, $participantId, ['allow_join'], 120);
            if (($result['success'] ?? false) && ! empty($result['token'])) {
                $token = $result['token'];
            }
        }

        $useEmbeddedMeeting = $videoSdk->isV2Rooms();
        $joinUrl = null;
        if ($withinSchedule && $token) {
            $joinUrl = $useEmbeddedMeeting
                ? route('visit-session.video-room', $session)
                : 'https://app.videosdk.live/meetings/'.$session->room_id.'?token='.rawurlencode($token);
        }

        return Inertia::render('Visitor/VisitSession', [
            'session' => [
                'id' => $session->id,
                'room_id' => $session->room_id,
                'token' => $token,
                'participant_id' => $participantId,
                'session_type' => $session->session_type,
                'inmate_name' => $session->visit
                    ? trim("{$session->visit->inmate_first_name} {$session->visit->inmate_middle_name} {$session->visit->inmate_last_name}")
                    : trim("{$session->eburol->inmate_first_name} {$session->eburol->inmate_middle_name} {$session->eburol->inmate_last_name}"),
                'schedule_reminder' => $scheduleReminder,
                'can_join_now' => $withinSchedule && (bool) $token,
                'join_url' => $joinUrl,
            ],
        ]);
    }

    /**
     * Accept terms and conditions for the session. Stores terms_accepted_at.
     */
    public function acceptTerms(Request $request, VisitSession $session): RedirectResponse
    {
        $user = $request->user();
        $visitor = $session->visit?->user ?? $session->eburol?->user;
        if (! $visitor || $visitor->id !== $user->id) {
            abort(403, 'You can only accept terms for your own session.');
        }
        if ($session->terms_accepted_at) {
            return redirect()->back()->with('info', 'Terms already accepted.');
        }
        if ($session->isCompleted()) {
            return redirect()->back()->withErrors(['session' => 'This session has ended.']);
        }

        $session->update(['terms_accepted_at' => now()]);

        return redirect()->route('visit-session.show', $session)
            ->with('success', 'Terms accepted. You can now join the call.');
    }

    /**
     * Mark visitor as joined and store participant_id. If inmate already joined, start recording.
     */
    public function participantJoined(Request $request, VisitSession $session): Response
    {
        $request->validate(['participant_id' => ['required', 'string', 'max:255']]);

        $user = $request->user();
        $visitor = $session->visit?->user ?? $session->eburol?->user;
        if (! $visitor || $visitor->id !== $user->id) {
            abort(403);
        }
        if ($session->isCompleted()) {
            return response()->json(['error' => 'Session ended'], 422);
        }

        $session->update([
            'visitor_joined_at' => $session->visitor_joined_at ?? now(),
            'visitor_participant_id' => $session->visitor_participant_id ?? $request->participant_id,
        ]);

        if ($session->inmate_joined_at && $session->visitor_participant_id) {
            app(VisitSessionRecordingService::class)->tryStartRecording($session, $session->visitor_participant_id);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Show embedded VideoSDK prebuilt for this session (used when v2 rooms to avoid app.videosdk.live 404).
     */
    public function videoRoom(Request $request, VisitSession $session): InertiaResponse|RedirectResponse
    {
        $user = $request->user();
        $visitor = $session->visit?->user ?? $session->eburol?->user;
        if (! $visitor || $visitor->id !== $user->id) {
            abort(403, 'You can only join your own session.');
        }
        if (! $session->terms_accepted_at) {
            return redirect()->route('visit-session.show', $session)
                ->withErrors(['session' => 'You must accept the terms before joining.']);
        }
        if ($session->isCompleted()) {
            return redirect()->back()->withErrors(['session' => 'This session has ended.']);
        }

        $tz = config('app.timezone');
        $now = now($tz);
        $start = $session->scheduled_start->setTimezone($tz);
        $end = $session->scheduled_end->setTimezone($tz);
        if (! $now->between($start, $end)) {
            return redirect()->route('visit-session.show', $session)
                ->withErrors(['session' => 'Session is not within the scheduled time.']);
        }

        $videoSdk = new VideoSdkService;
        $participantId = 'visitor-'.$user->id.'-'.$session->id;
        $result = $videoSdk->generateJoinTokenForPrebuiltApp($session->room_id, $participantId, ['allow_join'], 120);
        if (! ($result['success'] ?? false) || empty($result['token'])) {
            return redirect()->route('visit-session.show', $session)
                ->withErrors(['session' => 'Unable to generate join token. Please try again.']);
        }

        return Inertia::render('Visitor/VideoRoom', [
            'room_id' => $session->room_id,
            'token' => $result['token'],
            'api_key' => config('services.videosdk.api_key'),
            'participant_name' => $user->name ?? 'Visitor',
            'is_observer' => false,
            'branding_logo_url' => asset('logo.svg'),
            'branding_name' => config('app.name'),
        ]);
    }
}
