import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Plus, User, Video, X, CalendarClock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import visitor from '@/routes/visitor/index';
import type { BreadcrumbItem } from '@/types';

type Visit = {
    id: number;
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

type Props = {
    visits: Visit[];
    bookedTimeSlots?: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Schedule Management',
        href: '/visitor/schedule',
    },
];

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

export default function ScheduleManagement({ visits, bookedTimeSlots = [] }: Props) {
    const { props } = usePage<{ bookedTimeSlots?: string[] }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedVisitForReschedule, setSelectedVisitForReschedule] = useState<Visit | null>(null);
    useToast();
    const [visitType, setVisitType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [rescheduleDate, setRescheduleDate] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<string[]>(bookedTimeSlots);
    const [rescheduleBookedSlots, setRescheduleBookedSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const today = new Date().toISOString().split('T')[0];

    const form = useForm({
        scheduled_date: '',
        scheduled_time: '',
        visit_type: '',
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        notes: '',
    });

    const rescheduleForm = useForm({
        scheduled_date: '',
        scheduled_time: '',
    });

    // Update booked slots when props change
    const bookedTimeSlotsFromProps = props.bookedTimeSlots;
    useEffect(() => {
        if (bookedTimeSlotsFromProps !== undefined) {
            setBookedSlots(bookedTimeSlotsFromProps);
            setLoadingSlots(false);
        }
    }, [bookedTimeSlotsFromProps]);

    // Fetch booked slots when date changes
    useEffect(() => {
        if (!selectedDate) {
            setBookedSlots([]);
            setLoadingSlots(false);
            return;
        }

        const fetchBookedSlots = async () => {
            setLoadingSlots(true);
            router.get(
                visitor.schedule.index().url,
                { date: selectedDate },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['bookedTimeSlots'],
                    onSuccess: () => {
                        setLoadingSlots(false);
                    },
                    onError: () => {
                        setLoadingSlots(false);
                    },
                },
            );
        };

        fetchBookedSlots();
    }, [selectedDate]);

    // Filter visits based on selected filters
    const filteredVisits = useMemo(() => {
        return visits.filter((visit) => {
            const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
            const matchesVisitType = visitTypeFilter === 'all' || visit.visit_type === visitTypeFilter;
            return matchesStatus && matchesVisitType;
        });
    }, [visits, statusFilter, visitTypeFilter]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(visitor.schedule.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setVisitType('');
                setSelectedDate('');
                setBookedSlots([]);
                setIsModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to submit visit schedule. Please check the form and try again.');
            },
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        form.reset();
        setVisitType('');
        setSelectedDate('');
        setBookedSlots([]);
    };

    const handleCancelVisit = (visitId: number) => {
        if (!confirm('Are you sure you want to cancel this visit schedule?')) {
            return;
        }

        router.post(visitor.schedule.cancel(visitId).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Visit schedule cancelled successfully.');
            },
            onError: () => {
                toast.error('Failed to cancel visit schedule. Please try again.');
            },
        });
    };

    const handleOpenRescheduleModal = (visit: Visit) => {
        setSelectedVisitForReschedule(visit);
        setRescheduleDate(visit.scheduled_date);
        rescheduleForm.setData({
            scheduled_date: visit.scheduled_date,
            scheduled_time: visit.scheduled_time || '',
        });
        setIsRescheduleModalOpen(true);
    };

    const handleRescheduleModalClose = () => {
        setIsRescheduleModalOpen(false);
        setSelectedVisitForReschedule(null);
        rescheduleForm.reset();
        setRescheduleDate('');
        setRescheduleBookedSlots([]);
    };

    const handleRescheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVisitForReschedule) {
            return;
        }

        rescheduleForm.post(visitor.schedule.reschedule(selectedVisitForReschedule.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                rescheduleForm.reset();
                setRescheduleDate('');
                setRescheduleBookedSlots([]);
                setIsRescheduleModalOpen(false);
                setSelectedVisitForReschedule(null);
            },
            onError: () => {
                toast.error('Failed to reschedule visit. Please check the form and try again.');
            },
        });
    };

    // Fetch booked slots for reschedule date
    useEffect(() => {
        if (rescheduleDate && rescheduleDate !== selectedVisitForReschedule?.scheduled_date) {
            setLoadingSlots(true);
            router.get(
                visitor.schedule.index().url,
                { date: rescheduleDate },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['bookedTimeSlots'],
                    onSuccess: (page) => {
                        const bookedSlots = (page.props as { bookedTimeSlots?: string[] }).bookedTimeSlots || [];
                        setRescheduleBookedSlots(bookedSlots);
                        setLoadingSlots(false);
                    },
                    onError: () => {
                        setLoadingSlots(false);
                    },
                },
            );
        } else if (rescheduleDate === selectedVisitForReschedule?.scheduled_date) {
            // If rescheduling to the same date, exclude the current visit's time slot
            const currentTimeSlot = selectedVisitForReschedule?.scheduled_time;
            const bookedSlots = bookedTimeSlots.filter(slot => slot !== currentTimeSlot);
            setRescheduleBookedSlots(bookedSlots);
        }
    }, [rescheduleDate, selectedVisitForReschedule]);

    // Define columns for the data table
    const columns: ColumnDef<Visit>[] = useMemo(() => [
        {
            accessorKey: 'scheduled_date',
            header: 'Date & Time',
            cell: ({ row }) => {
                const visit = row.original;
                return (
                    <div className="space-y-1">
                        <div className="font-medium">
                            {new Date(visit.scheduled_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </div>
                        {visit.scheduled_time && (() => {
                            const [hours, minutes] = visit.scheduled_time.split(':').map(Number);
                            let endHours = hours;
                            let endMinutes = minutes + 10;
                            if (endMinutes >= 60) {
                                endMinutes = 0;
                                endHours += 1;
                            }
                            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                            return (
                                <div className="text-sm text-muted-foreground">
                                    {visit.scheduled_time} - {endTime}
                                </div>
                            );
                        })()}
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
                const isTimeForVisit = (() => {
                    if (!visit.scheduled_date || visit.status !== 'approved') {
                        return false;
                    }
                    const scheduledDate = new Date(visit.scheduled_date);
                    const now = new Date();

                    if (scheduledDate.toDateString() === now.toDateString() || scheduledDate < now) {
                        if (visit.scheduled_time) {
                            const [hours, minutes] = visit.scheduled_time.split(':').map(Number);
                            const scheduledDateTime = new Date(scheduledDate);
                            scheduledDateTime.setHours(hours, minutes, 0, 0);
                            return now >= scheduledDateTime;
                        }
                        return scheduledDate.toDateString() === now.toDateString();
                    }
                    return false;
                })();

                const canJoinVideoCall = visit.visit_type === 'virtual'
                    && visit.status === 'approved'
                    && visit.meeting_link
                    && isTimeForVisit;

                if (canJoinVideoCall) {
                    return (
                        <Button
                            size="sm"
                            variant="default"
                            asChild
                            className="bg-green-500 hover:bg-green-600"
                        >
                            <a
                                href={visit.meeting_link!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                            >
                                <Video className="h-4 w-4" />
                                Join Call
                            </a>
                        </Button>
                    );
                }
                if (visit.visit_type === 'virtual' && visit.status === 'approved' && visit.meeting_link) {
                    return (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Video className="h-4 w-4" />
                            <span>Available at scheduled time</span>
                        </div>
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
                if (visit.status === 'pending' || visit.status === 'approved') {
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenRescheduleModal(visit)}
                            >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                Reschedule
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelVisit(visit.id)}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    );
                }
                return <span className="text-sm text-muted-foreground">-</span>;
            },
        },
    ], [handleCancelVisit, handleOpenRescheduleModal]);

    const currentVisitType = visitType || form.data.visit_type || '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Schedule Management</h1>
                        <p className="text-muted-foreground">
                            View and manage your visit schedule requests
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Apply for Schedule
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter schedules by status and visit type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <Label htmlFor="status-filter">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger id="status-filter">
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
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <Label htmlFor="visit-type-filter">Visit Type</Label>
                                <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                    <SelectTrigger id="visit-type-filter">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                        <SelectItem value="physical">Physical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Visit Schedules</CardTitle>
                        <CardDescription>
                            {filteredVisits.length} of {visits.length} schedule{visits.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredVisits.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No visit schedules found.</p>
                                {visits.length === 0 && (
                                    <p className="text-sm mt-2">Click "Apply for Schedule" to submit a request.</p>
                                )}
                            </div>
                        ) : (
                            <DataTable columns={columns} data={filteredVisits} />
                        )}
                    </CardContent>
                </Card>

                {/* Apply Schedule Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Apply for Visit Schedule</DialogTitle>
                            <DialogDescription>
                                Fill in all the details to submit a visit schedule request
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="scheduled_date">
                                        Scheduled Date <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="scheduled_date"
                                            type="date"
                                            required
                                            min={today}
                                            name="scheduled_date"
                                            className="pl-10"
                                            value={form.data.scheduled_date || ''}
                                            onChange={(e) => {
                                                const date = e.target.value;
                                                form.setData('scheduled_date', date);
                                                setSelectedDate(date);
                                                if (form.data.scheduled_time) {
                                                    form.setData('scheduled_time', '');
                                                }
                                            }}
                                        />
                                    </div>
                                    <InputError message={form.errors.scheduled_date} />
                                    <p className="text-xs text-muted-foreground">
                                        Past dates are not available for selection
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label>
                                        Scheduled Time <span className="text-destructive">*</span>
                                    </Label>
                                    {!form.data.scheduled_date ? (
                                        <div className="border rounded-lg p-4 bg-muted/30 text-center text-sm text-muted-foreground">
                                            <Clock className="size-5 mx-auto mb-2 opacity-50" />
                                            Please select a date first to view available time slots
                                        </div>
                                    ) : (
                                        <>
                                            {loadingSlots && (
                                                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground mb-2">
                                                    <Spinner className="size-4 mr-2" />
                                                    Loading booked slots...
                                                </div>
                                            )}
                                            <TimeSlotPicker
                                                selectedTime={form.data.scheduled_time || ''}
                                                bookedSlots={bookedSlots}
                                                onTimeSelect={(time) => {
                                                    form.setData('scheduled_time', time);
                                                }}
                                            />
                                            <input
                                                type="hidden"
                                                name="scheduled_time"
                                                value={form.data.scheduled_time || ''}
                                            />
                                        </>
                                    )}
                                    <InputError message={form.errors.scheduled_time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="visit_type">
                                        Visit Type <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={currentVisitType}
                                        onValueChange={(value) => {
                                            setVisitType(value);
                                            form.setData('visit_type', value);
                                        }}
                                    >
                                        <SelectTrigger id="visit_type">
                                            <SelectValue placeholder="Select visit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="virtual">Virtual</SelectItem>
                                            <SelectItem value="physical">Physical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="visit_type" value={currentVisitType} />
                                    <InputError message={form.errors.visit_type} />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <User className="size-4" />
                                        Inmate Information
                                    </h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="inmate_first_name">
                                            Inmate First Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="inmate_first_name"
                                            type="text"
                                            required
                                            name="inmate_first_name"
                                            value={form.data.inmate_first_name || ''}
                                            onChange={(e) => form.setData('inmate_first_name', e.target.value)}
                                        />
                                        <InputError message={form.errors.inmate_first_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="inmate_middle_name">Inmate Middle Name</Label>
                                        <Input
                                            id="inmate_middle_name"
                                            type="text"
                                            name="inmate_middle_name"
                                            value={form.data.inmate_middle_name || ''}
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
                                            name="inmate_last_name"
                                            value={form.data.inmate_last_name || ''}
                                            onChange={(e) => form.setData('inmate_last_name', e.target.value)}
                                        />
                                        <InputError message={form.errors.inmate_last_name} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={form.data.notes || ''}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        placeholder="Any additional information or special requests..."
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={handleModalClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing && <Spinner className="mr-2 size-4" />}
                                    Submit Visit Request
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Reschedule Modal */}
                <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Reschedule Visit</DialogTitle>
                            <DialogDescription>
                                Select a new date and time for your visit schedule
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRescheduleSubmit}>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="reschedule_date">
                                        Scheduled Date <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="reschedule_date"
                                            type="date"
                                            required
                                            min={today}
                                            name="scheduled_date"
                                            className="pl-10"
                                            value={rescheduleForm.data.scheduled_date || ''}
                                            onChange={(e) => {
                                                const date = e.target.value;
                                                rescheduleForm.setData('scheduled_date', date);
                                                setRescheduleDate(date);
                                                if (rescheduleForm.data.scheduled_time) {
                                                    rescheduleForm.setData('scheduled_time', '');
                                                }
                                            }}
                                        />
                                    </div>
                                    <InputError message={rescheduleForm.errors.scheduled_date} />
                                    <p className="text-xs text-muted-foreground">
                                        Past dates are not available for selection
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label>
                                        Scheduled Time <span className="text-destructive">*</span>
                                    </Label>
                                    {!rescheduleForm.data.scheduled_date ? (
                                        <div className="border rounded-lg p-4 bg-muted/30 text-center text-sm text-muted-foreground">
                                            <Clock className="size-5 mx-auto mb-2 opacity-50" />
                                            Please select a date first to view available time slots
                                        </div>
                                    ) : (
                                        <>
                                            {loadingSlots && (
                                                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground mb-2">
                                                    <Spinner className="size-4 mr-2" />
                                                    Loading booked slots...
                                                </div>
                                            )}
                                            <TimeSlotPicker
                                                selectedTime={rescheduleForm.data.scheduled_time || ''}
                                                onTimeSelect={(time) => {
                                                    rescheduleForm.setData('scheduled_time', time);
                                                }}
                                                bookedSlots={rescheduleBookedSlots}
                                            />
                                        </>
                                    )}
                                    <InputError message={rescheduleForm.errors.scheduled_time} />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleRescheduleModalClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={rescheduleForm.processing}
                                >
                                    {rescheduleForm.processing ? (
                                        <>
                                            <Spinner className="mr-2 size-4" />
                                            Rescheduling...
                                        </>
                                    ) : (
                                        'Reschedule Visit'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
