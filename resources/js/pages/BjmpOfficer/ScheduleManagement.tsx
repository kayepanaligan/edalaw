import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Calendar, Video, MoreVertical, Eye, Check, X, RefreshCw, CalendarClock, FileOutput, VideoIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Visit Schedule Management',
        href: '/bjmp-officer/schedules',
    },
];

type Visit = {
    id: number;
    user_id: number;
    visitor_name: string;
    visitor_email: string;
    scheduled_date: string;
    scheduled_time: string | null;
    visit_type: 'virtual' | 'physical';
    inmate_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'missed' | 'completed';
    notes: string | null;
    meeting_link: string | null;
    rejection_reason: string | null;
    monitoring_officer_id: number | null;
    monitoring_officer_name: string | null;
    access_key: string | null;
    created_at: string;
};

type MonitoringOfficer = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    visits: Visit[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        completed: number;
        missed: number;
    };
    monitoringOfficers: MonitoringOfficer[];
};

function getStatusBadge(status: string) {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string; label: string }> = {
        pending: {
            variant: 'secondary',
            className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            label: 'Pending',
        },
        approved: {
            variant: 'default',
            className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            label: 'Approved',
        },
        rejected: {
            variant: 'destructive',
            className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            label: 'Rejected',
        },
        completed: {
            variant: 'default',
            className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            label: 'Completed',
        },
        missed: {
            variant: 'outline',
            className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
            label: 'Missed',
        },
    };

    const config = badges[status] || badges.pending;
    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    );
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

export default function ScheduleManagement({ visits, stats, monitoringOfficers }: Props) {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    useToast();
    const page = usePage();
    const flash = (page.props as { flash?: { warning?: string } }).flash;
    useEffect(() => {
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash?.warning]);

    const rejectForm = useForm({
        rejection_reason: '',
    });

    const approveForm = useForm({
        monitoring_officer_id: '',
    });

    const statusForm = useForm({
        status: 'pending' as 'pending' | 'approved' | 'rejected' | 'missed' | 'completed',
        rejection_reason: '',
        monitoring_officer_id: '',
    });

    const rescheduleForm = useForm({
        scheduled_date: '',
        scheduled_time: '',
    });

    const handleApprove = () => {
        if (!selectedVisit) {
            return;
        }

        if (selectedVisit.visit_type === 'virtual' && !approveForm.data.monitoring_officer_id) {
            toast.error('Please select a monitoring officer for this virtual visit.');
            return;
        }

        const payload: { monitoring_officer_id?: string } = {};
        if (selectedVisit.visit_type === 'virtual') {
            payload.monitoring_officer_id = approveForm.data.monitoring_officer_id;
        }
        router.post(`/bjmp-officer/schedules/${selectedVisit.id}/approve`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Schedule approved successfully.');
                setIsApproveModalOpen(false);
                setSelectedVisit(null);
                approveForm.reset();
            },
            onError: () => {
                toast.error('Failed to approve schedule.');
            },
        });
    };

    const handleReject = () => {
        if (!selectedVisit) {
            return;
        }

        if (!rejectForm.data.rejection_reason || rejectForm.data.rejection_reason.trim().length < 10) {
            toast.error('Rejection reason is required (minimum 10 characters)');
            return;
        }

        rejectForm.post(`/bjmp-officer/schedules/${selectedVisit.id}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Schedule rejected successfully.');
                setIsRejectModalOpen(false);
                setSelectedVisit(null);
                rejectForm.reset();
            },
            onError: () => {
                toast.error('Failed to reject schedule.');
            },
        });
    };

    const handleUpdateStatus = () => {
        if (!selectedVisit) {
            return;
        }

        if (statusForm.data.status === 'rejected') {
            if (!statusForm.data.rejection_reason || statusForm.data.rejection_reason.trim().length < 10) {
                toast.error('Rejection reason is required (minimum 10 characters)');
                return;
            }
        }

        if (statusForm.data.status === 'approved' && selectedVisit.visit_type === 'virtual') {
            if (!statusForm.data.monitoring_officer_id) {
                toast.error('Please select the monitoring officer responsible for this virtual visit.');
                return;
            }
        }

        statusForm.post(`/bjmp-officer/schedules/${selectedVisit.id}/update-status`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Schedule status updated successfully.');
                setIsStatusModalOpen(false);
                setSelectedVisit(null);
                statusForm.reset();
            },
            onError: () => {
                toast.error('Failed to update schedule status.');
            },
        });
    };

    const handleReschedule = () => {
        if (!selectedVisit) {
            return;
        }

        if (!rescheduleForm.data.scheduled_date || !rescheduleForm.data.scheduled_time) {
            toast.error('Date and time are required');
            return;
        }

        rescheduleForm.post(`/bjmp-officer/schedules/${selectedVisit.id}/reschedule`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Schedule rescheduled successfully.');
                setIsRescheduleModalOpen(false);
                setSelectedVisit(null);
                rescheduleForm.reset();
            },
            onError: () => {
                toast.error('Failed to reschedule visit.');
            },
        });
    };

    const filteredVisits = useMemo(() => {
        return visits.filter((visit) => {
            const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
            const matchesVisitType = visitTypeFilter === 'all' || visit.visit_type === visitTypeFilter;
            return matchesStatus && matchesVisitType;
        });
    }, [visits, statusFilter, visitTypeFilter]);

    const columns: ColumnDef<Visit>[] = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => (
                <span className="font-mono text-sm text-muted-foreground">#{row.original.id}</span>
            ),
        },
        {
            accessorKey: 'scheduled_date',
            header: 'Date / Time',
            cell: ({ row }) => {
                const visit = row.original;
                const scheduledDate = new Date(visit.scheduled_date);
                return (
                    <div className="space-y-1">
                        <div className="font-medium">
                            {scheduledDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </div>
                        {visit.scheduled_time && (
                            <div className="text-sm text-muted-foreground">
                                {visit.scheduled_time}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'visitor_name',
            header: 'Visitor',
            cell: ({ row }) => {
                const visit = row.original;
                return (
                    <div className="space-y-1">
                        <div className="font-medium">{visit.visitor_name}</div>
                        <div className="text-sm text-muted-foreground">{visit.visitor_email}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'inmate_name',
            header: 'Inmate',
            cell: ({ row }) => (
                <div className="font-medium">{row.original.inmate_name}</div>
            ),
        },
        {
            accessorKey: 'visit_type',
            header: 'Visit Type',
            cell: ({ row }) => getVisitTypeBadge(row.original.visit_type),
        },
        {
            id: 'access_key',
            header: 'Access Key',
            cell: ({ row }) => {
                const visit = row.original;
                if (visit.visit_type === 'virtual') {
                    return <span className="text-sm text-muted-foreground">Not applicable</span>;
                }
                if (visit.access_key) {
                    return (
                        <code className="rounded bg-muted px-2 py-1 font-mono text-sm font-bold">
                            {visit.access_key}
                        </code>
                    );
                }
                return <span className="text-sm text-muted-foreground">—</span>;
            },
        },
        {
            id: 'monitoring_officer',
            header: 'Monitoring Officer',
            cell: ({ row }) => {
                const visit = row.original;
                if (visit.visit_type === 'physical') {
                    return <span className="text-sm text-muted-foreground">Not applicable</span>;
                }
                if (visit.monitoring_officer_name) {
                    return <span className="text-sm">{visit.monitoring_officer_name}</span>;
                }
                return <span className="text-sm text-muted-foreground">Not assigned</span>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: 'rejection_reason',
            header: 'Rejection Reasons',
            cell: ({ row }) => {
                const visit = row.original;
                if (visit.status === 'approved') {
                    return <span className="text-sm text-muted-foreground">Application was approved</span>;
                }
                if (visit.status === 'pending') {
                    return <span className="text-sm text-muted-foreground">Application was pending</span>;
                }
                if (visit.status === 'rejected' && visit.rejection_reason) {
                    return (
                        <p className="max-w-xs text-sm text-destructive">{visit.rejection_reason}</p>
                    );
                }
                return <span className="text-sm text-muted-foreground">—</span>;
            },
        },
        {
            id: 'icon',
            header: '',
            cell: ({ row }) => {
                const visit = row.original;
                if (visit.visit_type === 'physical' && visit.status === 'approved') {
                    return (
                        <Button size="sm" variant="outline" asChild>
                            <a
                                href={`/visits/${visit.id}/proof`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex gap-2"
                                title="Proof of appointment"
                            >
                                <FileOutput className="h-4 w-4" />
                                PDF
                            </a>
                        </Button>
                    );
                }
                if (visit.visit_type === 'virtual' && visit.status === 'approved' && visit.meeting_link) {
                    return (
                        <a
                            href={visit.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700"
                            title="Join video call"
                        >
                            <VideoIcon className="h-4 w-4" />
                        </a>
                    );
                }
                return <span className="text-sm text-muted-foreground">—</span>;
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const visit = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedVisit(visit);
                                    setIsViewModalOpen(true);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedVisit(visit);
                                    statusForm.setData({
                                        status: visit.status,
                                        rejection_reason: visit.rejection_reason || '',
                                        monitoring_officer_id: visit.monitoring_officer_id?.toString() ?? '',
                                    });
                                    setIsStatusModalOpen(true);
                                }}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Update Status
                            </DropdownMenuItem>
                            {visit.status === 'pending' && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedVisit(visit);
                                            approveForm.reset();
                                            if (visit.visit_type === 'virtual') {
                                                approveForm.setData('monitoring_officer_id', visit.monitoring_officer_id?.toString() ?? '');
                                            }
                                            setIsApproveModalOpen(true);
                                        }}
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedVisit(visit);
                                            rejectForm.setData('rejection_reason', '');
                                            setIsRejectModalOpen(true);
                                        }}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reject
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedVisit(visit);
                                    rescheduleForm.setData({
                                        scheduled_date: visit.scheduled_date,
                                        scheduled_time: visit.scheduled_time || '',
                                    });
                                    setIsRescheduleModalOpen(true);
                                }}
                            >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                Reschedule
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

    const headerActions = (
        <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
            </Select>
            <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visit Schedule Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Visit Schedule Management</h1>
                        <p className="text-muted-foreground">
                            View and manage all visitation requests, approve, reject, or reschedule visitations
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total</CardDescription>
                            <CardTitle className="text-2xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-2xl">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Approved</CardDescription>
                            <CardTitle className="text-2xl">{stats.approved}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Rejected</CardDescription>
                            <CardTitle className="text-2xl">{stats.rejected}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Completed</CardDescription>
                            <CardTitle className="text-2xl">{stats.completed}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Missed</CardDescription>
                            <CardTitle className="text-2xl">{stats.missed}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Visit Schedules</CardTitle>
                        <CardDescription>
                            {filteredVisits.length} of {visits.length} schedule{visits.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredVisits.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No visit schedules found.</p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredVisits}
                                enableGlobalFilter={true}
                                searchPlaceholder="Search by visitor, inmate, date..."
                                headerActions={headerActions}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* View Details Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Visit Schedule Details</DialogTitle>
                            <DialogDescription>
                                View complete information about this visit schedule
                            </DialogDescription>
                        </DialogHeader>
                        {selectedVisit && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Visitor</Label>
                                        <p className="font-medium">{selectedVisit.visitor_name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedVisit.visitor_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedVisit.status)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Inmate Name</Label>
                                        <p className="font-medium">{selectedVisit.inmate_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Visit Type</Label>
                                        <div className="mt-1">{getVisitTypeBadge(selectedVisit.visit_type)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Scheduled Date</Label>
                                        <p className="font-medium">
                                            {new Date(selectedVisit.scheduled_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Scheduled Time</Label>
                                        <p className="font-medium">{selectedVisit.scheduled_time || 'N/A'}</p>
                                    </div>
                                    {selectedVisit.visit_type === 'virtual' && selectedVisit.meeting_link && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Join video call</Label>
                                            <p className="mt-1">
                                                <a
                                                    href={selectedVisit.meeting_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700"
                                                    title="Join video call"
                                                >
                                                    <VideoIcon className="h-5 w-5" />
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    {selectedVisit.notes && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Notes</Label>
                                            <p className="font-medium">{selectedVisit.notes}</p>
                                        </div>
                                    )}
                                    {selectedVisit.rejection_reason && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Rejection Reason</Label>
                                            <p className="font-medium text-destructive">{selectedVisit.rejection_reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    setSelectedVisit(null);
                                }}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Approve Modal */}
                <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approve Visit Schedule</DialogTitle>
                            <DialogDescription>
                                Approve this visit schedule. For virtual visits, assign a monitoring officer. The meeting link will be generated automatically.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {selectedVisit && selectedVisit.visit_type === 'virtual' && (
                                <div className="space-y-2">
                                    <Label htmlFor="monitoring_officer_id">
                                        Monitoring Officer <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={approveForm.data.monitoring_officer_id}
                                        onValueChange={(value) => approveForm.setData('monitoring_officer_id', value)}
                                    >
                                        <SelectTrigger id="monitoring_officer_id">
                                            <SelectValue placeholder="Select monitoring officer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monitoringOfficers.map((officer) => (
                                                <SelectItem key={officer.id} value={officer.id.toString()}>
                                                    {officer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={approveForm.errors.monitoring_officer_id} />
                                    <p className="text-xs text-muted-foreground">
                                        The selected officer will oversee this virtual visit and will be notified. A video meeting link is created automatically.
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsApproveModalOpen(false);
                                    setSelectedVisit(null);
                                    approveForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleApprove} disabled={approveForm.processing}>
                                {approveForm.processing ? 'Approving...' : 'Approve Schedule'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Modal */}
                <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Visit Schedule</DialogTitle>
                            <DialogDescription>
                                Provide a justification for rejecting this visit schedule. This reason will be sent to the visitor.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {selectedVisit && (
                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-medium">Rejecting schedule for:</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedVisit.inmate_name} - {new Date(selectedVisit.scheduled_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="rejection_reason">
                                    Rejection Reason <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="rejection_reason"
                                    required
                                    rows={6}
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                    placeholder="Please provide a detailed justification for rejecting this visit schedule..."
                                    minLength={10}
                                    maxLength={1000}
                                />
                                <InputError message={rejectForm.errors.rejection_reason} />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 10 characters, maximum 1000 characters
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setSelectedVisit(null);
                                    rejectForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleReject} disabled={rejectForm.processing}>
                                {rejectForm.processing ? 'Rejecting...' : 'Reject Schedule'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Update Status Modal */}
                <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Visit Status</DialogTitle>
                            <DialogDescription>
                                Update the status of this visit schedule
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={statusForm.data.status}
                                    onValueChange={(value) => statusForm.setData('status', value as 'pending' | 'approved' | 'rejected' | 'missed' | 'completed')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="missed">Missed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={statusForm.errors.status} />
                            </div>
                            {statusForm.data.status === 'rejected' && (
                                <div className="space-y-2">
                                    <Label htmlFor="status_rejection_reason">
                                        Rejection Reason <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="status_rejection_reason"
                                        required
                                        rows={6}
                                        value={statusForm.data.rejection_reason}
                                        onChange={(e) => statusForm.setData('rejection_reason', e.target.value)}
                                        placeholder="Please provide a detailed justification for rejecting this visit schedule..."
                                        minLength={10}
                                        maxLength={1000}
                                    />
                                    <InputError message={statusForm.errors.rejection_reason} />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 10 characters, maximum 1000 characters
                                    </p>
                                </div>
                            )}
                            {statusForm.data.status === 'approved' && selectedVisit?.visit_type === 'virtual' && monitoringOfficers && monitoringOfficers.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="status_monitoring_officer_id">
                                        Monitoring Officer <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={statusForm.data.monitoring_officer_id}
                                        onValueChange={(value) => statusForm.setData('monitoring_officer_id', value)}
                                    >
                                        <SelectTrigger id="status_monitoring_officer_id">
                                            <SelectValue placeholder="Select monitoring officer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monitoringOfficers.map((officer) => (
                                                <SelectItem key={officer.id} value={officer.id.toString()}>
                                                    {officer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={statusForm.errors.monitoring_officer_id} />
                                    <p className="text-xs text-muted-foreground">
                                        Required when approving. A meeting link is generated automatically if not already set.
                                    </p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsStatusModalOpen(false);
                                    setSelectedVisit(null);
                                    statusForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateStatus} disabled={statusForm.processing}>
                                {statusForm.processing ? 'Updating...' : 'Update Status'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reschedule Modal */}
                <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reschedule Visit</DialogTitle>
                            <DialogDescription>
                                Update the date and time for this visit schedule
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reschedule_date">
                                    Scheduled Date <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="reschedule_date"
                                    type="date"
                                    required
                                    value={rescheduleForm.data.scheduled_date}
                                    onChange={(e) => rescheduleForm.setData('scheduled_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <InputError message={rescheduleForm.errors.scheduled_date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reschedule_time">
                                    Scheduled Time <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="reschedule_time"
                                    type="time"
                                    required
                                    value={rescheduleForm.data.scheduled_time}
                                    onChange={(e) => rescheduleForm.setData('scheduled_time', e.target.value)}
                                />
                                <InputError message={rescheduleForm.errors.scheduled_time} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsRescheduleModalOpen(false);
                                    setSelectedVisit(null);
                                    rescheduleForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleReschedule} disabled={rescheduleForm.processing}>
                                {rescheduleForm.processing ? 'Rescheduling...' : 'Reschedule'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

