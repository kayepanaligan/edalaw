import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Notification = {
    id: number;
    type: string;
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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/monitoring-officer/notifications' },
];

function getNotificationTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        visit_status: 'Visit',
        eburol_status: 'E-Burol',
        appeal_status: 'Appeal',
        suggestion_feedback: 'Suggestion',
        complaint_feedback: 'Complaint',
        device_warning: 'Warning',
    };
    return labels[type] ?? 'Notification';
}

function getNotificationBadge(type: string) {
    const typeColors: Record<string, string> = {
        visit_status: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        eburol_status: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        appeal_status: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        suggestion_feedback: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        complaint_feedback: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        device_warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    };
    const className = typeColors[type] ?? 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    return (
        <Badge variant="secondary" className={className}>
            {getNotificationTypeLabel(type)}
        </Badge>
    );
}

function getStatusBadge(isRead: boolean) {
    return isRead ? (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 dark:text-gray-400">Read</Badge>
    ) : (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Unread</Badge>
    );
}

export default function Notifications({ notifications, unread_count: unreadCount }: Props) {
    const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleMarkAsRead = (notificationId: number) => {
        setMarkingAsRead(notificationId);
        router.post(`/monitoring-officer/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onFinish: () => setMarkingAsRead(null),
        });
    };

    const handleMarkAllAsRead = () => {
        setMarkingAllAsRead(true);
        router.post('/monitoring-officer/notifications/read-all', {}, {
            preserveScroll: true,
            onFinish: () => setMarkingAllAsRead(false),
        });
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            const matchesType = typeFilter === 'all' || n.type === typeFilter;
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'read' && n.is_read) ||
                (statusFilter === 'unread' && !n.is_read);
            return matchesType && matchesStatus;
        });
    }, [notifications, typeFilter, statusFilter]);

    const columns: ColumnDef<Notification>[] = useMemo(
        () => [
            { accessorKey: 'type', header: 'Type', cell: ({ row }) => getNotificationBadge(row.original.type) },
            { accessorKey: 'title', header: 'Title', cell: ({ row }) => <div className="font-medium">{row.original.title}</div> },
            { accessorKey: 'message', header: 'Message', cell: ({ row }) => <div className="max-w-md text-sm text-muted-foreground">{row.original.message}</div> },
            { accessorKey: 'is_read', header: 'Status', cell: ({ row }) => getStatusBadge(row.original.is_read) },
            { accessorKey: 'created_at', header: 'Date', cell: ({ row }) => <div className="text-sm text-muted-foreground">{new Date(row.original.created_at).toLocaleString()}</div> },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const n = row.original;
                    if (n.is_read) return <span className="text-sm text-muted-foreground">-</span>;
                    return (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(n.id)} disabled={markingAsRead === n.id}>
                            {markingAsRead === n.id ? <Clock className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                    );
                },
            },
        ],
        [markingAsRead]
    );

    const headerActions = (
        <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="visit_status">Visit</SelectItem>
                    <SelectItem value="eburol_status">E-Burol</SelectItem>
                    <SelectItem value="appeal_status">Appeal</SelectItem>
                    <SelectItem value="suggestion_feedback">Suggestion</SelectItem>
                    <SelectItem value="complaint_feedback">Complaint</SelectItem>
                    <SelectItem value="device_warning">Warning</SelectItem>
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                </SelectContent>
            </Select>
            {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} disabled={markingAllAsRead} variant="outline">
                    {markingAllAsRead ? <><Clock className="mr-2 h-4 w-4 animate-spin" />Marking...</> : <><CheckCheck className="mr-2 h-4 w-4" />Mark All as Read</>}
                </Button>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Notifications</h1>
                    <p className="text-muted-foreground">Session assignments, e-burol and visit updates, and system alerts</p>
                </div>
                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-lg font-medium text-muted-foreground">No notifications yet</p>
                            <p className="text-sm text-muted-foreground mt-2">You will see updates here when sessions are assigned or updated.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Notifications</CardTitle>
                            <CardDescription>{filteredNotifications.length} of {notifications.length} notification{notifications.length !== 1 ? 's' : ''}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={filteredNotifications} enableGlobalFilter searchPlaceholder="Search notifications..." headerActions={headerActions} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
