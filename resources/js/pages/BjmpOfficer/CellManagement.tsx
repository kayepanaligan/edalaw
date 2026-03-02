import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building, MoreVertical, Plus, Search, Trash2, Edit, Users } from 'lucide-react';
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
        title: 'Cell Management',
        href: '/bjmp-officer/cells',
    },
];

type Cell = {
    id: number;
    cell_number: string;
    capacity: number;
    status: 'active' | 'inactive';
    inmates_count: number;
    created_at: string;
};

type Props = {
    cells: {
        data: Cell[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
    };
};

function getStatusBadge(status: string) {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
        active: { variant: 'default', label: 'Active' },
        inactive: { variant: 'secondary', label: 'Inactive' },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function CellManagement({ cells, filters }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    // Forms
    const createForm = useForm({
        cell_number: '',
        capacity: 4,
        status: 'active',
    });

    const editForm = useForm({
        cell_number: '',
        capacity: 4,
        status: 'active',
    });

    const deleteForm = useForm({});

    const handleSearch = () => {
        router.get(
            '/bjmp-officer/cells',
            { search: searchQuery, status: statusFilter },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/bjmp-officer/cells', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCell) return;
        editForm.put(`/bjmp-officer/cells/${selectedCell.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedCell(null);
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCell) return;
        deleteForm.delete(`/bjmp-officer/cells/${selectedCell.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedCell(null);
            },
        });
    };

    const openEditModal = (cell: Cell) => {
        setSelectedCell(cell);
        editForm.setData({
            cell_number: cell.cell_number,
            capacity: cell.capacity,
            status: cell.status,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (cell: Cell) => {
        setSelectedCell(cell);
        setIsDeleteModalOpen(true);
    };

    const columns: ColumnDef<Cell>[] = useMemo(
        () => [
            {
                accessorKey: 'cell_number',
                header: 'Cell Number',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{row.original.cell_number}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'capacity',
                header: 'Capacity',
                cell: ({ row }) => (
                    <span>{row.original.capacity} inmates</span>
                ),
            },
            {
                accessorKey: 'inmates_count',
                header: 'Current Inmates',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {row.original.inmates_count} / {row.original.capacity}
                        </span>
                    </div>
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
                    const cell = row.original;
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
                                <DropdownMenuItem onClick={() => openEditModal(cell)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => openDeleteModal(cell)}
                                    className="text-destructive"
                                    disabled={cell.inmates_count > 0}
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
            <Head title="Cell Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Cell Management</h1>
                        <p className="text-muted-foreground">
                            Manage prison cells and their capacity
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Cell
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
                        <CardTitle>Cells</CardTitle>
                        <CardDescription>
                            View and manage all prison cells
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex items-center gap-2 flex-1">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search cells..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    router.get(
                                        '/bjmp-officer/cells',
                                        { search: searchQuery, status: value },
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
                                </SelectContent>
                            </Select>
                        </div>

                        <DataTable
                            columns={columns}
                            data={cells.data}
                            enableGlobalFilter={false}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Cell</DialogTitle>
                        <DialogDescription>
                            Create a new prison cell
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="cell_number">Cell Number</Label>
                                <Input
                                    id="cell_number"
                                    value={createForm.data.cell_number}
                                    onChange={(e) => createForm.setData('cell_number', e.target.value)}
                                    placeholder="e.g., Cell 1, A-101"
                                />
                                {createForm.errors.cell_number && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.cell_number}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={createForm.data.capacity}
                                    onChange={(e) => createForm.setData('capacity', parseInt(e.target.value))}
                                />
                                {createForm.errors.capacity && (
                                    <p className="text-sm text-destructive mt-1">{createForm.errors.capacity}</p>
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
                                Create Cell
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Cell</DialogTitle>
                        <DialogDescription>
                            Update cell details
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit_cell_number">Cell Number</Label>
                                <Input
                                    id="edit_cell_number"
                                    value={editForm.data.cell_number}
                                    onChange={(e) => editForm.setData('cell_number', e.target.value)}
                                />
                                {editForm.errors.cell_number && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.cell_number}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="edit_capacity">Capacity</Label>
                                <Input
                                    id="edit_capacity"
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={editForm.data.capacity}
                                    onChange={(e) => editForm.setData('capacity', parseInt(e.target.value))}
                                />
                                {editForm.errors.capacity && (
                                    <p className="text-sm text-destructive mt-1">{editForm.errors.capacity}</p>
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
                                Update Cell
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Cell</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedCell?.cell_number}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCell && selectedCell.inmates_count > 0 && (
                        <div className="rounded-md bg-destructive/10 p-4 text-destructive text-sm">
                            This cell has {selectedCell.inmates_count} inmate(s). Please transfer all inmates before deleting.
                        </div>
                    )}
                    <form onSubmit={handleDeleteSubmit}>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={deleteForm.processing || (selectedCell?.inmates_count ?? 0) > 0}
                            >
                                Delete Cell
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
