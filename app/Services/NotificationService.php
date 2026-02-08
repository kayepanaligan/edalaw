<?php

namespace App\Services;

use App\Models\Appeal;
use App\Models\Eburol;
use App\Models\Notification;
use App\Models\Role;
use App\Models\Suggestion;
use App\Models\User;
use App\Models\Visit;

class NotificationService
{
    /**
     * Create a notification for visit status change.
     */
    public static function createVisitNotification(Visit $visit, string $status): void
    {
        $statusMessages = [
            'approved' => 'Your visit schedule has been approved.',
            'rejected' => 'Your visit schedule has been rejected.',
            'completed' => 'Your visit has been marked as completed.',
            'missed' => 'Your visit has been marked as missed.',
        ];

        $titles = [
            'approved' => 'Visit Schedule Approved',
            'rejected' => 'Visit Schedule Rejected',
            'completed' => 'Visit Completed',
            'missed' => 'Visit Missed',
        ];

        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        $message = ($statusMessages[$status] ?? 'Your visit schedule status has been updated.')
            ." Inmate: {$inmateName}. Scheduled for: {$visit->scheduled_date->format('M d, Y')}";

        Notification::create([
            'user_id' => $visit->user_id,
            'type' => 'visit_status',
            'title' => $titles[$status] ?? 'Visit Status Updated',
            'message' => $message,
            'notifiable_id' => $visit->id,
            'notifiable_type' => Visit::class,
        ]);
    }

    /**
     * Create a notification for e-burol status change.
     */
    public static function createEburolNotification(Eburol $eburol, string $status): void
    {
        $statusMessages = [
            'approved' => 'Your e-burol application has been approved.',
            'rejected' => 'Your e-burol application has been rejected.',
            'completed' => 'Your e-burol has been marked as completed.',
        ];

        $titles = [
            'approved' => 'E-Burol Application Approved',
            'rejected' => 'E-Burol Application Rejected',
            'completed' => 'E-Burol Completed',
        ];

        $deceasedName = trim("{$eburol->deceased_first_name} {$eburol->deceased_middle_name} {$eburol->deceased_last_name}");
        $message = ($statusMessages[$status] ?? 'Your e-burol application status has been updated.')
            ." Deceased: {$deceasedName}. Wake period: {$eburol->wake_start_date->format('M d, Y')} - {$eburol->wake_end_date->format('M d, Y')}";

        Notification::create([
            'user_id' => $eburol->user_id,
            'type' => 'eburol_status',
            'title' => $titles[$status] ?? 'E-Burol Status Updated',
            'message' => $message,
            'notifiable_id' => $eburol->id,
            'notifiable_type' => Eburol::class,
        ]);
    }

    /**
     * Create a notification when a visit schedule is submitted.
     */
    public static function createVisitSubmittedNotification(Visit $visit): void
    {
        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        $visitType = $visit->visit_type->value === 'virtual' ? 'Virtual' : 'Physical';

        Notification::create([
            'user_id' => $visit->user_id,
            'type' => 'visit_status',
            'title' => 'Visit Schedule Application Received',
            'message' => "Your {$visitType} visit schedule application has been received by the BJMP officer. Inmate: {$inmateName}. Scheduled for: {$visit->scheduled_date->format('M d, Y')}. Please wait for approval.",
            'notifiable_id' => $visit->id,
            'notifiable_type' => Visit::class,
        ]);
    }

    /**
     * Create a notification when an e-burol application is submitted.
     */
    public static function createEburolSubmittedNotification(Eburol $eburol): void
    {
        $deceasedName = trim("{$eburol->deceased_first_name} {$eburol->deceased_middle_name} {$eburol->deceased_last_name}");

        Notification::create([
            'user_id' => $eburol->user_id,
            'type' => 'eburol_status',
            'title' => 'E-Burol Application Received',
            'message' => "Your e-burol application has been received by the BJMP officer. Deceased: {$deceasedName}. Wake period: {$eburol->wake_start_date->format('M d, Y')} - {$eburol->wake_end_date->format('M d, Y')}. Please wait for approval.",
            'notifiable_id' => $eburol->id,
            'notifiable_type' => Eburol::class,
        ]);
    }

    /**
     * Create a notification when an appeal is submitted.
     */
    public static function createAppealSubmittedNotification(Appeal $appeal): void
    {
        $appealableType = $appeal->appealable_type === Visit::class ? 'Visit Schedule' : 'E-Burol Application';

        Notification::create([
            'user_id' => $appeal->user_id,
            'type' => 'appeal_status',
            'title' => 'Appeal Submitted',
            'message' => "Your appeal for {$appealableType} has been submitted and is pending review.",
            'notifiable_id' => $appeal->id,
            'notifiable_type' => Appeal::class,
        ]);
    }

    /**
     * Create a notification when an appeal status changes.
     */
    public static function createAppealStatusNotification(Appeal $appeal): void
    {
        $statusMessages = [
            'approved' => 'Your appeal has been approved. The original decision has been reversed.',
            'rejected' => 'Your appeal has been rejected. This is the final decision.',
        ];

        $titles = [
            'approved' => 'Appeal Approved',
            'rejected' => 'Appeal Rejected',
        ];

        $appealableType = $appeal->appealable_type === Visit::class ? 'Visit Schedule' : 'E-Burol Application';
        $message = ($statusMessages[$appeal->status->value] ?? 'Your appeal status has been updated.')
            ." Appeal for: {$appealableType}.";

        Notification::create([
            'user_id' => $appeal->user_id,
            'type' => 'appeal_status',
            'title' => $titles[$appeal->status->value] ?? 'Appeal Status Updated',
            'message' => $message,
            'notifiable_id' => $appeal->id,
            'notifiable_type' => Appeal::class,
        ]);
    }

    /**
     * Notify all super admins about a new appeal.
     */
    public static function notifySuperAdminsAboutAppeal(Appeal $appeal): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if (! $superAdminRole) {
            return;
        }

        $superAdmins = User::where('role_id', $superAdminRole->id)->get();
        $appealableType = $appeal->appealable_type === Visit::class ? 'Visit Schedule' : 'E-Burol Application';
        $userName = trim("{$appeal->user->first_name} {$appeal->user->last_name}");

        foreach ($superAdmins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'admin_notification',
                'title' => 'New Appeal Submitted',
                'message' => "{$userName} has submitted an appeal for {$appealableType}. Reason: ".substr($appeal->reason, 0, 100).'...',
                'notifiable_id' => $appeal->id,
                'notifiable_type' => Appeal::class,
            ]);
        }
    }

    /**
     * Notify all super admins about a new suggestion/feedback.
     */
    public static function notifySuperAdminsAboutSuggestion(Suggestion $suggestion): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if (! $superAdminRole) {
            return;
        }

        $superAdmins = User::where('role_id', $superAdminRole->id)->get();
        $userName = trim("{$suggestion->user->first_name} {$suggestion->user->last_name}");
        $typeLabel = $suggestion->type === 'suggestion' ? 'Suggestion' : 'Complaint';

        foreach ($superAdmins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'admin_notification',
                'title' => "New {$typeLabel} Received",
                'message' => "{$userName} has submitted a {$suggestion->type}: {$suggestion->subject}",
                'notifiable_id' => $suggestion->id,
                'notifiable_type' => Suggestion::class,
            ]);
        }
    }

    /**
     * Create a notification for visitor when they submit a suggestion/feedback.
     */
    public static function createSuggestionSubmittedNotification(Suggestion $suggestion): void
    {
        $typeLabel = $suggestion->type === 'suggestion' ? 'Suggestion' : 'Complaint';

        Notification::create([
            'user_id' => $suggestion->user_id,
            'type' => $suggestion->type === 'suggestion' ? 'suggestion_feedback' : 'complaint_feedback',
            'title' => "{$typeLabel} Submitted",
            'message' => "Your {$suggestion->type} has been sent to the BJMP for review. Thank you for taking the time to provide your feedback!",
            'notifiable_id' => $suggestion->id,
            'notifiable_type' => Suggestion::class,
        ]);
    }

    /**
     * Create a notification for visitor when their suggestion/feedback status is updated.
     */
    public static function createSuggestionStatusNotification(Suggestion $suggestion, string $status): void
    {
        $typeLabel = $suggestion->type === 'suggestion' ? 'Suggestion' : 'Complaint';

        $statusMessages = [
            'reviewed' => "Your {$typeLabel} has been reviewed by the administrator.",
            'in_progress' => "Your {$typeLabel} is now being processed.",
            'resolved' => "Your {$typeLabel} has been resolved.",
            'dismissed' => "Your {$typeLabel} has been dismissed.",
        ];

        $titles = [
            'reviewed' => "{$typeLabel} Reviewed",
            'in_progress' => "{$typeLabel} In Progress",
            'resolved' => "{$typeLabel} Resolved",
            'dismissed' => "{$typeLabel} Dismissed",
        ];

        $message = $statusMessages[$status] ?? "Your {$typeLabel} status has been updated to {$status}.";

        // Add admin response if available
        if ($suggestion->admin_response) {
            $responsePreview = strlen($suggestion->admin_response) > 150
                ? substr($suggestion->admin_response, 0, 150).'...'
                : $suggestion->admin_response;
            $message .= " Response: {$responsePreview}";
        }

        Notification::create([
            'user_id' => $suggestion->user_id,
            'type' => $suggestion->type === 'suggestion' ? 'suggestion_feedback' : 'complaint_feedback',
            'title' => $titles[$status] ?? "{$typeLabel} Status Updated",
            'message' => $message,
            'notifiable_id' => $suggestion->id,
            'notifiable_type' => Suggestion::class,
        ]);
    }

    /**
     * Create a notification for device login warning.
     */
    public static function createDeviceLoginWarningNotification(User $user, string $deviceInfo, string $location): void
    {
        Notification::create([
            'user_id' => $user->id,
            'type' => 'device_warning',
            'title' => 'Security Alert: New Device Login Detected',
            'message' => "A login attempt was detected from a new device ({$deviceInfo}) at {$location}. If this wasn't you, please secure your account immediately.",
            'notifiable_id' => $user->id,
            'notifiable_type' => User::class,
        ]);
    }

    /**
     * Notify all super admins about a new user registration.
     */
    public static function notifySuperAdminsAboutNewUser(User $user): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if (! $superAdminRole) {
            return;
        }

        $superAdmins = User::where('role_id', $superAdminRole->id)->get();
        $userName = trim("{$user->first_name} {$user->middle_name} {$user->last_name}");
        $roleName = $user->role?->name ?? 'Unknown';

        foreach ($superAdmins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'admin_notification',
                'title' => 'New User Registration',
                'message' => "{$userName} ({$user->email}) has registered as {$roleName}. Approval status: {$user->approval_status->value}",
                'notifiable_id' => $user->id,
                'notifiable_type' => User::class,
            ]);
        }
    }

    /**
     * Notify all super admins about a new visit schedule.
     */
    public static function notifySuperAdminsAboutVisit(Visit $visit): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if (! $superAdminRole) {
            return;
        }

        $superAdmins = User::where('role_id', $superAdminRole->id)->get();
        $userName = trim("{$visit->user->first_name} {$visit->user->last_name}");
        $inmateName = trim("{$visit->inmate_first_name} {$visit->inmate_middle_name} {$visit->inmate_last_name}");
        $visitType = $visit->visit_type->value === 'virtual' ? 'Virtual' : 'Physical';

        foreach ($superAdmins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'admin_notification',
                'title' => 'New Visit Schedule Request',
                'message' => "{$userName} has submitted a {$visitType} visit schedule for {$inmateName} on {$visit->scheduled_date->format('M d, Y')}",
                'notifiable_id' => $visit->id,
                'notifiable_type' => Visit::class,
            ]);
        }
    }

    /**
     * Notify all super admins about a new e-burol application.
     */
    public static function notifySuperAdminsAboutEburol(Eburol $eburol): void
    {
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if (! $superAdminRole) {
            return;
        }

        $superAdmins = User::where('role_id', $superAdminRole->id)->get();
        $userName = trim("{$eburol->user->first_name} {$eburol->user->last_name}");
        $deceasedName = trim("{$eburol->deceased_first_name} {$eburol->deceased_middle_name} {$eburol->deceased_last_name}");

        foreach ($superAdmins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'admin_notification',
                'title' => 'New E-Burol Application',
                'message' => "{$userName} has submitted an e-burol application for {$deceasedName}. Wake period: {$eburol->wake_start_date->format('M d, Y')} - {$eburol->wake_end_date->format('M d, Y')}",
                'notifiable_id' => $eburol->id,
                'notifiable_type' => Eburol::class,
            ]);
        }
    }
}
