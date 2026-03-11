import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon, Clock, Plus, Scale, User, Video, X, CalendarClock, FileText, MoreVertical, FileOutput, VideoIcon, Search, Building, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

import { formatVisitSchedule } from '@/lib/formatVisitSchedule';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type InmateSearchResult = {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    inmate_number: string;
    cell: {
        id: number;
        cell_number: string;
    };
    available_days: Record<number, { virtual: boolean; physical: boolean }>;
};

type VisitSessionInfo = {
    id: number;
    scheduled_start: string;
    scheduled_end: string;
    status: string;
    terms_accepted_at: string | null;
    can_join_video: boolean;
    join_disabled_reason?: 'not_started' | 'ended' | null;
} | null;

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
    join_url: string | null;
    access_key: string | null;
    access_key_expires_at: string | null;
    monitoring_officer_id: number | null;
    monitoring_officer_name: string | null;
    rejection_reason: string | null;
    created_at: string;
    can_appeal?: boolean;
    appeal_deadline?: string | null;
    visit_session?: VisitSessionInfo;
};

type Props = {
    visits: Visit[];
    bookedTimeSlots?: string[];
    today_unavailable?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Visit Management',
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
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
    const [selectedVisitForReschedule, setSelectedVisitForReschedule] = useState<Visit | null>(null);
    const [selectedVisitForAppeal, setSelectedVisitForAppeal] = useState<Visit | null>(null);
    useToast();
    const [visitType, setVisitType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [rescheduleDate, setRescheduleDate] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<string[]>(bookedTimeSlots);
    const [rescheduleBookedSlots, setRescheduleBookedSlots] = useState<string[]>([]);
    const [slotCapacities, setSlotCapacities] = useState<Record<string, { current: number; max: number; isFull: boolean }>>({});
    const [userBookedSlots, setUserBookedSlots] = useState<string[]>([]);
    const [rescheduleSlotCapacities, setRescheduleSlotCapacities] = useState<Record<string, { current: number; max: number; isFull: boolean }>>({});
    const [isDayUnavailable, setIsDayUnavailable] = useState(false);
    const [rescheduleDayUnavailable, setRescheduleDayUnavailable] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const [videoTermsModalOpen, setVideoTermsModalOpen] = useState(false);
    const [selectedSessionForVideo, setSelectedSessionForVideo] = useState<{ sessionId: number; visit: Visit } | null>(null);
    const [videoTermsAccepted, setVideoTermsAccepted] = useState(false);
    const [acceptingTerms, setAcceptingTerms] = useState(false);
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0];
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minScheduleDate = (usePage().props as Props).today_unavailable ? tomorrow.toISOString().split('T')[0] : today;

    // Inmate search states
    const [isSearchingInmate, setIsSearchingInmate] = useState(false);
    const [inmateSearchResult, setInmateSearchResult] = useState<InmateSearchResult | null>(null);
    const [inmateSearchError, setInmateSearchError] = useState<string | null>(null);
    const [selectedInmateId, setSelectedInmateId] = useState<number | null>(null);
    const [cellAvailabilityError, setCellAvailabilityError] = useState<string | null>(null);

    const form = useForm({
        scheduled_date: '',
        scheduled_time: '',
        visit_type: '',
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        notes: '',
        relationship_proof: null as File | null,
        additional_proof: null as File | null,
    });

    const rescheduleForm = useForm({
        scheduled_date: '',
        scheduled_time: '',
    });

    const appealForm = useForm({
        appealable_type: 'visit',
        appealable_id: 0,
        reason: '',
        documents: [] as File[],
    });

    // Update booked slots when props change
    const bookedTimeSlotsFromProps = props.bookedTimeSlots;
    useEffect(() => {
        if (bookedTimeSlotsFromProps !== undefined) {
            setBookedSlots(bookedTimeSlotsFromProps);
            setLoadingSlots(false);
        }
    }, [bookedTimeSlotsFromProps]);

    // Fetch capacity information when date or visit type changes
    useEffect(() => {
        if (!selectedDate || !visitType) {
            setSlotCapacities({});
            setUserBookedSlots([]);
            setLoadingSlots(false);
            return;
        }

        const fetchSlotCapacities = async () => {
            setLoadingSlots(true);
            setIsDayUnavailable(false);
            try {
                const response = await fetch(`/visitor/schedules/booked-slots?date=${selectedDate}&visit_type=${visitType}`);
                const data = await response.json();
                if (data.slotCapacities) {
                    setSlotCapacities(data.slotCapacities);
                }
                if (Array.isArray(data.userBookedSlots)) {
                    setUserBookedSlots(data.userBookedSlots);
                } else {
                    setUserBookedSlots([]);
                }
                if (data.isDayUnavailable === true) {
                    setIsDayUnavailable(true);
                }
            } catch (error) {
                console.error('Error fetching slot capacities:', error);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlotCapacities();
    }, [selectedDate, visitType]);

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
        
        // Validate that selected date matches cell schedule
        if (inmateSearchResult && form.data.scheduled_date && form.data.visit_type) {
            const selectedDate = new Date(form.data.scheduled_date);
            const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const availability = inmateSearchResult.available_days[dayOfWeek];
            
            let isAllowed = false;
            if (form.data.visit_type === 'virtual' && availability?.virtual) {
                isAllowed = true;
            } else if (form.data.visit_type === 'physical' && availability?.physical) {
                isAllowed = true;
            }
            
            if (!isAllowed) {
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                toast.error(`This cell is not available for ${form.data.visit_type} visits on ${dayNames[dayOfWeek]}s. Please select a different date.`);
                return;
            }
        }
        
        form.post(visitor.schedule.store().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setVisitType('');
                setSelectedDate('');
                setBookedSlots([]);
                setInmateSearchResult(null);
                setSelectedInmateId(null);
                setCellAvailabilityError(null);
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
        setInmateSearchResult(null);
        setInmateSearchError(null);
        setSelectedInmateId(null);
        setCellAvailabilityError(null);
    };

    // Search for inmate by name
    const handleSearchInmate = async () => {
        if (!form.data.inmate_first_name || !form.data.inmate_last_name) {
            setInmateSearchError('Please enter both first name and last name to search');
            return;
        }

        setIsSearchingInmate(true);
        setInmateSearchError(null);
        setInmateSearchResult(null);
        setSelectedInmateId(null);
        setCellAvailabilityError(null);

        try {
            const response = await axios.post('/visitor/schedule/search-inmate', {
                first_name: form.data.inmate_first_name,
                middle_name: form.data.inmate_middle_name,
                last_name: form.data.inmate_last_name,
            });

            if (response.data.found && response.data.inmate) {
                setInmateSearchResult(response.data.inmate);
                setSelectedInmateId(response.data.inmate.id);
            } else {
                setInmateSearchError(response.data.message || 'Inmate not found');
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setInmateSearchError(error.response.data.message || 'Inmate not found');
            } else {
                setInmateSearchError('An error occurred while searching. Please try again.');
            }
        } finally {
            setIsSearchingInmate(false);
        }
    };

    // Check cell availability when date or visit type changes
    const checkCellAvailability = async (date: string, visitType: string) => {
        if (!selectedInmateId || !date || !visitType) {
            setCellAvailabilityError(null);
            return;
        }

        try {
            const response = await axios.post('/visitor/schedule/check-cell-availability', {
                inmate_id: selectedInmateId,
                date: date,
                visit_type: visitType,
            });

            if (!response.data.available) {
                setCellAvailabilityError(response.data.message || 'This cell is not available for the selected date and visit type.');
            } else {
                setCellAvailabilityError(null);
            }
        } catch (error) {
            setCellAvailabilityError(null);
        }
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

    const handleOpenAppealModal = (visit: Visit) => {
        if (!visit.can_appeal) {
            toast.error('The deadline for submitting an appeal has passed (48 hours after rejection).');
            return;
        }
        setSelectedVisitForAppeal(visit);
        appealForm.setData({
            appealable_type: 'visit',
            appealable_id: visit.id,
            reason: '',
            documents: [],
        });
        setIsAppealModalOpen(true);
    };

    const handleAppealModalClose = () => {
        setIsAppealModalOpen(false);
        setSelectedVisitForAppeal(null);
        appealForm.reset();
    };

    const handleAppealSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        appealForm.post('/visitor/appeals', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                appealForm.reset();
                setIsAppealModalOpen(false);
                setSelectedVisitForAppeal(null);
                toast.success('Appeal submitted successfully.');
            },
            onError: (errors) => {
                console.error('Appeal submission errors:', errors);
                
                // Get the first error message to show in toast
                const errorMessages: string[] = [];
                
                // Check for field-specific errors
                if (errors.reason) {
                    errorMessages.push(Array.isArray(errors.reason) ? errors.reason[0] : errors.reason);
                }
                if (errors.documents) {
                    errorMessages.push(Array.isArray(errors.documents) ? errors.documents[0] : errors.documents);
                }
                if (errors.appealable_type) {
                    errorMessages.push(Array.isArray(errors.appealable_type) ? errors.appealable_type[0] : errors.appealable_type);
                }
                if (errors.appealable_id) {
                    errorMessages.push(Array.isArray(errors.appealable_id) ? errors.appealable_id[0] : errors.appealable_id);
                }
                
                // Check for general appeal error
                if (errors.appeal) {
                    errorMessages.push(Array.isArray(errors.appeal) ? errors.appeal[0] : errors.appeal);
                }
                
                // Show the first error message in toast
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0]);
                } else {
                    toast.error('Failed to submit appeal. Please check the form and try again.');
                }
            },
        });
    };

    const handleAppealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        appealForm.setData('documents', files);
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

    // Fetch capacity information for reschedule
    useEffect(() => {
        if (!rescheduleDate || !selectedVisitForReschedule) {
            setRescheduleSlotCapacities({});
            return;
        }

        const fetchRescheduleSlotCapacities = async () => {
            setLoadingSlots(true);
            setRescheduleDayUnavailable(false);
            try {
                const visitType = selectedVisitForReschedule.visit_type;
                const response = await fetch(`/visitor/schedules/booked-slots?date=${rescheduleDate}&visit_type=${visitType}`);
                const data = await response.json();
                if (data.slotCapacities) {
                    setRescheduleSlotCapacities(data.slotCapacities);
                }
                if (data.isDayUnavailable === true) {
                    setRescheduleDayUnavailable(true);
                }
            } catch (error) {
                console.error('Error fetching reschedule slot capacities:', error);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchRescheduleSlotCapacities();
    }, [rescheduleDate, selectedVisitForReschedule]);

    // Define columns for the data table: ID, Date/Time, Visit Type, Access Key, Monitoring Officer, Status, Rejection Reasons, Icon, Actions
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
                const { dateLabel, timeLabel } = formatVisitSchedule(
                    visit.scheduled_date,
                    visit.scheduled_time ?? null,
                    visit.visit_type
                );
                return (
                    <div className="space-y-1">
                        <div className="font-medium">{dateLabel}</div>
                        <div className="text-sm text-muted-foreground">{timeLabel}</div>
                    </div>
                );
            },
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
                if (visit.status === 'approved') {
                    return <span className="text-sm text-muted-foreground">Not generated</span>;
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
                                title="Proof of appointment (print to show officer)"
                            >
                                <FileOutput className="h-4 w-4" />
                                PDF
                            </a>
                        </Button>
                    );
                }
                if (visit.visit_type === 'virtual' && visit.status === 'approved') {
                    const session = visit.visit_session;
                    if (session?.can_join_video) {
                        return (
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700 inline-flex gap-2"
                                title="Join video call"
                                onClick={() => {
                                    setSelectedSessionForVideo({ sessionId: session.id, visit });
                                    setVideoTermsAccepted(false);
                                    setVideoTermsModalOpen(true);
                                }}
                            >
                                <VideoIcon className="h-4 w-4" />
                                Video Call
                            </Button>
                        );
                    }
                    if (session && ['completed', 'terminated'].includes(session.status)) {
                        return <span className="text-sm text-muted-foreground">Completed</span>;
                    }
                    const sessionNotExpired = session && new Date(session.scheduled_end) > new Date() && !['completed', 'terminated'].includes(session.status);
                    if (session && !session.can_join_video) {
                        if (sessionNotExpired) {
                            return (
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 inline-flex gap-2"
                                    title="Join video call (a reminder will show if it's not yet time)"
                                    onClick={() => {
                                        setSelectedSessionForVideo({ sessionId: session.id, visit });
                                        setVideoTermsAccepted(false);
                                        setVideoTermsModalOpen(true);
                                    }}
                                >
                                    <VideoIcon className="h-4 w-4" />
                                    Video Call
                                </Button>
                            );
                        }
                        const tooltip = session.join_disabled_reason === 'not_started'
                            ? 'Video call is available from the scheduled start time.'
                            : session.join_disabled_reason === 'ended'
                                ? 'Schedule has ended.'
                                : 'Available during scheduled time only.';
                        return (
                            <Button size="sm" variant="outline" disabled className="inline-flex gap-2" title={tooltip}>
                                <VideoIcon className="h-4 w-4" />
                                Video Call
                            </Button>
                        );
                    }
                    if (visit.join_url) {
                        return (
                            <Button size="sm" variant="outline" asChild className="inline-flex gap-2">
                                <a href={visit.join_url} title="Join video call">
                                    <VideoIcon className="h-4 w-4" />
                                    Join
                                </a>
                            </Button>
                        );
                    }
                }
                return <span className="text-sm text-muted-foreground">—</span>;
            },
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
                            {(visit.status === 'pending' || visit.status === 'approved') && (
                                <>
                                    <DropdownMenuItem onClick={() => handleOpenRescheduleModal(visit)}>
                                        <CalendarClock className="mr-2 h-4 w-4" />
                                        Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleCancelVisit(visit.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </DropdownMenuItem>
                                </>
                            )}
                            {visit.status === 'rejected' && visit.can_appeal && (
                                <DropdownMenuItem onClick={() => handleOpenAppealModal(visit)}>
                                    <Scale className="mr-2 h-4 w-4" />
                                    Appeal
                                </DropdownMenuItem>
                            )}
                            {visit.status === 'rejected' && !visit.can_appeal && (
                                <DropdownMenuItem disabled className="text-muted-foreground">
                                    Appeal deadline passed
                                </DropdownMenuItem>
                            )}
                            {!['pending', 'approved', 'rejected'].includes(visit.status) && (
                                <DropdownMenuItem disabled className="text-muted-foreground">
                                    No actions available
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [handleCancelVisit, handleOpenRescheduleModal, handleOpenAppealModal]);

    const currentVisitType = visitType || form.data.visit_type || '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visit Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Visit Management</h1>
                        <p className="text-muted-foreground">
                            View and manage your visit schedule requests
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Apply for Schedule
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Visits</CardTitle>
                        <CardDescription>
                            {filteredVisits.length} of {visits.length} visit{visits.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredVisits.length === 0 && visits.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No visit schedules found.</p>
                                <p className="text-sm mt-2">Click "Apply for Schedule" to submit a request.</p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredVisits}
                                searchKey="inmate_first_name"
                                searchPlaceholder="Search by inmate name, date..."
                                initialSorting={[{ id: 'scheduled_date', desc: true }]}
                                headerActions={
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[150px]">
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
                                        <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="virtual">Virtual</SelectItem>
                                                <SelectItem value="physical">Physical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                <Dialog open={videoTermsModalOpen} onOpenChange={setVideoTermsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                            <DialogDescription>
                                Please read and accept before joining the video call.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li>The call is monitored by an officer.</li>
                                <li>The call is recorded.</li>
                                <li>Violations may result in termination of the call and/or future visit privileges.</li>
                            </ul>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="video-terms"
                                    checked={videoTermsAccepted}
                                    onCheckedChange={(c) => setVideoTermsAccepted(c === true)}
                                />
                                <Label htmlFor="video-terms" className="text-sm font-normal cursor-pointer">
                                    I understand and accept these terms.
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setVideoTermsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!videoTermsAccepted || acceptingTerms}
                                onClick={() => {
                                    if (!selectedSessionForVideo) return;
                                    const sessionId = selectedSessionForVideo.sessionId;
                                    setAcceptingTerms(true);
                                    router.post(`/visit/session/${sessionId}/accept-terms`, {}, {
                                        onSuccess: () => {
                                            setVideoTermsModalOpen(false);
                                            setSelectedSessionForVideo(null);
                                            setAcceptingTerms(false);
                                            router.visit(`/visit/session/${sessionId}`);
                                        },
                                        onError: () => setAcceptingTerms(false),
                                    });
                                }}
                            >
                                {acceptingTerms ? 'Accepting...' : 'Accept and Join'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Apply Schedule Modal - vertical layout, moderate width */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Apply for Visit Schedule</DialogTitle>
                            <DialogDescription>
                                Fill in all the details to submit a visit schedule request
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="visit_type">
                                        Visit Type <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={currentVisitType}
                                        onValueChange={(value) => {
                                            setVisitType(value);
                                            form.setData('visit_type', value);
                                            if (form.data.scheduled_time) {
                                                form.setData('scheduled_time', '');
                                            }
                                            // Check cell availability when visit type changes
                                            if (form.data.scheduled_date) {
                                                checkCellAvailability(form.data.scheduled_date, value);
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="visit_type">
                                            <SelectValue placeholder="Select visit type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="virtual">Virtual (10-min)</SelectItem>
                                            <SelectItem value="physical">Physical (1-hour)</SelectItem>
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

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="inmate_first_name">
                                            Inmate First Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="inmate_first_name"
                                            type="text"
                                            required
                                            name="inmate_first_name"
                                            placeholder="First name"
                                            value={form.data.inmate_first_name || ''}
                                            onChange={(e) => {
                                                form.setData('inmate_first_name', e.target.value);
                                                setInmateSearchResult(null);
                                                setInmateSearchError(null);
                                            }}
                                        />
                                        <InputError message={form.errors.inmate_first_name} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="inmate_middle_name">Inmate Middle Name</Label>
                                        <Input
                                            id="inmate_middle_name"
                                            type="text"
                                            name="inmate_middle_name"
                                            placeholder="Middle name (optional)"
                                            value={form.data.inmate_middle_name || ''}
                                            onChange={(e) => {
                                                form.setData('inmate_middle_name', e.target.value);
                                                setInmateSearchResult(null);
                                                setInmateSearchError(null);
                                            }}
                                        />
                                        <InputError message={form.errors.inmate_middle_name} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="inmate_last_name">
                                            Inmate Last Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="inmate_last_name"
                                            type="text"
                                            required
                                            name="inmate_last_name"
                                            placeholder="Last name"
                                            value={form.data.inmate_last_name || ''}
                                            onChange={(e) => {
                                                form.setData('inmate_last_name', e.target.value);
                                                setInmateSearchResult(null);
                                                setInmateSearchError(null);
                                            }}
                                        />
                                        <InputError message={form.errors.inmate_last_name} />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleSearchInmate}
                                        disabled={isSearchingInmate}
                                        className="w-full"
                                    >
                                        {isSearchingInmate ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-4 w-4" />
                                                Search Inmate
                                            </>
                                        )}
                                    </Button>

                                    {/* Search Error */}
                                    {inmateSearchError && (
                                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>{inmateSearchError}</span>
                                        </div>
                                    )}

                                    {/* Search Result - Cell Schedule */}
                                    {inmateSearchResult && (
                                        <div className="rounded-md bg-green-500/10 p-3 text-sm">
                                            <div className="flex items-start gap-2 mb-3">
                                                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                                                <span className="font-medium text-green-800">Inmate found!</span>
                                            </div>
                                            <div className="ml-6">
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {form.data.visit_type 
                                                        ? `Available ${form.data.visit_type} visit days for this cell:`
                                                        : 'Available visit days for this cell:'}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(inmateSearchResult.available_days).map(([day, availability]) => {
                                                        const dayNum = parseInt(day);
                                                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                        const hasVirtual = availability.virtual;
                                                        const hasPhysical = availability.physical;
                                                        
                                                        // Filter based on selected visit type
                                                        if (form.data.visit_type === 'virtual' && !hasVirtual) return null;
                                                        if (form.data.visit_type === 'physical' && !hasPhysical) return null;
                                                        if (!form.data.visit_type && !hasVirtual && !hasPhysical) return null;
                                                        
                                                        // Determine label based on visit type selection
                                                        let label = '';
                                                        let badgeClass = '';
                                                        
                                                        if (form.data.visit_type === 'virtual') {
                                                            label = '';
                                                            badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                                                        } else if (form.data.visit_type === 'physical') {
                                                            label = '';
                                                            badgeClass = 'bg-green-50 text-green-700 border-green-200';
                                                        } else {
                                                            // No visit type selected yet, show all
                                                            if (hasVirtual && hasPhysical) {
                                                                label = ' (Both)';
                                                                badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                                                            } else if (hasVirtual) {
                                                                label = ' (Virtual)';
                                                                badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                                                            } else {
                                                                label = ' (Physical)';
                                                                badgeClass = 'bg-green-50 text-green-700 border-green-200';
                                                            }
                                                        }
                                                        
                                                        return (
                                                            <Badge 
                                                                key={day} 
                                                                variant="outline" 
                                                                className={`text-xs ${badgeClass}`}
                                                            >
                                                                {dayNames[dayNum]}
                                                                {label}
                                                            </Badge>
                                                        );
                                                    })}
                                                    {(() => {
                                                        const filteredDays = Object.entries(inmateSearchResult.available_days).filter(([day, availability]) => {
                                                            const hasVirtual = availability.virtual;
                                                            const hasPhysical = availability.physical;
                                                            if (form.data.visit_type === 'virtual' && !hasVirtual) return false;
                                                            if (form.data.visit_type === 'physical' && !hasPhysical) return false;
                                                            return hasVirtual || hasPhysical;
                                                        });
                                                        
                                                        if (filteredDays.length === 0) {
                                                            return (
                                                                <span className="text-xs text-destructive">
                                                                    {form.data.visit_type 
                                                                        ? `No ${form.data.visit_type} visit days configured for this cell`
                                                                        : 'No days configured for visits'}
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>


                                {/* Cell Availability Error */}
                                {cellAvailabilityError && (
                                    <div className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-800 flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>{cellAvailabilityError}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="scheduled_date">
                                        Scheduled Date <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="scheduled_date"
                                            type="date"
                                            required
                                            min={minScheduleDate}
                                            name="scheduled_date"
                                            className="pl-10"
                                            value={form.data.scheduled_date || ''}
                                            onChange={(e) => {
                                                const date = e.target.value;
                                                
                                                // Validate date against cell schedule
                                                if (date && inmateSearchResult && form.data.visit_type) {
                                                    const selectedDate = new Date(date);
                                                    const dayOfWeek = selectedDate.getDay();
                                                    const availability = inmateSearchResult.available_days[dayOfWeek];
                                                    const isAllowed = form.data.visit_type === 'virtual' 
                                                        ? availability?.virtual 
                                                        : availability?.physical;
                                                    
                                                    if (!isAllowed) {
                                                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                        const allowedDays = Object.entries(inmateSearchResult.available_days)
                                                            .filter(([d, a]) => form.data.visit_type === 'virtual' ? a.virtual : a.physical)
                                                            .map(([d]) => dayNames[parseInt(d)]);
                                                        toast.error(`This cell is not available for ${form.data.visit_type} visits on ${dayNames[dayOfWeek]}s. Please select a ${allowedDays.join(', ')}.`);
                                                        form.setData('scheduled_date', '');
                                                        setSelectedDate('');
                                                        return;
                                                    }
                                                }
                                                
                                                form.setData('scheduled_date', date);
                                                setSelectedDate(date);
                                                if (form.data.scheduled_time) {
                                                    form.setData('scheduled_time', '');
                                                }
                                                // Check cell availability
                                                if (form.data.visit_type) {
                                                    checkCellAvailability(date, form.data.visit_type);
                                                }
                                            }}
                                            disabled={!inmateSearchResult || !form.data.visit_type}
                                        />
                                    </div>
                                    <InputError message={form.errors.scheduled_date} />
                                    {inmateSearchResult && form.data.visit_type && (() => {
                                        const allowedDays = Object.entries(inmateSearchResult.available_days)
                                            .filter(([day, availability]) => {
                                                if (form.data.visit_type === 'virtual') return availability.virtual;
                                                if (form.data.visit_type === 'physical') return availability.physical;
                                                return false;
                                            })
                                            .map(([day]) => parseInt(day));
                                        
                                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        const allowedDayNames = allowedDays.map(d => dayNames[d]);
                                        
                                        if (allowedDayNames.length > 0) {
                                            return (
                                                <p className="text-xs text-muted-foreground">
                                                    Only {allowedDayNames.join(', ')} available for {form.data.visit_type} visits
                                                </p>
                                            );
                                        }
                                        return (
                                            <p className="text-xs text-destructive">
                                                No {form.data.visit_type} visit days available for this cell
                                            </p>
                                        );
                                    })()}
                                    {!inmateSearchResult && (
                                        <p className="text-xs text-muted-foreground">
                                            Past dates are not available for selection
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>
                                        Scheduled Time <span className="text-destructive">*</span>
                                    </Label>
                                    {!form.data.scheduled_date ? (
                                        <div className="border rounded-lg p-4 bg-muted/30 text-center text-sm text-muted-foreground">
                                            <Clock className="size-5 mx-auto mb-2 opacity-50" />
                                            Please select a date first to view available time slots
                                        </div>
                                    ) : !form.data.visit_type ? (
                                        <div className="border rounded-lg p-4 bg-muted/30 text-center text-sm text-muted-foreground">
                                            <Clock className="size-5 mx-auto mb-2 opacity-50" />
                                            Please select a visit type first
                                        </div>
                                    ) : (
                                        <>
                                            {loadingSlots && (
                                                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground mb-2">
                                                    <Spinner className="size-4 mr-2" />
                                                    Loading booked slots...
                                                </div>
                                            )}
                                            {isDayUnavailable ? (
                                                <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-center text-sm text-amber-800 dark:text-amber-200">
                                                    <strong>Unavailable.</strong> Schedule times for this day end at 5:50 PM. Please select another date.
                                                </div>
                                            ) : (
                                                <TimeSlotPicker
                                                    selectedTime={form.data.scheduled_time || ''}
                                                    bookedSlots={bookedSlots}
                                                    slotCapacities={slotCapacities}
                                                    userBookedSlots={userBookedSlots}
                                                    visitType={form.data.visit_type as 'physical' | 'virtual'}
                                                    onTimeSelect={(time) => {
                                                        form.setData('scheduled_time', time);
                                                    }}
                                                />
                                            )}
                                            <input
                                                type="hidden"
                                                name="scheduled_time"
                                                value={form.data.scheduled_time || ''}
                                            />
                                        </>
                                    )}
                                    <InputError message={form.errors.scheduled_time} />
                                </div>

                               

                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm font-semibold flex items-center gap-2">
                                        <FileText className="size-4" />
                                        Required Documents
                                    </h3>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="relationship_proof">
                                                Proof of Relationship <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="relationship_proof"
                                                type="file"
                                                name="relationship_proof"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    form.setData('relationship_proof', file);
                                                }}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: PDF, JPG, PNG (Max 10MB)
                                            </p>
                                            <InputError message={form.errors.relationship_proof} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="additional_proof">
                                                Additional/Supporting Proof of Relationship <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="additional_proof"
                                                type="file"
                                                name="additional_proof"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    form.setData('additional_proof', file);
                                                }}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: PDF, JPG, PNG (Max 10MB)
                                            </p>
                                            <InputError message={form.errors.additional_proof} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
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
                                        <CalendarIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="reschedule_date"
                                            type="date"
                                            required
                                            min={minScheduleDate}
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
                                            {rescheduleDayUnavailable ? (
                                                <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-center text-sm text-amber-800 dark:text-amber-200">
                                                    <strong>Unavailable.</strong> Schedule times for this day end at 5:50 PM. Please select another date.
                                                </div>
                                            ) : (
                                                <TimeSlotPicker
                                                    selectedTime={rescheduleForm.data.scheduled_time || ''}
                                                    onTimeSelect={(time) => {
                                                        rescheduleForm.setData('scheduled_time', time);
                                                    }}
                                                    bookedSlots={rescheduleBookedSlots}
                                                    slotCapacities={rescheduleSlotCapacities}
                                                    visitType={selectedVisitForReschedule?.visit_type as 'physical' | 'virtual'}
                                                />
                                            )}
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

                {/* Appeal Modal */}
                <Dialog open={isAppealModalOpen} onOpenChange={setIsAppealModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Submit Appeal</DialogTitle>
                            <DialogDescription>
                                Provide a reason for your appeal and optionally attach supporting documents.
                                Appeals must be submitted within 48 hours after rejection.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAppealSubmit}>
                            <div className="space-y-4">
                                {selectedVisitForAppeal && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <Label className="text-sm font-semibold">Appealing:</Label>
                                        <p className="text-sm mt-1">
                                            Visit Schedule - Inmate: {selectedVisitForAppeal.inmate_first_name} {selectedVisitForAppeal.inmate_middle_name} {selectedVisitForAppeal.inmate_last_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Scheduled: {selectedVisitForAppeal.scheduled_date} {selectedVisitForAppeal.scheduled_time && `at ${selectedVisitForAppeal.scheduled_time}`}
                                        </p>
                                        {selectedVisitForAppeal.rejection_reason && (
                                            <p className="text-sm text-destructive mt-2">
                                                <strong>Rejection Reason:</strong> {selectedVisitForAppeal.rejection_reason}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="appeal_reason">
                                        Appeal Reason <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="appeal_reason"
                                        required
                                        rows={6}
                                        value={appealForm.data.reason}
                                        onChange={(e) => appealForm.setData('reason', e.target.value)}
                                        placeholder="Please provide a detailed reason for your appeal. Explain why you believe the rejection should be reconsidered..."
                                        minLength={10}
                                        maxLength={2000}
                                    />
                                    <InputError message={appealForm.errors.reason} />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 10 characters, maximum 2000 characters
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="appeal_documents">
                                        Supporting Documents (Optional)
                                    </Label>
                                    <Input
                                        id="appeal_documents"
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleAppealFileChange}
                                    />
                                    <InputError message={appealForm.errors.documents} />
                                    {appealForm.errors.appeal && (
                                        <div className="text-sm text-destructive">
                                            {Array.isArray(appealForm.errors.appeal) ? appealForm.errors.appeal[0] : appealForm.errors.appeal}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        You can upload up to 5 files (PDF, DOC, DOCX, JPG, JPEG, PNG). Max 5MB per file.
                                    </p>
                                    {appealForm.data.documents.length > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            Selected: {appealForm.data.documents.length} file(s)
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={handleAppealModalClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={appealForm.processing}>
                                    {appealForm.processing ? 'Submitting...' : 'Submit Appeal'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
