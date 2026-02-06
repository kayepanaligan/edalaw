import { Head, router } from '@inertiajs/react';
import { Computer, Globe, MapPin, Monitor, Smartphone, Tablet, Trash2, Users, Activity, Circle } from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Session Management',
        href: '/admin/sessions',
    },
];

type Session = {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    user_role: string;
    session_id: string;
    ip_address: string | null;
    device_type: string | null;
    device_name: string | null;
    browser: string | null;
    platform: string | null;
    location: string | null;
    is_current: boolean;
    last_activity: string | null;
    created_at: string;
    is_active: boolean;
};

type Props = {
    sessions: Session[];
    stats: {
        total: number;
        active: number;
        current: number;
        by_device: {
            mobile: number;
            tablet: number;
            desktop: number;
        };
    };
};

function getDeviceIcon(deviceType: string | null) {
    switch (deviceType) {
        case 'mobile':
            return <Smartphone className="h-4 w-4" />;
        case 'tablet':
            return <Tablet className="h-4 w-4" />;
        case 'desktop':
            return <Monitor className="h-4 w-4" />;
        default:
            return <Computer className="h-4 w-4" />;
    }
}

function getDeviceTypeBadge(deviceType: string | null) {
    const colors: Record<string, string> = {
        mobile: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        tablet: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        desktop: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    };

    return (
        <Badge variant="outline" className={colors[deviceType || ''] || ''}>
            {deviceType ? deviceType.charAt(0).toUpperCase() + deviceType.slice(1) : 'Unknown'}
        </Badge>
    );
}

function getRoleBadge(role: string) {
    const roleColors: Record<string, string> = {
        'Super Admin': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        'BJMP Officer': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        'Visitor': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        'Monitoring Officer': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    };

    const className = roleColors[role] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';

    return (
        <Badge variant="outline" className={className}>
            {role}
        </Badge>
    );
}

export default function SessionManagement({ sessions, stats }: Props) {
    const [revokingSession, setRevokingSession] = useState<number | null>(null);
    const [deviceFilter, setDeviceFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleRevoke = (sessionId: number) => {
        setRevokingSession(sessionId);
        router.delete(`/admin/sessions/${sessionId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Session revoked successfully');
            },
            onError: () => {
                toast.error('Failed to revoke session');
            },
            onFinish: () => setRevokingSession(null),
        });
    };

    const handleRevokeUserSessions = (userId: number) => {
        router.post(`/admin/sessions/user/${userId}/revoke-all`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('All sessions for this user have been revoked');
            },
            onError: () => {
                toast.error('Failed to revoke user sessions');
            },
        });
    };

    const filteredSessions = useMemo(() => {
        return sessions.filter((session) => {
            const matchesDevice = deviceFilter === 'all' || session.device_type === deviceFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && session.is_active) ||
                (statusFilter === 'current' && session.is_current) ||
                (statusFilter === 'inactive' && !session.is_active && !session.is_current);
            return matchesDevice && matchesStatus;
        });
    }, [sessions, deviceFilter, statusFilter]);

    const columns: ColumnDef<Session>[] = useMemo(
        () => [
            {
                accessorKey: 'user_name',
                header: 'User',
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <div>
                            <div className="font-medium">{session.user_name}</div>
                            <div className="text-sm text-muted-foreground">{session.user_email}</div>
                            {getRoleBadge(session.user_role)}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'device_type',
                header: 'Device',
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            {getDeviceIcon(session.device_type)}
                            <div>
                                <div>{getDeviceTypeBadge(session.device_type)}</div>
                                {session.device_name && (
                                    <div className="text-xs text-muted-foreground">{session.device_name}</div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'browser',
                header: 'Browser / Platform',
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <div className="text-sm">
                            {session.browser && <div>{session.browser}</div>}
                            {session.platform && (
                                <div className="text-muted-foreground">{session.platform}</div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'location',
                header: 'Location',
                cell: ({ row }) => {
                    const location = row.original.location;
                    return location ? (
                        <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {location}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Unknown</span>
                    );
                },
            },
            {
                accessorKey: 'ip_address',
                header: 'IP Address',
                cell: ({ row }) => {
                    const ip = row.original.ip_address;
                    return ip ? (
                        <div className="flex items-center gap-1 text-sm font-mono">
                            <Globe className="h-3 w-3" />
                            {ip}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">N/A</span>
                    );
                },
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: ({ row }) => {
                    const session = row.original;
                    if (session.is_current) {
                        return (
                            <Badge variant="default" className="bg-primary">
                                Current
                            </Badge>
                        );
                    }
                    if (session.is_active) {
                        return (
                            <div className="flex items-center gap-2">
                                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                                <span className="text-sm">Active</span>
                            </div>
                        );
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
                            <span className="text-sm text-muted-foreground">Inactive</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'last_activity',
                header: 'Last Activity',
                cell: ({ row }) => {
                    const lastActivity = row.original.last_activity;
                    return lastActivity ? (
                        <div className="text-sm">
                            {new Date(lastActivity).toLocaleString()}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Never</span>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const session = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleRevoke(session.id)}
                                    disabled={session.is_current || revokingSession === session.id}
                                >
                                    {revokingSession === session.id ? 'Revoking...' : 'Revoke Session'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleRevokeUserSessions(session.user_id)}
                                >
                                    Revoke All User Sessions
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [revokingSession],
    );

    const headerActions = (
        <div className="flex items-center gap-2">
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by device" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Session Management" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Session Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage all user sessions across the system
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Sessions</CardTitle>
                            <Circle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.current}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
                            <Smartphone className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.by_device.mobile}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
                            <Monitor className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.by_device.desktop}</div>
                        </CardContent>
                    </Card>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredSessions}
                    searchKey="user_email"
                    searchPlaceholder="Search by user email or name..."
                    headerActions={headerActions}
                />
            </div>
        </AppLayout>
    );
}

