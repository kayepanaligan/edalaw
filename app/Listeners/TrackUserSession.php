<?php

namespace App\Listeners;

use App\Models\UserSession;
use App\Services\DeviceDetectionService;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class TrackUserSession
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;
        $request = request();
        $sessionId = Session::getId();

        // Parse device information
        $deviceInfo = DeviceDetectionService::parseUserAgent($request->userAgent());
        $location = DeviceDetectionService::getLocationFromIp($request->ip());

        // Mark all other sessions as not current
        UserSession::where('user_id', $user->id)->update(['is_current' => false]);

        // Delete old sessions (keep only last 10)
        $totalSessions = UserSession::where('user_id', $user->id)->count();

        if ($totalSessions > 10) {
            // Get IDs of sessions to keep (most recent 10)
            $sessionsToKeep = UserSession::where('user_id', $user->id)
                ->orderBy('last_activity', 'desc')
                ->limit(10)
                ->pluck('id');

            // Delete sessions that are not in the keep list
            $oldSessions = UserSession::where('user_id', $user->id)
                ->whereNotIn('id', $sessionsToKeep)
                ->get();

            foreach ($oldSessions as $oldSession) {
                // Delete from sessions table if using database driver
                if (config('session.driver') === 'database') {
                    DB::table('sessions')->where('id', $oldSession->session_id)->delete();
                }
                $oldSession->delete();
            }
        }

        // If visitor role, enforce one device only - revoke all other sessions
        if ($user->role?->slug === 'visitor') {
            // Revoke all other active sessions
            $otherSessions = UserSession::where('user_id', $user->id)
                ->where('session_id', '!=', $sessionId)
                ->get();

            foreach ($otherSessions as $otherSession) {
                // Delete from sessions table if using database driver
                if (config('session.driver') === 'database') {
                    DB::table('sessions')->where('id', $otherSession->session_id)->delete();
                }
                $otherSession->delete();
            }
        }

        // Create or update current session
        UserSession::updateOrCreate(
            [
                'user_id' => $user->id,
                'session_id' => $sessionId,
            ],
            [
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'device_type' => $deviceInfo['device_type'],
                'device_name' => $deviceInfo['device_name'],
                'browser' => $deviceInfo['browser'],
                'platform' => $deviceInfo['platform'],
                'location' => $location,
                'is_current' => true,
                'last_activity' => now(),
            ]
        );
    }
}
