import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Link2, Lock, Play, Square, Unlock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useToast } from '@/hooks/use-toast';

import { formatVisitSchedule, formatSessionSchedule } from '@/lib/formatVisitSchedule';
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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Assigned Sessions', href: '/monitoring-officer/assigned-sessions' },
];

type Session = {
    id: number;
    visit_id: number | null;
    eburol_id: number | null;
    room_id: string;
    visitor_name: string | null;
    inmate_name: string;
    type: string;
    scheduled_start: string;
    scheduled_end: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    visit_type: string | null;
    schedule_ended: boolean;
    status: string;
    recording_status: string;
    started_at: string | null;
    ended_at: string | null;
    has_active_tunnel: boolean;
    has_tunnel: boolean;
    chat_locked: boolean;
};

type Props = {
    sessions: Session[];
    filters?: { type: string };
};

function getStatusBadge(status: string) {
    const map: Record<string, { label: string; className: string }> = {
        scheduled: { label: 'Scheduled', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
        active: { label: 'Active', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
        completed: { label: 'Completed', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
        terminated: { label: 'Terminated', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' },
        no_show: { label: 'No show', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
        unsuccessful: { label: 'Unsuccessful', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
    };
    const config = map[status] ?? { label: status, className: '' };
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
}

export default function AssignedSessions({ sessions, filters: initialFilters }: Props) {
    useToast();
    const [typeFilter, setTypeFilter] = useState(initialFilters?.type ?? 'all');
    const [generatingTunnelFor, setGeneratingTunnelFor] = useState<number | null>(null);
    const [endingFor, setEndingFor] = useState<number | null>(null);
    const [lockingFor, setLockingFor] = useState<number | null>(null);

    const getCsrfToken = () => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    const handleGenerateTunnel = async (sessionId: number) => {
        setGeneratingTunnelFor(sessionId);
        try {
            const res = await fetch(`/monitoring-officer/assigned-sessions/${sessionId}/generate-tunnel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: '{}',
                credentials: 'same-origin',
            });
            const data = await res.json();
            if (res.ok && data.join_url) {
                await navigator.clipboard.writeText(data.join_url);
                toast.success('Inmate join link copied to clipboard.');
            } else {
                toast.error(data.error || 'Failed to generate link');
            }
        } catch {
            toast.error('Failed to generate link');
        }
        setGeneratingTunnelFor(null);
    };

    const handleStartSession = (sessionId: number) => {
        router.post(`/monitoring-officer/assigned-sessions/${sessionId}/start`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Session started'),
            onError: () => toast.error('Failed to start session'),
        });
    };

    const handleEndSession = (sessionId: number) => {
        setEndingFor(sessionId);
        router.post(`/monitoring-officer/assigned-sessions/${sessionId}/end`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Session ended');
                setEndingFor(null);
            },
            onError: () => {
                toast.error('Failed to end session');
                setEndingFor(null);
            },
        });
    };

    const handleLockChat = async (sessionId: number) => {
        setLockingFor(sessionId);
        try {
            const res = await fetch(`/monitoring-officer/assigned-sessions/${sessionId}/lock-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
                credentials: 'same-origin',
            });
            if (res.ok) {
                toast.success('Chat locked');
                router.reload();
            } else {
                const d = await res.json();
                toast.error(d.error || 'Failed to lock chat');
            }
        } catch {
            toast.error('Failed to lock chat');
        }
        setLockingFor(null);
    };

    const handleUnlockChat = async (sessionId: number) => {
        setLockingFor(sessionId);
        try {
            const res = await fetch(`/monitoring-officer/assigned-sessions/${sessionId}/unlock-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
                credentials: 'same-origin',
            });
            if (res.ok) {
                toast.success('Chat unlocked');
                router.reload();
            } else {
                const d = await res.json();
                toast.error(d.error || 'Failed to unlock chat');
            }
        } catch {
            toast.error('Failed to unlock chat');
        }
        setLockingFor(null);
    };

    const columns: ColumnDef<Session>[] = useMemo(() => [
        { accessorKey: 'visitor_name', header: 'Visitor', cell: ({ row }) => <span className="font-medium">{row.original.visitor_name ?? '—'}</span> },
        { accessorKey: 'inmate_name', header: 'Inmate' },
        { accessorKey: 'type', header: 'Type', cell: ({ row }) => row.original.type === 'visit' ? 'Visit' : 'E-Burol' },
        {
            accessorKey: 'scheduled_start',
            header: 'Schedule',
            cell: ({ row }) => {
                const s = row.original;
                const { dateLabel, timeLabel } = s.scheduled_date && s.scheduled_time && s.visit_type
                    ? formatVisitSchedule(s.scheduled_date, s.scheduled_time, s.visit_type as 'virtual' | 'physical')
                    : formatSessionSchedule(s.scheduled_start, s.scheduled_end);
                return (
                    <div className="space-y-1">
                        <div className="font-medium">{dateLabel}</div>
                        <div className="text-sm text-muted-foreground">{timeLabel}</div>
                    </div>
                );
            },
        },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => getStatusBadge(row.original.status) },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const s = row.original;
                const isScheduled = s.status === 'scheduled';
                const isActive = s.status === 'active';
                const isCompleted = s.status === 'completed' || s.status === 'terminated';
                return (
                    <div className="flex items-center gap-2">
                        {!isCompleted && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleGenerateTunnel(s.id)}
                                    disabled={generatingTunnelFor === s.id || s.schedule_ended}
                                    title={s.schedule_ended ? 'Session has ended' : undefined}
                                >
                                    <Link2 className="mr-1 h-4 w-4" />
                                    {generatingTunnelFor === s.id ? '...' : 'Inmate Link'}
                                </Button>
                                {isScheduled && (
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleStartSession(s.id)}
                                        disabled={!s.has_tunnel}
                                        title={!s.has_tunnel ? 'Generate inmate link first' : undefined}
                                    >
                                        <Play className="mr-1 h-4 w-4" />
                                        Start
                                    </Button>
                                )}
                                {!isCompleted && !s.schedule_ended && (
                                    <Button size="sm" variant="outline" asChild>
                                        <a href={`/monitoring-officer/assigned-sessions/${s.id}/join`}>
                                            <Eye className="mr-1 h-4 w-4" />
                                            Join as observer
                                        </a>
                                    </Button>
                                )}
                                {isActive && (
                                    <Button size="sm" variant="destructive" onClick={() => handleEndSession(s.id)} disabled={endingFor === s.id}>
                                        <Square className="mr-1 h-4 w-4" />
                                        {endingFor === s.id ? '...' : 'End'}
                                    </Button>
                                )}
                                {isActive && (
                                    s.chat_locked
                                        ? (
                                            <Button size="sm" variant="outline" onClick={() => handleUnlockChat(s.id)} disabled={lockingFor === s.id}>
                                                <Unlock className="mr-1 h-4 w-4" />
                                                {lockingFor === s.id ? '...' : 'Unlock chat'}
                                            </Button>
                                        )
                                        : (
                                            <Button size="sm" variant="outline" onClick={() => handleLockChat(s.id)} disabled={lockingFor === s.id}>
                                                <Lock className="mr-1 h-4 w-4" />
                                                {lockingFor === s.id ? '...' : 'Lock chat'}
                                            </Button>
                                        )
                                )}
                                                            </>
                                                        )}
                                                    </div>
                );
            },
        },
    ], [generatingTunnelFor, endingFor, lockingFor]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assigned Sessions" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Assigned Sessions</h1>
                    <p className="text-muted-foreground">Manage your assigned visit and e-burol video sessions.</p>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <CardTitle>Sessions</CardTitle>
                                <CardDescription>{sessions.length} session(s) assigned to you</CardDescription>
                            </div>
                            <Select
                                value={typeFilter}
                                onValueChange={(value) => {
                                    setTypeFilter(value);
                                    router.get('/monitoring-officer/assigned-sessions', {
                                        type: value === 'all' ? undefined : value,
                                    }, { preserveScroll: true });
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Session type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All sessions</SelectItem>
                                    <SelectItem value="visit">Virtual visit</SelectItem>
                                    <SelectItem value="eburol">E-Burol</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={sessions} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
