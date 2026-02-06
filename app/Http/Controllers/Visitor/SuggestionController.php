<?php

namespace App\Http\Controllers\Visitor;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\SuggestionStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class SuggestionController extends Controller
{
    /**
     * Display the suggestions/complaints page.
     */
    public function index(): Response
    {
        $suggestions = Suggestion::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($suggestion) {
                return [
                    'id' => $suggestion->id,
                    'type' => $suggestion->type,
                    'subject' => $suggestion->subject,
                    'message' => $suggestion->message,
                    'status' => $suggestion->status->value,
                    'admin_response' => $suggestion->admin_response,
                    'reviewed_at' => $suggestion->reviewed_at?->format('Y-m-d H:i:s'),
                    'created_at' => $suggestion->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Visitor/Suggestions', [
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Store a new suggestion or complaint.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => ['required', 'string', 'in:suggestion,complaint'],
            'subject' => ['required', 'string', 'max:255', 'min:5'],
            'message' => ['required', 'string', 'min:20', 'max:5000'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $suggestion = Suggestion::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => SuggestionStatus::Pending,
        ]);

        // Notify super admins
        \App\Services\NotificationService::notifySuperAdminsAboutSuggestion($suggestion);

        return redirect()->back()->with('success', 'Your '.$request->type.' has been sent to the Super Admin for review. Thank you for taking the time to provide your feedback!');
    }
}
