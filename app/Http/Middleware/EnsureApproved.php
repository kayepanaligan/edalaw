<?php

namespace App\Http\Middleware;

use App\ApprovalStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        $user = $request->user();

        // Allow super admins to always access
        if ($user->role?->slug === 'super_admin') {
            return $next($request);
        }

        // Check approval status
        if ($user->approval_status === ApprovalStatus::Pending) {
            return redirect()->route('account-pending')
                ->with('message', 'Your account is pending approval. Please wait for a super admin to review your registration.');
        }

        if ($user->approval_status === ApprovalStatus::Rejected) {
            return redirect()->route('account-rejected')
                ->with('message', 'Your account has been rejected. You may submit an appeal if you believe this was an error.');
        }

        // Only approved users can proceed
        if ($user->approval_status !== ApprovalStatus::Approved) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Your account is not approved. Please contact support.']);
        }

        return $next($request);
    }
}
