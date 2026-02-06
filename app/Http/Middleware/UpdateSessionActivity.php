<?php

namespace App\Http\Middleware;

use App\Models\UserSession;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class UpdateSessionActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $sessionId = Session::getId();

            // Update last activity for current session
            UserSession::where('user_id', $request->user()->id)
                ->where('session_id', $sessionId)
                ->update(['last_activity' => now()]);
        }

        return $next($request);
    }
}
