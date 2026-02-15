import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    Heart,
    MessageSquare,
    Moon,
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    Scale,
    Sun,
    Video,
} from 'lucide-react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { useNotifications } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Visitor',
        href: '/dashboard/visitor',
    },
];

type RecentSchedule = {
    id: number;
    scheduled_date: string;
    scheduled_time: string | null;
    visit_type: 'virtual' | 'physical';
    inmate_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'missed' | 'completed';
    meeting_link: string | null;
    created_at: string;
};

type RecentCallLog = {
    id: number;
    phone_number: string;
    call_type: 'incoming' | 'outgoing';
    call_date: string;
    duration: number | null;
    status: string;
};

type Props = {
    stats: {
        total_schedules: number;
        pending_schedules: number;
        approved_schedules: number;
        rejected_schedules: number;
        completed_schedules: number;
        missed_schedules: number;
    };
    visit_types: {
        physical: number;
        virtual: number;
    };
    recent_schedules: RecentSchedule[];
    call_logs_stats: {
        total_calls: number;
        incoming_calls: number;
        outgoing_calls: number;
        completed_calls: number;
        missed_calls: number;
    };
    recent_call_logs: RecentCallLog[];
    eburol_stats: {
        total_eburols: number;
        pending_eburols: number;
        approved_eburols: number;
        rejected_eburols: number;
        completed_eburols: number;
    };
    recent_eburols: Array<{
        id: number;
        deceased_name: string;
        inmate_name: string;
        relationship: string;
        wake_start_date: string;
        wake_end_date: string;
        status: 'pending' | 'approved' | 'rejected' | 'completed';
        created_at: string;
    }>;
    appeals_stats: {
        total_appeals: number;
        pending_appeals: number;
        approved_appeals: number;
        rejected_appeals: number;
    };
    feedback_stats: {
        total_feedback: number;
        pending_feedback: number;
        reviewed_feedback: number;
        resolved_feedback: number;
        in_progress_feedback: number;
        dismissed_feedback: number;
    };
    feedback_types: {
        complaints: number;
        suggestions: number;
    };
};

function getStatusBadge(status: string) {
    switch (status) {
        case 'approved':
            return (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Approved
                </Badge>
            );
        case 'rejected':
            return (
                <Badge variant="destructive">Rejected</Badge>
            );
        case 'missed':
            return (
                <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                    Missed
                </Badge>
            );
        case 'completed':
            return (
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                    Completed
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                    Pending
                </Badge>
            );
    }
}

function getVisitTypeBadge(type: string) {
    return type === 'virtual' ? (
        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
            Virtual
        </Badge>
    ) : (
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
            Physical
        </Badge>
    );
}

export default function VisitorDashboard({
    stats,
    visit_types,
    recent_schedules,
    call_logs_stats,
    recent_call_logs,
    eburol_stats,
    recent_eburols,
    appeals_stats,
    feedback_stats,
    feedback_types,
}: Props) {
    const page = usePage();
    const unreadNotificationCount = (page.props as { unreadNotificationCount?: number }).unreadNotificationCount || 0;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    useToast();
    useNotifications();
    
    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };
    
    // Pie chart data for visit types
    const visitTypeChartData = [
        { name: 'Physical', value: visit_types.physical },
        { name: 'Virtual', value: visit_types.virtual },
    ];

    // Pie chart data for feedback types
    const feedbackTypeChartData = [
        { name: 'Complaints', value: feedback_types.complaints },
        { name: 'Suggestions', value: feedback_types.suggestions },
    ];

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visitor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Visitor Dashboard</h1>
                        <p className="text-muted-foreground">
                            Overview of your visit schedules and statistics
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="inline-flex items-center justify-center rounded-lg border border-input bg-background p-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="Toggle theme"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-5" />
                            ) : (
                                <Moon className="size-5" />
                            )}
                        </button>
                        <Link
                            href="/visitor/notifications"
                            className="relative inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <Bell className="mr-2 size-4" />
                            Notifications
                            {unreadNotificationCount > 0 && (
                                <Badge variant="default" className="ml-2 bg-blue-500 hover:bg-blue-600">
                                    {unreadNotificationCount}
                                </Badge>
                            )}
                        </Link>
                        <Link
                            href="/visitor/schedule"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        >
                            <Calendar className="mr-2 size-4" />
                            Apply for Visit
                        </Link>
                        <Link
                            href="/visitor/eburol"
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        >
                            <Heart className="mr-2 size-4" />
                            Apply for E-Burol
                        </Link>
                        <Link
                            href="/visitor/suggestions"
                            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <MessageSquare className="mr-2 size-4" />
                            Feedback
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* First Card: Schedules */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Schedules Applied For
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_schedules}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {stats.pending_schedules} • Approved: {stats.approved_schedules} • Rejected: {stats.rejected_schedules} • Completed: {stats.completed_schedules} • Missed: {stats.missed_schedules}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Second Card: E-Burol */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                E-Burol Applications
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{eburol_stats.total_eburols}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {eburol_stats.pending_eburols} • Approved: {eburol_stats.approved_eburols} • Rejected: {eburol_stats.rejected_eburols} • Completed: {eburol_stats.completed_eburols}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Third Card: Appeals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Appeals
                            </CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{appeals_stats.total_appeals}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {appeals_stats.pending_appeals} • Approved: {appeals_stats.approved_appeals} • Rejected: {appeals_stats.rejected_appeals}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Fourth Card: Feedback */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Feedback Submitted
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{feedback_stats.total_feedback}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {feedback_stats.pending_feedback} • Reviewed: {feedback_stats.reviewed_feedback} • Resolved: {feedback_stats.resolved_feedback} • In Progress: {feedback_stats.in_progress_feedback} • Dismissed: {feedback_stats.dismissed_feedback}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pie Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Visit Type Distribution Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visit Type Distribution</CardTitle>
                            <CardDescription>
                                Distribution of physical and virtual visits applied for
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={visitTypeChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {visitTypeChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Feedback Type Distribution Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback Type Distribution</CardTitle>
                            <CardDescription>
                                Distribution of complaints and suggestions submitted
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={feedbackTypeChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {feedbackTypeChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Schedules */}
                <div className="grid gap-4 md:grid-cols-1">

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Schedules</CardTitle>
                                    <CardDescription>
                                        Your latest visit schedule requests
                                    </CardDescription>
                                </div>
                                <Link
                                    href="/visitor/schedule"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Visit Management →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recent_schedules.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No schedules yet.</p>
                                    <Link
                                        href="/visitor/schedule"
                                        className="text-primary hover:underline mt-2 inline-block"
                                    >
                                        Apply for a schedule
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recent_schedules.map((schedule) => {
                                        // Check if scheduled time has arrived
                                        const isTimeForVisit = (() => {
                                            if (!schedule.scheduled_date || schedule.status !== 'approved') {
                                                return false;
                                            }
                                            const scheduledDate = new Date(schedule.scheduled_date);
                                            const now = new Date();
                                            
                                            // If scheduled date is today or in the past
                                            if (scheduledDate.toDateString() === now.toDateString() || scheduledDate < now) {
                                                // If there's a scheduled time, check if it has passed
                                                if (schedule.scheduled_time) {
                                                    const [hours, minutes] = schedule.scheduled_time.split(':').map(Number);
                                                    const scheduledDateTime = new Date(scheduledDate);
                                                    scheduledDateTime.setHours(hours, minutes, 0, 0);
                                                    return now >= scheduledDateTime;
                                                }
                                                // If no time specified, allow access on the scheduled date
                                                return scheduledDate.toDateString() === now.toDateString();
                                            }
                                            return false;
                                        })();

                                        const canJoinVideoCall = schedule.visit_type === 'virtual' 
                                            && schedule.status === 'approved' 
                                            && schedule.meeting_link 
                                            && isTimeForVisit;

                                        return (
                                            <div
                                                key={schedule.id}
                                                className="rounded-lg border p-4 space-y-2"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">
                                                                {new Date(
                                                                    schedule.scheduled_date
                                                                ).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}
                                                            </span>
                                                            {schedule.scheduled_time && (
                                                                <span className="text-sm text-muted-foreground">
                                                                    at {schedule.scheduled_time}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Inmate: {schedule.inmate_name}
                                                        </div>
                                                        {schedule.visit_type === 'virtual' 
                                                            && schedule.status === 'approved' 
                                                            && schedule.meeting_link && (
                                                            <div className="text-sm">
                                                                {canJoinVideoCall ? (
                                                                    <a
                                                                        href={schedule.meeting_link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 text-primary hover:underline"
                                                                    >
                                                                        <Video className="h-4 w-4" />
                                                                        <span>Join Virtual Visit</span>
                                                                    </a>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                                        <Video className="h-4 w-4" />
                                                                        <span>
                                                                            {isTimeForVisit 
                                                                                ? 'Meeting link available' 
                                                                                : 'Meeting link will be available at scheduled time'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {getStatusBadge(schedule.status)}
                                                        {getVisitTypeBadge(schedule.visit_type)}
                                                        {canJoinVideoCall && (
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                asChild
                                                                className="bg-green-500 hover:bg-green-600"
                                                            >
                                                                <a
                                                                    href={schedule.meeting_link!}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2"
                                                                >
                                                                    <Video className="h-4 w-4" />
                                                                    Join Call
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Call Logs Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Call Logs Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="size-5" />
                                Call Logs Statistics
                            </CardTitle>
                            <CardDescription>
                                Overview of your call history
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Calls</p>
                                    <p className="text-2xl font-bold">{call_logs_stats.total_calls}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Incoming</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {call_logs_stats.incoming_calls}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Outgoing</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {call_logs_stats.outgoing_calls}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-green-500">
                                        {call_logs_stats.completed_calls}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link
                                    href="/visitor/call-logs"
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    View All Call Logs
                                    <Phone className="size-4" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Call Logs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Call Logs</CardTitle>
                            <CardDescription>
                                Your latest call history
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_call_logs.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Phone className="size-12 mx-auto mb-4 opacity-50" />
                                    <p>No call logs yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recent_call_logs.map((log) => (
                                        <div
                                            key={log.id}
                                            className="rounded-lg border p-3 space-y-2"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-2 flex-1">
                                                    {log.call_type === 'incoming' ? (
                                                        <PhoneIncoming className="size-4 text-green-600 mt-1" />
                                                    ) : (
                                                        <PhoneOutgoing className="size-4 text-blue-600 mt-1" />
                                                    )}
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm">
                                                                {log.phone_number}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs capitalize">
                                                                {log.call_type}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>
                                                                {new Date(log.call_date).toLocaleString()}
                                                            </span>
                                                            {log.duration && (
                                                                <span>
                                                                    {Math.floor(log.duration / 60)}:
                                                                    {(log.duration % 60).toString().padStart(2, '0')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {log.status === 'completed' ? (
                                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                                                            Completed
                                                        </Badge>
                                                    ) : log.status === 'missed' ? (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Missed
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {log.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* E-Burol Statistics */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="size-5" />
                                E-Burol Statistics
                            </CardTitle>
                            <CardDescription>
                                Overview of your e-burol requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Requests</p>
                                    <p className="text-2xl font-bold">{eburol_stats.total_eburols}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {eburol_stats.pending_eburols}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {eburol_stats.approved_eburols}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Rejected</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {eburol_stats.rejected_eburols}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link
                                    href="/visitor/eburol"
                                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                    View All E-Burol Requests
                                    <Heart className="size-4" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent E-Burol Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent E-Burol Requests</CardTitle>
                            <CardDescription>
                                Your latest e-burol applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recent_eburols.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Heart className="size-12 mx-auto mb-4 opacity-50" />
                                    <p>No e-burol requests yet.</p>
                                    <Link
                                        href="/visitor/eburol"
                                        className="text-primary hover:underline mt-2 inline-block"
                                    >
                                        Apply for E-Burol
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recent_eburols.map((eburol) => (
                                        <div
                                            key={eburol.id}
                                            className="rounded-lg border p-3 space-y-2"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">
                                                            {eburol.deceased_name}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {eburol.relationship}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        For: {eburol.inmate_name}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>
                                                            {new Date(eburol.wake_start_date).toLocaleDateString()} - {new Date(eburol.wake_end_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {getStatusBadge(eburol.status)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
