import { Head } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { formatVisitSchedule, formatSessionSchedule } from '@/lib/formatVisitSchedule';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

function formatTimeUntil(startIso: string): string {
    const now = Date.now();
    const start = new Date(startIso).getTime();
    if (start <= now) return '';
    const diffMs = start - now;
    const totalMinutes = Math.floor(diffMs / 60_000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Assigned Sessions', href: '/monitoring-officer/assigned-sessions' },
];

type Session = {
    id: number;
    visit_id: number | null;
    eburol_id: number | null;
    room_id: string;
    tunnel_short_code: string | null;
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
    const [beforeScheduleSession, setBeforeScheduleSession] = useState<Session | null>(null);

    const columns: ColumnDef<Session>[] = useMemo(() => [
        {
            accessorKey: 'tunnel_short_code',
            header: 'Tunnel code',
            cell: ({ row }) => (
                <span className="font-mono text-sm tracking-wider">{row.original.tunnel_short_code || '—'}</span>
            ),
        },
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
                const isCompleted = s.status === 'completed' || s.status === 'terminated';
                const joinDisabled = s.schedule_ended || s.status === 'no_show' || s.status === 'missed' || isCompleted;
                const joinReason = joinDisabled
                    ? (s.status === 'no_show' ? 'No show' : s.status === 'missed' ? 'Missed' : s.schedule_ended ? 'Session has ended' : 'Session ended')
                    : '';
                const handleJoinClick = () => {
                    if (joinDisabled) return;
                    const now = Date.now();
                    const start = new Date(s.scheduled_start).getTime();
                    if (start > now) {
                        setBeforeScheduleSession(s);
                        return;
                    }
                    window.location.href = `/monitoring-officer/assigned-sessions/${s.id}/join`;
                };
                return (
                    <div className="flex items-center gap-2">
                        {!isCompleted && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="inline-block">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={joinDisabled}
                                                onClick={handleJoinClick}
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                Join as observer
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {joinDisabled && <TooltipContent>{joinReason}</TooltipContent>}
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                );
            },
        },
    ], []);

    const timeUntilStr = beforeScheduleSession ? formatTimeUntil(beforeScheduleSession.scheduled_start) : '';

    const filteredSessions = useMemo(() => {
        if (typeFilter === 'all') return sessions;
        return sessions.filter((s) => s.type === typeFilter);
    }, [sessions, typeFilter]);

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
                        <div>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>{filteredSessions.length} of {sessions.length} session(s) assigned to you</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={filteredSessions}
                            searchKey="session_search"
                            searchPlaceholder="Search by visitor, inmate, type..."
                            initialSorting={[{ id: 'scheduled_start', desc: true }]}
                            headerActions={
                                <Select
                                    value={typeFilter}
                                    onValueChange={setTypeFilter}
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
                            }
                        />
                    </CardContent>
                </Card>

                <Dialog open={!!beforeScheduleSession} onOpenChange={(open) => !open && setBeforeScheduleSession(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Session not started yet</DialogTitle>
                            <DialogDescription>
                                {timeUntilStr
                                    ? `This session starts in ${timeUntilStr}. You can wait and try again when it's time, or cancel.`
                                    : 'This session has not started yet.'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setBeforeScheduleSession(null)}>
                                Wait
                            </Button>
                            <Button variant="secondary" onClick={() => setBeforeScheduleSession(null)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
