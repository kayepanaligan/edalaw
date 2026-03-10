import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Clock, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Time Slot Capacity',
        href: '/settings/time-slot-capacity',
    },
];

type TimeSlotCapacity = {
    id: number | null;
    time_slot: string;
    visit_type: 'physical' | 'virtual';
    max_capacity: number;
};

type Props = {
    capacities: TimeSlotCapacity[];
};

function getVisitTypeBadge(visitType: string) {
    if (visitType === 'virtual') {
        return (
            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                Virtual
            </Badge>
        );
    }
    return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Physical
        </Badge>
    );
}

function formatTimeSlot(timeSlot: string): string {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default function TimeSlotCapacity({ capacities }: Props) {
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const [editingCapacity, setEditingCapacity] = useState<TimeSlotCapacity | null>(null);
    const [capacityValue, setCapacityValue] = useState<string>('');

    // Filter capacities by visit type
    const filteredCapacities = useMemo(() => {
        if (visitTypeFilter === 'all') {
            return capacities;
        }
        return capacities.filter((cap) => cap.visit_type === visitTypeFilter);
    }, [capacities, visitTypeFilter]);

    // Group by AM/PM
    const amSlots = filteredCapacities.filter((cap) => {
        const [hours] = cap.time_slot.split(':').map(Number);
        return hours < 12;
    });

    const pmSlots = filteredCapacities.filter((cap) => {
        const [hours] = cap.time_slot.split(':').map(Number);
        return hours >= 12;
    });

    const handleEdit = (capacity: TimeSlotCapacity) => {
        setEditingCapacity(capacity);
        setCapacityValue(capacity.max_capacity.toString());
    };

    const handleSave = (capacity: TimeSlotCapacity) => {
        const newCapacity = parseInt(capacityValue, 10);
        
        if (isNaN(newCapacity) || newCapacity < 1 || newCapacity > 100) {
            toast.error('Capacity must be between 1 and 100');
            return;
        }

        if (capacity.id) {
            // Update existing
            router.put(`/admin/time-slot-capacities/${capacity.id}`, {
                max_capacity: newCapacity,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Capacity updated successfully');
                    setEditingCapacity(null);
                    setCapacityValue('');
                },
                onError: () => {
                    toast.error('Failed to update capacity');
                },
            });
        } else {
            // Create new
            router.post('/admin/time-slot-capacities/update', {
                time_slot: capacity.time_slot,
                visit_type: capacity.visit_type,
                max_capacity: newCapacity,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Capacity updated successfully');
                    setEditingCapacity(null);
                    setCapacityValue('');
                },
                onError: () => {
                    toast.error('Failed to update capacity');
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingCapacity(null);
        setCapacityValue('');
    };

    const columns: ColumnDef<TimeSlotCapacity>[] = useMemo(() => [
        {
            accessorKey: 'time_slot',
            header: 'Time Slot',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatTimeSlot(row.original.time_slot)}</span>
                    <span className="text-sm text-muted-foreground">({row.original.time_slot})</span>
                </div>
            ),
        },
        {
            accessorKey: 'visit_type',
            header: 'Visit Type',
            cell: ({ row }) => getVisitTypeBadge(row.original.visit_type),
        },
        {
            accessorKey: 'max_capacity',
            header: 'Max Capacity',
            cell: ({ row }) => {
                const capacity = row.original;
                const isEditing = editingCapacity?.id === capacity.id && 
                                 editingCapacity?.visit_type === capacity.visit_type &&
                                 editingCapacity?.time_slot === capacity.time_slot;

                if (isEditing) {
                    return (
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="1"
                                max="100"
                                value={capacityValue}
                                onChange={(e) => setCapacityValue(e.target.value)}
                                className="w-24"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                onClick={() => handleSave(capacity)}
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    );
                }

                return (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{capacity.max_capacity}</span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(capacity)}
                        >
                            Edit
                        </Button>
                    </div>
                );
            },
        },
    ], [editingCapacity, capacityValue]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Slot Capacity" />
            <h1 className="sr-only">Time Slot Capacity Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Time Slot Capacity"
                        description="Configure the maximum number of visitors allowed for each time slot. Default capacity is 4 visitors per slot."
                    />

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Filter by Visit Type:</label>
                            <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="physical">Physical</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Tabs defaultValue="AM" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="AM">AM (7:00 AM - 11:50 AM)</TabsTrigger>
                                <TabsTrigger value="PM">PM (12:00 PM - 5:50 PM)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="AM" className="mt-4">
                                <DataTable
                                    columns={columns}
                                    data={amSlots}
                                    enableGlobalFilter={false}
                                />
                            </TabsContent>

                            <TabsContent value="PM" className="mt-4">
                                <DataTable
                                    columns={columns}
                                    data={pmSlots}
                                    enableGlobalFilter={false}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

