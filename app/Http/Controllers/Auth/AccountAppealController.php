<?php

namespace App\Http\Controllers\Auth;

use App\AppealStatus;
use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\AppealDocument;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountAppealController extends Controller
{
    /**
     * Store a new account appeal.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = auth()->user();

        if ($user->approval_status !== ApprovalStatus::Rejected) {
            return redirect()->route('dashboard')
                ->withErrors(['appeal' => 'You can only appeal rejected accounts.']);
        }

        $validator = Validator::make($request->all(), [
            'reason' => ['required', 'string', 'min:10', 'max:2000'],
            'documents' => ['required', 'array', 'min:2', 'max:5'],
            'documents.*' => ['required', 'file', 'max:5120', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Check if already appealed and not rejected
        $existingAppeal = Appeal::where('user_id', $user->id)
            ->where('appealable_type', User::class)
            ->where('appealable_id', $user->id)
            ->where('status', '!=', AppealStatus::Rejected)
            ->first();

        if ($existingAppeal) {
            return redirect()->back()
                ->withErrors(['appeal' => 'You have already submitted an appeal for your account. Please wait for review.'])
                ->withInput();
        }

        // Calculate deadline (48 hours from now)
        $deadline = now()->addHours(48);

        // Create appeal
        $appeal = Appeal::create([
            'user_id' => $user->id,
            'appealable_type' => User::class,
            'appealable_id' => $user->id,
            'reason' => $request->reason,
            'status' => AppealStatus::Pending,
            'submitted_at' => now(),
            'deadline' => $deadline,
        ]);

        // Store documents
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $filePath = $file->store('appeals/documents', 'public');
                AppealDocument::create([
                    'appeal_id' => $appeal->id,
                    'file_path' => $filePath,
                    'file_name' => $file->getClientOriginalName(),
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        // Notify super admins about account appeal
        NotificationService::notifySuperAdminsAboutAccountAppeal($appeal);

        return redirect()->back()->with('success', 'Appeal submitted successfully. Your appeal has been sent to the super admin for review.');
    }
}
