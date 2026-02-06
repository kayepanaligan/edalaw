import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, Clock, FileText, MapPin, User, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
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
    created_at: string;
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

    const getInmateFullName = (eburol: Eburol): string => {
        const parts = [eburol.inmate_first_name, eburol.inmate_middle_name, eburol.inmate_last_name].filter(Boolean);
        return parts.join(' ') || 'N/A';
    };

    const getDeceasedFullName = (eburol: Eburol): string => {
        const parts = [eburol.deceased_first_name, eburol.deceased_middle_name, eburol.deceased_last_name].filter(Boolean);
        return parts.join(' ') || 'N/A';
    };

    // Define columns for the data table
    const columns: ColumnDef<Eburol>[] = useMemo(() => [
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
                                Preferred: {eburol.preferred_time}
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
    ], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="E-Burol Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                                        <div className="space-y-2">
                                            <Label htmlFor="preferred_time">Preferred Time</Label>
                                            <Input
                                                id="preferred_time"
                                                type="time"
                                                name="preferred_time"
                                                value={form.data.preferred_time}
                                                onChange={(e) => form.setData('preferred_time', e.target.value)}
                                            />
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
                            <DataTable columns={columns} data={eburols} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

