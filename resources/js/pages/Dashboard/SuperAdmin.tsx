import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, UserX, Users, MessageSquare, AlertCircle, FileText, Scale } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Super Admin',
        href: '#',
    },
];

type User = {
    id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    role: string | null;
    role_name: string | null;
    approval_status: string;
    created_at: string;
};

type Props = {
    stats: {
        total_users: number;
        pending_users: number;
        approved_users: number;
        rejected_users: number;
    };
    recent_users: User[];
    users_by_role: Record<string, number>;
    appeals_stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        by_type: {
            visit: number;
            eburol: number;
        };
    };
    suggestions_stats: {
        total: number;
        pending: number;
        suggestions: number;
        complaints: number;
        resolved: number;
        reviewed: number;
        in_progress: number;
        dismissed: number;
    };
};

function getFullName(user: User): string {
    const parts = [user.first_name, user.middle_name, user.last_name].filter(
        Boolean
    );

    return parts.join(' ') || 'N/A';
}

function getStatusBadge(status: string) {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
        approved: 'default',
        pending: 'secondary',
        rejected: 'destructive',
    };

    return (
        <Badge variant={variants[status.toLowerCase()] || 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}

function getRoleBadge(role: string | null) {
    if (!role) {
        return <Badge variant="secondary">No Role</Badge>;
    }

    const roleColors: Record<string, 'default' | 'secondary'> = {
        super_admin: 'default',
        bjmp_officer: 'default',
        monitoring_officer: 'default',
        visitor: 'secondary',
    };

    return (
        <Badge variant={roleColors[role] || 'secondary'}>
            {role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
    );
}

export default function SuperAdminDashboard({
    stats,
    recent_users,
    appeals_stats,
    suggestions_stats,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage all aspects of the system</p>
                    </div>
                </div>

                {/* User Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                All registered users
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{stats.pending_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{stats.approved_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Active users
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rejected
                            </CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{stats.rejected_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Rejected accounts
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Appeals Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Appeals
                            </CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{appeals_stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                All appeal requests
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Appeals
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{appeals_stats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved Appeals
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{appeals_stats.approved}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully approved
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rejected Appeals
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{appeals_stats.rejected}</div>
                            <p className="text-xs text-muted-foreground">
                                Rejected appeals
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Appeals Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appeals by Type</CardTitle>
                        <CardDescription>Breakdown of appeals by request type</CardDescription>
                    </CardHeader>
                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Visit Appeals</p>
                                        <p className="text-2xl font-bold">{appeals_stats.by_type.visit}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">E-Burol Appeals</p>
                                        <p className="text-2xl font-bold">{appeals_stats.by_type.eburol}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Suggestions/Complaints Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Feedback
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{suggestions_stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                All feedback submissions
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Feedback
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{suggestions_stats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Suggestions
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{suggestions_stats.suggestions}</div>
                            <p className="text-xs text-muted-foreground">
                                User suggestions
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Complaints
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="text-2xl font-bold">{suggestions_stats.complaints}</div>
                            <p className="text-xs text-muted-foreground">
                                User complaints
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Suggestions/Complaints Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Feedback Status Breakdown</CardTitle>
                        <CardDescription>Current status of all feedback submissions</CardDescription>
                    </CardHeader>
                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                                        <p className="text-2xl font-bold">{suggestions_stats.resolved}</p>
                                    </div>
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                                        <p className="text-2xl font-bold">{suggestions_stats.reviewed}</p>
                                    </div>
                                    <MessageSquare className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                        <p className="text-2xl font-bold">{suggestions_stats.in_progress}</p>
                                    </div>
                                    <Clock className="h-6 w-6 text-orange-500" />
                                </div>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Dismissed</p>
                                        <p className="text-2xl font-bold">{suggestions_stats.dismissed}</p>
                                    </div>
                                    <AlertCircle className="h-6 w-6 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg">System Overview</CardTitle>
                            <CardDescription>View system statistics and metrics</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <Link href="/admin/users" className="block">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="size-5" />
                                    <CardTitle className="text-lg">User Management</CardTitle>
                                </div>
                                <CardDescription>View and manage all user accounts</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg">Settings</CardTitle>
                            <CardDescription>Configure system settings</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Recent Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Users</CardTitle>
                                <CardDescription>
                                    Latest registered users in the system
                                </CardDescription>
                            </div>
                            <Link href="/admin/users">
                                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                                    View All
                                </Badge>
                            </Link>
                        </div>
                    </CardHeader>
                    <div className="px-6 pb-6">
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_users.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {getFullName(user)}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {getRoleBadge(user.role)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(user.approval_status)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

