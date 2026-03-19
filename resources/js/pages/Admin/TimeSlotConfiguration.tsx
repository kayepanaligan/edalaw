import { Head, router, useForm } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Clock, Settings, Save, Sunrise, Sunset } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/data-table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Time Slot Capacity',
        href: '/admin/time-slot-capacities',
    },
];

type TimeSlotCapacity = {
    id: number | null;
    time_slot: string;
    visit_type: 'physical' | 'virtual';
    max_capacity: number;
    start_time?: string;
    end_time?: string;
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

export default function TimeSlotConfiguration({ capacities }: Props) {
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const [editingCapacity, setEditingCapacity] = useState<TimeSlotCapacity | null>(null);
    const [capacityValue, setCapacityValue] = useState<string>('');
    
    // Get unique visit types from capacities
    const virtualCap = capacities.find((cap) => cap.visit_type === 'virtual');
    const physicalCap = capacities.find((cap) => cap.visit_type === 'physical');
    
    // State for operating hours by visit type
    const [virtualStartTime, setVirtualStartTime] = useState<string>(virtualCap?.start_time ?? '07:00');
    const [virtualEndTime, setVirtualEndTime] = useState<string>(virtualCap?.end_time ?? '22:00');
    const [physicalStartTime, setPhysicalStartTime] = useState<string>(physicalCap?.start_time ?? '07:00');
    const [physicalEndTime, setPhysicalEndTime] = useState<string>(physicalCap?.end_time ?? '18:00');

    const updateForm = useForm({
        time_slot: '',
        visit_type: 'physical' as 'physical' | 'virtual',
        max_capacity: 4,
    });

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

    const handleSaveOperatingHours = (visitType: 'virtual' | 'physical') => {
        const startTime = visitType === 'virtual' ? virtualStartTime : physicalStartTime;
        const endTime = visitType === 'virtual' ? virtualEndTime : physicalEndTime;
        
        router.put(`/admin/time-slot-capacities/operating-hours`, {
            visit_type: visitType,
            start_time: startTime,
            end_time: endTime,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Operating hours updated for ${visitType} visits`);
            },
            onError: () => {
                toast.error(`Failed to update operating hours for ${visitType} visits`);
            },
        });
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
                                <Save className="h-4 w-4" />
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
            <Head title="Time Slot Capacity Configuration" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Time Slot Capacity Configuration</h1>
                        <p className="text-muted-foreground">
                            Configure the maximum number of visitors allowed for each time slot
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Time Slot Capacities</CardTitle>
                        <CardDescription>
                            Configure operating hours and capacity for each visit type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Operating Hours Settings */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Virtual Visit Hours */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Sunrise className="h-5 w-5 text-blue-500" />
                                            Virtual Visit Hours
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="virtual-start" className="text-sm">Start:</Label>
                                            <Input
                                                id="virtual-start"
                                                type="time"
                                                value={virtualStartTime}
                                                onChange={(e) => setVirtualStartTime(e.target.value)}
                                                className="w-32"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="virtual-end" className="text-sm">End:</Label>
                                            <Input
                                                id="virtual-end"
                                                type="time"
                                                value={virtualEndTime}
                                                onChange={(e) => setVirtualEndTime(e.target.value)}
                                                className="w-32"
                                            />
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveOperatingHours('virtual')}
                                            className="w-full"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Virtual Hours
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Physical Visit Hours */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Sunset className="h-5 w-5 text-green-500" />
                                            Physical Visit Hours
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="physical-start" className="text-sm">Start:</Label>
                                            <Input
                                                id="physical-start"
                                                type="time"
                                                value={physicalStartTime}
                                                onChange={(e) => setPhysicalStartTime(e.target.value)}
                                                className="w-32"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="physical-end" className="text-sm">End:</Label>
                                            <Input
                                                id="physical-end"
                                                type="time"
                                                value={physicalEndTime}
                                                onChange={(e) => setPhysicalEndTime(e.target.value)}
                                                className="w-32"
                                            />
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveOperatingHours('physical')}
                                            className="w-full"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Physical Hours
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Visit Type Filter */}
                            <div className="flex items-center gap-4">
                                <Label>Filter by Visit Type:</Label>
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
                                    <TabsTrigger value="AM">
                                        AM ({virtualCap?.start_time ?? '07:00'} - {(() => {
                                            const endTime = visitTypeFilter === 'virtual' ? virtualEndTime : physicalEndTime;
                                            const [hours, minutes] = endTime.split(':').map(Number);
                                            if (hours < 12) return `${hours.toString().padStart(2, '0')}:${minutes}`;
                                            return '11:59';
                                        })()})
                                    </TabsTrigger>
                                    <TabsTrigger value="PM">
                                        PM ({(() => {
                                            const startTime = visitTypeFilter === 'virtual' ? virtualStartTime : physicalStartTime;
                                            const [hours, minutes] = startTime.split(':').map(Number);
                                            if (hours >= 12) return `${hours.toString().padStart(2, '0')}:${minutes}`;
                                            return '12:00';
                                        })()} - {visitTypeFilter === 'virtual' ? virtualEndTime : physicalEndTime})
                                    </TabsTrigger>
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

