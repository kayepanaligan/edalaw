import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronRight, Search, Download, Share2, Clock, Users, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

type MonitoredLog = {
    id: number;
    meeting_id: string;
    session_started_at: string;
    duration: string;
    duration_seconds: number;
    unique_participants_count: number;
    visitor_name: string;
    inmate_name: string;
    visit_type: 'virtual' | 'physical';
    status: 'completed' | 'interrupted' | 'failed';
    jail_officer_name: string | null;
};

type Stats = {
    total: number;
    completed: number;
    interrupted: number;
    failed: number;
};

type Props = {
    monitoredLogs: {
        data: MonitoredLog[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: Stats;
    filters: {
        search: string | null;
        status: string | null;
        visit_type: string | null;
    };
};

export default function VisitMonitoredManagement({ monitoredLogs, stats, filters }: Props) {
    useToast(); // Auto-display flash messages
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [visitTypeFilter, setVisitTypeFilter] = useState(filters.visit_type || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/jail-officer/visits-monitored', {
            search: searchTerm || null,
            status: statusFilter !== 'all' ? statusFilter : null,
            visit_type: visitTypeFilter !== 'all' ? visitTypeFilter : null,
        }, {
            preserveState: true,
        });
    };

    const handleRowClick = (meetingId: string) => {
        router.visit(`/jail-officer/visits-monitored/${meetingId}`);
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
            completed: { variant: 'default', label: 'Completed' },
            interrupted: { variant: 'secondary', label: 'Interrupted' },
            failed: { variant: 'destructive', label: 'Failed' },
        };

        const badge = config[status] || config.completed;
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    };

    const getVisitTypeBadge = (type: string) => {
        const config: Record<string, { variant: 'default' | 'outline'; label: string }> = {
            virtual: { variant: 'default', label: 'Virtual' },
            physical: { variant: 'outline', label: 'Physical' },
        };

        const badge = config[type] || config.virtual;
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Visit Monitored Management', href: '/jail-officer/visits-monitored' }]}>
            <Head title="Visit Monitored Management" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Visit Monitored Management</h1>
                        <p className="text-muted-foreground">
                            Comprehensive directory of all successfully conducted meeting records
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-sm font-medium">Total Meetings</CardDescription>
                            <CardTitle className="text-2xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-sm font-medium">Completed</CardDescription>
                            <CardTitle className="text-2xl text-green-600">{stats.completed}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-sm font-medium">Interrupted</CardDescription>
                            <CardTitle className="text-2xl text-yellow-600">{stats.interrupted}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-sm font-medium">Failed</CardDescription>
                            <CardTitle className="text-2xl text-red-600">{stats.failed}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[250px] space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by meeting ID, visitor, or inmate..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <div className="w-[180px] space-y-2">
                                <Label htmlFor="status-filter">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger id="status-filter">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="interrupted">Interrupted</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-[180px] space-y-2">
                                <Label htmlFor="type-filter">Visit Type</Label>
                                <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                    <SelectTrigger id="type-filter">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                        <SelectItem value="physical">Physical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button type="submit" className="w-full">
                                    <Search className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Meeting ID</TableHead>
                                    <TableHead>Session Initiated</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Unique Participants</TableHead>
                                    <TableHead>Visitor</TableHead>
                                    <TableHead>Inmate</TableHead>
                                    <TableHead>Visit Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monitoredLogs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Activity className="h-12 w-12 mb-2" />
                                                <p>No monitored visits found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    monitoredLogs.data.map((log) => (
                                        <TableRow
                                            key={log.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleRowClick(log.meeting_id)}
                                        >
                                            <TableCell>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </TableCell>
                                            <TableCell className="font-mono font-medium">
                                                {log.meeting_id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{new Date(log.session_started_at).toLocaleDateString()}</span>
                                                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                                                    <span className="text-sm">{new Date(log.session_started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {log.duration}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>{log.unique_participants_count}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {log.visitor_name}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {log.inmate_name}
                                            </TableCell>
                                            <TableCell>
                                                {getVisitTypeBadge(log.visit_type)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(log.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRowClick(log.meeting_id);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {monitoredLogs.links && monitoredLogs.links.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {monitoredLogs.data.length} of {stats.total} results
                        </div>
                        <div className="flex gap-2">
                            {monitoredLogs.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
