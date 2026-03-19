import { Head } from '@inertiajs/react';
import { Activity, Calendar, Download, FileVideo, RefreshCw, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
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
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'BJMP Officer' },
];

type Filters = {
    date_from: string;
    date_to: string;
    visit_type: string | null;
    group_by: string;
};

type Kpis = {
    total_visits_today: number;
    active_sessions_now: number;
    pending_approvals: number;
    scheduled_sessions_today: number;
    terminated_sessions_today: number;
    total_flagged_today: number;
    recording_compliance_rate: number;
};

type VolumePoint = { period: string; virtual: number; physical: number; eburol: number };
type UtilizationPoint = { date: string; scheduled: number; available_slots: number; utilization_percent: number };
type ViolationPoint = { date: string; flagged_count: number; terminated_count: number };
type StatusDist = Record<string, number>;
type Heatmap = number[][];
type TopInmate = { inmate_name: string; visit_count: number; rank: number };
type MonitorRow = { monitor_name: string; sessions_supervised_today: number; enforcement_actions: number };
type CriticalEvent = {
    id: string;
    type: string;
    action: string;
    performed_by_name: string | null;
    created_at: string;
    metadata: Record<string, unknown> | null;
    session_id: number | null;
};

type Props = {
    filters: Filters;
    kpis: Kpis;
    visitVolumeOverTime: VolumePoint[];
    sessionStatusDistribution: StatusDist;
    facilityUtilization: UtilizationPoint[];
    violationFlagTrend: ViolationPoint[];
    peakVisitationHeatmap: Heatmap;
    topInmatesByVisitFrequency: TopInmate[];
    monitorActivitySnapshot: MonitorRow[];
    recordingStorageSummary: { total_count: number; total_hours: number };
    recentCriticalEvents: CriticalEvent[];
    overviewDataUrl: string;
    exportOverviewUrl: string;
};

const POLL_INTERVAL_MS = 60_000;

const PIE_COLORS: Record<string, string> = {
    scheduled: 'var(--chart-1)',
    active: 'var(--chart-2)',
    completed: 'var(--chart-3)',
    terminated: 'var(--chart-4)',
    no_show: 'var(--chart-5)',
    locked: 'var(--muted-foreground)',
};

export default function BjmpOfficerDashboard(props: Props) {
    const [data, setData] = useState<Props>(props);
    const [filters, setFilters] = useState<Filters>(props.filters);
    const [loading, setLoading] = useState(false);
    useToast();

    const fetchOverview = useCallback(async () => {
        const params = new URLSearchParams({
            date_from: filters.date_from,
            date_to: filters.date_to,
            group_by: filters.group_by,
        });
        if (filters.visit_type) params.set('visit_type', filters.visit_type);
        const url = `${data.overviewDataUrl}?${params}`;
        setLoading(true);
        try {
            const res = await fetch(url);
            const json = await res.json();
            setData((prev) => ({ ...prev, ...json }));
        } catch {
            // keep previous data
        } finally {
            setLoading(false);
        }
    }, [data.overviewDataUrl, filters.date_from, filters.date_to, filters.visit_type, filters.group_by]);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    useEffect(() => {
        const t = setInterval(fetchOverview, POLL_INTERVAL_MS);
        return () => clearInterval(t);
    }, [fetchOverview]);

    const handleExport = () => {
        const params = new URLSearchParams({
            date_from: filters.date_from,
            date_to: filters.date_to,
            group_by: filters.group_by,
        });
        if (filters.visit_type) params.set('visit_type', filters.visit_type);
        window.open(`${data.exportOverviewUrl}?${params}`, '_blank');
    };

    const sessionStatusPieData = Object.entries(data.sessionStatusDistribution || {}).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value: Number(value),
        fill: PIE_COLORS[name] ?? 'hsl(var(--muted))',
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="BJMP Officer Dashboard - Overview" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-[10px]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">BJMP Officer Dashboard</h1>
                        <p className="text-muted-foreground">
                            Facility-wide operational intelligence and situational awareness
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                            className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                        />
                        <span className="text-muted-foreground">to</span>
                        <input
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                            className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                        />
                        <Button variant="outline" size="sm" onClick={() => fetchOverview()} disabled={loading}>
                            Apply
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const today = new Date().toISOString().slice(0, 10);
                                setFilters((f) => ({ ...f, date_from: today, date_to: today }));
                            }}
                        >
                            Clear
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => fetchOverview()} disabled={loading}>
                            <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="size-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* KPI Summary Cards — Total Visits Today, Active Sessions Now, Pending Approvals, Scheduled Today */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Visits Today</CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.kpis?.total_visits_today ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions Now</CardTitle>
                            <Activity className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.kpis?.active_sessions_now ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.kpis?.pending_approvals ?? 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.kpis?.scheduled_sessions_today ?? 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Visit Volume Over Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visit Volume Over Time</CardTitle>
                            <CardDescription>Segmented by visit type (virtual, physical, eburol)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.visitVolumeOverTime ?? []}>
                                        <XAxis dataKey="period" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="virtual" stroke="var(--chart-1)" name="Virtual" />
                                        <Line type="monotone" dataKey="physical" stroke="var(--chart-2)" name="Physical" />
                                        <Line type="monotone" dataKey="eburol" stroke="var(--chart-3)" name="Eburol" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session Status Distribution Donut */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Status Distribution</CardTitle>
                            <CardDescription>Scheduled, active, completed, terminated, no-show</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sessionStatusPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {sessionStatusPieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Facility Utilization Bar — yellow (scheduled) / green (available) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Facility Utilization</CardTitle>
                            <CardDescription>Scheduled sessions vs available slots per day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[260px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.facilityUtilization ?? []}>
                                        <XAxis dataKey="date" fontSize={10} />
                                        <YAxis fontSize={11} />
                                        <Tooltip />
                                        <Bar dataKey="scheduled" fill="#eab308" name="Scheduled" />
                                        <Bar dataKey="available_slots" fill="#22c55e" name="Available slots" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 border-t pt-2 text-xs">
                                <span className="flex items-center gap-1.5">
                                    <span className="inline-block size-3 rounded bg-[#eab308]" aria-hidden />
                                    Scheduled
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="inline-block size-3 rounded bg-[#22c55e]" aria-hidden />
                                    Available slots
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Violation & Flag Activity Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Violation & Flag Activity Trend</CardTitle>
                            <CardDescription>Flagged messages and terminated sessions over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[260px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.violationFlagTrend ?? []}>
                                        <XAxis dataKey="date" fontSize={10} />
                                        <YAxis fontSize={11} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="flagged_count" stroke="var(--chart-4)" name="Flagged" />
                                        <Line type="monotone" dataKey="terminated_count" stroke="var(--destructive)" name="Terminated" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Peak Visitation Hours Heatmap */}
                <Card>
                    <CardHeader>
                        <CardTitle>Peak Visitation Hours Heatmap</CardTitle>
                        <CardDescription>Hour (0–23) vs day of week; intensity = session count</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <HeatmapGrid data={data.peakVisitationHeatmap ?? []} />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Top Inmates by Visit Frequency */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Inmates by Visit Frequency</CardTitle>
                            <CardDescription>Anomaly detection</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[320px] overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left font-medium">#</th>
                                            <th className="py-2 text-left font-medium">Inmate</th>
                                            <th className="py-2 text-right font-medium">Visits</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.topInmatesByVisitFrequency ?? []).map((row) => (
                                            <tr key={row.rank} className="border-b border-border/50">
                                                <td className="py-1.5">{row.rank}</td>
                                                <td className="py-1.5">{row.inmate_name || '—'}</td>
                                                <td className="py-1.5 text-right">{row.visit_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monitor Activity Snapshot */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monitor Activity Snapshot</CardTitle>
                            <CardDescription>Sessions supervised and enforcement actions today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[320px] overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left font-medium">Monitor</th>
                                            <th className="py-2 text-right font-medium">Sessions</th>
                                            <th className="py-2 text-right font-medium">Enforcement</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data.monitorActivitySnapshot ?? []).map((row, i) => (
                                            <tr key={i} className="border-b border-border/50">
                                                <td className="py-1.5">{row.monitor_name}</td>
                                                <td className="py-1.5 text-right">{row.sessions_supervised_today}</td>
                                                <td className="py-1.5 text-right">{row.enforcement_actions}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Recording Storage Summary */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recording Storage Summary</CardTitle>
                            <FileVideo className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.recordingStorageSummary?.total_count ?? 0}</div>
                            <p className="text-xs text-muted-foreground">Total recordings</p>
                            <div className="mt-2 text-2xl font-bold">{data.recordingStorageSummary?.total_hours ?? 0} h</div>
                            <p className="text-xs text-muted-foreground">Cumulative hours stored</p>
                        </CardContent>
                    </Card>

                    {/* Recent Critical Events Feed */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Critical Events</CardTitle>
                            <CardDescription>Terminations, flags, manual enforcement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="max-h-[200px] space-y-2 overflow-auto">
                                {(data.recentCriticalEvents ?? []).map((ev) => (
                                    <li key={ev.id} className="flex items-start gap-2 rounded border border-border/50 p-2 text-sm">
                                        <Badge variant={ev.action === 'terminated' ? 'destructive' : 'secondary'}>
                                            {ev.action}
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            {ev.performed_by_name ?? 'System'} · {new Date(ev.created_at).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function HeatmapGrid({ data }: { data: number[][] }) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const maxVal = Math.max(1, ...(data.flat() ?? []));
    const rows = Array.from({ length: 24 }, (_, i) => i);
    const cols = Array.from({ length: 7 }, (_, i) => i);

    return (
        <table className="w-full border-collapse text-xs">
            <thead>
                <tr>
                    <th className="border border-border p-1 font-medium">Hour</th>
                    {days.map((d) => (
                        <th key={d} className="border border-border p-1 font-medium">
                            {d}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((hour) => (
                    <tr key={hour}>
                        <td className="border border-border p-1 font-medium">{hour}:00</td>
                        {cols.map((dow) => {
                            const val = data[hour]?.[dow] ?? 0;
                            const pct = maxVal ? (val / maxVal) * 100 : 0;
                            return (
                                <td
                                    key={dow}
                                    className="border border-border p-1 text-center"
                                    style={{
                                        backgroundColor: `oklch(0.65 0.2 41 / ${0.15 + (pct / 100) * 0.85})`,
                                    }}
                                    title={`${val} sessions`}
                                >
                                    {val > 0 ? val : ''}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
