import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { review } from '@/routes/admin/account-appeals';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Account Appeals',
        href: '/admin/account-appeals',
    },
];

type Appeal = {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        contact_number: string | null;
        approval_status: string;
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

type Props = {
    appeals: Appeal[];
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
    };

    const config = badges[status] || badges.pending;
    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    );
}

export default function AccountAppealReview({ appeals: initialAppeals = [] }: Props) {
    const [appeals] = useState<Appeal[]>(initialAppeals);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const reviewForm = useForm({
        status: 'approved' as 'approved' | 'rejected',
        decision_notes: '',
    });

    const filteredAppeals = useMemo(() => {
        if (statusFilter === 'all') {
            return appeals;
        }
        return appeals.filter((appeal) => appeal.status === statusFilter);
    }, [appeals, statusFilter]);

    const columns: ColumnDef<Appeal>[] = useMemo(
        () => [
            {
                accessorKey: 'user.name',
                header: 'User',
                cell: ({ row }) => {
                    const appeal = row.original;
                    return (
                        <div>
                            <div className="font-medium">{appeal.user.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {appeal.user.email}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'reason',
                header: 'Reason',
                cell: ({ row }) => {
                    const reason = row.original.reason;
                    return (
                        <div className="max-w-md truncate" title={reason}>
                            {reason}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                accessorKey: 'submitted_at',
                header: 'Submitted',
                cell: ({ row }) => {
                    const date = new Date(row.original.submitted_at);
                    return date.toLocaleDateString();
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const appeal = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedAppeal(appeal);
                                    setIsReviewModalOpen(true);
                                    reviewForm.setData({
                                        status: appeal.status === 'pending' ? 'approved' : appeal.status,
                                        decision_notes: appeal.decision_notes || '',
                                    });
                                }}
                                disabled={appeal.status !== 'pending'}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [reviewForm],
    );

    const handleReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAppeal) {
            return;
        }

        reviewForm.post(review(selectedAppeal.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewModalOpen(false);
                setSelectedAppeal(null);
                reviewForm.reset();
                toast.success('Appeal reviewed successfully.');
                router.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Appeals" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Appeals</CardTitle>
                        <CardDescription>
                            Review and manage account appeals from rejected users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-4">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable columns={columns} data={filteredAppeals} />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Account Appeal</DialogTitle>
                        <DialogDescription>
                            Review the appeal and make a decision.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAppeal && (
                        <form onSubmit={handleReview} className="space-y-4">
                            <div className="space-y-2">
                                <Label>User Information</Label>
                                <div className="rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <div>
                                            <span className="font-medium">Name:</span>{' '}
                                            {selectedAppeal.user.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span>{' '}
                                            {selectedAppeal.user.email}
                                        </div>
                                        {selectedAppeal.user.contact_number && (
                                            <div>
                                                <span className="font-medium">
                                                    Contact:
                                                </span>{' '}
                                                {selectedAppeal.user.contact_number}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium">
                                                Current Status:
                                            </span>{' '}
                                            {getStatusBadge(
                                                selectedAppeal.user.approval_status,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Appeal Reason</Label>
                                <div className="rounded-lg border p-4">
                                    <p className="text-sm">
                                        {selectedAppeal.reason}
                                    </p>
                                </div>
                            </div>

                            {selectedAppeal.documents.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Supporting Documents</Label>
                                    <div className="space-y-2">
                                        {selectedAppeal.documents.map((doc) => (
                                            <a
                                                key={doc.id}
                                                href={`/storage/${doc.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block rounded-lg border p-2 text-sm hover:bg-muted"
                                            >
                                                {doc.file_name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Decision <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={reviewForm.data.status}
                                    onValueChange={(value: 'approved' | 'rejected') =>
                                        reviewForm.setData('status', value)
                                    }
                                    disabled={selectedAppeal.status !== 'pending'}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">
                                            <div className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-600" />
                                                Approve
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            <div className="flex items-center gap-2">
                                                <X className="h-4 w-4 text-red-600" />
                                                Reject
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={reviewForm.errors.status} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="decision_notes">
                                    Decision Notes (Optional)
                                </Label>
                                <Textarea
                                    id="decision_notes"
                                    rows={4}
                                    placeholder="Add any notes about your decision..."
                                    value={reviewForm.data.decision_notes}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'decision_notes',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={2000}
                                />
                                <InputError
                                    message={reviewForm.errors.decision_notes}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsReviewModalOpen(false);
                                        setSelectedAppeal(null);
                                        reviewForm.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        reviewForm.processing ||
                                        selectedAppeal.status !== 'pending'
                                    }
                                >
                                    {reviewForm.processing && 'Processing...'}
                                    {!reviewForm.processing && 'Submit Review'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

