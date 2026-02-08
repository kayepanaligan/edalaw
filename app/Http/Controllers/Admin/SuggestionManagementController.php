<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Services\NotificationService;
use App\SuggestionStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class SuggestionManagementController extends Controller
{
    /**
     * Display the suggestions management page.
     */
    public function index(): Response
    {
        $suggestions = Suggestion::with(['user', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($suggestion) {
                return [
                    'id' => $suggestion->id,
                    'user_name' => trim("{$suggestion->user->first_name} {$suggestion->user->middle_name} {$suggestion->user->last_name}"),
                    'user_email' => $suggestion->user->email,
                    'type' => $suggestion->type,
                    'subject' => $suggestion->subject,
                    'message' => $suggestion->message,
                    'status' => $suggestion->status->value,
                    'admin_response' => $suggestion->admin_response,
                    'reviewed_by' => $suggestion->reviewer ? trim("{$suggestion->reviewer->first_name} {$suggestion->reviewer->last_name}") : null,
                    'reviewed_at' => $suggestion->reviewed_at?->format('Y-m-d H:i:s'),
                    'created_at' => $suggestion->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $stats = [
            'total' => Suggestion::count(),
            'pending' => Suggestion::where('status', SuggestionStatus::Pending)->count(),
            'suggestions' => Suggestion::where('type', 'suggestion')->count(),
            'complaints' => Suggestion::where('type', 'complaint')->count(),
            'resolved' => Suggestion::where('status', SuggestionStatus::Resolved)->count(),
        ];

        return Inertia::render('Admin/SuggestionManagement', [
            'suggestions' => $suggestions,
            'stats' => $stats,
        ]);
    }

    /**
     * Update suggestion status and add admin response.
     */
    public function update(Request $request, Suggestion $suggestion): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'string', 'in:pending,reviewed,in_progress,resolved,dismissed'],
            'admin_response' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $oldStatus = $suggestion->status->value;

        $suggestion->update([
            'status' => SuggestionStatus::from($request->status),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'admin_response' => $request->admin_response,
        ]);

        // Refresh the model to get updated admin_response
        $suggestion->refresh();

        // Notify the visitor if status changed
        if ($oldStatus !== $request->status) {
            NotificationService::createSuggestionStatusNotification($suggestion, $request->status);
        }

        return redirect()->back()->with('success', 'Suggestion updated successfully.');
    }
}
