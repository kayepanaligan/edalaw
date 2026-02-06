import { Head, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Notification = {
    id: number;
    type: 'visit_status' | 'eburol_status';
    title: string;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    related_id: number;
    related_type: string;
};

type Props = {
    notifications: Notification[];
    unread_count: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifications',
        href: '/visitor/notifications',
    },
];

function getNotificationIcon(type: string) {
    switch (type) {
        case 'visit_status':
            return '📅';
        case 'eburol_status':
            return '💐';
        default:
            return '🔔';
    }
}

function getNotificationBadge(type: string) {
    switch (type) {
        case 'visit_status':
            return (
                <Badge variant="outline" className="text-xs">
                    Visit
                </Badge>
            );
        case 'eburol_status':
            return (
                <Badge variant="outline" className="text-xs">
                    E-Burol
                </Badge>
            );
        default:
            return null;
    }
}

export default function Notifications({ notifications, unread_count }: Props) {
    const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

    const handleMarkAsRead = (notificationId: number) => {
        setMarkingAsRead(notificationId);
        router.post(`/visitor/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onFinish: () => setMarkingAsRead(null),
        });
    };

    const handleMarkAllAsRead = () => {
        setMarkingAllAsRead(true);
        router.post('/visitor/notifications/read-all', {}, {
            preserveScroll: true,
            onFinish: () => setMarkingAllAsRead(false),
        });
    };

    const unreadNotifications = notifications.filter((n) => !n.is_read);
    const readNotifications = notifications.filter((n) => n.is_read);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Notifications</h1>
                        <p className="text-muted-foreground">
                            Stay updated on your visit schedules and e-burol applications
                        </p>
                    </div>
                    {unread_count > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            disabled={markingAllAsRead}
                            variant="outline"
                        >
                            {markingAllAsRead ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Marking...
                                </>
                            ) : (
                                <>
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    Mark All as Read
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-lg font-medium text-muted-foreground">
                                No notifications yet
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                You'll be notified when your visit schedules or e-burol applications are updated.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Unread Notifications */}
                        {unreadNotifications.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">Unread</h2>
                                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                        {unreadNotifications.length}
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    {unreadNotifications.map((notification) => (
                                        <Card
                                            key={notification.id}
                                            className={`border-l-4 ${
                                                notification.type === 'visit_status'
                                                    ? 'border-l-blue-500'
                                                    : 'border-l-purple-500'
                                            } ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                        >
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">
                                                                {getNotificationIcon(notification.type)}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-semibold">
                                                                        {notification.title}
                                                                    </h3>
                                                                    {getNotificationBadge(notification.type)}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    {new Date(notification.created_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        disabled={markingAsRead === notification.id}
                                                        className="shrink-0"
                                                    >
                                                        {markingAsRead === notification.id ? (
                                                            <Clock className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Notifications */}
                        {readNotifications.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold">Read</h2>
                                    <Badge variant="secondary">
                                        {readNotifications.length}
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    {readNotifications.map((notification) => (
                                        <Card
                                            key={notification.id}
                                            className="opacity-75"
                                        >
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">
                                                                {getNotificationIcon(notification.type)}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-semibold">
                                                                        {notification.title}
                                                                    </h3>
                                                                    {getNotificationBadge(notification.type)}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    {new Date(notification.created_at).toLocaleString()}
                                                                    {notification.read_at && (
                                                                        <span className="ml-2">
                                                                            • Read {new Date(notification.read_at).toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

