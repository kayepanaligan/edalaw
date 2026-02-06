import { Head, router, useForm } from '@inertiajs/react';
import { Calendar, FileText, Scale, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';
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
import visitor from '@/routes/visitor/index';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Appeal Management',
        href: '/visitor/appeals',
    },
];

type Appeal = {
    id: number;
    appealable_type: string;
    appealable_data: {
        type: 'visit' | 'eburol';
        id: number;
        scheduled_date?: string;
        scheduled_time?: string;
        visit_type?: string;
        inmate_name?: string;
        deceased_name?: string;
        wake_start_date?: string;
        wake_end_date?: string;
        status?: string;
    };
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by: string | null;
    reviewed_at: string | null;
    decision_notes: string | null;
    submitted_at: string;
    deadline: string | null;
    is_within_deadline: boolean;
    documents: Array<{
        id: number;
        file_name: string;
        file_path: string;
    }>;
    created_at: string;
};

type RejectedItem = {
    id: number;
    type: 'visit' | 'eburol';
    type_label: string;
    scheduled_date?: string;
    scheduled_time?: string;
    visit_type?: string;
    inmate_name?: string;
    deceased_name?: string;
    wake_start_date?: string;
    wake_end_date?: string;
    rejected_at: string;
};

type Props = {
    appeals: Appeal[];
    rejected_visits: RejectedItem[];
    rejected_eburols: RejectedItem[];
};

function getStatusBadge(status: string) {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string; label: string }> = {
        pending: {
            variant: 'secondary',
            className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            label: 'Pending Review',
        },
        approved: {
            variant: 'default',
            className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            label: 'Approved (Reversed)',
        },
        rejected: {
            variant: 'destructive',
            className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            label: 'Rejected (Final)',
        },
    };

    const config = badges[status] || badges.pending;
    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    );
}

export default function Appeals({ appeals, rejected_visits, rejected_eburols }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<RejectedItem | null>(null);
    useToast();

    const form = useForm({
        appealable_type: '',
        appealable_id: '',
        reason: '',
        documents: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(visitor.appeals.store().url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setIsModalOpen(false);
                setSelectedItem(null);
            },
            onError: () => {
                toast.error('Failed to submit appeal. Please check the form and try again.');
            },
        });
    };

    const handleOpenModal = (item: RejectedItem) => {
        setSelectedItem(item);
        form.setData({
            appealable_type: item.type,
            appealable_id: item.id.toString(),
            reason: '',
            documents: [],
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        form.reset();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        form.setData('documents', files);
    };

    const allRejectedItems = [...rejected_visits, ...rejected_eburols];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appeal Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Appeal Management</h1>
                        <p className="text-muted-foreground">
                            Appeal rejected visit schedules or e-burol applications
                        </p>
                    </div>
                </div>

                {/* Rejected Items Available for Appeal */}
                {allRejectedItems.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Rejected Requests Available for Appeal</CardTitle>
                            <CardDescription>
                                You can appeal these rejected requests. Appeals must be submitted within 24-48 hours after rejection.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {allRejectedItems.map((item) => (
                                    <Card key={`${item.type}-${item.id}`} className="border-l-4 border-l-orange-500">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-lg">
                                                            {item.type_label}
                                                        </CardTitle>
                                                        <Badge variant="destructive">Rejected</Badge>
                                                    </div>
                                                    <CardDescription>
                                                        {item.type === 'visit' ? (
                                                            <>
                                                                Inmate: {item.inmate_name} | 
                                                                Date: {item.scheduled_date} {item.scheduled_time && `at ${item.scheduled_time}`} | 
                                                                Type: {item.visit_type}
                                                            </>
                                                        ) : (
                                                            <>
                                                                Deceased: {item.deceased_name} | 
                                                                Inmate: {item.inmate_name} | 
                                                                Wake: {item.wake_start_date} to {item.wake_end_date}
                                                            </>
                                                        )}
                                                    </CardDescription>
                                                    <CardDescription>
                                                        Rejected: {new Date(item.rejected_at).toLocaleString()}
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    <Plus className="mr-2 size-4" />
                                                    Appeal
                                                </Button>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Existing Appeals */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Appeals</CardTitle>
                        <CardDescription>
                            View all your submitted appeals and their status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {appeals.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Scale className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No appeals submitted yet.</p>
                                {allRejectedItems.length === 0 && (
                                    <p className="text-sm mt-2">You have no rejected requests to appeal.</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {appeals.map((appeal) => (
                                    <Card key={appeal.id} className="border-l-4 border-l-primary">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <CardTitle className="text-lg">
                                                            {appeal.appealable_type}
                                                        </CardTitle>
                                                        {getStatusBadge(appeal.status)}
                                                        {!appeal.is_within_deadline && appeal.status === 'pending' && (
                                                            <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                                                                <Clock className="mr-1 size-3" />
                                                                Past Deadline
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription>
                                                        {appeal.appealable_data.type === 'visit' ? (
                                                            <>
                                                                Inmate: {appeal.appealable_data.inmate_name} | 
                                                                Date: {appeal.appealable_data.scheduled_date} {appeal.appealable_data.scheduled_time && `at ${appeal.appealable_data.scheduled_time}`} | 
                                                                Type: {appeal.appealable_data.visit_type}
                                                            </>
                                                        ) : (
                                                            <>
                                                                Deceased: {appeal.appealable_data.deceased_name} | 
                                                                Inmate: {appeal.appealable_data.inmate_name} | 
                                                                Wake: {appeal.appealable_data.wake_start_date} to {appeal.appealable_data.wake_end_date}
                                                            </>
                                                        )}
                                                    </CardDescription>
                                                    <CardDescription>
                                                        Submitted: {new Date(appeal.submitted_at).toLocaleString()}
                                                        {appeal.deadline && (
                                                            <> | Deadline: {new Date(appeal.deadline).toLocaleString()}</>
                                                        )}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-semibold">Appeal Reason:</Label>
                                                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                                    {appeal.reason}
                                                </p>
                                            </div>

                                            {appeal.documents.length > 0 && (
                                                <div>
                                                    <Label className="text-sm font-semibold">Supporting Documents:</Label>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {appeal.documents.map((doc) => (
                                                            <Button
                                                                key={doc.id}
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={doc.file_path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <FileText className="mr-2 size-4" />
                                                                    {doc.file_name}
                                                                </a>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {appeal.status !== 'pending' && (
                                                <div className="rounded-lg bg-muted p-4 border-l-4 border-l-primary">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {appeal.status === 'approved' ? (
                                                            <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <XCircle className="size-5 text-red-600 dark:text-red-400" />
                                                        )}
                                                        <Label className="text-sm font-semibold">
                                                            {appeal.status === 'approved' ? 'Approved' : 'Rejected'} Decision
                                                        </Label>
                                                    </div>
                                                    {appeal.decision_notes && (
                                                        <p className="text-sm mt-1 whitespace-pre-wrap">
                                                            {appeal.decision_notes}
                                                        </p>
                                                    )}
                                                    {appeal.reviewed_by && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Reviewed by: {appeal.reviewed_by}
                                                            {appeal.reviewed_at && (
                                                                <> on {new Date(appeal.reviewed_at).toLocaleString()}</>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Appeal Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Submit Appeal</DialogTitle>
                            <DialogDescription>
                                Provide a reason for your appeal and optionally attach supporting documents.
                                Appeals must be submitted within 24-48 hours after rejection.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {selectedItem && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <Label className="text-sm font-semibold">Appealing:</Label>
                                        <p className="text-sm mt-1">
                                            {selectedItem.type_label} - {selectedItem.type === 'visit' ? `Inmate: ${selectedItem.inmate_name}` : `Deceased: ${selectedItem.deceased_name}`}
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="reason">
                                        Appeal Reason <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        required
                                        rows={6}
                                        value={form.data.reason}
                                        onChange={(e) => form.setData('reason', e.target.value)}
                                        placeholder="Please provide a detailed reason for your appeal. Explain why you believe the rejection should be reconsidered..."
                                        minLength={10}
                                        maxLength={2000}
                                    />
                                    <InputError message={form.errors.reason} />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 10 characters, maximum 2000 characters
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="documents">
                                        Supporting Documents (Optional)
                                    </Label>
                                    <Input
                                        id="documents"
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                    <InputError message={form.errors.documents} />
                                    <p className="text-xs text-muted-foreground">
                                        You can upload up to 5 files (PDF, DOC, DOCX, JPG, JPEG, PNG). Max 5MB per file.
                                    </p>
                                    {form.data.documents.length > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            Selected: {form.data.documents.length} file(s)
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={handleModalClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Submitting...' : 'Submit Appeal'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

