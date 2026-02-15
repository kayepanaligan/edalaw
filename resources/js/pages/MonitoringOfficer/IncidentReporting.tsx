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
    { title: 'Incident Reporting', href: '#' },
];

type IncidentRow = {
    id: number;
    title: string;
    description: string;
    classification: string;
    status: string;
    reported_by_name: string | null;
    reported_by_email: string | null;
    created_at: string;
    created_at_human: string;
    reviewed_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    incidents: {
        data: IncidentRow[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        date_from?: string;
        date_to?: string;
        status: string;
        classification: string;
    };
};

function getStatusBadge(status: string) {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        open: 'destructive',
        under_review: 'secondary',
        resolved: 'default',
        closed: 'outline',
    };
    return (
        <Badge variant={variants[status] ?? 'secondary'}>
            {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
    );
}

function getClassificationBadge(classification: string) {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        minor: 'outline',
        major: 'secondary',
        critical: 'destructive',
    };
    return (
        <Badge variant={variants[classification] ?? 'secondary'}>
            {classification.replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
    );
}

export default function MonitoringOfficerIncidentReporting({ incidents, filters: initialFilters }: Props) {
    const [searchQuery, setSearchQuery] = useState(initialFilters.search ?? '');
    const [dateFrom, setDateFrom] = useState(initialFilters.date_from ?? '');
    const [dateTo, setDateTo] = useState(initialFilters.date_to ?? '');
    const [statusFilter, setStatusFilter] = useState(initialFilters.status ?? 'all');
    const [classificationFilter, setClassificationFilter] = useState(
        initialFilters.classification ?? 'all'
    );

    const columns: ColumnDef<IncidentRow>[] = useMemo(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-sm">{row.original.created_at.slice(0, 10)}</div>
                        <div className="text-xs text-muted-foreground">{row.original.created_at_human}</div>
                    </div>
                ),
            },
            {
                accessorKey: 'title',
                header: 'Title',
                cell: ({ row }) => (
                    <div className="max-w-[200px]">
                        <div className="font-medium truncate" title={row.original.title}>
                            {row.original.title}
                        </div>
                        {row.original.description && (
                            <div className="text-xs text-muted-foreground truncate" title={row.original.description}>
                                {row.original.description.slice(0, 60)}
                                {row.original.description.length > 60 ? '…' : ''}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'classification',
                header: 'Classification',
                cell: ({ row }) => getClassificationBadge(row.original.classification),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'reported_by_name',
                header: 'Reported By',
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium text-sm">{row.original.reported_by_name ?? '—'}</div>
                        {row.original.reported_by_email && (
                            <div className="text-xs text-muted-foreground">{row.original.reported_by_email}</div>
                        )}
                    </div>
                ),
            },
        ],
        []
    );

    const handleFilter = () => {
        router.get('/monitoring-officer/incidents', {
            search: searchQuery || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            classification: classificationFilter !== 'all' ? classificationFilter : undefined,
        }, { preserveScroll: true });
    };

    const prevLink = incidents.links?.find((l) => l.label === '&laquo; Previous');
    const nextLink = incidents.links?.find((l) => l.label === 'Next &raquo;');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incident Reporting" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Incident Reporting</h1>
                        <p className="text-muted-foreground">Incidents for sessions you are responsible for</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title, description, reporter..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="mo-ir-date_from" className="text-xs">From Date</Label>
                                <Input
                                    id="mo-ir-date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="mo-ir-date_to" className="text-xs">To Date</Label>
                                <Input
                                    id="mo-ir-date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-[150px]"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="minor">Minor</SelectItem>
                                    <SelectItem value="major">Major</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
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
                            data={incidents.data}
                            searchPlaceholder="Search incidents..."
                            enableGlobalFilter={false}
                        />
                        {incidents.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {incidents.current_page} of {incidents.last_page} ({incidents.total} total)
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
