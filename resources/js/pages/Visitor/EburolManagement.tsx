import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Calendar, Clock, FileText, MapPin, Scale, User, Users, MoreVertical, Eye, Edit, CalendarClock, Trash2, Filter, Video } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Eburol = {
    id: number;
    inmate_first_name: string;
    inmate_middle_name: string | null;
    inmate_last_name: string;
    deceased_first_name: string;
    deceased_middle_name: string | null;
    deceased_last_name: string;
    deceased_date_of_death: string;
    relationship_to_inmate: string;
    wake_start_date: string;
    wake_end_date: string;
    preferred_time: string | null;
    wake_location: string;
    additional_details: string | null;
    death_certificate_path: string | null;
    relationship_proof_path: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    admin_notes: string | null;
    rejection_reason: string | null;
    created_at: string;
    can_appeal?: boolean;
    appeal_deadline?: string | null;
    visit_session?: {
        id: number;
        scheduled_start: string;
        scheduled_end: string;
        status: string;
        terms_accepted_at: string | null;
        can_join_video: boolean;
        join_disabled_reason?: 'not_started' | 'ended' | null;
    } | null;
    join_url?: string | null;
};

type Props = {
    eburols: Eburol[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'E-Burol Management',
        href: '/visitor/eburol',
    },
];

/** Format 24h slot start (e.g. "08:00") as 12hr range "8:00 AM – 9:00 AM". */
function formatEburolTimeSlot(slot: string | null): string {
    if (!slot) return '—';
    const [hStr, mStr] = slot.split(':');
    const h = parseInt(hStr ?? '0', 10);
    const m = parseInt(mStr ?? '0', 10);
    const period = h < 12 ? 'AM' : 'PM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const endH = h + 1;
    const endPeriod = endH < 12 ? 'AM' : 'PM';
    const endH12 = endH === 0 ? 12 : endH > 12 ? endH - 12 : endH;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${h12}:${pad(m)} ${period} – ${endH12}:00 ${endPeriod}`;
}

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

export default function EburolManagement({ eburols }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
    const [selectedEburol, setSelectedEburol] = useState<Eburol | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [videoTermsModalOpen, setVideoTermsModalOpen] = useState(false);
    const [selectedSessionIdForVideo, setSelectedSessionIdForVideo] = useState<number | null>(null);
    const [videoTermsAccepted, setVideoTermsAccepted] = useState(false);
    const [acceptingTerms, setAcceptingTerms] = useState(false);
    const [eburolSlotAvailability, setEburolSlotAvailability] = useState<Record<string, { current: number; max: number; isFull: boolean }>>({});
    useToast();
    const today = new Date().toISOString().split('T')[0];

    const form = useForm({
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        deceased_first_name: '',
        deceased_middle_name: '',
        deceased_last_name: '',
        deceased_date_of_death: '',
        relationship_to_inmate: '',
        wake_start_date: '',
        wake_end_date: '',
        preferred_time: '',
        wake_location: '',
        additional_details: '',
        death_certificate: null as File | null,
        relationship_proof: null as File | null,
    });

    const editForm = useForm({
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        deceased_first_name: '',
        deceased_middle_name: '',
        deceased_last_name: '',
        deceased_date_of_death: '',
        relationship_to_inmate: '',
        wake_start_date: '',
        wake_end_date: '',
        preferred_time: '',
        wake_location: '',
        additional_details: '',
        death_certificate: null as File | null,
        relationship_proof: null as File | null,
    });

    const rescheduleForm = useForm({
        wake_start_date: '',
        wake_end_date: '',
        preferred_time: '',
    });

    const appealForm = useForm({
        appealable_type: 'eburol',
        appealable_id: 0,
        reason: '',
        documents: [] as File[],
        // E-burol application fields for appeal
        inmate_first_name: '',
        inmate_middle_name: '',
        inmate_last_name: '',
        deceased_first_name: '',
        deceased_middle_name: '',
        deceased_last_name: '',
        deceased_date_of_death: '',
        relationship_to_inmate: '',
        wake_start_date: '',
        wake_end_date: '',
        preferred_time: '',
        wake_location: '',
        additional_details: '',
        death_certificate: null as File | null,
        relationship_proof: null as File | null,
    });

    useEffect(() => {
        const date = form.data.wake_start_date;
        if (!date) {
            setEburolSlotAvailability({});
            return;
        }
        fetch(`/visitor/eburol/slot-availability?date=${encodeURIComponent(date)}`)
            .then((res) => res.ok ? res.json() : {})
            .then((data) => setEburolSlotAvailability(data))
            .catch(() => setEburolSlotAvailability({}));
    }, [form.data.wake_start_date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/visitor/eburol', {
            forceFormData: true,
            onSuccess: () => {
                setShowForm(false);
                form.reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEburol) {
            return;
        }

        editForm.put(`/visitor/eburol/${selectedEburol.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('E-burol application updated successfully.');
                setIsEditModalOpen(false);
                setSelectedEburol(null);
                editForm.reset();
            },
            onError: () => {
                toast.error('Failed to update e-burol application.');
            },
        });
    };

    const handleReschedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEburol) {
            return;
        }

        rescheduleForm.post(`/visitor/eburol/${selectedEburol.id}/reschedule`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('E-burol schedule rescheduled successfully.');
                setIsRescheduleModalOpen(false);
                setSelectedEburol(null);
                rescheduleForm.reset();
            },
            onError: () => {
                toast.error('Failed to reschedule e-burol application.');
            },
        });
    };

    const handleDelete = () => {
        if (!selectedEburol) {
            return;
        }

        router.delete(`/visitor/eburol/${selectedEburol.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('E-burol application deleted successfully.');
                setIsDeleteModalOpen(false);
                setSelectedEburol(null);
            },
            onError: () => {
                toast.error('Failed to delete e-burol application.');
            },
        });
    };

    const handleOpenAppealModal = useCallback((eburol: Eburol) => {
        if (!eburol.can_appeal) {
            toast.error('The deadline for submitting an appeal has passed (48 hours after rejection).');
            return;
        }
        setSelectedEburol(eburol);
        appealForm.setData({
            appealable_type: 'eburol',
            appealable_id: eburol.id,
            reason: '',
            documents: [],
            // Pre-fill with rejected e-burol data
            inmate_first_name: eburol.inmate_first_name,
            inmate_middle_name: eburol.inmate_middle_name || '',
            inmate_last_name: eburol.inmate_last_name,
            deceased_first_name: eburol.deceased_first_name,
            deceased_middle_name: eburol.deceased_middle_name || '',
            deceased_last_name: eburol.deceased_last_name,
            deceased_date_of_death: eburol.deceased_date_of_death,
            relationship_to_inmate: eburol.relationship_to_inmate,
            wake_start_date: eburol.wake_start_date,
            wake_end_date: eburol.wake_end_date,
            preferred_time: eburol.preferred_time || '',
            wake_location: eburol.wake_location,
            additional_details: eburol.additional_details || '',
            death_certificate: null,
            relationship_proof: null,
        });
        setIsAppealModalOpen(true);
    }, [appealForm]);

    const handleAppealModalClose = () => {
        setIsAppealModalOpen(false);
        setSelectedEburol(null);
        appealForm.reset();
    };

    const handleAppealSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build comprehensive appeal reason including updated e-burol information
        const updatedInfo = `Updated E-Burol Application Details:
- Inmate: ${appealForm.data.inmate_first_name} ${appealForm.data.inmate_middle_name || ''} ${appealForm.data.inmate_last_name}
- Deceased: ${appealForm.data.deceased_first_name} ${appealForm.data.deceased_middle_name || ''} ${appealForm.data.deceased_last_name}
- Date of Death: ${appealForm.data.deceased_date_of_death}
- Relationship: ${appealForm.data.relationship_to_inmate}
- Wake Period: ${appealForm.data.wake_start_date} to ${appealForm.data.wake_end_date}
- Preferred Time: ${appealForm.data.preferred_time ? formatEburolTimeSlot(appealForm.data.preferred_time) : 'Not specified'}
- Wake Location: ${appealForm.data.wake_location}
${appealForm.data.additional_details ? `- Additional Details: ${appealForm.data.additional_details}` : ''}

Appeal Reason:
${appealForm.data.reason}`;

        // Create form data with all fields
        const formData = new FormData();
        formData.append('appealable_type', 'eburol');
        formData.append('appealable_id', selectedEburol?.id.toString() || '');
        formData.append('reason', updatedInfo);
        
        // Add e-burol application fields as metadata
        formData.append('inmate_first_name', appealForm.data.inmate_first_name);
        formData.append('inmate_middle_name', appealForm.data.inmate_middle_name || '');
        formData.append('inmate_last_name', appealForm.data.inmate_last_name);
        formData.append('deceased_first_name', appealForm.data.deceased_first_name);
        formData.append('deceased_middle_name', appealForm.data.deceased_middle_name || '');
        formData.append('deceased_last_name', appealForm.data.deceased_last_name);
        formData.append('deceased_date_of_death', appealForm.data.deceased_date_of_death);
        formData.append('relationship_to_inmate', appealForm.data.relationship_to_inmate);
        formData.append('wake_start_date', appealForm.data.wake_start_date);
        formData.append('wake_end_date', appealForm.data.wake_end_date);
        formData.append('preferred_time', appealForm.data.preferred_time || '');
        formData.append('wake_location', appealForm.data.wake_location);
        formData.append('additional_details', appealForm.data.additional_details || '');
        
        // Add files
        if (appealForm.data.death_certificate) {
            formData.append('death_certificate', appealForm.data.death_certificate);
        }
        if (appealForm.data.relationship_proof) {
            formData.append('relationship_proof', appealForm.data.relationship_proof);
        }
        
        // Add appeal documents
        if (appealForm.data.documents && appealForm.data.documents.length > 0) {
            appealForm.data.documents.forEach((file: File) => {
                formData.append('documents[]', file);
            });
        }

        appealForm.transform(() => formData).post('/visitor/appeals', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                appealForm.reset();
                setIsAppealModalOpen(false);
                setSelectedEburol(null);
                toast.success('Appeal submitted successfully. Your appeal has been sent to the BJMP officer for review.');
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

    const getInmateFullName = (eburol: Eburol): string => {
        const parts = [eburol.inmate_first_name, eburol.inmate_middle_name, eburol.inmate_last_name].filter(Boolean);
        return parts.join(' ') || 'N/A';
    };

    const getDeceasedFullName = (eburol: Eburol): string => {
        const parts = [eburol.deceased_first_name, eburol.deceased_middle_name, eburol.deceased_last_name].filter(Boolean);
        return parts.join(' ') || 'N/A';
    };

    // Format date to readable format (e.g., "February 10, 2026")
    const formatDateForSearch = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Filter eburols based on status
    const filteredEburols = useMemo(() => {
        let filtered = eburols;
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter((eburol) => eburol.status === statusFilter);
        }
        
        return filtered;
    }, [eburols, statusFilter]);

    // Custom global filter function for eburol search
    const eburolGlobalFilterFn = (row: any, columnId: string, filterValue: string): boolean => {
        if (!filterValue) {
            return true;
        }

        const searchValue = filterValue.toLowerCase();
        const eburol = row.original as Eburol;

        // Search in deceased name
        const deceasedName = getDeceasedFullName(eburol).toLowerCase();
        if (deceasedName.includes(searchValue)) {
            return true;
        }

        // Search in inmate name (PDL)
        const inmateName = getInmateFullName(eburol).toLowerCase();
        if (inmateName.includes(searchValue)) {
            return true;
        }

        // Search in formatted dates
        const wakeStartDate = formatDateForSearch(eburol.wake_start_date).toLowerCase();
        const wakeEndDate = formatDateForSearch(eburol.wake_end_date).toLowerCase();
        const deathDate = formatDateForSearch(eburol.deceased_date_of_death).toLowerCase();
        const submittedDate = formatDateForSearch(eburol.created_at).toLowerCase();
        
        if (
            wakeStartDate.includes(searchValue) ||
            wakeEndDate.includes(searchValue) ||
            deathDate.includes(searchValue) ||
            submittedDate.includes(searchValue)
        ) {
            return true;
        }

        // Search in other fields
        const relationship = (eburol.relationship_to_inmate || '').toLowerCase();
        const location = (eburol.wake_location || '').toLowerCase();
        const additionalDetails = (eburol.additional_details || '').toLowerCase();

        return (
            relationship.includes(searchValue) ||
            location.includes(searchValue) ||
            additionalDetails.includes(searchValue)
        );
    };

    // Define columns for the data table
    const columns: ColumnDef<Eburol>[] = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => (
                <div className="font-medium">{row.original.id}</div>
            ),
        },
        {
            accessorKey: 'deceased_first_name',
            header: 'Deceased Name',
            cell: ({ row }) => {
                const eburol = row.original;
                return (
                    <div>
                        <div className="font-medium">{getDeceasedFullName(eburol)}</div>
                        <div className="text-sm text-muted-foreground">
                            For: {getInmateFullName(eburol)}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'relationship_to_inmate',
            header: 'Relationship',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{row.original.relationship_to_inmate}</span>
                </div>
            ),
        },
        {
            accessorKey: 'deceased_date_of_death',
            header: 'Date of Death',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(row.original.deceased_date_of_death).toLocaleDateString()}</span>
                </div>
            ),
        },
        {
            accessorKey: 'wake_start_date',
            header: 'Wake Period',
            cell: ({ row }) => {
                const eburol = row.original;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                                {new Date(eburol.wake_start_date).toLocaleDateString()} - {new Date(eburol.wake_end_date).toLocaleDateString()}
                            </span>
                        </div>
                        {eburol.preferred_time && (
                            <div className="text-xs text-muted-foreground">
                                Preferred: {formatEburolTimeSlot(eburol.preferred_time)}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'wake_location',
            header: 'Location',
            cell: ({ row }) => (
                <div className="flex items-start gap-2 max-w-[200px]">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm truncate">{row.original.wake_location}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: 'rejection_reason',
            header: 'Rejection Reason',
            cell: ({ row }) => {
                const eburol = row.original;
                if (eburol.status === 'rejected' && eburol.rejection_reason) {
                    return (
                        <div className="max-w-md">
                            <p className="text-sm text-destructive">{eburol.rejection_reason}</p>
                        </div>
                    );
                }
                return <span className="text-sm text-muted-foreground">-</span>;
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Submitted',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'documents',
            header: 'Documents',
            cell: ({ row }) => {
                const eburol = row.original;
                return (
                    <div className="flex gap-2">
                        {eburol.death_certificate_path && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(eburol.death_certificate_path!, '_blank')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Death Cert
                            </Button>
                        )}
                        {eburol.relationship_proof_path && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(eburol.relationship_proof_path!, '_blank')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Proof
                            </Button>
                        )}
                        {!eburol.death_certificate_path && !eburol.relationship_proof_path && (
                            <span className="text-sm text-muted-foreground">-</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'meeting',
            header: '',
            cell: ({ row }) => {
                const eburol = row.original;
                if (eburol.status !== 'approved') {
                    return <span className="text-sm text-muted-foreground">—</span>;
                }
                const session = eburol.visit_session;
                if (session?.can_join_video) {
                    return (
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 inline-flex gap-2"
                            title="Join meeting"
                            onClick={() => {
                                setSelectedSessionIdForVideo(session.id);
                                setVideoTermsAccepted(false);
                                setVideoTermsModalOpen(true);
                            }}
                        >
                            <Video className="h-4 w-4" />
                            Join
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
                                title="Join meeting (a reminder will show if it's not yet time)"
                                onClick={() => {
                                    setSelectedSessionIdForVideo(session.id);
                                    setVideoTermsAccepted(false);
                                    setVideoTermsModalOpen(true);
                                }}
                            >
                                <Video className="h-4 w-4" />
                                Join
                            </Button>
                        );
                    }
                    const tooltip = session.join_disabled_reason === 'not_started'
                        ? 'Meeting is available from the scheduled start time.'
                        : session.join_disabled_reason === 'ended'
                            ? 'Schedule has ended.'
                            : 'Available during scheduled time only.';
                    return (
                        <Button size="sm" variant="outline" disabled className="inline-flex gap-2" title={tooltip}>
                            <Video className="h-4 w-4" />
                            Join
                        </Button>
                    );
                }
                if (eburol.join_url) {
                    return (
                        <Button size="sm" variant="outline" asChild className="inline-flex gap-2">
                            <a href={eburol.join_url} title="Join meeting">
                                <Video className="h-4 w-4" />
                                Join
                            </a>
                        </Button>
                    );
                }
                return <span className="text-sm text-muted-foreground">—</span>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const eburol = row.original;
                const isPending = eburol.status === 'pending';
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
                                    setSelectedEburol(eburol);
                                    setIsViewModalOpen(true);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            {isPending && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedEburol(eburol);
                                            editForm.setData({
                                                inmate_first_name: eburol.inmate_first_name,
                                                inmate_middle_name: eburol.inmate_middle_name || '',
                                                inmate_last_name: eburol.inmate_last_name,
                                                deceased_first_name: eburol.deceased_first_name,
                                                deceased_middle_name: eburol.deceased_middle_name || '',
                                                deceased_last_name: eburol.deceased_last_name,
                                                deceased_date_of_death: eburol.deceased_date_of_death,
                                                relationship_to_inmate: eburol.relationship_to_inmate,
                                                wake_start_date: eburol.wake_start_date,
                                                wake_end_date: eburol.wake_end_date,
                                                preferred_time: eburol.preferred_time || '',
                                                wake_location: eburol.wake_location,
                                                additional_details: eburol.additional_details || '',
                                                death_certificate: null,
                                                relationship_proof: null,
                                            });
                                            setIsEditModalOpen(true);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedEburol(eburol);
                                            rescheduleForm.setData({
                                                wake_start_date: eburol.wake_start_date,
                                                wake_end_date: eburol.wake_end_date,
                                                preferred_time: eburol.preferred_time || '',
                                            });
                                            setIsRescheduleModalOpen(true);
                                        }}
                                    >
                                        <CalendarClock className="mr-2 h-4 w-4" />
                                        Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedEburol(eburol);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                            {eburol.status === 'rejected' && eburol.can_appeal && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handleOpenAppealModal(eburol)}
                                    >
                                        <Scale className="mr-2 h-4 w-4" />
                                        Appeal
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [editForm, rescheduleForm, handleOpenAppealModal]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="E-Burol Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">E-Burol Management</h1>
                        <p className="text-muted-foreground">
                            Apply for e-burol schedule to allow inmates to attend wakes of deceased family members
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Apply for E-Burol'}
                    </Button>
                </div>

                {showForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Apply for E-Burol Schedule</CardTitle>
                            <CardDescription>
                                Fill in the details below to apply for an e-burol schedule. Please ensure all required documents are provided.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Inmate Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Inmate Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="inmate_first_name">First Name *</Label>
                                            <Input
                                                id="inmate_first_name"
                                                name="inmate_first_name"
                                                value={form.data.inmate_first_name}
                                                onChange={(e) => form.setData('inmate_first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.inmate_first_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="inmate_middle_name">Middle Name</Label>
                                            <Input
                                                id="inmate_middle_name"
                                                name="inmate_middle_name"
                                                value={form.data.inmate_middle_name}
                                                onChange={(e) => form.setData('inmate_middle_name', e.target.value)}
                                            />
                                            <InputError message={form.errors.inmate_middle_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="inmate_last_name">Last Name *</Label>
                                            <Input
                                                id="inmate_last_name"
                                                name="inmate_last_name"
                                                value={form.data.inmate_last_name}
                                                onChange={(e) => form.setData('inmate_last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.inmate_last_name} />
                                        </div>
                                    </div>
                                </div>

                                {/* Deceased Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Deceased Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="deceased_first_name">First Name *</Label>
                                            <Input
                                                id="deceased_first_name"
                                                name="deceased_first_name"
                                                value={form.data.deceased_first_name}
                                                onChange={(e) => form.setData('deceased_first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.deceased_first_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="deceased_middle_name">Middle Name</Label>
                                            <Input
                                                id="deceased_middle_name"
                                                name="deceased_middle_name"
                                                value={form.data.deceased_middle_name}
                                                onChange={(e) => form.setData('deceased_middle_name', e.target.value)}
                                            />
                                            <InputError message={form.errors.deceased_middle_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="deceased_last_name">Last Name *</Label>
                                            <Input
                                                id="deceased_last_name"
                                                name="deceased_last_name"
                                                value={form.data.deceased_last_name}
                                                onChange={(e) => form.setData('deceased_last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.deceased_last_name} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="deceased_date_of_death">Date of Death *</Label>
                                            <Input
                                                id="deceased_date_of_death"
                                                type="date"
                                                name="deceased_date_of_death"
                                                value={form.data.deceased_date_of_death}
                                                onChange={(e) => form.setData('deceased_date_of_death', e.target.value)}
                                                max={today}
                                                required
                                            />
                                            <InputError message={form.errors.deceased_date_of_death} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="relationship_to_inmate">Relationship to Inmate *</Label>
                                            <Input
                                                id="relationship_to_inmate"
                                                name="relationship_to_inmate"
                                                placeholder="e.g., Father, Mother, Spouse, Sibling"
                                                value={form.data.relationship_to_inmate}
                                                onChange={(e) => form.setData('relationship_to_inmate', e.target.value)}
                                                required
                                            />
                                            <InputError message={form.errors.relationship_to_inmate} />
                                        </div>
                                    </div>
                                </div>

                                {/* Wake Schedule */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Wake Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="wake_start_date">Start Date *</Label>
                                            <Input
                                                id="wake_start_date"
                                                type="date"
                                                name="wake_start_date"
                                                value={form.data.wake_start_date}
                                                onChange={(e) => form.setData('wake_start_date', e.target.value)}
                                                min={today}
                                                required
                                            />
                                            <InputError message={form.errors.wake_start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="wake_end_date">End Date *</Label>
                                            <Input
                                                id="wake_end_date"
                                                type="date"
                                                name="wake_end_date"
                                                value={form.data.wake_end_date}
                                                onChange={(e) => form.setData('wake_end_date', e.target.value)}
                                                min={form.data.wake_start_date || today}
                                                required
                                            />
                                            <InputError message={form.errors.wake_end_date} />
                                        </div>
                                        <div className="space-y-2 md:col-span-3">
                                            <Label>Preferred time (1-hour slot)</Label>
                                            {form.data.wake_start_date ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                                    {Array.from({ length: 10 }, (_, i) => {
                                                        const hour = 8 + i;
                                                        const slot = `${hour.toString().padStart(2, '0')}:00`;
                                                        const cap = eburolSlotAvailability[slot] ?? { current: 0, max: 4, isFull: false };
                                                        const label = formatEburolTimeSlot(slot);
                                                        const isSelected = form.data.preferred_time === slot;
                                                        return (
                                                            <Button
                                                                key={slot}
                                                                type="button"
                                                                variant={isSelected ? 'default' : 'outline'}
                                                                size="sm"
                                                                disabled={cap.isFull}
                                                                className="text-xs flex flex-col h-auto py-2"
                                                                onClick={() => form.setData('preferred_time', slot)}
                                                            >
                                                                <span>{label.split(' – ')[0]}</span>
                                                                <span className="text-muted-foreground text-[10px]">
                                                                    {cap.current}/{cap.max}
                                                                </span>
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Select start date first to see available time slots.</p>
                                            )}
                                            <InputError message={form.errors.preferred_time} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wake_location">Wake Location *</Label>
                                        <Textarea
                                            id="wake_location"
                                            name="wake_location"
                                            placeholder="Enter the complete address of the wake location"
                                            value={form.data.wake_location}
                                            onChange={(e) => form.setData('wake_location', e.target.value)}
                                            required
                                            rows={3}
                                        />
                                        <InputError message={form.errors.wake_location} />
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Required Documents
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="death_certificate">Death Certificate *</Label>
                                            <Input
                                                id="death_certificate"
                                                type="file"
                                                name="death_certificate"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    form.setData('death_certificate', file);
                                                }}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: PDF, JPG, PNG (Max 10MB)
                                            </p>
                                            <InputError message={form.errors.death_certificate} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="relationship_proof">Proof of Relationship *</Label>
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
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="space-y-2">
                                    <Label htmlFor="additional_details">Additional Details</Label>
                                    <Textarea
                                        id="additional_details"
                                        name="additional_details"
                                        placeholder="Any additional information that may help with the approval process"
                                        value={form.data.additional_details}
                                        onChange={(e) => form.setData('additional_details', e.target.value)}
                                        rows={4}
                                    />
                                    <InputError message={form.errors.additional_details} />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowForm(false);
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        {form.processing && <Spinner />}
                                        Submit Application
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Existing E-Burol Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle>My E-Burol Requests</CardTitle>
                        <CardDescription>
                            View all your submitted e-burol applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {eburols.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No e-burol requests yet.</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => setShowForm(true)}
                                >
                                    Apply for E-Burol
                                </Button>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredEburols}
                                searchKey="eburol_search"
                                searchPlaceholder="Search by deceased name, PDL name, or date (e.g., February 10, 2026)..."
                                enableGlobalFilter={true}
                                globalFilterFn={eburolGlobalFilterFn}
                                headerActions={
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Video Call Terms & Conditions Modal */}
                <Dialog open={videoTermsModalOpen} onOpenChange={setVideoTermsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                            <DialogDescription>
                                Please read and accept before joining the meeting.
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
                                    id="eburol-video-terms"
                                    checked={videoTermsAccepted}
                                    onCheckedChange={(c) => setVideoTermsAccepted(c === true)}
                                />
                                <Label htmlFor="eburol-video-terms" className="text-sm font-normal cursor-pointer">
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
                                    if (selectedSessionIdForVideo === null) return;
                                    const sessionId = selectedSessionIdForVideo;
                                    setAcceptingTerms(true);
                                    router.post(`/visit/session/${sessionId}/accept-terms`, {}, {
                                        onSuccess: () => {
                                            setVideoTermsModalOpen(false);
                                            setSelectedSessionIdForVideo(null);
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

                {/* View Details Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>E-Burol Application Details</DialogTitle>
                            <DialogDescription>
                                View complete information about this e-burol application
                            </DialogDescription>
                        </DialogHeader>
                        {selectedEburol && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedEburol.status)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Submitted</Label>
                                        <p className="font-medium">
                                            {new Date(selectedEburol.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-muted-foreground">Inmate Name</Label>
                                        <p className="font-medium">
                                            {`${selectedEburol.inmate_first_name} ${selectedEburol.inmate_middle_name || ''} ${selectedEburol.inmate_last_name}`.trim()}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-muted-foreground">Deceased Name</Label>
                                        <p className="font-medium">
                                            {`${selectedEburol.deceased_first_name} ${selectedEburol.deceased_middle_name || ''} ${selectedEburol.deceased_last_name}`.trim()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Date of Death</Label>
                                        <p className="font-medium">
                                            {new Date(selectedEburol.deceased_date_of_death).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Relationship</Label>
                                        <p className="font-medium">{selectedEburol.relationship_to_inmate}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Wake Start Date</Label>
                                        <p className="font-medium">
                                            {new Date(selectedEburol.wake_start_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Wake End Date</Label>
                                        <p className="font-medium">
                                            {new Date(selectedEburol.wake_end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {selectedEburol.preferred_time && (
                                        <div>
                                            <Label className="text-muted-foreground">Preferred Time</Label>
                                            <p className="font-medium">{formatEburolTimeSlot(selectedEburol.preferred_time)}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <Label className="text-muted-foreground">Wake Location</Label>
                                        <p className="font-medium">{selectedEburol.wake_location}</p>
                                    </div>
                                    {selectedEburol.additional_details && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Additional Details</Label>
                                            <p className="font-medium">{selectedEburol.additional_details}</p>
                                        </div>
                                    )}
                                    {selectedEburol.rejection_reason && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Rejection Reason</Label>
                                            <p className="font-medium text-destructive">{selectedEburol.rejection_reason}</p>
                                        </div>
                                    )}
                                    {selectedEburol.admin_notes && (
                                        <div className="col-span-2">
                                            <Label className="text-muted-foreground">Admin Notes</Label>
                                            <p className="font-medium">{selectedEburol.admin_notes}</p>
                                        </div>
                                    )}
                                    <div className="col-span-2 flex gap-2">
                                        {selectedEburol.death_certificate_path && (
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(selectedEburol.death_certificate_path!, '_blank')}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                View Death Certificate
                                            </Button>
                                        )}
                                        {selectedEburol.relationship_proof_path && (
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(selectedEburol.relationship_proof_path!, '_blank')}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                View Relationship Proof
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    setSelectedEburol(null);
                                }}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit E-Burol Application</DialogTitle>
                            <DialogDescription>
                                Update the details of your e-burol application. You can only edit pending applications.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedEburol && selectedEburol.status === 'pending' && (
                            <form onSubmit={handleEdit} className="space-y-6">
                                {/* Similar form structure as the create form, but using editForm */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Inmate Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_inmate_first_name">First Name *</Label>
                                            <Input
                                                id="edit_inmate_first_name"
                                                value={editForm.data.inmate_first_name}
                                                onChange={(e) => editForm.setData('inmate_first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={editForm.errors.inmate_first_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_inmate_middle_name">Middle Name</Label>
                                            <Input
                                                id="edit_inmate_middle_name"
                                                value={editForm.data.inmate_middle_name}
                                                onChange={(e) => editForm.setData('inmate_middle_name', e.target.value)}
                                            />
                                            <InputError message={editForm.errors.inmate_middle_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_inmate_last_name">Last Name *</Label>
                                            <Input
                                                id="edit_inmate_last_name"
                                                value={editForm.data.inmate_last_name}
                                                onChange={(e) => editForm.setData('inmate_last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={editForm.errors.inmate_last_name} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Deceased Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_deceased_first_name">First Name *</Label>
                                            <Input
                                                id="edit_deceased_first_name"
                                                value={editForm.data.deceased_first_name}
                                                onChange={(e) => editForm.setData('deceased_first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={editForm.errors.deceased_first_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_deceased_middle_name">Middle Name</Label>
                                            <Input
                                                id="edit_deceased_middle_name"
                                                value={editForm.data.deceased_middle_name}
                                                onChange={(e) => editForm.setData('deceased_middle_name', e.target.value)}
                                            />
                                            <InputError message={editForm.errors.deceased_middle_name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_deceased_last_name">Last Name *</Label>
                                            <Input
                                                id="edit_deceased_last_name"
                                                value={editForm.data.deceased_last_name}
                                                onChange={(e) => editForm.setData('deceased_last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={editForm.errors.deceased_last_name} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_deceased_date_of_death">Date of Death *</Label>
                                            <Input
                                                id="edit_deceased_date_of_death"
                                                type="date"
                                                value={editForm.data.deceased_date_of_death}
                                                onChange={(e) => editForm.setData('deceased_date_of_death', e.target.value)}
                                                max={today}
                                                required
                                            />
                                            <InputError message={editForm.errors.deceased_date_of_death} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_relationship_to_inmate">Relationship to Inmate *</Label>
                                            <Input
                                                id="edit_relationship_to_inmate"
                                                value={editForm.data.relationship_to_inmate}
                                                onChange={(e) => editForm.setData('relationship_to_inmate', e.target.value)}
                                                required
                                            />
                                            <InputError message={editForm.errors.relationship_to_inmate} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Wake Schedule
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_wake_start_date">Wake Start Date *</Label>
                                            <Input
                                                id="edit_wake_start_date"
                                                type="date"
                                                value={editForm.data.wake_start_date}
                                                onChange={(e) => editForm.setData('wake_start_date', e.target.value)}
                                                min={today}
                                                required
                                            />
                                            <InputError message={editForm.errors.wake_start_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_wake_end_date">Wake End Date *</Label>
                                            <Input
                                                id="edit_wake_end_date"
                                                type="date"
                                                value={editForm.data.wake_end_date}
                                                onChange={(e) => editForm.setData('wake_end_date', e.target.value)}
                                                min={editForm.data.wake_start_date || today}
                                                required
                                            />
                                            <InputError message={editForm.errors.wake_end_date} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_preferred_time">Preferred Time</Label>
                                            <Input
                                                id="edit_preferred_time"
                                                type="time"
                                                value={editForm.data.preferred_time}
                                                onChange={(e) => editForm.setData('preferred_time', e.target.value)}
                                            />
                                            <InputError message={editForm.errors.preferred_time} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_wake_location">Wake Location *</Label>
                                        <Textarea
                                            id="edit_wake_location"
                                            value={editForm.data.wake_location}
                                            onChange={(e) => editForm.setData('wake_location', e.target.value)}
                                            rows={2}
                                            required
                                        />
                                        <InputError message={editForm.errors.wake_location} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_additional_details">Additional Details</Label>
                                        <Textarea
                                            id="edit_additional_details"
                                            value={editForm.data.additional_details}
                                            onChange={(e) => editForm.setData('additional_details', e.target.value)}
                                            rows={3}
                                        />
                                        <InputError message={editForm.errors.additional_details} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Documents (Optional - Leave empty to keep existing)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_death_certificate">Death Certificate</Label>
                                            <Input
                                                id="edit_death_certificate"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    editForm.setData('death_certificate', file);
                                                }}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: PDF, JPG, PNG (Max 10MB). Leave empty to keep existing.
                                            </p>
                                            <InputError message={editForm.errors.death_certificate} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit_relationship_proof">Proof of Relationship</Label>
                                            <Input
                                                id="edit_relationship_proof"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    editForm.setData('relationship_proof', file);
                                                }}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Accepted formats: PDF, JPG, PNG (Max 10MB). Leave empty to keep existing.
                                            </p>
                                            <InputError message={editForm.errors.relationship_proof} />
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setSelectedEburol(null);
                                            editForm.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={editForm.processing}>
                                        {editForm.processing ? 'Updating...' : 'Update Application'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Reschedule Modal */}
                <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reschedule E-Burol</DialogTitle>
                            <DialogDescription>
                                Update the wake schedule dates and time. You can only reschedule pending applications.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedEburol && selectedEburol.status === 'pending' && (
                            <form onSubmit={handleReschedule} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reschedule_wake_start_date">Wake Start Date *</Label>
                                        <Input
                                            id="reschedule_wake_start_date"
                                            type="date"
                                            value={rescheduleForm.data.wake_start_date}
                                            onChange={(e) => rescheduleForm.setData('wake_start_date', e.target.value)}
                                            min={today}
                                            required
                                        />
                                        <InputError message={rescheduleForm.errors.wake_start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reschedule_wake_end_date">Wake End Date *</Label>
                                        <Input
                                            id="reschedule_wake_end_date"
                                            type="date"
                                            value={rescheduleForm.data.wake_end_date}
                                            onChange={(e) => rescheduleForm.setData('wake_end_date', e.target.value)}
                                            min={rescheduleForm.data.wake_start_date || today}
                                            required
                                        />
                                        <InputError message={rescheduleForm.errors.wake_end_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reschedule_preferred_time">Preferred Time</Label>
                                        <Input
                                            id="reschedule_preferred_time"
                                            type="time"
                                            value={rescheduleForm.data.preferred_time}
                                            onChange={(e) => rescheduleForm.setData('preferred_time', e.target.value)}
                                        />
                                        <InputError message={rescheduleForm.errors.preferred_time} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsRescheduleModalOpen(false);
                                            setSelectedEburol(null);
                                            rescheduleForm.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={rescheduleForm.processing}>
                                        {rescheduleForm.processing ? 'Rescheduling...' : 'Reschedule'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Appeal Modal */}
                <Dialog open={isAppealModalOpen} onOpenChange={setIsAppealModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Submit Appeal for E-Burol Application</DialogTitle>
                            <DialogDescription>
                                Review and update your e-burol application details, then provide a reason for your appeal.
                                Appeals must be submitted within 48 hours after rejection.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedEburol && selectedEburol.rejection_reason && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-4">
                                <Label className="text-sm font-semibold text-destructive">Rejection Reason:</Label>
                                <p className="text-sm text-destructive mt-1">{selectedEburol.rejection_reason}</p>
                            </div>
                        )}
                        <form onSubmit={handleAppealSubmit} className="space-y-6">
                            {/* Inmate Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Inmate Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_inmate_first_name">First Name *</Label>
                                        <Input
                                            id="appeal_inmate_first_name"
                                            value={appealForm.data.inmate_first_name}
                                            onChange={(e) => appealForm.setData('inmate_first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={appealForm.errors.inmate_first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_inmate_middle_name">Middle Name</Label>
                                        <Input
                                            id="appeal_inmate_middle_name"
                                            value={appealForm.data.inmate_middle_name}
                                            onChange={(e) => appealForm.setData('inmate_middle_name', e.target.value)}
                                        />
                                        <InputError message={appealForm.errors.inmate_middle_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_inmate_last_name">Last Name *</Label>
                                        <Input
                                            id="appeal_inmate_last_name"
                                            value={appealForm.data.inmate_last_name}
                                            onChange={(e) => appealForm.setData('inmate_last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={appealForm.errors.inmate_last_name} />
                                    </div>
                                </div>
                            </div>

                            {/* Deceased Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Deceased Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_deceased_first_name">First Name *</Label>
                                        <Input
                                            id="appeal_deceased_first_name"
                                            value={appealForm.data.deceased_first_name}
                                            onChange={(e) => appealForm.setData('deceased_first_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={appealForm.errors.deceased_first_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_deceased_middle_name">Middle Name</Label>
                                        <Input
                                            id="appeal_deceased_middle_name"
                                            value={appealForm.data.deceased_middle_name}
                                            onChange={(e) => appealForm.setData('deceased_middle_name', e.target.value)}
                                        />
                                        <InputError message={appealForm.errors.deceased_middle_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_deceased_last_name">Last Name *</Label>
                                        <Input
                                            id="appeal_deceased_last_name"
                                            value={appealForm.data.deceased_last_name}
                                            onChange={(e) => appealForm.setData('deceased_last_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={appealForm.errors.deceased_last_name} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_deceased_date_of_death">Date of Death *</Label>
                                        <Input
                                            id="appeal_deceased_date_of_death"
                                            type="date"
                                            value={appealForm.data.deceased_date_of_death}
                                            onChange={(e) => appealForm.setData('deceased_date_of_death', e.target.value)}
                                            max={today}
                                            required
                                        />
                                        <InputError message={appealForm.errors.deceased_date_of_death} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_relationship_to_inmate">Relationship to Inmate *</Label>
                                        <Input
                                            id="appeal_relationship_to_inmate"
                                            placeholder="e.g., Father, Mother, Spouse, Sibling"
                                            value={appealForm.data.relationship_to_inmate}
                                            onChange={(e) => appealForm.setData('relationship_to_inmate', e.target.value)}
                                            required
                                        />
                                        <InputError message={appealForm.errors.relationship_to_inmate} />
                                    </div>
                                </div>
                            </div>

                            {/* Wake Schedule */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Wake Schedule
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_wake_start_date">Start Date *</Label>
                                        <Input
                                            id="appeal_wake_start_date"
                                            type="date"
                                            value={appealForm.data.wake_start_date}
                                            onChange={(e) => appealForm.setData('wake_start_date', e.target.value)}
                                            min={today}
                                            required
                                        />
                                        <InputError message={appealForm.errors.wake_start_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_wake_end_date">End Date *</Label>
                                        <Input
                                            id="appeal_wake_end_date"
                                            type="date"
                                            value={appealForm.data.wake_end_date}
                                            onChange={(e) => appealForm.setData('wake_end_date', e.target.value)}
                                            min={appealForm.data.wake_start_date || today}
                                            required
                                        />
                                        <InputError message={appealForm.errors.wake_end_date} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_preferred_time">Preferred Time</Label>
                                        <Input
                                            id="appeal_preferred_time"
                                            type="time"
                                            value={appealForm.data.preferred_time}
                                            onChange={(e) => appealForm.setData('preferred_time', e.target.value)}
                                        />
                                        <InputError message={appealForm.errors.preferred_time} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="appeal_wake_location">Wake Location *</Label>
                                    <Textarea
                                        id="appeal_wake_location"
                                        placeholder="Enter the complete address of the wake location"
                                        value={appealForm.data.wake_location}
                                        onChange={(e) => appealForm.setData('wake_location', e.target.value)}
                                        required
                                        rows={3}
                                    />
                                    <InputError message={appealForm.errors.wake_location} />
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Required Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_death_certificate">Death Certificate *</Label>
                                        <Input
                                            id="appeal_death_certificate"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                appealForm.setData('death_certificate', file);
                                            }}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Accepted formats: PDF, JPG, PNG (Max 10MB)
                                        </p>
                                        <InputError message={appealForm.errors.death_certificate} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="appeal_relationship_proof">Proof of Relationship *</Label>
                                        <Input
                                            id="appeal_relationship_proof"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                appealForm.setData('relationship_proof', file);
                                            }}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Accepted formats: PDF, JPG, PNG (Max 10MB)
                                        </p>
                                        <InputError message={appealForm.errors.relationship_proof} />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-2">
                                <Label htmlFor="appeal_additional_details">Additional Details</Label>
                                <Textarea
                                    id="appeal_additional_details"
                                    placeholder="Any additional information that may help with the approval process"
                                    value={appealForm.data.additional_details}
                                    onChange={(e) => appealForm.setData('additional_details', e.target.value)}
                                    rows={4}
                                />
                                <InputError message={appealForm.errors.additional_details} />
                            </div>

                            {/* Appeal Reason */}
                            <div className="space-y-2">
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

                            {/* Supporting Documents */}
                            <div className="space-y-2">
                                <Label htmlFor="appeal_documents">
                                    Additional Supporting Documents (Optional)
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

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete E-Burol Application</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this e-burol application? This action cannot be undone. You can only delete pending applications.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedEburol && selectedEburol.status === 'pending' && (
                            <div className="space-y-4">
                                <div className="rounded-lg border p-4 bg-muted/50">
                                    <p className="text-sm font-medium">Application Details:</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Inmate: {`${selectedEburol.inmate_first_name} ${selectedEburol.inmate_last_name}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Deceased: {`${selectedEburol.deceased_first_name} ${selectedEburol.deceased_last_name}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Wake Dates: {new Date(selectedEburol.wake_start_date).toLocaleDateString()} - {new Date(selectedEburol.wake_end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedEburol(null);
                                }}
                            >
                                Cancel
                            </Button>
                            {selectedEburol && selectedEburol.status === 'pending' && (
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

