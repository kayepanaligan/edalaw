<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // If user is already authenticated, redirect to their dashboard
    if (auth()->check()) {
        $user = auth()->user();
        $role = $user->role?->slug;

        // Redirect based on role
        if ($role === 'super_admin') {
            return redirect()->route('dashboard.super-admin');
        }
        if ($role === 'bjmp_officer') {
            return redirect()->route('dashboard.bjmp-officer');
        }
        if ($role === 'visitor') {
            return redirect()->route('dashboard.visitor');
        }

        // Fallback to general dashboard
        return redirect()->route('dashboard');
    }

    // If not authenticated, show login page
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Webhook routes (no auth required, uses signature verification)
Route::post('webhooks/daily-co', [\App\Http\Controllers\Webhook\DailyCoWebhookController::class, 'handle'])
    ->name('webhooks.daily-co');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $role = $user->role?->slug;

        // Redirect based on role
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

    Route::middleware(['role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', \App\Http\Controllers\Admin\UserManagementController::class)
            ->only(['index', 'update', 'destroy']);
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

        Route::get('eburols', [\App\Http\Controllers\Admin\EburolManagementController::class, 'index'])
            ->name('eburols.index');
        Route::post('eburols/{eburol}/approve', [\App\Http\Controllers\Admin\EburolManagementController::class, 'approve'])
            ->name('eburols.approve');
        Route::post('eburols/{eburol}/reject', [\App\Http\Controllers\Admin\EburolManagementController::class, 'reject'])
            ->name('eburols.reject');
        Route::post('eburols/{eburol}/update-status', [\App\Http\Controllers\Admin\EburolManagementController::class, 'updateStatus'])
            ->name('eburols.update-status');
    });

    Route::middleware(['role:visitor'])->prefix('visitor')->name('visitor.')->group(function () {
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
        // E-Burol Management
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
