<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuditLogService
{
    /**
     * Log an appeal-related action.
     */
    public static function logAppealAction(
        string $action,
        Model $auditable,
        ?string $description = null,
        ?Request $request = null
    ): void {
        $user = auth()->user();
        $description = $description ?? self::getDefaultDescription($action, $auditable);

        AuditLog::create([
            'action' => $action,
            'auditable_type' => get_class($auditable),
            'auditable_id' => $auditable->id,
            'user_id' => $user?->id,
            'user_role' => $user?->role?->slug,
            'description' => $description,
            'metadata' => [
                'user_email' => $user?->email,
                'user_name' => $user ? trim("{$user->first_name} {$user->middle_name} {$user->last_name}") : 'System',
            ],
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    /**
     * Get default description for an action.
     */
    private static function getDefaultDescription(string $action, Model $auditable): string
    {
        $auditableType = class_basename($auditable);

        return match ($action) {
            'appeal_submitted' => "Appeal submitted for {$auditableType} #{$auditable->id}",
            'appeal_reviewed' => "Appeal reviewed for {$auditableType} #{$auditable->id}",
            'appeal_auto_rejected' => "Appeal automatically rejected (deadline passed) for {$auditableType} #{$auditable->id}",
            default => "Action '{$action}' performed on {$auditableType} #{$auditable->id}",
        };
    }
}
