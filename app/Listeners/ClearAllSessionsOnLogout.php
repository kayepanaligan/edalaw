<?php

namespace App\Listeners;

use App\Models\UserSession;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\DB;

class ClearAllSessionsOnLogout
{
    /**
     * When a user logs out, remove all their sessions from the sessions table and user_sessions
     * so they can log in from any device without being blocked by "logged in on another device".
     */
    public function handle(Logout $event): void
    {
        $user = $event->user;
        if (! $user || ! $user->getAuthIdentifier()) {
            return;
        }

        $userId = $user->getAuthIdentifier();

        if (config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))
                ->where('user_id', $userId)
                ->delete();
        }

        UserSession::where('user_id', $userId)->delete();
    }
}
