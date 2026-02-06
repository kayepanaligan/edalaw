<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationManagementController extends Controller
{
    /**
     * Display the notification management page.
     */
    public function index(): Response
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->where('type', 'admin_notification')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'is_read' => $notification->read_at !== null,
                    'read_at' => $notification->read_at?->format('Y-m-d H:i:s'),
                    'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                    'notifiable_id' => $notification->notifiable_id,
                    'notifiable_type' => $notification->notifiable_type,
                ];
            });

        $unreadCount = Notification::where('user_id', auth()->id())
            ->where('type', 'admin_notification')
            ->whereNull('read_at')
            ->count();

        $stats = [
            'total' => Notification::where('user_id', auth()->id())
                ->where('type', 'admin_notification')
                ->count(),
            'unread' => $unreadCount,
            'read' => Notification::where('user_id', auth()->id())
                ->where('type', 'admin_notification')
                ->whereNotNull('read_at')
                ->count(),
        ];

        return Inertia::render('Admin/NotificationManagement', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'stats' => $stats,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification): RedirectResponse
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();

        return redirect()->back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        Notification::where('user_id', auth()->id())
            ->where('type', 'admin_notification')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return redirect()->back();
    }
}
