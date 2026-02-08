<?php

namespace App\Http\Controllers\Admin;

use App\ApprovalStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * Display the user management page.
     */
    public function index(): Response
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                // Check if user has an active session
                $hasActiveSession = UserSession::where('user_id', $user->id)
                    ->where('is_current', true)
                    ->where('last_activity', '>=', now()->subHours(2))
                    ->exists();

                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'dob' => $user->dob?->format('Y-m-d'),
                    'gender' => $user->gender,
                    'street' => $user->street,
                    'brgy' => $user->brgy,
                    'municipality' => $user->municipality,
                    'province' => $user->province,
                    'postal_code' => $user->postal_code,
                    'email' => $user->email,
                    'contact_number' => $user->contact_number,
                    'role' => $user->role?->slug,
                    'role_name' => $user->role?->name,
                    'approval_status' => $user->approval_status,
                    'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i:s'),
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'is_active' => $hasActiveSession,
                ];
            });

        // Get unique roles for filter
        $roles = \App\Models\Role::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Approve a pending user.
     */
    public function approve(User $user): RedirectResponse
    {
        $user->update([
            'approval_status' => ApprovalStatus::Approved,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User approved successfully.');
    }

    /**
     * Reject a pending user.
     */
    public function reject(User $user): RedirectResponse
    {
        $user->update([
            'approval_status' => ApprovalStatus::Rejected,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User rejected successfully.');
    }

    /**
     * Update user approval status.
     */
    public function updateStatus(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'approval_status' => 'required|in:pending,approved,rejected',
        ]);

        $user->update([
            'approval_status' => $request->approval_status,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User status updated successfully.');
    }

    /**
     * Update user information.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'dob' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'street' => ['nullable', 'string', 'max:255'],
            'brgy' => ['nullable', 'string', 'max:255'],
            'municipality' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'street' => $request->street,
            'brgy' => $request->brgy,
            'municipality' => $request->municipality,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'email' => $request->email,
            'contact_number' => $request->contact_number,
            'role_id' => $request->role_id,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }
}
