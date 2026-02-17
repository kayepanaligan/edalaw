<?php

namespace App\Http\Controllers\MonitoringOfficer;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'is_read' => $n->read_at !== null,
                'read_at' => $n->read_at?->format('Y-m-d H:i:s'),
                'created_at' => $n->created_at->format('Y-m-d H:i:s'),
                'related_id' => $n->notifiable_id,
                'related_type' => $n->notifiable_type,
            ]);

        $unreadCount = Notification::where('user_id', auth()->id())->whereNull('read_at')->count();

        return Inertia::render('MonitoringOfficer/Notifications', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Notification $notification): RedirectResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }
        $notification->markAsRead();

        return redirect()->back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        Notification::where('user_id', auth()->id())->whereNull('read_at')->update(['read_at' => now()]);

        return redirect()->back();
    }
}
