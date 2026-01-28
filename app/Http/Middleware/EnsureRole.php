<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roleSlugs
     */
    public function handle(Request $request, Closure $next, string ...$roleSlugs): Response
    {
        if (! $request->user()) {
            abort(403);
        }

        $userRole = $request->user()->role;

        if (! $userRole || ! in_array($userRole->slug, $roleSlugs, true)) {
            abort(403);
        }

        return $next($request);
    }
}
