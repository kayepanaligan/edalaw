import { Head, Link, router } from '@inertiajs/react';
import { Users, MessageSquare, Scale, Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

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
}: Props) {
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>('all');
    const [selectedBarangay, setSelectedBarangay] = useState<string>('all');
    const [locationDistribution, setLocationDistribution] = useState(initialLocationDistribution);
    const [municipalities, setMunicipalities] = useState(initialMunicipalities);
    const [barangays, setBarangays] = useState(initialBarangays);

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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage all aspects of the system</p>
                    </div>
                </div>

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
                                    <Tooltip />
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
                                    <Tooltip />
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
                                    <Tooltip />
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
                                    <Tooltip />
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
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Number of Visitors" />
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
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" name="Number of Visitors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

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
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_users.map((user) => (
                                            <TableRow key={user.id}>
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
