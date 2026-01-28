<?php

namespace App\Http\Controllers\Admin;

use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users for approval.
     */
    public function index(): Response
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'dob' => $user->dob?->format('Y-m-d'),
                    'gender' => $user->gender,
                    'street' => $user->street,
                    'brgy' => $user->brgy,
                    'municipality' => $user->municipality,
                    'province' => $user->province,
                    'postal_code' => $user->postal_code,
                    'role' => $user->role->name,
                    'role_slug' => $user->role->slug,
                    'approval_status' => $user->approval_status->value,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    /**
     * Approve a user account.
     */
    public function approve(User $user): RedirectResponse
    {
        $user->update([
            'approval_status' => ApprovalStatus::Approved,
        ]);

        return redirect()->back()->with('success', 'User account approved successfully.');
    }

    /**
     * Reject a user account.
     */
    public function reject(User $user): RedirectResponse
    {
        $user->update([
            'approval_status' => ApprovalStatus::Rejected,
        ]);

        return redirect()->back()->with('success', 'User account rejected.');
    }
}
