import { Head, router } from '@inertiajs/react';
import { Download, Filter, MessageCircle, Search, X } from 'lucide-react';
import { useState } from 'react';

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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Chat Logs', href: '/jail-officer/chat-logs' },
];

type ChatLog = {
    id: number;
    session_id: number;
    sender: string;
    sender_name: string;
    message: string;
    sent_at: string;
    flagged: boolean;
    flag_reason: string | null;
    visitor_name: string;
    inmate_name: string;
    session_type: string;
};

type Props = {
    chatLogs: ChatLog[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        session_id?: string;
        date_from?: string;
        date_to?: string;
        sender?: string;
        flagged?: string;
    };
};

export default function ChatLogs({ chatLogs, pagination, filters }: Props) {
    const [localFilters, setLocalFilters] = useState({
        session_id: filters.session_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        sender: filters.sender || '',
        flagged: filters.flagged || '',
    });

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (localFilters.session_id) params.session_id = localFilters.session_id;
        if (localFilters.date_from) params.date_from = localFilters.date_from;
        if (localFilters.date_to) params.date_to = localFilters.date_to;
        if (localFilters.sender) params.sender = localFilters.sender;
        if (localFilters.flagged) params.flagged = localFilters.flagged;
        
        router.get('/jail-officer/chat-logs', params, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({
            session_id: '',
            date_from: '',
            date_to: '',
            sender: '',
            flagged: '',
        });
        router.get('/jail-officer/chat-logs', {}, { preserveState: true });
    };

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (localFilters.session_id) params.append('session_id', localFilters.session_id);
        if (localFilters.date_from) params.append('date_from', localFilters.date_from);
        if (localFilters.date_to) params.append('date_to', localFilters.date_to);
        if (localFilters.sender) params.append('sender', localFilters.sender);
        if (localFilters.flagged) params.append('flagged', localFilters.flagged);
        
        window.location.href = `/jail-officer/chat-logs/export?${params.toString()}`;
    };

    const getSenderBadgeColor = (sender: string) => {
        switch (sender) {
            case 'visitor':
                return 'bg-blue-100 text-blue-800';
            case 'inmate':
                return 'bg-orange-100 text-orange-800';
            case 'monitor':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Chat Logs</h1>
                        <p className="text-muted-foreground">
                            View and export chat messages from all visit sessions
                        </p>
                    </div>
                    <Button onClick={exportCsv} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="grid gap-2">
                                <Label htmlFor="session_id">Session ID</Label>
                                <Input
                                    id="session_id"
                                    placeholder="Enter session ID"
                                    value={localFilters.session_id}
                                    onChange={(e) => setLocalFilters({ ...localFilters, session_id: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date_from">Date From</Label>
                                <Input
                                    id="date_from"
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date_to">Date To</Label>
                                <Input
                                    id="date_to"
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sender">Sender</Label>
                                <Select
                                    value={localFilters.sender || 'all'}
                                    onValueChange={(value) => setLocalFilters({ ...localFilters, sender: value === 'all' ? '' : value })}
                                >
                                    <SelectTrigger id="sender">
                                        <SelectValue placeholder="All senders" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All senders</SelectItem>
                                        <SelectItem value="visitor">Visitor</SelectItem>
                                        <SelectItem value="inmate">Inmate</SelectItem>
                                        <SelectItem value="monitor">Monitor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="flagged">Flagged</Label>
                                <Select
                                    value={localFilters.flagged || 'all'}
                                    onValueChange={(value) => setLocalFilters({ ...localFilters, flagged: value === 'all' ? '' : value })}
                                >
                                    <SelectTrigger id="flagged">
                                        <SelectValue placeholder="All messages" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All messages</SelectItem>
                                        <SelectItem value="true">Flagged only</SelectItem>
                                        <SelectItem value="false">Not flagged</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={applyFilters}>
                                <Search className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Chat Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Messages ({pagination.total})</CardTitle>
                        <CardDescription>
                            Showing {chatLogs.length} of {pagination.total} messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Session</TableHead>
                                    <TableHead>Visitor</TableHead>
                                    <TableHead>Inmate</TableHead>
                                    <TableHead>Sender</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Sent At</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chatLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                                            No chat logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    chatLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-sm">#{log.id}</TableCell>
                                            <TableCell className="font-mono text-sm">#{log.session_id}</TableCell>
                                            <TableCell>{log.visitor_name}</TableCell>
                                            <TableCell>{log.inmate_name}</TableCell>
                                            <TableCell>
                                                <Badge className={getSenderBadgeColor(log.sender)}>
                                                    {log.sender}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={log.message}>
                                                {log.message}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(log.sent_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {log.flagged ? (
                                                    <Badge variant="destructive" title={log.flag_reason || ''}>
                                                        Flagged
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Normal</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.current_page === 1}
                                        onClick={() => router.get('/jail-officer/chat-logs', { 
                                            page: pagination.current_page - 1,
                                            ...filters 
                                        }, { preserveState: true })}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.current_page === pagination.last_page}
                                        onClick={() => router.get('/jail-officer/chat-logs', { 
                                            page: pagination.current_page + 1,
                                            ...filters 
                                        }, { preserveState: true })}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
