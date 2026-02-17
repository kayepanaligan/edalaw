<?php

use App\ApprovalStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();
        $user->load('role');

        if ($user->role?->slug !== 'super_admin') {
            if ($user->approval_status === ApprovalStatus::Pending) {
                return redirect()->route('account-pending');
            }
            if ($user->approval_status === ApprovalStatus::Rejected) {
                return redirect()->route('account-rejected');
            }
            if ($user->approval_status !== ApprovalStatus::Approved) {
                Auth::logout();

                return redirect()->route('login')
                    ->withErrors(['email' => 'Your account is not approved. Please contact support.']);
            }
        }

        $role = $user->role?->slug;
        if ($role === 'super_admin') {
            return redirect()->route('dashboard.super-admin');
        }
        if ($role === 'bjmp_officer') {
            return redirect()->route('dashboard.bjmp-officer');
        }
        if ($role === 'visitor') {
            return redirect()->route('dashboard.visitor');
        }

        return redirect()->route('dashboard');
    }

    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
        'status' => session('status'),
        'loginUrl' => route('login.store'),
        'forgotPasswordUrl' => route('password.forgot.show'),
        'csrfToken' => csrf_token(),
        'oldEmail' => request()->old('email'),
    ]);
})->name('home');

Route::post('webhooks/daily-co', [\App\Http\Controllers\Webhook\DailyCoWebhookController::class, 'handle'])
    ->name('webhooks.daily-co');

// Inmate tunnel entry from login page (no auth)
Route::get('inmate-tunnel', [\App\Http\Controllers\InmateTunnelController::class, 'showEnterToken'])
    ->name('inmate.enter-token');
Route::post('inmate-tunnel', [\App\Http\Controllers\InmateTunnelController::class, 'verifyToken'])
    ->name('inmate.verify-token');

// Inmate join (no auth - tunnel token validates access)
Route::get('inmate/join/{token}', [\App\Http\Controllers\InmateTunnelController::class, 'join'])
    ->name('inmate.join');
Route::get('inmate/join/{token}/token', [\App\Http\Controllers\InmateTunnelController::class, 'getInmateToken'])
    ->name('inmate.token');
Route::get('inmate/chat', [\App\Http\Controllers\InmateTunnelController::class, 'listChat'])
    ->name('inmate.chat.list');
Route::post('inmate/chat', [\App\Http\Controllers\InmateTunnelController::class, 'sendChat'])
    ->name('inmate.chat.send');

// Embedded VideoSDK prebuilt (v2 rooms; no auth so inmate can join via token in URL)
Route::get('video-room', [\App\Http\Controllers\VideoRoomController::class, 'show'])
    ->name('video-room.show');

// Concurrent login warning (no auth - shown when login blocked due to existing session)
Route::get('concurrent-login-warning', function () {
    return Inertia::render('auth/concurrent-login-warning', [
        'email' => session('concurrent_login_email'),
        'loginUrl' => route('login'),
    ]);
})->name('concurrent-login-warning')->middleware('guest');

// OTP Verification routes (no auth required)
Route::middleware('guest')->group(function () {
    Route::get('otp-verification', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'show'])
        ->name('otp-verification.show');
    Route::post('otp-verification/verify', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'verify'])
        ->name('otp-verification.verify');
    Route::post('otp-verification/resend', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'resend'])
        ->name('otp-verification.resend');

    // Password reset via OTP (send OTP to contact number, verify, then reset and logout other sessions)
    Route::get('password/forgot', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'showForgotForm'])
        ->name('password.forgot.show');
    Route::post('password/forgot', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'sendOtp'])
        ->name('password.forgot.send');
    Route::get('password/verify-otp', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'showVerifyOtp'])
        ->name('password.verify-otp.show');
    Route::post('password/verify-otp', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'verifyOtp'])
        ->name('password.verify-otp.submit');
    Route::get('password/reset', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'showResetForm'])
        ->name('password.reset.show');
    Route::post('password/reset', [\App\Http\Controllers\Auth\PasswordResetOtpController::class, 'reset'])
        ->name('password.reset.submit');
});

Route::middleware('auth')->group(function () {
    Route::get('account-pending', [\App\Http\Controllers\Auth\AccountStatusController::class, 'showPending'])
        ->name('account-pending');
    Route::get('account-rejected', [\App\Http\Controllers\Auth\AccountStatusController::class, 'showRejected'])
        ->name('account-rejected');
    Route::post('account-appeal', [\App\Http\Controllers\Auth\AccountAppealController::class, 'store'])
        ->name('account-appeal.store');
});

Route::middleware(['auth', 'verified', 'approved'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $role = $user->role?->slug;

        if ($role === 'super_admin') {
            return redirect()->route('dashboard.super-admin');
        }
        if ($role === 'bjmp_officer') {
            return redirect()->route('dashboard.bjmp-officer');
        }
        if ($role === 'visitor') {
            return redirect()->route('dashboard.visitor');
        }
        if ($role === 'monitoring_officer') {
            return redirect()->route('dashboard.monitoring-officer');
        }

        return Inertia::render('dashboard');

    })->name('dashboard');

    Route::middleware(['role:visitor'])->get('dashboard/visitor', \App\Http\Controllers\Dashboard\VisitorDashboardController::class)
        ->name('dashboard.visitor');

    Route::middleware(['role:super_admin'])->get('dashboard/super-admin', \App\Http\Controllers\Dashboard\SuperAdminDashboardController::class)
        ->name('dashboard.super-admin');

    Route::middleware(['role:bjmp_officer'])->get('dashboard/bjmp-officer', [\App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::class, '__invoke'])
        ->name('dashboard.bjmp-officer');
    Route::middleware(['role:bjmp_officer'])->get('dashboard/bjmp-officer/overview-data', [\App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::class, 'overviewData'])
        ->name('dashboard.bjmp-officer.overview-data');
    Route::middleware(['role:bjmp_officer'])->get('dashboard/bjmp-officer/export-overview', [\App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::class, 'exportCsv'])
        ->name('dashboard.bjmp-officer.export-overview');

    Route::middleware(['role:monitoring_officer'])->get('dashboard/monitoring-officer', [\App\Http\Controllers\MonitoringOfficer\AnalyticsController::class, 'index'])
        ->name('dashboard.monitoring-officer');

    Route::middleware(['role:super_admin,monitoring_officer'])->prefix('monitoring')->name('monitoring.')->group(function () {
        Route::get('video-recordings', [\App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::class, 'index'])
            ->name('video-recordings.index');
        Route::get('chat-recordings', [\App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::class, 'index'])
            ->name('chat-recordings.index');
    });

    Route::middleware(['role:monitoring_officer'])->get('monitoring-officer/visit-monitoring', \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::class)
        ->name('monitoring-officer.visit-monitoring');
    Route::middleware(['role:monitoring_officer'])->get('monitoring-officer/eburol-monitoring', \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::class)
        ->name('monitoring-officer.eburol-monitoring');

    Route::middleware(['role:monitoring_officer,super_admin'])->prefix('monitoring-officer')->name('monitoring-officer.')->group(function () {
        Route::get('assigned-sessions', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'index'])
            ->name('assigned-sessions.index');
        Route::post('assigned-sessions/{session}/generate-tunnel', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'generateTunnel'])
            ->name('assigned-sessions.generate-tunnel');
        Route::post('assigned-sessions/{session}/start', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'startSession'])
            ->name('assigned-sessions.start');
        Route::post('assigned-sessions/{session}/end', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'endSession'])
            ->name('assigned-sessions.end');
        Route::post('assigned-sessions/{session}/lock-chat', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'lockChat'])
            ->name('assigned-sessions.lock-chat');
        Route::post('assigned-sessions/{session}/unlock-chat', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'unlockChat'])
            ->name('assigned-sessions.unlock-chat');
        Route::get('video-recordings', [\App\Http\Controllers\MonitoringOfficer\VideoRecordingsController::class, 'index'])
            ->name('video-recordings.index');
        Route::get('chat-recordings', [\App\Http\Controllers\MonitoringOfficer\ChatRecordingsController::class, 'index'])
            ->name('chat-recordings.index');
        Route::get('analytics', [\App\Http\Controllers\MonitoringOfficer\AnalyticsController::class, 'index'])
            ->name('analytics.index');
        Route::get('analytics/export/csv', [\App\Http\Controllers\MonitoringOfficer\AnalyticsController::class, 'exportCsv'])
            ->name('analytics.export.csv');
        Route::get('incidents', [\App\Http\Controllers\MonitoringOfficer\IncidentReportingController::class, 'index'])
            ->name('incidents.index');
        Route::get('history', [\App\Http\Controllers\MonitoringOfficer\HistoryController::class, 'index'])
            ->name('history.index');
        Route::get('inmate-tunnels', [\App\Http\Controllers\MonitoringOfficer\InmateTunnelController::class, 'index'])
            ->name('inmate-tunnels.index');
        Route::get('notifications', [\App\Http\Controllers\MonitoringOfficer\NotificationController::class, 'index'])
            ->name('notifications.index');
        Route::post('notifications/{notification}/read', [\App\Http\Controllers\MonitoringOfficer\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [\App\Http\Controllers\MonitoringOfficer\NotificationController::class, 'markAllAsRead'])
            ->name('notifications.read-all');
    });

    // Join as observer: monitoring officer or super admin (same privileges)
    Route::middleware(['role:monitoring_officer,super_admin'])->get('monitoring-officer/assigned-sessions/{session}/join', [\App\Http\Controllers\MonitoringOfficer\AssignedSessionsController::class, 'joinAsObserver'])
        ->name('monitoring-officer.assigned-sessions.join');

    Route::get('visit/session/{session}/chat', [\App\Http\Controllers\VisitSessionChatController::class, 'index'])
        ->name('visit-session.chat.index');
    Route::post('visit/session/{session}/chat', [\App\Http\Controllers\VisitSessionChatController::class, 'store'])
        ->name('visit-session.chat.store');
    Route::post('visit/session/{session}/chat/{chatLog}/flag', [\App\Http\Controllers\VisitSessionChatController::class, 'flag'])
        ->name('visit-session.chat.flag');
    Route::post('visit/session/{session}/chat/export', [\App\Http\Controllers\VisitSessionChatExportController::class, 'store'])
        ->name('visit-session.chat.export');
    Route::get('chat-exports/{chatExport}/download', [\App\Http\Controllers\VisitSessionChatExportController::class, 'download'])
        ->name('chat-exports.download');

    Route::get('visits/{visit}/proof', [\App\Http\Controllers\VisitProofController::class, 'show'])
        ->name('visits.proof');

    Route::middleware(['role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', \App\Http\Controllers\Admin\UserManagementController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::post('users/{user}/approve', [\App\Http\Controllers\Admin\UserManagementController::class, 'approve'])
            ->name('users.approve');
        Route::post('users/{user}/reject', [\App\Http\Controllers\Admin\UserManagementController::class, 'reject'])
            ->name('users.reject');
        Route::post('users/{user}/update-status', [\App\Http\Controllers\Admin\UserManagementController::class, 'updateStatus'])
            ->name('users.update-status');

        Route::get('schedules', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'index'])
            ->name('schedules.index');
        Route::get('schedules/booked-slots', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'getBookedTimeSlots'])
            ->name('schedules.booked-slots');
        Route::post('schedules', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'store'])
            ->name('schedules.store');
        Route::put('schedules/{visit}', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'update'])
            ->name('schedules.update');
        Route::delete('schedules/{visit}', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'destroy'])
            ->name('schedules.destroy');
        Route::post('schedules/{visit}/approve', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'approve'])
            ->name('schedules.approve');
        Route::post('schedules/{visit}/reject', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'reject'])
            ->name('schedules.reject');
        Route::post('schedules/{visit}/update-status', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'updateStatus'])
            ->name('schedules.update-status');
        Route::post('schedules/{visit}/generate-access-key', [\App\Http\Controllers\Admin\ScheduleManagementController::class, 'generateAccessKey'])
            ->name('schedules.generate-access-key');
        Route::get('visit-session/{session}/join', [\App\Http\Controllers\StaffVisitSessionJoinController::class, 'join'])
            ->name('visit-session.join');

        Route::get('eburols', [\App\Http\Controllers\Admin\EburolManagementController::class, 'index'])
            ->name('eburols.index');
        Route::post('eburols', [\App\Http\Controllers\Admin\EburolManagementController::class, 'store'])
            ->name('eburols.store');
        Route::put('eburols/{eburol}', [\App\Http\Controllers\Admin\EburolManagementController::class, 'update'])
            ->name('eburols.update');
        Route::delete('eburols/{eburol}', [\App\Http\Controllers\Admin\EburolManagementController::class, 'destroy'])
            ->name('eburols.destroy');
        Route::post('eburols/{eburol}/approve', [\App\Http\Controllers\Admin\EburolManagementController::class, 'approve'])
            ->name('eburols.approve');
        Route::post('eburols/{eburol}/reject', [\App\Http\Controllers\Admin\EburolManagementController::class, 'reject'])
            ->name('eburols.reject');
        Route::post('eburols/{eburol}/update-status', [\App\Http\Controllers\Admin\EburolManagementController::class, 'updateStatus'])
            ->name('eburols.update-status');
        Route::get('eburols/{eburol}/document/death-certificate', [\App\Http\Controllers\Admin\EburolManagementController::class, 'deathCertificate'])
            ->name('eburols.document.death-certificate');
        Route::get('eburols/{eburol}/document/relationship-proof', [\App\Http\Controllers\Admin\EburolManagementController::class, 'relationshipProof'])
            ->name('eburols.document.relationship-proof');

        Route::get('time-slot-capacities', [\App\Http\Controllers\Admin\TimeSlotConfigurationController::class, 'index'])
            ->name('time-slot-capacities.index');
        Route::put('time-slot-capacities/{timeSlotCapacity}', [\App\Http\Controllers\Admin\TimeSlotConfigurationController::class, 'update'])
            ->name('time-slot-capacities.update');
        Route::post('time-slot-capacities/update', [\App\Http\Controllers\Admin\TimeSlotConfigurationController::class, 'updateCapacity'])
            ->name('time-slot-capacities.update-capacity');
    });

    Route::middleware(['role:visitor'])->prefix('visitor')->name('visitor.')->group(function () {
        Route::get('schedules/booked-slots', [\App\Http\Controllers\Visitor\ScheduleController::class, 'getBookedTimeSlots'])
            ->name('schedules.booked-slots');
        Route::get('schedule', [\App\Http\Controllers\Visitor\ScheduleController::class, 'index'])
            ->name('schedule.index');
        Route::post('schedule', [\App\Http\Controllers\Visitor\ScheduleController::class, 'store'])
            ->name('schedule.store');
        Route::post('schedule/{visit}/cancel', [\App\Http\Controllers\Visitor\ScheduleController::class, 'cancel'])
            ->name('schedule.cancel');
        Route::post('schedule/{visit}/reschedule', [\App\Http\Controllers\Visitor\ScheduleController::class, 'reschedule'])
            ->name('schedule.reschedule');
        Route::get('schedule/booked-slots', [\App\Http\Controllers\Visitor\ScheduleController::class, 'getBookedTimeSlots'])
            ->name('schedule.booked-slots');
        Route::get('call-logs', [\App\Http\Controllers\Visitor\CallLogController::class, 'index'])
            ->name('call-logs.index');
        Route::get('eburol', [\App\Http\Controllers\Visitor\EburolController::class, 'index'])
            ->name('eburol.index');
        Route::get('eburol/slot-availability', [\App\Http\Controllers\Visitor\EburolController::class, 'slotAvailability'])
            ->name('eburol.slot-availability');
        Route::post('eburol', [\App\Http\Controllers\Visitor\EburolController::class, 'store'])
            ->name('eburol.store');
        Route::get('eburol/{eburol}', [\App\Http\Controllers\Visitor\EburolController::class, 'show'])
            ->name('eburol.show');
        Route::get('eburol/{eburol}/document/death-certificate', [\App\Http\Controllers\Visitor\EburolController::class, 'deathCertificate'])
            ->name('eburol.document.death-certificate');
        Route::get('eburol/{eburol}/document/relationship-proof', [\App\Http\Controllers\Visitor\EburolController::class, 'relationshipProof'])
            ->name('eburol.document.relationship-proof');
        Route::put('eburol/{eburol}', [\App\Http\Controllers\Visitor\EburolController::class, 'update'])
            ->name('eburol.update');
        Route::post('eburol/{eburol}/reschedule', [\App\Http\Controllers\Visitor\EburolController::class, 'reschedule'])
            ->name('eburol.reschedule');
        Route::delete('eburol/{eburol}', [\App\Http\Controllers\Visitor\EburolController::class, 'destroy'])
            ->name('eburol.destroy');
        Route::get('notifications', [\App\Http\Controllers\Visitor\NotificationController::class, 'index'])
            ->name('notifications.index');
        Route::post('notifications/{notification}/read', [\App\Http\Controllers\Visitor\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [\App\Http\Controllers\Visitor\NotificationController::class, 'markAllAsRead'])
            ->name('notifications.read-all');
        Route::get('sessions', [\App\Http\Controllers\Visitor\SessionController::class, 'index'])
            ->name('sessions.index');
        Route::delete('sessions/{session}', [\App\Http\Controllers\Visitor\SessionController::class, 'revoke'])
            ->name('sessions.revoke');
        Route::post('sessions/revoke-all', [\App\Http\Controllers\Visitor\SessionController::class, 'revokeAll'])
            ->name('sessions.revoke-all');
        Route::get('appeals', [\App\Http\Controllers\Visitor\AppealController::class, 'index'])
            ->name('appeals.index');
        Route::post('appeals', [\App\Http\Controllers\Visitor\AppealController::class, 'store'])
            ->name('appeals.store');
        Route::get('suggestions', [\App\Http\Controllers\Visitor\SuggestionController::class, 'index'])
            ->name('suggestions.index');
        Route::post('suggestions', [\App\Http\Controllers\Visitor\SuggestionController::class, 'store'])
            ->name('suggestions.store');
        Route::get('history', [\App\Http\Controllers\Visitor\AuditLogController::class, 'index'])
            ->name('history.index');
    });

    Route::middleware(['role:visitor'])->group(function () {
        Route::get('visit/session/{session}', [\App\Http\Controllers\Visitor\VisitSessionController::class, 'show'])
            ->name('visit-session.show');
        Route::get('visit/session/{session}/video-room', [\App\Http\Controllers\Visitor\VisitSessionController::class, 'videoRoom'])
            ->name('visit-session.video-room');
        Route::post('visit/session/{session}/accept-terms', [\App\Http\Controllers\Visitor\VisitSessionController::class, 'acceptTerms'])
            ->name('visit-session.accept-terms');
        Route::post('visit/session/{session}/participant-joined', [\App\Http\Controllers\Visitor\VisitSessionController::class, 'participantJoined'])
            ->name('visit-session.participant-joined');
    });

    Route::middleware(['role:bjmp_officer'])->prefix('bjmp-officer')->name('bjmp-officer.')->group(function () {
        Route::get('notifications', [\App\Http\Controllers\BjmpOfficer\NotificationController::class, 'index'])
            ->name('notifications.index');
        Route::post('notifications/{notification}/read', [\App\Http\Controllers\BjmpOfficer\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [\App\Http\Controllers\BjmpOfficer\NotificationController::class, 'markAllAsRead'])
            ->name('notifications.read-all');

        Route::get('eburols', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'index'])
            ->name('eburols.index');
        Route::get('eburols/{eburol}/document/death-certificate', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'deathCertificate'])
            ->name('eburols.document.death-certificate');
        Route::get('eburols/{eburol}/document/relationship-proof', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'relationshipProof'])
            ->name('eburols.document.relationship-proof');
        Route::post('eburols/{eburol}/approve', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'approve'])
            ->name('eburols.approve');
        Route::post('eburols/{eburol}/reject', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'reject'])
            ->name('eburols.reject');
        Route::post('eburols/{eburol}/update-status', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'updateStatus'])
            ->name('eburols.update-status');

        // Visit Schedule Management
        Route::get('schedules', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'index'])
            ->name('schedules.index');
        Route::post('schedules/{visit}/approve', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'approve'])
            ->name('schedules.approve');
        Route::post('schedules/{visit}/reject', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'reject'])
            ->name('schedules.reject');
        Route::post('schedules/{visit}/update-status', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'updateStatus'])
            ->name('schedules.update-status');
        Route::post('schedules/{visit}/generate-access-key', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'generateAccessKey'])
            ->name('schedules.generate-access-key');
        Route::post('schedules/{visit}/reschedule', [\App\Http\Controllers\BjmpOfficer\ScheduleManagementController::class, 'reschedule'])
            ->name('schedules.reschedule');
        Route::get('visit-session/{session}/join', [\App\Http\Controllers\StaffVisitSessionJoinController::class, 'join'])
            ->name('visit-session.join');

        // Appeal Processing
        Route::get('appeals', [\App\Http\Controllers\BjmpOfficer\AppealReviewController::class, 'index'])
            ->name('appeals.index');
        Route::post('appeals/{appeal}/review', [\App\Http\Controllers\BjmpOfficer\AppealReviewController::class, 'review'])
            ->name('appeals.review');

        // Audit Logs
        Route::get('audit-logs', [\App\Http\Controllers\BjmpOfficer\AuditLogController::class, 'index'])
            ->name('audit-logs.index');
    });

    Route::middleware(['role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('appeals', [\App\Http\Controllers\Admin\AppealsOversightController::class, 'index'])
            ->name('appeals.index');
        Route::post('appeals/{appeal}/review', [\App\Http\Controllers\Admin\AppealsOversightController::class, 'review'])
            ->name('appeals.review');
        Route::put('appeals/{appeal}/update-status', [\App\Http\Controllers\Admin\AppealsOversightController::class, 'updateStatus'])
            ->name('appeals.update-status');
        Route::get('appeals/documents/{appealDocument}/download', [\App\Http\Controllers\Admin\AppealsOversightController::class, 'downloadDocument'])
            ->name('appeals.documents.download');
        Route::get('account-appeals', [\App\Http\Controllers\Admin\AccountAppealReviewController::class, 'index'])
            ->name('account-appeals.index');
        Route::post('account-appeals/{appeal}/review', [\App\Http\Controllers\Admin\AccountAppealReviewController::class, 'review'])
            ->name('account-appeals.review');
        Route::get('suggestions', [\App\Http\Controllers\Admin\SuggestionManagementController::class, 'index'])
            ->name('suggestions.index');
        Route::put('suggestions/{suggestion}', [\App\Http\Controllers\Admin\SuggestionManagementController::class, 'update'])
            ->name('suggestions.update');
        Route::get('notifications', [\App\Http\Controllers\Admin\NotificationManagementController::class, 'index'])
            ->name('notifications.index');
        Route::post('notifications/{notification}/read', [\App\Http\Controllers\Admin\NotificationManagementController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [\App\Http\Controllers\Admin\NotificationManagementController::class, 'markAllAsRead'])
            ->name('notifications.read-all');
        Route::get('sessions', [\App\Http\Controllers\Admin\SessionManagementController::class, 'index'])
            ->name('sessions.index');
        Route::delete('sessions/{session}', [\App\Http\Controllers\Admin\SessionManagementController::class, 'revoke'])
            ->name('sessions.revoke');
        Route::post('sessions/user/{user}/revoke-all', [\App\Http\Controllers\Admin\SessionManagementController::class, 'revokeUserSessions'])
            ->name('sessions.revoke-user-all');
        Route::post('sessions/revoke-my-other', [\App\Http\Controllers\Admin\SessionManagementController::class, 'revokeMyOtherSessions'])
            ->name('sessions.revoke-my-other');
        Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])
            ->name('audit-logs.index');
        Route::get('audit-logs/export', [\App\Http\Controllers\Admin\AuditLogController::class, 'export'])
            ->name('audit-logs.export');
        Route::get('incident-reporting', [\App\Http\Controllers\Admin\IncidentReportingController::class, 'index'])
            ->name('incident-reporting.index');
        Route::get('inmate-tunnels', [\App\Http\Controllers\Admin\InmateTunnelController::class, 'index'])
            ->name('inmate-tunnels.index');
    });
});

require __DIR__.'/settings.php';
