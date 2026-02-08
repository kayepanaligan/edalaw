<?php

namespace App\Http\Controllers\Admin;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Eburol;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EburolManagementController extends Controller
{
    /**
     * Display the e-burol management page.
     */
    public function index(Request $request): Response
    {
        $eburols = Eburol::with('user')
            ->orderBy('wake_start_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($eburol) {
                return [
                    'id' => $eburol->id,
                    'user_id' => $eburol->user_id,
                    'visitor_name' => trim("{$eburol->user->first_name} {$eburol->user->middle_name} {$eburol->user->last_name}"),
                    'visitor_email' => $eburol->user->email,
                    'inmate_first_name' => $eburol->inmate_first_name,
                    'inmate_middle_name' => $eburol->inmate_middle_name,
                    'inmate_last_name' => $eburol->inmate_last_name,
                    'deceased_first_name' => $eburol->deceased_first_name,
                    'deceased_middle_name' => $eburol->deceased_middle_name,
                    'deceased_last_name' => $eburol->deceased_last_name,
                    'deceased_date_of_death' => $eburol->deceased_date_of_death->format('Y-m-d'),
                    'relationship_to_inmate' => $eburol->relationship_to_inmate,
                    'wake_start_date' => $eburol->wake_start_date->format('Y-m-d'),
                    'wake_end_date' => $eburol->wake_end_date->format('Y-m-d'),
                    'preferred_time' => $eburol->preferred_time,
                    'wake_location' => $eburol->wake_location,
                    'additional_details' => $eburol->additional_details,
                    'status' => $eburol->status->value,
                    'admin_notes' => $eburol->admin_notes,
                    'rejection_reason' => $eburol->rejection_reason,
                    'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/EburolManagement', [
            'eburols' => $eburols,
        ]);
    }

    /**
     * Approve an e-burol application.
     */
    public function approve(Eburol $eburol): RedirectResponse
    {
        $eburol->update([
            'status' => EburolStatus::Approved,
        ]);

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application approved successfully.');
    }

    /**
     * Reject an e-burol application.
     */
    public function reject(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'rejection_reason' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $eburol->update([
            'status' => EburolStatus::Rejected,
            'rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol application rejected successfully.');
    }

    /**
     * Update e-burol status.
     */
    public function updateStatus(Request $request, Eburol $eburol): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected,completed',
            'rejection_reason' => ['required_if:status,rejected', 'string', 'min:10', 'max:1000'],
        ]);

        $updateData = ['status' => $request->status];

        // If rejecting, require and store rejection reason
        if ($request->status === 'rejected') {
            $updateData['rejection_reason'] = $request->rejection_reason;
        } else {
            // Clear rejection reason if status changes from rejected
            $updateData['rejection_reason'] = null;
        }

        $eburol->update($updateData);

        return redirect()->route('admin.eburols.index')
            ->with('success', 'E-Burol status updated successfully.');
    }
}
