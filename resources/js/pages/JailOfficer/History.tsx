import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'History', href: '#' },
];

type LogRow = {
    id: number;
    visit_session_id: number;
    action: string;
    metadata: Record<string, unknown> | null;
    visitor_name: string | null;
    session_type: string;
    created_at: string;
    created_at_human: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    logs: {
        data: LogRow[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    action_options: string[];
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        action: string;
    };
};

function formatAction(action: string) {
    return action
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function History({ logs, action_options, filters: initialFilters }: Props) {
    const [searchQuery, setSearchQuery] = useState(initialFilters.search ?? '');
    const [dateFrom, setDateFrom] = useState(initialFilters.date_from ?? '');
    const [dateTo, setDateTo] = useState(initialFilters.date_to ?? '');
    const [actionFilter, setActionFilter] = useState(initialFilters.action ?? 'all');

    const columns: ColumnDef<LogRow>[] = useMemo(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date & Time',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-sm">{row.original.created_at}</div>
                        <div className="text-xs text-muted-foreground">{row.original.created_at_human}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'action',
                header: 'Action',
                cell: ({ row }) => (
                    <Badge variant="secondary">{formatAction(row.original.action)}</Badge>
                ),
            },
            {
                accessorKey: 'session_type',
                header: 'Type',
                cell: ({ row }) => (
                    <span className="text-sm capitalize">{row.original.session_type}</span>
                ),
            },
            {
                accessorKey: 'visit_session_id',
                header: 'Session ID',
                cell: ({ row }) => (
                    <span className="font-mono text-sm">{row.original.visit_session_id}</span>
                ),
            },
            {
                accessorKey: 'visitor_name',
                header: 'Visitor',
                cell: ({ row }) => (
                    <span className="text-sm">{row.original.visitor_name ?? '—'}</span>
                ),
            },
            {
                accessorKey: 'metadata',
                header: 'Details',
                cell: ({ row }) => {
                    const m = row.original.metadata;
                    if (!m || typeof m !== 'object') return '—';
                    const parts = Object.entries(m).map(([k, v]) => `${k}: ${String(v)}`);
                    return (
                        <span className="text-xs text-muted-foreground max-w-[200px] truncate block" title={parts.join(', ')}>
                            {parts.slice(0, 2).join(', ')}
                            {parts.length > 2 ? '…' : ''}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const handleFilter = () => {
        router.get('/jail-officer/history', {
            search: searchQuery || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            action: actionFilter !== 'all' ? actionFilter : undefined,
        }, { preserveScroll: true });
    };

    const prevLink = logs.links?.find((l) => l.label === '&laquo; Previous');
    const nextLink = logs.links?.find((l) => l.label === 'Next &raquo;');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">History</h1>
                        <p className="text-muted-foreground">All transactions you performed in the system</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by action or session ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="hist-date_from" className="text-xs">From Date</Label>
                                <Input
                                    id="hist-date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="hist-date_to" className="text-xs">To Date</Label>
                                <Input
                                    id="hist-date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    {action_options.map((action) => (
                                        <SelectItem key={action} value={action}>
                                            {formatAction(action)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Apply
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={logs.data}
                            searchPlaceholder="Search..."
                            enableGlobalFilter={false}
                        />
                        {logs.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {logs.current_page} of {logs.last_page} ({logs.total} total)
                                </p>
                                <div className="flex gap-2">
                                    {prevLink?.url ? (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={prevLink.url} preserveScroll>Previous</Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>Previous</Button>
                                    )}
                                    {nextLink?.url ? (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={nextLink.url} preserveScroll>Next</Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>Next</Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
