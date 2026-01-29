import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Phone, PhoneIncoming, PhoneOutgoing, Clock } from 'lucide-react';

type CallLog = {
    id: number;
    phone_number: string;
    call_type: 'incoming' | 'outgoing';
    call_date: string;
    duration: number | null;
    notes: string | null;
    status: string;
    created_at: string;
};

type Props = {
    callLogs: CallLog[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Call Logs',
    },
];

export default function CallLogs({ callLogs }: Props) {
    const formatDuration = (seconds: number | null): string => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCallTypeIcon = (type: string) => {
        return type === 'incoming' ? (
            <PhoneIncoming className="size-4 text-green-600" />
        ) : (
            <PhoneOutgoing className="size-4 text-blue-600" />
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Completed
                    </Badge>
                );
            case 'missed':
                return (
                    <Badge variant="destructive">Missed</Badge>
                );
            case 'failed':
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                        Failed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">{status}</Badge>
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Call Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Call Logs</h1>
                        <p className="text-muted-foreground">View your call history and records</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Call History</CardTitle>
                        <CardDescription>All your incoming and outgoing calls</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {callLogs.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Phone className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No call logs found.</p>
                                <p className="text-sm mt-2">Your call history will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {callLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="rounded-lg border p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                {getCallTypeIcon(log.call_type)}
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{log.phone_number}</span>
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {log.call_type}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="size-3" />
                                                            {new Date(log.call_date).toLocaleString()}
                                                        </span>
                                                        {log.duration && (
                                                            <span>Duration: {formatDuration(log.duration)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(log.status)}
                                            </div>
                                        </div>
                                        {log.notes && (
                                            <div className="text-sm text-muted-foreground border-t pt-3">
                                                <strong>Notes:</strong> {log.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}




