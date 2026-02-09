<?php

namespace App\Http\Controllers\Admin;

use App\AppealStatus;
use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountAppealReviewController extends Controller
{
    /**
     * Display a listing of account appeals.
     */
    public function index(): Response
    {
        $appeals = Appeal::with(['user', 'reviewer'])
            ->where('appealable_type', User::class)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($appeal) {
                $user = $appeal->appealable;

                return [
                    'id' => $appeal->id,
                    'user' => [
                        'id' => $appeal->user->id,
                        'name' => trim("{$appeal->user->first_name} {$appeal->user->middle_name} {$appeal->user->last_name}"),
                        'email' => $appeal->user->email,
                        'contact_number' => $appeal->user->contact_number,
                        'approval_status' => $appeal->user->approval_status->value,
                    ],
                    'reason' => $appeal->reason,
                    'status' => $appeal->status->value,
                    'reviewed_by' => $appeal->reviewer ? trim("{$appeal->reviewer->first_name} {$appeal->reviewer->last_name}") : null,
                    'reviewed_at' => $appeal->reviewed_at?->format('Y-m-d H:i:s'),
                    'decision_notes' => $appeal->decision_notes,
                    'submitted_at' => $appeal->submitted_at?->format('Y-m-d H:i:s'),
                    'deadline' => $appeal->deadline?->format('Y-m-d H:i:s'),
                    'is_within_deadline' => $appeal->isWithinDeadline(),
                    'documents' => $appeal->documents->map(function ($doc) {
                        return [
                            'id' => $doc->id,
                            'file_name' => $doc->file_name,
                            'file_path' => $doc->file_path,
                        ];
                    }),
                    'created_at' => $appeal->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('admin/AccountAppealReview', [
            'appeals' => $appeals,
        ]);
    }

    /**
     * Review an account appeal.
     */
    public function review(Request $request, Appeal $appeal): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected'],
            'decision_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($appeal->appealable_type !== User::class) {
            return redirect()->back()
                ->withErrors(['appeal' => 'This is not an account appeal.']);
        }

        if ($appeal->status !== AppealStatus::Pending) {
            return redirect()->back()
                ->withErrors(['appeal' => 'This appeal has already been reviewed.']);
        }

        $appeal->update([
            'status' => AppealStatus::from($request->status),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'decision_notes' => $request->decision_notes,
        ]);

        // If approved, update user's approval status
        if ($request->status === 'approved') {
            $user = $appeal->appealable;
            $user->update([
                'approval_status' => ApprovalStatus::Approved,
            ]);
        }

        // Create notification for the user
        \App\Services\NotificationService::createAppealStatusNotification($appeal);

        return redirect()->back()->with('success', 'Appeal reviewed successfully.');
    }
}
