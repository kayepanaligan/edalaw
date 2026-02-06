<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->load('role');
        }

        $unreadNotificationCount = 0;
        $unreadAdminNotificationCount = 0;
        if ($user) {
            $unreadNotificationCount = Notification::where('user_id', $user->id)
                ->whereNull('read_at')
                ->count();

            // Get admin notification count for super admins
            if ($user->role?->slug === 'super_admin') {
                $unreadAdminNotificationCount = Notification::where('user_id', $user->id)
                    ->where('type', 'admin_notification')
                    ->whereNull('read_at')
                    ->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'role' => $user->role?->slug,
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'unreadNotificationCount' => $unreadNotificationCount,
            'unreadAdminNotificationCount' => $unreadAdminNotificationCount,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
