import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, Video } from 'lucide-react';
import { useMemo } from 'react';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Visit Monitoring', href: '/monitoring-officer/visit-monitoring' },
];

type Visit = {
    id: number;
    visitor_name: string;
    visitor_email: string;
    scheduled_date: string;
    scheduled_time: string | null;
    inmate_name: string;
    status: string;
    meeting_link: string | null;
    created_at: string;
};

type Props = {
    visits: Visit[];
};

function getStatusBadge(status: string) {
    const map: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
        approved: { label: 'Approved', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
        rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
        completed: { label: 'Completed', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
        missed: { label: 'Missed', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },
        cancelled: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },
    };
    const config = map[status] ?? { label: status, className: '' };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
}

export default function VisitMonitoring({ visits }: Props) {
    const visitColumns: ColumnDef<Visit>[] = useMemo(() => [
        {
            accessorKey: 'visitor_name',
            header: 'Visitor',
            cell: ({ row }) => (
                <div className="space-y-0.5">
                    <div className="font-medium">{row.original.visitor_name}</div>
                    <div className="text-xs text-muted-foreground">{row.original.visitor_email}</div>
                </div>
            ),
        },
        { accessorKey: 'inmate_name', header: 'Inmate' },
        {
            accessorKey: 'scheduled_date',
            header: 'Scheduled',
            cell: ({ row }) => (
                <span>
                    {row.original.scheduled_date}
                    {row.original.scheduled_time ? ` at ${row.original.scheduled_time}` : ''}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: 'meeting_link',
            header: 'Meeting',
            cell: ({ row }) =>
                row.original.meeting_link ? (
                    <a
                        href={row.original.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Join
                    </a>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visit Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Visit Monitoring</h1>
                    <p className="text-muted-foreground">
                        Virtual visit schedules you are responsible for overseeing
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            Assigned Virtual Visits
                        </CardTitle>
                        <CardDescription>
                            Virtual visit schedules you have been assigned to monitor
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={visitColumns} data={visits} />
                        {visits.length === 0 && (
                            <p className="py-8 text-center text-muted-foreground">
                                No virtual visits assigned to you yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
