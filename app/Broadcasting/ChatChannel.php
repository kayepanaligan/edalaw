<?php

namespace App\Broadcasting;

use App\Models\MonitoringSession;
use App\Models\User;

class ChatChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, string $sessionToken): array|bool
    {
        // Find the monitoring session
        $session = MonitoringSession::where('session_token', $sessionToken)->first();

        if (! $session) {
            return false;
        }

        // Allow access if:
        // 1. User is the visitor
        // 2. User is a monitoring officer
        // 3. User is a super admin
        $isVisitor = $session->visitor_id === $user->id;
        $isMonitor = $user->role?->slug === 'monitoring_officer';
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        return $isVisitor || $isMonitor || $isSuperAdmin;
    }
}
