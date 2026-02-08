import { Head, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Clock, User, Calendar, Heart, Scale, MessageSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifications',
        href: '/admin/notifications',
    },
];

type Notification = {
    id: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    notifiable_id: number;
    notifiable_type: string;
};

type Props = {
    notifications: Notification[];
    unread_count: number;
    stats: {
        total: number;
        unread: number;
        read: number;
    };
};

function getNotificationIcon(notifiableType: string) {
    if (notifiableType?.includes('Appeal')) {
        return <Scale className="h-4 w-4" />;
    }
    if (notifiableType?.includes('Suggestion')) {
        return <MessageSquare className="h-4 w-4" />;
    }
    if (notifiableType?.includes('User')) {
        return <User className="h-4 w-4" />;
    }
    if (notifiableType?.includes('Visit')) {
        return <Calendar className="h-4 w-4" />;
    }
    if (notifiableType?.includes('Eburol')) {
        return <Heart className="h-4 w-4" />;
    }
    return <Bell className="h-4 w-4" />;
}

function getNotificationBadge(notifiableType: string) {
    if (notifiableType?.includes('Appeal')) {
        return (
            <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Appeal
            </Badge>
        );
    }
    if (notifiableType?.includes('Suggestion')) {
        return (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Feedback
            </Badge>
        );
    }
    if (notifiableType?.includes('User')) {
        return (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">
                User
            </Badge>
        );
    }
    if (notifiableType?.includes('Visit')) {
        return (
            <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400">
                Visit
            </Badge>
        );
    }
    if (notifiableType?.includes('Eburol')) {
        return (
            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 dark:text-red-400">
                E-Burol
            </Badge>
        );
    }
    return null;
}

export default function NotificationManagement({ notifications, unread_count, stats }: Props) {
    const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
    const [readFilter, setReadFilter] = useState<string>('all');

    const handleMarkAsRead = (notificationId: number) => {
        setMarkingAsRead(notificationId);
        router.post(`/admin/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Notification marked as read');
            },
            onFinish: () => setMarkingAsRead(null),
        });
    };

    const handleMarkAllAsRead = () => {
        setMarkingAllAsRead(true);
        router.post('/admin/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('All notifications marked as read');
            },
            onFinish: () => setMarkingAllAsRead(false),
        });
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            if (readFilter === 'all') {
                return true;
            }
            if (readFilter === 'unread') {
                return !notification.is_read;
            }
            return notification.is_read;
        });
    }, [notifications, readFilter]);

    const columns: ColumnDef<Notification>[] = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Notification',
                cell: ({ row }) => {
                    const notification = row.original;
                    return (
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`}>
                                {getNotificationIcon(notification.notifiable_type)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-medium ${notification.is_read ? 'text-muted-foreground' : ''}`}>
                                        {notification.title}
                                    </p>
                                    {getNotificationBadge(notification.notifiable_type)}
                                    {!notification.is_read && (
                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                </div>
                                <p className={`text-sm ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'is_read',
                header: 'Status',
                cell: ({ row }) => {
                    const isRead = row.original.is_read;
                    return (
                        <Badge variant={isRead ? 'outline' : 'default'} className={isRead ? '' : 'bg-primary'}>
                            {isRead ? 'Read' : 'Unread'}
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const notification = row.original;
                    return (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={notification.is_read || markingAsRead === notification.id}
                        >
                            {markingAsRead === notification.id ? (
                                <Clock className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                        </Button>
                    );
                },
            },
        ],
        [markingAsRead],
    );

    const headerActions = (
        <div className="flex items-center gap-2">
            <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                </SelectContent>
            </Select>

            {unread_count > 0 && (
                <Button
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllAsRead}
                >
                    {markingAllAsRead ? (
                        <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Marking...
                        </>
                    ) : (
                        <>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark All Read
                        </>
                    )}
                </Button>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notification Management" />
            <div className="space-y-6  p-6"> 
                <div>
                    <h1 className="text-2xl font-semibold">Notification Management</h1>
                    <p className="text-muted-foreground">
                        Monitor all system notifications and activities
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                            <Bell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unread</CardTitle>
                            <Bell className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unread}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Read</CardTitle>
                            <Check className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.read}</div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredNotifications}
                    searchKey="message"
                    searchPlaceholder="Search notifications..."
                    headerActions={headerActions}
                />
            </div>
        </AppLayout>
    );
}

