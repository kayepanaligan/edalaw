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
        'csrfToken' => csrf_token(),
        'oldEmail' => request()->old('email'),
    ]);
})->name('home');

Route::post('webhooks/daily-co', [\App\Http\Controllers\Webhook\DailyCoWebhookController::class, 'handle'])
    ->name('webhooks.daily-co');

// OTP Verification routes (no auth required)
Route::middleware('guest')->group(function () {
    Route::get('otp-verification', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'show'])
        ->name('otp-verification.show');
    Route::post('otp-verification/verify', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'verify'])
        ->name('otp-verification.verify');
    Route::post('otp-verification/resend', [\App\Http\Controllers\Auth\OtpVerificationController::class, 'resend'])
        ->name('otp-verification.resend');
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

    Route::middleware(['role:bjmp_officer'])->get('dashboard/bjmp-officer', \App\Http\Controllers\Dashboard\BjmpOfficerDashboardController::class)
        ->name('dashboard.bjmp-officer');

    Route::middleware(['role:monitoring_officer'])->get('dashboard/monitoring-officer', \App\Http\Controllers\Dashboard\MonitoringOfficerDashboardController::class)
        ->name('dashboard.monitoring-officer');

    Route::middleware(['role:monitoring_officer'])->get('monitoring-officer/visit-monitoring', \App\Http\Controllers\MonitoringOfficer\VisitMonitoringController::class)
        ->name('monitoring-officer.visit-monitoring');
    Route::middleware(['role:monitoring_officer'])->get('monitoring-officer/eburol-monitoring', \App\Http\Controllers\MonitoringOfficer\EburolMonitoringController::class)
        ->name('monitoring-officer.eburol-monitoring');

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
        Route::post('eburol', [\App\Http\Controllers\Visitor\EburolController::class, 'store'])
            ->name('eburol.store');
        Route::get('eburol/{eburol}', [\App\Http\Controllers\Visitor\EburolController::class, 'show'])
            ->name('eburol.show');
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

    Route::middleware(['role:bjmp_officer'])->prefix('bjmp-officer')->name('bjmp-officer.')->group(function () {

        Route::get('eburols', [\App\Http\Controllers\BjmpOfficer\EburolManagementController::class, 'index'])
            ->name('eburols.index');
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
        Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])
            ->name('audit-logs.index');
        Route::get('audit-logs/export', [\App\Http\Controllers\Admin\AuditLogController::class, 'export'])
            ->name('audit-logs.export');
    });
});

require __DIR__.'/settings.php';
