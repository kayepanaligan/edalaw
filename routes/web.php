<?php

use App\Http\Controllers\Dashboard\BjmpOfficerDashboardController;
use App\Http\Controllers\Dashboard\SuperAdminDashboardController;
use App\Http\Controllers\Dashboard\VisitorDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('auth/login', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user()->load('role');

        return match ($user->role->slug) {
            'super_admin' => redirect()->route('dashboard.super-admin'),
            'bjmp_officer' => redirect()->route('dashboard.bjmp-officer'),
            'visitor' => redirect()->route('dashboard.visitor'),
            default => redirect()->route('dashboard.visitor'),
        };
    })->name('dashboard');

    Route::get('dashboard/super-admin', SuperAdminDashboardController::class)
        ->middleware('role:super_admin')
        ->name('dashboard.super-admin');

    Route::get('dashboard/bjmp-officer', BjmpOfficerDashboardController::class)
        ->middleware('role:bjmp_officer')
        ->name('dashboard.bjmp-officer');

    Route::get('dashboard/visitor', VisitorDashboardController::class)
        ->middleware('role:visitor')
        ->name('dashboard.visitor');
});

Route::middleware(['auth', 'verified', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('users', [App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('users.index');
    Route::post('users/{user}/approve', [App\Http\Controllers\Admin\UserManagementController::class, 'approve'])->name('users.approve');
    Route::post('users/{user}/reject', [App\Http\Controllers\Admin\UserManagementController::class, 'reject'])->name('users.reject');
});

Route::middleware(['auth', 'verified', 'role:visitor'])->prefix('visitor')->name('visitor.')->group(function () {
    Route::get('schedule', [App\Http\Controllers\Visitor\ScheduleController::class, 'index'])->name('schedule.index');
    Route::get('schedule/booked-slots', [App\Http\Controllers\Visitor\ScheduleController::class, 'getBookedTimeSlots'])->name('schedule.booked-slots');
    Route::post('schedule', [App\Http\Controllers\Visitor\ScheduleController::class, 'store'])->name('schedule.store');
    Route::get('requests', [App\Http\Controllers\Visitor\RequestManagementController::class, 'index'])->name('requests.index');
    Route::get('call-logs', [App\Http\Controllers\Visitor\CallLogController::class, 'index'])->name('call-logs.index');
});

require __DIR__.'/settings.php';
