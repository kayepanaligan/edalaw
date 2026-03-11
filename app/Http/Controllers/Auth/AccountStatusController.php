<?php

namespace App\Http\Controllers\Auth;

use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AccountStatusController extends Controller
{
    /**
     * Show the account pending page.
     */
    public function showPending(Request $request): Response|RedirectResponse
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        if ($user->approval_status === ApprovalStatus::Approved) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('status', 'Your account has been approved. Please log in.');
        }

        if ($user->approval_status !== ApprovalStatus::Pending) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/account-pending', [
            'message' => session('message', 'Your account is pending approval. Please wait for a super admin to review your registration.'),
        ]);
    }

    /**
     * Show the account rejected page.
     */
    public function showRejected(Request $request): Response
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        if ($user->approval_status !== ApprovalStatus::Rejected) {
            return redirect()->route('dashboard');
        }

        // Check if user already has a pending or approved appeal
        $existingAppeal = $user->appeals()
            ->where('appealable_type', \App\Models\User::class)
            ->where('appealable_id', $user->id)
            ->whereIn('status', [\App\AppealStatus::Pending, \App\AppealStatus::Approved])
            ->first();

        return Inertia::render('auth/account-rejected', [
            'message' => session('message', 'Your account has been rejected. You may submit an appeal if you believe this was an error.'),
            'rejection_reason' => $user->rejection_reason,
            'hasExistingAppeal' => $existingAppeal !== null,
            'existingAppeal' => $existingAppeal ? [
                'id' => $existingAppeal->id,
                'status' => $existingAppeal->status->value,
                'reason' => $existingAppeal->reason,
                'submitted_at' => $existingAppeal->submitted_at?->format('Y-m-d H:i:s'),
                'reviewed_at' => $existingAppeal->reviewed_at?->format('Y-m-d H:i:s'),
                'decision_notes' => $existingAppeal->decision_notes,
            ] : null,
        ]);
    }
}
