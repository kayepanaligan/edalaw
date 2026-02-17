import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'E-Burol Monitoring', href: '/monitoring-officer/eburol-monitoring' },
];

type Eburol = {
    id: number;
    visitor_name: string;
    visitor_email: string;
    inmate_name: string;
    deceased_name: string;
    wake_start_date: string;
    wake_end_date: string;
    wake_location: string;
    status: string;
    created_at: string;
    inmate_tunnel_code?: string | null;
    inmate_tunnel_status?: 'active' | 'expired' | 'used' | null;
};

type Props = {
    eburols: Eburol[];
};

function getStatusBadge(status: string) {
    const map: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
        approved: { label: 'Approved', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
        rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
        completed: { label: 'Completed', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    };
    const config = map[status] ?? { label: status, className: '' };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
}

export default function EburolMonitoring({ eburols }: Props) {
    const eburolColumns: ColumnDef<Eburol>[] = useMemo(() => [
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
        { accessorKey: 'deceased_name', header: 'Deceased' },
        {
            accessorKey: 'wake_start_date',
            header: 'Wake period',
            cell: ({ row }) => `${row.original.wake_start_date} – ${row.original.wake_end_date}`,
        },
        {
            accessorKey: 'wake_location',
            header: 'Location',
            cell: ({ row }) => (
                <span className="block max-w-[200px] truncate" title={row.original.wake_location}>
                    {row.original.wake_location}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: 'inmate_tunnel',
            header: 'Inmate tunnel',
            cell: ({ row }) => {
                const code = row.original.inmate_tunnel_code;
                const status = row.original.inmate_tunnel_status;
                if (!code) return <span className="text-muted-foreground">—</span>;
                const statusLabel = status === 'active' ? 'Active' : status === 'expired' ? 'Expired' : status === 'used' ? 'Used' : '—';
                const statusVariant = status === 'active' ? 'default' : status === 'expired' ? 'destructive' : 'secondary';
                return (
                    <div className="flex flex-col gap-1">
                        <code className="font-mono text-sm tracking-wider">{code}</code>
                        {status && (
                            <Badge variant={statusVariant} className="text-xs w-fit">
                                {statusLabel}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="E-Burol Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div>
                    <h1 className="text-2xl font-semibold">E-Burol Monitoring</h1>
                    <p className="text-muted-foreground">
                        E-burol schedules you are responsible for overseeing
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Assigned E-Burol Schedules
                        </CardTitle>
                        <CardDescription>
                            E-burol schedules you have been assigned to oversee
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={eburolColumns} data={eburols} />
                        {eburols.length === 0 && (
                            <p className="py-8 text-center text-muted-foreground">
                                No e-burol schedules assigned to you yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
