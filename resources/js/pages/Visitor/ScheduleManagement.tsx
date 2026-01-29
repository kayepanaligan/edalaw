import InputError from '@/components/input-error';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import visitor from '@/routes/visitor';
import type { BreadcrumbItem } from '@/types';
import { Form, Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type Visit = {
    id: number;
    scheduled_date: string;
    scheduled_time: string | null;
    visit_type: 'virtual' | 'physical';
    inmate_first_name: string;
    inmate_middle_name: string | null;
    inmate_last_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    notes: string | null;
    created_at: string;
};

type Props = {
    visits: Visit[];
    bookedTimeSlots?: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Schedule',
    },
];

export default function ScheduleManagement({ visits, bookedTimeSlots = [] }: Props) {
    const { props } = usePage<{ bookedTimeSlots?: string[] }>();
    const [visitType, setVisitType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [bookedSlots, setBookedSlots] = useState<string[]>(bookedTimeSlots);
    const [loadingSlots, setLoadingSlots] = useState(false);
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

    useEffect(() => {
        if (props.bookedTimeSlots !== undefined) {
            setBookedSlots(props.bookedTimeSlots);
            setLoadingSlots(false);
        }
    }, [props.bookedTimeSlots]);

    useEffect(() => {
        if (selectedDate) {
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
                    onFinish: () => {
                        setLoadingSlots(false);
                    },
                }
            );
        } else {
            setBookedSlots([]);
            setLoadingSlots(false);
        }
    }, [selectedDate]);

    const getStatusBadge = (status: string) => {
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
    };

    const getVisitTypeBadge = (type: string) => {
        return type === 'virtual' ? (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                Virtual
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                Physical
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Schedule Management</h1>
                        <p className="text-muted-foreground">Apply for visit schedules and manage your appointments</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5" />
                                Apply for Visit Schedule
                            </CardTitle>
                            <CardDescription>Fill out the form to request a visit schedule</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.post(visitor.schedule.store().url);
                                }}
                                className="space-y-6"
                            >
                                {(() => {
                                    const { processing, errors } = form;
                                    const data = form.data;
                                    const setData = (key: string, value: any) => {
                                        form.setData(key as keyof typeof form.data, value);
                                    };
                                    const currentVisitType = visitType || data?.visit_type || '';

                                    return (
                                        <>
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
                                                        value={data?.scheduled_date || ''}
                                                        onChange={(e) => {
                                                            const date = e.target.value;
                                                            setData('scheduled_date', date);
                                                            // Update selectedDate state immediately
                                                            setSelectedDate(date);
                                                            // Clear selected time when date changes
                                                            if (data?.scheduled_time) {
                                                                setData('scheduled_time', '');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <InputError message={errors.scheduled_date} />
                                                <p className="text-xs text-muted-foreground">
                                                    Past dates are not available for selection
                                                </p>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>
                                                    Scheduled Time <span className="text-destructive">*</span>
                                                </Label>
                                                {!data?.scheduled_date ? (
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
                                                            selectedTime={data?.scheduled_time || ''}
                                                            bookedSlots={bookedSlots}
                                                            onTimeSelect={(time) => {
                                                                setData('scheduled_time', time);
                                                            }}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="scheduled_time"
                                                            value={data?.scheduled_time || ''}
                                                        />
                                                    </>
                                                )}
                                                <InputError message={errors.scheduled_time} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="visit_type">
                                                    Visit Type <span className="text-destructive">*</span>
                                                </Label>
                                                <Select
                                                    value={currentVisitType}
                                                    onValueChange={(value) => {
                                                        setVisitType(value);
                                                        setData('visit_type', value);
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
                                                <InputError message={errors.visit_type} />
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
                                                        placeholder="First name"
                                                        value={data?.inmate_first_name || ''}
                                                        onChange={(e) => setData('inmate_first_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.inmate_first_name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="inmate_middle_name">
                                                        Inmate Middle Name (Optional)
                                                    </Label>
                                                    <Input
                                                        id="inmate_middle_name"
                                                        type="text"
                                                        name="inmate_middle_name"
                                                        placeholder="Middle name"
                                                        value={data?.inmate_middle_name || ''}
                                                        onChange={(e) => setData('inmate_middle_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.inmate_middle_name} />
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
                                                        placeholder="Last name"
                                                        value={data?.inmate_last_name || ''}
                                                        onChange={(e) => setData('inmate_last_name', e.target.value)}
                                                    />
                                                    <InputError message={errors.inmate_last_name} />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="notes">Notes (Optional)</Label>
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    rows={3}
                                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Additional notes or special requests"
                                                    value={data?.notes || ''}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                />
                                                <InputError message={errors.notes} />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Submit Visit Request
                                            </Button>
                                        </>
                                    );
                                })()}
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Visit Schedules</CardTitle>
                            <CardDescription>View and track your visit schedule requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {visits.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No visit schedules yet.</p>
                                    <p className="text-sm mt-2">Submit a request using the form on the left.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {visits.map((visit) => (
                                        <div
                                            key={visit.id}
                                            className="rounded-lg border p-4 space-y-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            {new Date(visit.scheduled_date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                        {visit.scheduled_time && (() => {
                                                            // Calculate end time (start time + 10 minutes)
                                                            const [hours, minutes] = visit.scheduled_time.split(':').map(Number);
                                                            let endHours = hours;
                                                            let endMinutes = minutes + 10;
                                                            if (endMinutes >= 60) {
                                                                endMinutes = 0;
                                                                endHours += 1;
                                                            }
                                                            const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                                                            return (
                                                                <span className="text-sm text-muted-foreground">
                                                                    at {visit.scheduled_time} - {endTime}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            Inmate: {visit.inmate_first_name} {visit.inmate_middle_name} {visit.inmate_last_name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {getStatusBadge(visit.status)}
                                                    {getVisitTypeBadge(visit.visit_type)}
                                                </div>
                                            </div>
                                            {visit.notes && (
                                                <div className="text-sm text-muted-foreground border-t pt-2">
                                                    <strong>Notes:</strong> {visit.notes}
                                                </div>
                                            )}
                                            <div className="text-xs text-muted-foreground">
                                                Submitted: {new Date(visit.created_at).toLocaleString()}
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

