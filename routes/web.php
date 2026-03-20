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
        if ($role === 'jail_officer') {
            return redirect()->route('dashboard.jail-officer');
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

Route::get('/test-token', function () {

    $payload = [
        'apikey' => config('videosdk.api_key'),
        'permissions' => ['allow_join'],
        'iat' => time(),
        'exp' => time() + 3600,
    ];

    return \Firebase\JWT\JWT::encode(
        $payload,
        config('videosdk.secret_key'),
        'HS256'
    );
});

Route::get('/meeting-token/{room}', [\App\Http\Controllers\VideoRoomController::class, 'token']);

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

    // Registration OTP Verification (visitor registration)
    Route::get('registration/otp', [\App\Http\Controllers\Auth\RegistrationOtpController::class, 'show'])
        ->name('registration-otp.show');
    Route::post('registration/otp/verify', [\App\Http\Controllers\Auth\RegistrationOtpController::class, 'verify'])
        ->name('registration-otp.verify');
    Route::post('registration/otp/resend', [\App\Http\Controllers\Auth\RegistrationOtpController::class, 'resend'])
        ->name('registration-otp.resend');

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

Route::post('/video/chat', [App\Http\Controllers\VideoChatController::class, 'store'])->name('video.chat.store');
Route::post('/video/session/update', [App\Http\Controllers\VideoChatController::class, 'updateSession'])->name('video.session.update');
Route::post('/video/chat/send', [App\Http\Controllers\VideoChatController::class, 'sendMessage'])->name('video.chat.send');
Route::get('/video/chat/history/{roomId}', [App\Http\Controllers\VideoChatController::class, 'getChatHistory'])->name('video.chat.history');
Route::get('/video/chat/sync/{sessionId}', [App\Http\Controllers\VideoChatController::class, 'syncFromCloud']);
Route::get('/video/chat/export/{sessionId}', [App\Http\Controllers\VideoChatController::class, 'exportChat'])->name('video.chat.export');
Route::post('/visit-session/save-session-id', [App\Http\Controllers\Visitor\VisitSessionController::class, 'saveSessionId'])->name('visit-session.save-session-id');

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
        if ($role === 'jail_officer') {
            return redirect()->route('dashboard.jail-officer');
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

    Route::middleware(['role:jail_officer'])->get('dashboard/jail-officer', [\App\Http\Controllers\JailOfficer\AnalyticsController::class, 'index'])
        ->name('dashboard.jail-officer');

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

        // Chat Logs Management
        Route::get('chat-logs', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'index'])
            ->name('chat-logs.index');
        Route::get('chat-logs/export', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'exportCsv'])
            ->name('chat-logs.export');
        Route::get('chat-logs/session/{session}', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'showSession'])
            ->name('chat-logs.session');

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
        Route::post('time-slot-capacities/update-settings', [\App\Http\Controllers\Admin\TimeSlotConfigurationController::class, 'updateSettings'])
            ->name('time-slot-capacities.update-settings');
        Route::post('time-slot-capacities/operating-hours', [\App\Http\Controllers\Admin\TimeSlotConfigurationController::class, 'updateOperatingHours'])
            ->name('time-slot-capacities.update-operating-hours');
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
        Route::post('schedule/search-inmate', [\App\Http\Controllers\Visitor\ScheduleController::class, 'searchInmate'])
            ->name('schedule.search-inmate');
        Route::post('schedule/check-cell-availability', [\App\Http\Controllers\Visitor\ScheduleController::class, 'checkCellAvailability'])
            ->name('schedule.check-cell-availability');
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
        Route::get('appeals/documents/{document}/download', [\App\Http\Controllers\Visitor\AppealController::class, 'downloadDocument'])
            ->name('appeals.documents.download');
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

    // Cell, Inmate, and Cell Schedule Management (accessible by both BJMP Officer and Jail Officer)
    Route::middleware(['role:bjmp_officer,jail_officer'])->prefix('bjmp-officer')->name('bjmp-officer.')->group(function () {
        // Cell Management
        Route::get('cells', [\App\Http\Controllers\BjmpOfficer\CellManagementController::class, 'index'])
            ->name('cells.index');
        Route::post('cells', [\App\Http\Controllers\BjmpOfficer\CellManagementController::class, 'store'])
            ->name('cells.store');
        Route::put('cells/{cell}', [\App\Http\Controllers\BjmpOfficer\CellManagementController::class, 'update'])
            ->name('cells.update');
        Route::delete('cells/{cell}', [\App\Http\Controllers\BjmpOfficer\CellManagementController::class, 'destroy'])
            ->name('cells.destroy');

        // Inmate Management
        Route::get('inmates', [\App\Http\Controllers\BjmpOfficer\InmateManagementController::class, 'index'])
            ->name('inmates.index');
        Route::post('inmates', [\App\Http\Controllers\BjmpOfficer\InmateManagementController::class, 'store'])
            ->name('inmates.store');
        Route::put('inmates/{inmate}', [\App\Http\Controllers\BjmpOfficer\InmateManagementController::class, 'update'])
            ->name('inmates.update');
        Route::delete('inmates/{inmate}', [\App\Http\Controllers\BjmpOfficer\InmateManagementController::class, 'destroy'])
            ->name('inmates.destroy');
        Route::post('inmates/{inmate}/transfer', [\App\Http\Controllers\BjmpOfficer\InmateManagementController::class, 'transfer'])
            ->name('inmates.transfer');

        // Cell Schedule Templates
        Route::get('cell-schedules', [\App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::class, 'index'])
            ->name('cell-schedules.index');
        Route::put('cell-schedules/{cell}', [\App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::class, 'update'])
            ->name('cell-schedules.update');
        Route::post('cell-schedules/bulk-update', [\App\Http\Controllers\BjmpOfficer\CellScheduleTemplateController::class, 'bulkUpdate'])
            ->name('cell-schedules.bulk-update');
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

    // Unified Jail Officer Routes (combines Monitoring Officer + BJMP Officer features)
    Route::middleware(['role:jail_officer'])->prefix('jail-officer')->name('jail-officer.')->group(function () {
        // Dashboard
        Route::get('dashboard', [\App\Http\Controllers\JailOfficer\AnalyticsController::class, 'index'])
            ->name('dashboard');
        Route::get('dashboard/export/csv', [\App\Http\Controllers\JailOfficer\AnalyticsController::class, 'exportCsv'])
            ->name('dashboard.export.csv');

        // Notifications
        Route::get('notifications', [\App\Http\Controllers\JailOfficer\NotificationController::class, 'index'])
            ->name('notifications.index');
        Route::post('notifications/{notification}/read', [\App\Http\Controllers\JailOfficer\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [\App\Http\Controllers\JailOfficer\NotificationController::class, 'markAllAsRead'])
            ->name('notifications.read-all');

        // Schedule Management (Visits)
        Route::get('schedules', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'index'])
            ->name('schedules.index');
        Route::post('schedules/{visit}/approve', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'approve'])
            ->name('schedules.approve');
        Route::post('schedules/{visit}/reject', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'reject'])
            ->name('schedules.reject');
        Route::post('schedules/{visit}/update-status', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'updateStatus'])
            ->name('schedules.update-status');
        Route::post('schedules/{visit}/generate-access-key', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'generateAccessKey'])
            ->name('schedules.generate-access-key');
        Route::post('schedules/{visit}/reschedule', [\App\Http\Controllers\JailOfficer\ScheduleManagementController::class, 'reschedule'])
            ->name('schedules.reschedule');
        Route::get('visit-session/{session}/join', [\App\Http\Controllers\StaffVisitSessionJoinController::class, 'join'])
            ->name('visit-session.join');

        // Visit Monitored Management
        Route::get('visits-monitored', [\App\Http\Controllers\JailOfficer\VisitMonitoredManagementController::class, 'index'])
            ->name('visits-monitored.index');
        Route::get('visits-monitored/{meetingId}', [\App\Http\Controllers\JailOfficer\VisitMonitoredManagementController::class, 'show'])
            ->name('visits-monitored.show');
        Route::get('visits-monitored/{meetingId}/download-chat', [\App\Http\Controllers\JailOfficer\VisitMonitoredManagementController::class, 'downloadChat'])
            ->name('visits-monitored.download-chat');
        Route::post('visits-monitored/{meetingId}/share-analytics', [\App\Http\Controllers\JailOfficer\VisitMonitoredManagementController::class, 'shareAnalytics'])
            ->name('visits-monitored.share-analytics');

        // Eburol Management
        Route::get('eburols', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'index'])
            ->name('eburols.index');
        Route::get('eburols/{eburol}/document/death-certificate', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'deathCertificate'])
            ->name('eburols.document.death-certificate');
        Route::get('eburols/{eburol}/document/relationship-proof', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'relationshipProof'])
            ->name('eburols.document.relationship-proof');
        Route::post('eburols/{eburol}/approve', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'approve'])
            ->name('eburols.approve');
        Route::post('eburols/{eburol}/reject', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'reject'])
            ->name('eburols.reject');
        Route::post('eburols/{eburol}/update-status', [\App\Http\Controllers\JailOfficer\EburolManagementController::class, 'updateStatus'])
            ->name('eburols.update-status');

        // Session Monitoring & Assigned Sessions
        Route::get('assigned-sessions', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'index'])
            ->name('assigned-sessions.index');
        Route::post('assigned-sessions/{session}/generate-tunnel', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'generateTunnel'])
            ->name('assigned-sessions.generate-tunnel');
        Route::post('assigned-sessions/{session}/start', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'startSession'])
            ->name('assigned-sessions.start');
        Route::post('assigned-sessions/{session}/end', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'endSession'])
            ->name('assigned-sessions.end');
        Route::post('assigned-sessions/{session}/lock-chat', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'lockChat'])
            ->name('assigned-sessions.lock-chat');
        Route::post('assigned-sessions/{session}/unlock-chat', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'unlockChat'])
            ->name('assigned-sessions.unlock-chat');
        Route::get('assigned-sessions/{session}/join', [\App\Http\Controllers\JailOfficer\AssignedSessionsController::class, 'joinAsObserver'])
            ->name('assigned-sessions.join');

        // Visit & Eburol Monitoring
        Route::get('visit-monitoring', \App\Http\Controllers\JailOfficer\VisitMonitoringController::class)
            ->name('visit-monitoring');
        Route::get('eburol-monitoring', \App\Http\Controllers\JailOfficer\EburolMonitoringController::class)
            ->name('eburol-monitoring');
        Route::get('session-monitoring', [\App\Http\Controllers\JailOfficer\SessionMonitoringController::class, 'index'])
            ->name('session-monitoring.index');

        // Recordings
        Route::get('video-recordings', [\App\Http\Controllers\JailOfficer\VideoRecordingsController::class, 'index'])
            ->name('video-recordings.index');
        Route::get('chat-recordings', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'index'])
            ->name('chat-recordings.index');
        Route::get('chat-recordings/session/{roomId}', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'viewSession'])
            ->name('chat-recordings.view-session');
        Route::get('chat-recordings/session/{roomId}/export', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'exportSession'])
            ->name('chat-recordings.export-session');

        // Incident Reporting
        Route::get('incidents', [\App\Http\Controllers\JailOfficer\IncidentReportingController::class, 'index'])
            ->name('incidents.index');

        // History
        Route::get('history', [\App\Http\Controllers\JailOfficer\HistoryController::class, 'index'])
            ->name('history.index');

        // Inmate Tunnels
        Route::get('inmate-tunnels', [\App\Http\Controllers\JailOfficer\InmateTunnelController::class, 'index'])
            ->name('inmate-tunnels.index');

        // Appeal Review
        Route::get('appeals', [\App\Http\Controllers\JailOfficer\AppealReviewController::class, 'index'])
            ->name('appeals.index');
        Route::post('appeals/{appeal}/review', [\App\Http\Controllers\JailOfficer\AppealReviewController::class, 'review'])
            ->name('appeals.review');

        // Audit Logs
        Route::get('audit-logs', [\App\Http\Controllers\JailOfficer\AuditLogController::class, 'index'])
            ->name('audit-logs.index');

        // Chat Logs Management
        Route::get('chat-logs', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'index'])
            ->name('chat-logs.index');
        Route::get('chat-logs/export', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'exportCsv'])
            ->name('chat-logs.export');
        Route::get('chat-logs/session/{session}', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'showSession'])
            ->name('chat-logs.session');
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

        // Chat Logs Management
        Route::get('chat-logs', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'index'])
            ->name('chat-logs.index');
        Route::get('chat-logs/export', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'exportCsv'])
            ->name('chat-logs.export');
        Route::get('chat-logs/session/{session}', [\App\Http\Controllers\JailOfficer\ChatLogsController::class, 'showSession'])
            ->name('chat-logs.session');

        // Chat Recordings Management
        Route::get('chat-recordings', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'index'])
            ->name('chat-recordings.index');
        Route::get('chat-recordings/session/{roomId}', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'viewSession'])
            ->name('chat-recordings.view-session');
        Route::get('chat-recordings/session/{roomId}/export', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'exportSession'])
            ->name('chat-recordings.export-session');
    });
});

// API route for fetching chat session data (used by modal)
Route::middleware(['auth', 'role:jail_officer'])->get('api/chat-recordings/session/{roomId}', [\App\Http\Controllers\JailOfficer\ChatRecordingsController::class, 'viewSessionApi'])
    ->name('jail-officer.chat-recordings.api');

require __DIR__.'/settings.php';
