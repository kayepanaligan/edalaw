import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, FileText, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        title: 'System History',
        href: '#',
    },
];

type AuditLog = {
    id: number;
    action: string;
    module: string;
    description: string;
    auditable_type: string;
    auditable_id: number;
    metadata: Record<string, unknown>;
    ip_address: string | null;
    user_agent: string | null;
    user_id: number | null;
    user_name: string;
    user_email: string | null;
    user_role: string | null;
    user_role_name: string | null;
    created_at: string;
    created_at_human: string;
};

type Role = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    audit_logs: AuditLog[];
    stats: {
        total: number;
        by_module: Record<string, number>;
        by_action: Record<string, number>;
        by_role: Record<string, number>;
    };
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
        date_from?: string;
        date_to?: string;
    };
};

function getActionBadge(action: string) {
    const actionColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        eburol_approved: 'default',
        eburol_rejected: 'destructive',
        eburol_status_updated: 'secondary',
        eburol_submitted: 'default',
        eburol_updated: 'secondary',
        eburol_rescheduled: 'outline',
        eburol_deleted: 'destructive',
        visit_approved: 'default',
        visit_rejected: 'destructive',
        visit_status_updated: 'secondary',
        visit_rescheduled: 'outline',
        visit_submitted: 'default',
        visit_cancelled: 'destructive',
        appeal_reviewed: 'secondary',
        appeal_submitted: 'default',
        suggestion_submitted: 'default',
    };

    const actionLabels: Record<string, string> = {
        eburol_approved: 'E-Burol Approved',
        eburol_rejected: 'E-Burol Rejected',
        eburol_status_updated: 'E-Burol Status Updated',
        eburol_submitted: 'E-Burol Submitted',
        eburol_updated: 'E-Burol Updated',
        eburol_rescheduled: 'E-Burol Rescheduled',
        eburol_deleted: 'E-Burol Deleted',
        visit_approved: 'Visit Approved',
        visit_rejected: 'Visit Rejected',
        visit_status_updated: 'Visit Status Updated',
        visit_rescheduled: 'Visit Rescheduled',
        visit_submitted: 'Visit Submitted',
        visit_cancelled: 'Visit Cancelled',
        appeal_reviewed: 'Appeal Reviewed',
        appeal_submitted: 'Appeal Submitted',
        suggestion_submitted: 'Feedback Submitted',
    };

    return (
        <Badge variant={actionColors[action] || 'secondary'}>
            {actionLabels[action] || action.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
    );
}

function getModuleBadge(module: string) {
    const moduleColors: Record<string, 'default' | 'secondary' | 'outline'> = {
        'E-Burol Management': 'default',
        'Visit Schedule Management': 'secondary',
        'Appeal Processing': 'outline',
        'Appeal Management': 'outline',
        'Feedback & Suggestions': 'outline',
        'Schedule Management': 'secondary',
    };

    return (
        <Badge variant={moduleColors[module] || 'secondary'}>
            {module}
        </Badge>
    );
}

function getRoleBadge(role: string | null) {
    if (!role) {
        return <Badge variant="secondary">N/A</Badge>;
    }

    const roleColors: Record<string, 'default' | 'secondary' | 'outline'> = {
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

export default function AuditLogs({ audit_logs, stats, roles, filters: initialFilters }: Props) {
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
    const [roleFilter, setRoleFilter] = useState<string>(initialFilters.role || 'all');
    const [dateFrom, setDateFrom] = useState<string>(initialFilters.date_from || '');
    const [dateTo, setDateTo] = useState<string>(initialFilters.date_to || '');

    const columns: ColumnDef<AuditLog>[] = useMemo(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date & Time',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.created_at}</div>
                        <div className="text-xs text-muted-foreground">{row.original.created_at_human}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'user_name',
                header: 'User',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.user_name}</div>
                        <div className="text-xs text-muted-foreground">{row.original.user_email || 'N/A'}</div>
                        {row.original.user_role_name && (
                            <div className="mt-1">{getRoleBadge(row.original.user_role)}</div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'module',
                header: 'Module',
                cell: ({ row }) => getModuleBadge(row.original.module),
            },
            {
                accessorKey: 'action',
                header: 'Action',
                cell: ({ row }) => getActionBadge(row.original.action),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => (
                    <div className="max-w-md">
                        <div className="font-medium">{row.original.description}</div>
                        {row.original.metadata && Object.keys(row.original.metadata).length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {row.original.metadata.rejection_reason && (
                                    <div>Reason: {String(row.original.metadata.rejection_reason).substring(0, 100)}</div>
                                )}
                                {row.original.metadata.old_status && row.original.metadata.new_status && (
                                    <div>
                                        Status: {String(row.original.metadata.old_status)} → {String(row.original.metadata.new_status)}
                                    </div>
                                )}
                                {row.original.metadata.inmate_name && (
                                    <div>Inmate: {String(row.original.metadata.inmate_name)}</div>
                                )}
                                {row.original.metadata.deceased_name && (
                                    <div>Deceased: {String(row.original.metadata.deceased_name)}</div>
                                )}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'auditable_type',
                header: 'Related Item',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.auditable_type}</div>
                        <div className="text-xs text-muted-foreground">ID: {row.original.auditable_id}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'ip_address',
                header: 'IP Address',
                cell: ({ row }) => <div className="text-sm">{row.original.ip_address || 'N/A'}</div>,
            },
        ],
        []
    );

    const handleFilter = () => {
        router.get(
            '/admin/audit-logs',
            {
                search: searchQuery || null,
                role: roleFilter !== 'all' ? roleFilter : null,
                date_from: dateFrom || null,
                date_to: dateTo || null,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (roleFilter !== 'all') params.append('role', roleFilter);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        window.open(`/admin/audit-logs/export?${params.toString()}`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System History" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">System History</h1>
                        <p className="text-muted-foreground">View all transaction history from all users</p>
                    </div>
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All logged transactions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Modules</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(stats.by_module).length}</div>
                            <p className="text-xs text-muted-foreground">Different modules accessed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(stats.by_action).length}</div>
                            <p className="text-xs text-muted-foreground">Different action types</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(stats.by_role).length}</div>
                            <p className="text-xs text-muted-foreground">Different user roles</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Transaction History</CardTitle>
                                <CardDescription>
                                    Complete history of all transactions from all users
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-end gap-4 mt-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, description, module, action..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleFilter();
                                        }
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="date_from" className="text-xs">
                                    From Date
                                </Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="date_to" className="text-xs">
                                    To Date
                                </Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.slug} value={role.slug}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} variant="outline">
                                Apply Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={audit_logs} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

