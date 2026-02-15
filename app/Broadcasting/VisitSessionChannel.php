<?php

namespace App\Broadcasting;

use App\Models\User;
use App\Models\VisitSession;

class VisitSessionChannel
{
    public function join(User $user, int $visitSessionId): array|bool
    {
        $session = VisitSession::find($visitSessionId);
        if (! $session) {
            return false;
        }

        $visitor = $session->visit?->user ?? $session->eburol?->user;
        $isVisitor = $visitor && $visitor->id === $user->id;
        $isMonitor = $session->monitor_id === $user->id;
        $isSuperAdmin = $user->role?->slug === 'super_admin';

        return $isVisitor || $isMonitor || $isSuperAdmin;
    }
}
