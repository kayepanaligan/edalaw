import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Users, MoreVertical, Plus, Search, Trash2, Edit, ArrowRightLeft, User } from 'lucide-react';
import { useMemo, useState } from 'react';

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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Inmate Management',
        href: '/jail-officer/inmates',
    },
];

type Cell = {
    id: number;
    cell_number: string;
    capacity: number;
};

type Inmate = {
    id: number;
    cell_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    inmate_number: string;
    date_of_birth: string | null;
    status: 'active' | 'inactive' | 'released';
    cell: Cell;
    created_at: string;
};

type Props = {
    inmates: {
        data: Inmate[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    cells: Cell[];
    filters: {
        search: string;
        cell_id: number | null;
        status: string;
    };
};

function getStatusBadge(status: string) {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        active: { variant: 'default', label: 'Active' },
        inactive: { variant: 'secondary', label: 'Inactive' },
        released: { variant: 'outline', label: 'Released' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function InmateManagement({ inmates, cells, filters }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [cellFilter, setCellFilter] = useState<string>(filters.cell_id ? String(filters.cell_id) : 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null);

    // Forms
    const createForm = useForm({
        cell_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        inmate_number: '',
        date_of_birth: '',
        status: 'active',
    });

    const editForm = useForm({
        cell_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        inmate_number: '',
        date_of_birth: '',
        status: 'active',
    });

    const deleteForm = useForm({});

    const transferForm = useForm({
        cell_id: '',
    });

    const handleSearch = () => {
        router.get(
            '/jail-officer/inmates',
            { search: searchQuery, cell_id: cellFilter !== 'all' ? cellFilter : '', status: statusFilter },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/jail-officer/inmates', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInmate) return;
        editForm.put(`/jail-officer/inmates/${selectedInmate.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedInmate(null);
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInmate) return;
        deleteForm.delete(`/jail-officer/inmates/${selectedInmate.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedInmate(null);
            },
        });
    };

    const handleTransferSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInmate) return;
        transferForm.post(`/jail-officer/inmates/${selectedInmate.id}/transfer`, {
            onSuccess: () => {
                setIsTransferModalOpen(false);
                setSelectedInmate(null);
                transferForm.reset();
            },
        });
    };

    const openEditModal = (inmate: Inmate) => {
        setSelectedInmate(inmate);
        editForm.setData({
            cell_id: String(inmate.cell_id),
            first_name: inmate.first_name,
            middle_name: inmate.middle_name ?? '',
            last_name: inmate.last_name,
            inmate_number: inmate.inmate_number,
            date_of_birth: inmate.date_of_birth ?? '',
            status: inmate.status,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (inmate: Inmate) => {
        setSelectedInmate(inmate);
        setIsDeleteModalOpen(true);
    };

    const openTransferModal = (inmate: Inmate) => {
        setSelectedInmate(inmate);
        transferForm.setData({ cell_id: '' });
        setIsTransferModalOpen(true);
    };

    const columns: ColumnDef<Inmate>[] = useMemo(
        () => [
            {
                accessorKey: 'inmate_number',
                header: 'Inmate Number',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{row.original.inmate_number}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => {
                    const inmate = row.original;
                    const fullName = `${inmate.first_name} ${inmate.middle_name ? inmate.middle_name + ' ' : ''}${inmate.last_name}`;
                    return <span>{fullName}</span>;
                },
            },
            {
                accessorKey: 'cell',
                header: 'Cell',
                cell: ({ row }) => (
                    <Badge variant="outline">{row.original.cell.cell_number}</Badge>
                ),
            },
            {
                accessorKey: 'date_of_birth',
                header: 'Date of Birth',
                cell: ({ row }) => (
                    <span>{row.original.date_of_birth || '—'}</span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => getStatusBadge(row.original.status),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const inmate = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditModal(inmate)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openTransferModal(inmate)}>
                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                    Transfer Cell
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => openDeleteModal(inmate)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inmate Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Inmate Management</h1>
                        <p className="text-muted-foreground">
                            Manage inmates and their cell assignments
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Inmate
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md bg-green-500/10 p-4 text-green-600">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                        {flash.error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Inmates</CardTitle>
                        <CardDescription>
                            View and manage all inmates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search inmates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select
                                value={cellFilter}
                                onValueChange={(value) => {
                                    setCellFilter(value);
                                    router.get(
                                        '/jail-officer/inmates',
                                        { search: searchQuery, cell_id: value !== 'all' ? value : '', status: statusFilter },
                                        { preserveState: true, preserveScroll: true }
                                    );
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by cell" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cells</SelectItem>
                                    {cells.map((cell) => (
                                        <SelectItem key={cell.id} value={String(cell.id)}>
                                            {cell.cell_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    router.get(
                                        '/jail-officer/inmates',
                                        { search: searchQuery, cell_id: cellFilter !== 'all' ? cellFilter : '', status: value },
                                        { preserveState: true, preserveScroll: true }
                                    );
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="released">Released</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            columns={columns}
                            data={inmates.data}
                            enableGlobalFilter={false}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New Inmate</DialogTitle>
                        <DialogDescription>
                            Create a new inmate record
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="cell_id">Cell</Label>
                                <Select
                                    value={createForm.data.cell_id}
                                    onValueChange={(value) => createForm.setData('cell_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a cell" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cells.map((cell) => (
                                            <SelectItem key={cell.id} value={String(cell.id)}>
                                                {cell.cell_number} (Capacity: {cell.capacity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.cell_id && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.cell_id}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={createForm.data.first_name}
                                        onChange={(e) => createForm.setData('first_name', e.target.value)}
                                    />
                                    {createForm.errors.first_name && (
                                        <p className="text-sm text-destructive mt-1">{createForm.errors.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={createForm.data.last_name}
                                        onChange={(e) => createForm.setData('last_name', e.target.value)}
                                    />
                                    {createForm.errors.last_name && (
                                        <p className="text-sm text-destructive mt-1">{createForm.errors.last_name}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                                <Input
                                    id="middle_name"
                                    value={createForm.data.middle_name}
                                    onChange={(e) => createForm.setData('middle_name', e.target.value)}
                                />
                                {createForm.errors.middle_name && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.middle_name}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="inmate_number">Inmate Number</Label>
                                <Input
                                    id="inmate_number"
                                    value={createForm.data.inmate_number}
                                    onChange={(e) => createForm.setData('inmate_number', e.target.value)}
                                    placeholder="e.g., INM-2024-001"
                                />
                                {createForm.errors.inmate_number && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.inmate_number}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="date_of_birth">Date of Birth (Optional)</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={createForm.data.date_of_birth}
                                    onChange={(e) => createForm.setData('date_of_birth', e.target.value)}
                                />
                                {createForm.errors.date_of_birth && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.date_of_birth}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(value) => createForm.setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="released">Released</SelectItem>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.status && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.status}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create Inmate
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Inmate</DialogTitle>
                        <DialogDescription>
                            Update inmate details
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit_cell_id">Cell</Label>
                                <Select
                                    value={editForm.data.cell_id}
                                    onValueChange={(value) => editForm.setData('cell_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a cell" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cells.map((cell) => (
                                            <SelectItem key={cell.id} value={String(cell.id)}>
                                                {cell.cell_number} (Capacity: {cell.capacity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.cell_id && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.cell_id}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit_first_name">First Name</Label>
                                    <Input
                                        id="edit_first_name"
                                        value={editForm.data.first_name}
                                        onChange={(e) => editForm.setData('first_name', e.target.value)}
                                    />
                                    {editForm.errors.first_name && (
                                        <p className="text-sm text-destructive mt-1">{editForm.errors.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit_last_name">Last Name</Label>
                                    <Input
                                        id="edit_last_name"
                                        value={editForm.data.last_name}
                                        onChange={(e) => editForm.setData('last_name', e.target.value)}
                                    />
                                    {editForm.errors.last_name && (
                                        <p className="text-sm text-destructive mt-1">{editForm.errors.last_name}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit_middle_name">Middle Name (Optional)</Label>
                                <Input
                                    id="edit_middle_name"
                                    value={editForm.data.middle_name}
                                    onChange={(e) => editForm.setData('middle_name', e.target.value)}
                                />
                                {editForm.errors.middle_name && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.middle_name}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="edit_inmate_number">Inmate Number</Label>
                                <Input
                                    id="edit_inmate_number"
                                    value={editForm.data.inmate_number}
                                    onChange={(e) => editForm.setData('inmate_number', e.target.value)}
                                />
                                {editForm.errors.inmate_number && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.inmate_number}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="edit_date_of_birth">Date of Birth (Optional)</Label>
                                <Input
                                    id="edit_date_of_birth"
                                    type="date"
                                    value={editForm.data.date_of_birth}
                                    onChange={(e) => editForm.setData('date_of_birth', e.target.value)}
                                />
                                {editForm.errors.date_of_birth && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.date_of_birth}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="edit_status">Status</Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(value) => editForm.setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="released">Released</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.status && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.status}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update Inmate
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Transfer Modal */}
            <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Inmate</DialogTitle>
                        <DialogDescription>
                            Transfer {selectedInmate && `${selectedInmate.first_name} ${selectedInmate.last_name}`} to a different cell
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleTransferSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Current Cell</Label>
                                <div className="mt-1 p-2 bg-muted rounded-md">
                                    {selectedInmate?.cell.cell_number}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="transfer_cell_id">New Cell</Label>
                                <Select
                                    value={transferForm.data.cell_id}
                                    onValueChange={(value) => transferForm.setData('cell_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a cell" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cells
                                            .filter((cell) => cell.id !== selectedInmate?.cell_id)
                                            .map((cell) => (
                                                <SelectItem key={cell.id} value={String(cell.id)}>
                                                    {cell.cell_number} (Capacity: {cell.capacity})
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {transferForm.errors.cell_id && (
                                    <p className="text-sm text-destructive mt-1">{transferForm.errors.cell_id}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsTransferModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={transferForm.processing}>
                                Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Inmate</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedInmate && `${selectedInmate.first_name} ${selectedInmate.last_name}`}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDeleteSubmit}>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={deleteForm.processing}>
                                Delete Inmate
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
