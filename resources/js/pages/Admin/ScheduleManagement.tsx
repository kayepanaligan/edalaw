import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, Clock, Plus, User, Video, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { DataTable } from '@/components/data-table';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Schedule Management',
        href: '/admin/schedules',
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
    inmate_first_name: string;
    inmate_middle_name: string | null;
    inmate_last_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'missed' | 'completed' | 'cancelled';
    notes: string | null;
    meeting_link: string | null;
    created_at: string;
};

type Visitor = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    visits: Visit[];
    visitors: Visitor[];
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
        cancelled: {
            variant: 'outline',
            className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
            label: 'Cancelled',
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

export default function ScheduleManagement({ visits, visitors }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    useToast();

    const today = new Date().toISOString().split('T')[0];

    const form = useForm({
        user_id: '',
        scheduled_date: '',
        scheduled_time: '',
        visit_type: '',
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        notes: '',
        meeting_link: '',
    });

    // Fetch booked slots when date changes
    const fetchBookedSlots = async (date: string) => {
        if (!date) {
            setBookedSlots([]);
            return;
        }

        setLoadingSlots(true);
        try {
            const response = await fetch(`/visitor/schedule/booked-slots?date=${date}`);
            const data = await response.json();
            setBookedSlots(data.booked_slots || []);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            setBookedSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        form.setData('scheduled_date', date);
        fetchBookedSlots(date);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/schedules', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Schedule created and approved successfully.');
                form.reset();
                setIsCreateModalOpen(false);
                setSelectedDate('');
                setBookedSlots([]);
            },
            onError: () => {
                toast.error('Failed to create schedule. Please check the form and try again.');
            },
        });
    };

    const handleUpdateStatus = (visit: Visit, newStatus: string) => {
        router.post(
            `/admin/schedules/${visit.id}/update-status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Schedule status updated successfully.');
                    setIsStatusModalOpen(false);
                    setSelectedVisit(null);
                },
                onError: () => {
                    toast.error('Failed to update schedule status.');
                },
            }
        );
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
                accessorKey: 'scheduled_date',
                header: 'Date & Time',
                cell: ({ row }) => {
                    const visit = row.original;
                    const scheduledDate = new Date(visit.scheduled_date);
                    const [hours, minutes] = (visit.scheduled_time || '00:00').split(':').map(Number);
                    let endHours = hours;
                    let endMinutes = minutes + 10;
                    if (endMinutes >= 60) {
                        endMinutes = 0;
                        endHours += 1;
                    }
                    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

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
                                    {visit.scheduled_time} - {endTime}
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
                accessorKey: 'inmate_first_name',
                header: 'Inmate Name',
                cell: ({ row }) => {
                    const visit = row.original;
                    const inmateName = `${visit.inmate_first_name} ${visit.inmate_middle_name || ''} ${visit.inmate_last_name}`.trim();
                    return <div className="font-medium">{inmateName}</div>;
                },
            },
            {
                accessorKey: 'visit_type',
                header: 'Visit Type',
                cell: ({ row }) => getVisitTypeBadge(row.original.visit_type),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'meeting_link',
                header: 'Meeting Link',
                cell: ({ row }) => {
                    const visit = row.original;
                    if (visit.visit_type === 'virtual' && visit.status === 'approved' && visit.meeting_link) {
                        return (
                            <Button
                                size="sm"
                                variant="outline"
                                asChild
                            >
                                <a
                                    href={visit.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2"
                                >
                                    <Video className="h-4 w-4" />
                                    View Link
                                </a>
                            </Button>
                        );
                    }
                    return <span className="text-sm text-muted-foreground">-</span>;
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created',
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {new Date(row.original.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const visit = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            {visit.status === 'pending' && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => {
                                            router.post(`/admin/schedules/${visit.id}/approve`, {}, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success('Schedule approved successfully.');
                                                },
                                                onError: () => {
                                                    toast.error('Failed to approve schedule.');
                                                },
                                            });
                                        }}
                                    >
                                        <Check className="mr-1 size-4" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                            router.post(`/admin/schedules/${visit.id}/reject`, {}, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success('Schedule rejected successfully.');
                                                },
                                                onError: () => {
                                                    toast.error('Failed to reject schedule.');
                                                },
                                            });
                                        }}
                                    >
                                        <X className="mr-1 size-4" />
                                        Reject
                                    </Button>
                                </>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setSelectedVisit(visit);
                                    setIsStatusModalOpen(true);
                                }}
                            >
                                Update Status
                            </Button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const currentVisitType = form.data.visit_type || '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Schedule Management</h1>
                        <p className="text-muted-foreground">
                            Manage all visit schedules from all visitors
                        </p>
                    </div>
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
                                searchKey="search"
                                searchPlaceholder="Search by visitor, inmate, date..."
                                headerActions={
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="status-filter" className="sr-only">Status</Label>
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger id="status-filter" className="w-[150px]">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="approved">Approved</SelectItem>
                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="missed">Missed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Label htmlFor="visit-type-filter" className="sr-only">Visit Type</Label>
                                            <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                                <SelectTrigger id="visit-type-filter" className="w-[150px]">
                                                    <SelectValue placeholder="All Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    <SelectItem value="virtual">Virtual</SelectItem>
                                                    <SelectItem value="physical">Physical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={() => setIsCreateModalOpen(true)}>
                                            <Plus className="mr-2 size-4" />
                                            Create Schedule
                                        </Button>
                                    </>
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Create Schedule Modal */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Schedule</DialogTitle>
                            <DialogDescription>
                                Create a new visit schedule. It will be automatically approved.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="user_id">
                                        Visitor <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.user_id}
                                        onValueChange={(value) => form.setData('user_id', value)}
                                    >
                                        <SelectTrigger id="user_id">
                                            <SelectValue placeholder="Select visitor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {visitors.map((visitor) => (
                                                <SelectItem key={visitor.id} value={visitor.id.toString()}>
                                                    {visitor.name} ({visitor.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.user_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="scheduled_date">
                                        Scheduled Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="scheduled_date"
                                        type="date"
                                        required
                                        min={today}
                                        value={form.data.scheduled_date}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                    />
                                    <InputError message={form.errors.scheduled_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="scheduled_time">
                                        Scheduled Time <span className="text-destructive">*</span>
                                    </Label>
                                    {form.data.scheduled_date ? (
                                        <TimeSlotPicker
                                            selectedTime={form.data.scheduled_time}
                                            onTimeSelect={(time) => form.setData('scheduled_time', time)}
                                            bookedSlots={bookedSlots}
                                            loading={loadingSlots}
                                        />
                                    ) : (
                                        <Input
                                            id="scheduled_time"
                                            type="time"
                                            required
                                            value={form.data.scheduled_time}
                                            onChange={(e) => form.setData('scheduled_time', e.target.value)}
                                        />
                                    )}
                                    <InputError message={form.errors.scheduled_time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="visit_type">
                                        Visit Type <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.visit_type}
                                        onValueChange={(value) => {
                                            form.setData('visit_type', value);
                                            if (value !== 'virtual') {
                                                form.setData('meeting_link', '');
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="visit_type">
                                            <SelectValue placeholder="Select visit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="physical">Physical</SelectItem>
                                            <SelectItem value="virtual">Virtual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.visit_type} />
                                </div>

                                {currentVisitType === 'virtual' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="meeting_link">
                                            Meeting Link <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="meeting_link"
                                            type="url"
                                            required
                                            value={form.data.meeting_link}
                                            onChange={(e) => form.setData('meeting_link', e.target.value)}
                                            placeholder="https://meet.example.com/room-id"
                                        />
                                        <InputError message={form.errors.meeting_link} />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="inmate_first_name">
                                        Inmate First Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="inmate_first_name"
                                        type="text"
                                        required
                                        value={form.data.inmate_first_name}
                                        onChange={(e) => form.setData('inmate_first_name', e.target.value)}
                                    />
                                    <InputError message={form.errors.inmate_first_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="inmate_middle_name">Inmate Middle Name</Label>
                                    <Input
                                        id="inmate_middle_name"
                                        type="text"
                                        value={form.data.inmate_middle_name}
                                        onChange={(e) => form.setData('inmate_middle_name', e.target.value)}
                                    />
                                    <InputError message={form.errors.inmate_middle_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="inmate_last_name">
                                        Inmate Last Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="inmate_last_name"
                                        type="text"
                                        required
                                        value={form.data.inmate_last_name}
                                        onChange={(e) => form.setData('inmate_last_name', e.target.value)}
                                    />
                                    <InputError message={form.errors.inmate_last_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        rows={3}
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Additional notes (optional)"
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        form.reset();
                                        setSelectedDate('');
                                        setBookedSlots([]);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Creating...' : 'Create Schedule'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Update Status Modal */}
                <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Schedule Status</DialogTitle>
                            <DialogDescription>
                                Change the status for this schedule
                            </DialogDescription>
                        </DialogHeader>
                        {selectedVisit && (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        defaultValue={selectedVisit.status}
                                        onValueChange={(value) => {
                                            handleUpdateStatus(selectedVisit, value);
                                        }}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="missed">Missed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsStatusModalOpen(false);
                                    setSelectedVisit(null);
                                }}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

