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
    public function show(Request $request): InertiaResponse
    {
        $request->validate([
            'room_id' => ['required', 'string', 'max:255'],
            'token' => ['required', 'string'],
        ]);

        return Inertia::render('Visitor/VideoRoom', [
            'room_id' => $request->query('room_id'),
            'token' => $request->query('token'),
            'api_key' => config('services.videosdk.api_key'),
            'participant_name' => $request->query('name', 'Participant'),
            'is_observer' => filter_var($request->query('observer', false), FILTER_VALIDATE_BOOL),
            'branding_logo_url' => asset('logo.svg'),
            'branding_name' => config('app.name'),
        ]);
    }
}
