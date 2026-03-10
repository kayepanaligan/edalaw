import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Eye, MoreVertical } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Chat Recordings', href: '/jail-officer/chat-recordings' },
];

type ExportRow = {
    id: number;
    format: string;
    generated_at: string;
    generated_by_name: string | null;
    download_url: string;
};

type Session = {
    id: number;
    session_type: string;
    visitor_name: string | null;
    inmate_name: string;
    scheduled_start: string;
    scheduled_end: string;
    status: string;
    total_messages: number;
    flagged_count: number;
    exports: ExportRow[];
};

type Props = {
    sessions: Session[];
    filters: { type?: string; has_flagged?: boolean };
};

export default function ChatRecordings({ sessions, filters }: Props) {
    const columns: ColumnDef<Session>[] = useMemo(() => [
        { accessorKey: 'id', header: 'Session ID', cell: ({ row }) => `#${row.original.id}` },
        { accessorKey: 'visitor_name', header: 'Visitor', cell: ({ row }) => row.original.visitor_name ?? '—' },
        { accessorKey: 'inmate_name', header: 'Inmate' },
        { accessorKey: 'session_type', header: 'Type', cell: ({ row }) => row.original.session_type === 'visit' ? 'Visit' : 'E-Burol' },
        {
            accessorKey: 'scheduled_start',
            header: 'Scheduled',
            cell: ({ row }) => (
                <span className="text-sm">
                    {new Date(row.original.scheduled_start).toLocaleString()} – {new Date(row.original.scheduled_end).toLocaleTimeString()}
                </span>
            ),
        },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge> },
        { accessorKey: 'total_messages', header: 'Messages', cell: ({ row }) => row.original.total_messages },
        {
            accessorKey: 'flagged_count',
            header: 'Flagged',
            cell: ({ row }) => (
                row.original.flagged_count > 0
                    ? <Badge variant="destructive">{row.original.flagged_count}</Badge>
                    : <span className="text-muted-foreground">0</span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/jail-officer/chat-recordings/session/${row.original.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Chat
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/jail-officer/chat-recordings/session/${row.original.id}/export`}>
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Recordings" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Chat Recordings</h1>
                    <p className="text-muted-foreground">Session chat logs, flagged messages, and export files.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Sessions with chat</CardTitle>
                        <CardDescription>{sessions.length} session(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={sessions}
                            searchKey="chat_search"
                            searchPlaceholder="Search by session, visitor, inmate..."
                            initialSorting={[{ id: 'scheduled_start', desc: true }]}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
