import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { MessageSquare, MoreVertical, Eye, CheckCircle, Clock, XCircle, FileX } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
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
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin/index';
import type { BreadcrumbItem } from '@/types';

type Suggestion = {
    id: number;
    user_name: string;
    user_email: string;
    type: 'suggestion' | 'complaint';
    subject: string;
    message: string;
    status: 'pending' | 'reviewed' | 'in_progress' | 'resolved' | 'dismissed';
    admin_response: string | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
};

type Props = {
    suggestions: Suggestion[];
    stats: {
        total: number;
        pending: number;
        suggestions: number;
        complaints: number;
        resolved: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Suggestions Management',
        href: '/admin/suggestions',
    },
];

function getStatusBadge(status: string) {
    const badges: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string; label: string }> = {
        pending: {
            variant: 'secondary',
            className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
            label: 'Pending',
        },
        reviewed: {
            variant: 'default',
            className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            label: 'Reviewed',
        },
        in_progress: {
            variant: 'default',
            className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            label: 'In Progress',
        },
        resolved: {
            variant: 'default',
            className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
            label: 'Resolved',
        },
        dismissed: {
            variant: 'outline',
            className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
            label: 'Dismissed',
        },
    };

    const config = badges[status] || badges.pending;
    return (
        <Badge variant={config.variant} className={config.className}>
            {config.label}
        </Badge>
    );
}

export default function SuggestionManagement({ suggestions, stats }: Props) {
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const form = useForm({
        status: '',
        admin_response: '',
    });

    const filteredSuggestions = useMemo(() => {
        return suggestions.filter((suggestion) => {
            const matchesStatus = statusFilter === 'all' || suggestion.status === statusFilter;
            const matchesType = typeFilter === 'all' || suggestion.type === typeFilter;
            return matchesStatus && matchesType;
        });
    }, [suggestions, statusFilter, typeFilter]);

    const handleOpenModal = useCallback((suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        form.setData({
            status: suggestion.status,
            admin_response: suggestion.admin_response || '',
        });
        setIsModalOpen(true);
    }, [form]);

    const handleQuickStatusUpdate = useCallback((suggestion: Suggestion, newStatus: string) => {
        router.put(
            admin.suggestions.update({ suggestion: suggestion.id }).url,
            {
                status: newStatus,
                admin_response: suggestion.admin_response || '',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status updated successfully.');
                },
                onError: () => {
                    toast.error('Failed to update status.');
                },
            }
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSuggestion) {
            return;
        }

        form.put(admin.suggestions.update({ suggestion: selectedSuggestion.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Suggestion updated successfully.');
                setIsModalOpen(false);
                setSelectedSuggestion(null);
                form.reset();
            },
            onError: () => {
                toast.error('Failed to update suggestion.');
            },
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSuggestion(null);
        form.reset();
    };

    const columns: ColumnDef<Suggestion>[] = useMemo(
        () => [
            {
                accessorKey: 'user_name',
                header: 'User',
                cell: ({ row }) => {
                    const suggestion = row.original;
                    return (
                        <div>
                            <div className="font-medium">{suggestion.user_name}</div>
                            <div className="text-sm text-muted-foreground">
                                {suggestion.user_email}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({ row }) => (
                    <Badge variant="outline" className="capitalize">
                        {row.original.type}
                    </Badge>
                ),
            },
            {
                accessorKey: 'subject',
                header: 'Subject',
                cell: ({ row }) => (
                    <div className="max-w-[300px] truncate font-medium">
                        {row.original.subject}
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
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const suggestion = row.original;
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
                                <DropdownMenuItem onClick={() => handleOpenModal(suggestion)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Review & Respond
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Quick Status Update</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => handleQuickStatusUpdate(suggestion, 'pending')}
                                    disabled={suggestion.status === 'pending'}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Set to Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleQuickStatusUpdate(suggestion, 'reviewed')}
                                    disabled={suggestion.status === 'reviewed'}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Mark as Reviewed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleQuickStatusUpdate(suggestion, 'in_progress')}
                                    disabled={suggestion.status === 'in_progress'}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Set to In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleQuickStatusUpdate(suggestion, 'resolved')}
                                    disabled={suggestion.status === 'resolved'}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleQuickStatusUpdate(suggestion, 'dismissed')}
                                    disabled={suggestion.status === 'dismissed'}
                                >
                                    <FileX className="mr-2 h-4 w-4" />
                                    Dismiss
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [handleOpenModal, handleQuickStatusUpdate]
    );

    return ( 
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suggestions Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div> 
                        <h1 className="text-2xl font-semibold">Suggestions & Complaints Management</h1>
                        <p className="text-muted-foreground">
                            Review and manage visitor feedback and complaints
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.suggestions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.complaints}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Suggestions & Complaints</CardTitle>
                        <CardDescription>
                            {filteredSuggestions.length} of {suggestions.length} submission{suggestions.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredSuggestions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No suggestions or complaints found.</p>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredSuggestions}
                                searchKey="search"
                                searchPlaceholder="Search by user, subject, message..."
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
                                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                    <SelectItem value="dismissed">Dismissed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Label htmlFor="type-filter" className="sr-only">Type</Label>
                                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                                <SelectTrigger id="type-filter" className="w-[150px]">
                                                    <SelectValue placeholder="All Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    <SelectItem value="suggestion">Suggestion</SelectItem>
                                                    <SelectItem value="complaint">Complaint</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                }
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Review Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Review Suggestion/Complaint</DialogTitle>
                            <DialogDescription>
                                Review and respond to visitor feedback
                            </DialogDescription>
                        </DialogHeader>
                        {selectedSuggestion && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">User:</Label>
                                            <span className="text-sm">{selectedSuggestion.user_name}</span>
                                            <span className="text-sm text-muted-foreground">
                                                ({selectedSuggestion.user_email})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Type:</Label>
                                            <Badge variant="outline" className="capitalize">
                                                {selectedSuggestion.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-semibold">Subject:</Label>
                                            <span className="text-sm">{selectedSuggestion.subject}</span>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Message:</Label>
                                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                                {selectedSuggestion.message}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Submitted: {new Date(selectedSuggestion.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">
                                            Status <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={form.data.status}
                                            onValueChange={(value) => form.setData('status', value)}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                <SelectItem value="dismissed">Dismissed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="admin_response">Admin Response</Label>
                                        <Textarea
                                            id="admin_response"
                                            rows={4}
                                            value={form.data.admin_response}
                                            onChange={(e) => form.setData('admin_response', e.target.value)}
                                            placeholder="Provide a response to the visitor (optional)..."
                                        />
                                        <InputError message={form.errors.admin_response} />
                                    </div>
                                </div>
                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={handleModalClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        {form.processing ? 'Updating...' : 'Update'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

