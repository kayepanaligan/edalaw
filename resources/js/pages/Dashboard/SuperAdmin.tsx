import { Head, Link, router } from '@inertiajs/react';
import { Users, MessageSquare, Scale, Heart, HelpCircle, LineChart as LineChartIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
        title: 'Super Admin',
        href: '#',
    },
];

type User = {
    id: number;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string;
    role: string | null;
    role_name: string | null;
    approval_status: string;
    created_at: string;
};

type Props = {
    stats: {
        total_users: number;
        pending_users: number;
        approved_users: number;
        rejected_users: number;
    };
    recent_users: User[];
    users_by_role: Record<string, number>;
    appeals_stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        by_type: {
            visit: number;
            eburol: number;
        };
    };
    suggestions_stats: {
        total: number;
        pending: number;
        suggestions: number;
        complaints: number;
        resolved: number;
        reviewed: number;
        in_progress: number;
        dismissed: number;
    };
    eburol_stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        completed: number;
    };
    gender_distribution: Record<string, number>;
    visit_type_distribution: {
        physical: number;
        virtual: number;
    };
    appeals_by_type: {
        visit: number;
        eburol: number;
    };
    feedback_by_type: {
        suggestions: number;
        complaints: number;
    };
    provinces: string[];
    municipalities: string[];
    barangays: string[];
    location_distribution: Array<{ name: string; count: number }>;
    age_distribution: Array<{ name: string; count: number }>;
    visit_volume_over_time: Array<{ date: string; physical: number; virtual: number }>;
    peak_usage_hours: Array<{ hour: string; sessions: number }>;
    incident_reports_summary: { minor: number; major: number; critical: number };
    flagged_messages_over_time: Array<{ date: string; count: number }>;
    enforcement_actions: { forced_mutes: number; terminations: number; chat_locks: number };
    physical_visit_key_usage: { generated: number; used: number; expired: number };
    complaints_reviews_trend: Array<{ date: string; submitted: number; resolved: number }>;
    filters?: {
        date_preset?: string;
        date_from?: string;
        date_to?: string;
        time_grouping?: string;
        visit_type?: string;
        status?: string;
        recording_compliance?: string;
        violation?: string;
        monitoring_officer_id?: string;
        inmate?: string;
    };
    monitoring_officers?: Array<{ id: number; name: string }>;
}

function getFullName(user: User): string {
    const parts = [user.first_name, user.middle_name, user.last_name].filter(
        Boolean
    );

    return parts.join(' ') || 'N/A';
}

function getStatusBadge(status: string) {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
        approved: 'default',
        pending: 'secondary',
        rejected: 'destructive',
    };

    return (
        <Badge variant={variants[status.toLowerCase()] || 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}

function getRoleBadge(role: string | null) {
    if (!role) {
        return <Badge variant="secondary">No Role</Badge>;
    }

    const roleColors: Record<string, 'default' | 'secondary'> = {
        super_admin: 'default',
        bjmp_officer: 'default',
        monitoring_officer: 'default',
        visitor: 'secondary',
    };

    return (
        <Badge variant={roleColors[role] || 'secondary'}>
            {role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
    );
}

// Helper component for chart titles with tooltips
function ChartTitleWithTooltip({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                        <p>{description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

const COLORS = ['#facc15', '#22c55e', '#eab308', '#16a34a', '#fbbf24', '#10b981', '#fde047'];

export default function SuperAdminDashboard({
    stats,
    recent_users,
    appeals_stats,
    suggestions_stats,
    eburol_stats,
    gender_distribution,
    visit_type_distribution,
    appeals_by_type,
    feedback_by_type,
    provinces,
    municipalities: initialMunicipalities,
    barangays: initialBarangays,
    location_distribution: initialLocationDistribution,
    age_distribution,
    visit_volume_over_time = [],
    peak_usage_hours = [],
    incident_reports_summary = { minor: 0, major: 0, critical: 0 },
    flagged_messages_over_time = [],
    enforcement_actions = { forced_mutes: 0, terminations: 0, chat_locks: 0 },
    physical_visit_key_usage = { generated: 0, used: 0, expired: 0 },
    complaints_reviews_trend = [],
    filters: initialFilters = {},
    monitoring_officers: monitoringOfficersList = [],
}: Props) {
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
    const [selectedBarangay, setSelectedBarangay] = useState<string>('all');
    const [locationDistribution, setLocationDistribution] = useState(initialLocationDistribution);
    const [municipalities, setMunicipalities] = useState(initialMunicipalities);
    const [barangays, setBarangays] = useState(initialBarangays);

    const [globalFilters, setGlobalFilters] = useState({
        date_preset: initialFilters?.date_preset ?? 'last_30_days',
        date_from: initialFilters?.date_from ?? '',
        date_to: initialFilters?.date_to ?? '',
        time_grouping: initialFilters?.time_grouping ?? 'daily',
        visit_type: initialFilters?.visit_type ?? 'all',
        status: initialFilters?.status ?? 'all',
        recording_compliance: initialFilters?.recording_compliance ?? 'all',
        violation: initialFilters?.violation ?? 'all',
        monitoring_officer_id: initialFilters?.monitoring_officer_id || 'all',
        inmate: initialFilters?.inmate ?? '',
    });

    const applyGlobalFilters = () => {
        const params: Record<string, string> = {};
        if (globalFilters.date_preset) params.date_preset = globalFilters.date_preset;
        if (globalFilters.date_from) params.date_from = globalFilters.date_from;
        if (globalFilters.date_to) params.date_to = globalFilters.date_to;
        if (globalFilters.time_grouping && globalFilters.time_grouping !== 'daily') params.time_grouping = globalFilters.time_grouping;
        if (globalFilters.visit_type && globalFilters.visit_type !== 'all') params.visit_type = globalFilters.visit_type;
        if (globalFilters.status && globalFilters.status !== 'all') params.status = globalFilters.status;
        if (globalFilters.recording_compliance && globalFilters.recording_compliance !== 'all') params.recording_compliance = globalFilters.recording_compliance;
        if (globalFilters.violation && globalFilters.violation !== 'all') params.violation = globalFilters.violation;
        if (globalFilters.monitoring_officer_id && globalFilters.monitoring_officer_id !== 'all') params.monitoring_officer_id = globalFilters.monitoring_officer_id;
        if (globalFilters.inmate) params.inmate = globalFilters.inmate;
        router.get('/dashboard/super-admin', params, { preserveState: false });
    };

    useToast();
    useNotifications();

    // Gender distribution chart data
    const genderChartData = useMemo(() => {
        return Object.entries(gender_distribution).map(([name, value]) => ({
            name: name || 'Not Specified',
            value,
        }));
    }, [gender_distribution]);

    // Visit type distribution chart data
    const visitTypeChartData = useMemo(() => {
        return [
            { name: 'Physical', value: visit_type_distribution.physical },
            { name: 'Virtual', value: visit_type_distribution.virtual },
        ];
    }, [visit_type_distribution]);

    // Appeals by type chart data
    const appealsByTypeChartData = useMemo(() => {
        return [
            { name: 'Visits', value: appeals_by_type.visit },
            { name: 'E-Burol', value: appeals_by_type.eburol },
        ];
    }, [appeals_by_type]);

    // Feedback by type chart data
    const feedbackByTypeChartData = useMemo(() => {
        return [
            { name: 'Suggestions', value: feedback_by_type.suggestions },
            { name: 'Complaints', value: feedback_by_type.complaints },
        ];
    }, [feedback_by_type]);

    // Location distribution chart data
    const locationChartData = useMemo(() => {
        return locationDistribution;
    }, [locationDistribution]);

    const handleLocationFilterChange = () => {
        router.get(
            '/dashboard/super-admin',
            {
                province: selectedProvince !== 'all' ? selectedProvince : null,
                municipality: selectedMunicipality !== 'all' ? selectedMunicipality : null,
                barangay: selectedBarangay !== 'all' ? selectedBarangay : null,
            },
            {
                only: ['location_distribution', 'municipalities', 'barangays'],
                preserveScroll: true,
                onSuccess: (page) => {
                    const props = page.props as unknown as Props;
                    setLocationDistribution(props.location_distribution);
                    setMunicipalities(props.municipalities);
                    setBarangays(props.barangays);
                },
            }
        );
    };

    // Update municipalities when province changes
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setSelectedMunicipality('all');
        setSelectedBarangay('all');
        if (value !== 'all') {
            router.get(
                '/dashboard/super-admin',
                { province: value },
                {
                    only: ['municipalities'],
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const props = page.props as unknown as Props;
                        setMunicipalities(props.municipalities);
                    },
                }
            );
        } else {
            setMunicipalities(initialMunicipalities);
        }
    };

    // Update barangays when municipality changes
    const handleMunicipalityChange = (value: string) => {
        setSelectedMunicipality(value);
        setSelectedBarangay('all');
        if (value !== 'all') {
            router.get(
                '/dashboard/super-admin',
                {
                    province: selectedProvince !== 'all' ? selectedProvince : null,
                    municipality: value,
                },
                {
                    only: ['barangays'],
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const props = page.props as unknown as Props;
                        setBarangays(props.barangays);
                    },
                }
            );
        } else {
            setBarangays(initialBarangays);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="scrollbar-hide flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage all aspects of the system</p>
                    </div>
                </div>

                {/* Global filters — control all charts and KPIs via URL params */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Overview filters</CardTitle>
                        <CardDescription>Apply to all charts and reports. Changes update the dashboard via server.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Date range</label>
                            <Select value={globalFilters.date_preset} onValueChange={(v) => setGlobalFilters((f) => ({ ...f, date_preset: v }))}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="yesterday">Yesterday</SelectItem>
                                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                                    <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                                    <SelectItem value="this_month">This Month</SelectItem>
                                    <SelectItem value="last_month">Last Month</SelectItem>
                                    <SelectItem value="this_year">This Year</SelectItem>
                                    <SelectItem value="custom">Custom range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {globalFilters.date_preset === 'custom' && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">From</label>
                                    <input
                                        type="date"
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm h-9"
                                        value={globalFilters.date_from}
                                        onChange={(e) => setGlobalFilters((f) => ({ ...f, date_from: e.target.value }))}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-muted-foreground">To</label>
                                    <input
                                        type="date"
                                        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm h-9"
                                        value={globalFilters.date_to}
                                        onChange={(e) => setGlobalFilters((f) => ({ ...f, date_to: e.target.value }))}
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Time grouping</label>
                            <Select value={globalFilters.time_grouping} onValueChange={(v) => setGlobalFilters((f) => ({ ...f, time_grouping: v }))}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Visit type</label>
                            <Select value={globalFilters.visit_type} onValueChange={(v) => setGlobalFilters((f) => ({ ...f, visit_type: v }))}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="physical">Physical</SelectItem>
                                    <SelectItem value="eburol">Eburol</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Status</label>
                            <Select value={globalFilters.status} onValueChange={(v) => setGlobalFilters((f) => ({ ...f, status: v }))}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="missed">Missed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Monitoring officer</label>
                            <Select value={globalFilters.monitoring_officer_id} onValueChange={(v) => setGlobalFilters((f) => ({ ...f, monitoring_officer_id: v }))}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {monitoringOfficersList.map((o) => (
                                        <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={applyGlobalFilters}>Apply filters</Button>
                    </CardContent>
                </Card>

                {/* KPI Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {/* First Card: Users */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Number of Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {stats.pending_users} • Approved: {stats.approved_users} • Rejected: {stats.rejected_users}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Second Card: Appeals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Appeals
                            </CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{appeals_stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {appeals_stats.pending} • Approved: {appeals_stats.approved} • Rejected: {appeals_stats.rejected}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Third Card: Feedbacks */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Number of Feedbacks
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{suggestions_stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {suggestions_stats.pending} • Reviewed: {suggestions_stats.reviewed} • Resolved: {suggestions_stats.resolved} • In Progress: {suggestions_stats.in_progress} • Dismissed: {suggestions_stats.dismissed}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Fourth Card: E-Burol */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                E-Burol Applications
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{eburol_stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pending: {eburol_stats.pending} • Approved: {eburol_stats.approved} • Rejected: {eburol_stats.rejected} • Completed: {eburol_stats.completed}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* First Row: Gender and Visit Type Pie Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gender Distribution</CardTitle>
                            <CardDescription>
                                Distribution of gender among all visitors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={genderChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {genderChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Visit Type Distribution</CardTitle>
                            <CardDescription>
                                Distribution of physical and virtual visits
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
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Row: Appeals and Feedback Pie Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appeals Distribution</CardTitle>
                            <CardDescription>
                                Distribution of appeals by type (E-Burol vs Visits)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={appealsByTypeChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {appealsByTypeChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback Distribution</CardTitle>
                            <CardDescription>
                                Distribution of feedbacks (Suggestions vs Complaints)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={feedbackByTypeChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {feedbackByTypeChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Third Row: Location Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Location Distribution</CardTitle>
                        <CardDescription>
                            Distribution of visitors by their location (Barangay, Municipality, Province)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Provinces</SelectItem>
                                    {provinces.map((province) => (
                                        <SelectItem key={province} value={province}>
                                            {province}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedMunicipality} onValueChange={handleMunicipalityChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select Municipality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Municipalities</SelectItem>
                                    {municipalities.map((municipality: string) => (
                                        <SelectItem key={municipality} value={municipality}>
                                            {municipality}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select Barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Barangays</SelectItem>
                                    {barangays.map((barangay: string) => (
                                        <SelectItem key={barangay} value={barangay}>
                                            {barangay}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleLocationFilterChange}>
                                Apply Filters
                            </Button>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={locationChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#facc15" name="Number of Visitors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Fourth Row: Age Distribution Histogram */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Age Distribution</CardTitle>
                        <CardDescription>
                            Distribution of visitors by age groups
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={age_distribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#22c55e" name="Number of Visitors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reports Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Visit Volume Over Time */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Visit Volume Over Time"
                                description="Are visitation demands increasing or declining? This chart shows visits per day over the last 30 days, with separate lines for physical and virtual visits."
                            />
                            <CardDescription>Visits per day (last 30 days)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={visit_volume_over_time}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="physical" stroke="#facc15" name="Physical" />
                                    <Line type="monotone" dataKey="virtual" stroke="#22c55e" name="Virtual" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Peak Usage Hours */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Peak Usage Hours"
                                description="When are system and staff resources most strained? This heatmap shows the number of sessions per hour of the day."
                            />
                            <CardDescription>Sessions per hour</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={peak_usage_hours}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="sessions" fill="#eab308" name="Sessions" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Incident Reports Summary */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Incident Reports Summary"
                                description="How safe and compliant are sessions overall? This donut chart shows the breakdown of incidents by severity: minor, major, and critical."
                            />
                            <CardDescription>Incidents by classification</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Minor', value: incident_reports_summary.minor },
                                            { name: 'Major', value: incident_reports_summary.major },
                                            { name: 'Critical', value: incident_reports_summary.critical },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Cell fill="#facc15" />
                                        <Cell fill="#eab308" />
                                        <Cell fill="#dc2626" />
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Flagged Chat Messages Over Time */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Flagged Chat Messages Over Time"
                                description="Are communication violations increasing? This line chart shows the count of flagged messages per day over the last 30 days."
                            />
                            <CardDescription>Flagged messages per day (last 30 days)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={flagged_messages_over_time}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Line type="monotone" dataKey="count" stroke="#dc2626" name="Flagged Messages" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Session Enforcement Actions */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Session Enforcement Actions"
                                description="How often do monitors intervene? This bar chart shows the frequency of forced mutes, session terminations, and chat locks."
                            />
                            <CardDescription>Enforcement actions taken</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        { name: 'Forced Mutes', value: enforcement_actions.forced_mutes },
                                        { name: 'Terminations', value: enforcement_actions.terminations },
                                        { name: 'Chat Locks', value: enforcement_actions.chat_locks },
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#facc15" name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Physical Visit Key Usage */}
                    <Card>
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Physical Visit Key Usage"
                                description="Are physical visits being properly validated? This bar chart shows the number of generated keys, used keys, and expired keys for physical visits."
                            />
                            <CardDescription>Access key statistics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        { name: 'Generated', value: physical_visit_key_usage.generated },
                                        { name: 'Used', value: physical_visit_key_usage.used },
                                        { name: 'Expired', value: physical_visit_key_usage.expired },
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#22c55e" name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Complaints & Reviews Trend */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <ChartTitleWithTooltip
                                title="Complaints & Reviews Trend"
                                description="Is user satisfaction improving or worsening? This line chart shows complaints submitted and resolved per day over the last 30 days."
                            />
                            <CardDescription>Complaints submitted vs resolved (last 30 days)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={complaints_reviews_trend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="submitted" stroke="#dc2626" name="Submitted" />
                                    <Line type="monotone" dataKey="resolved" stroke="#22c55e" name="Resolved" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Users</CardTitle>
                                <CardDescription>
                                    Latest registered users in the system
                                </CardDescription>
                            </div>
                            <Link href="/admin/users">
                                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                                    View All
                                </Badge>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_users.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.id}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {getFullName(user)}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    {getRoleBadge(user.role)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(user.approval_status)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
