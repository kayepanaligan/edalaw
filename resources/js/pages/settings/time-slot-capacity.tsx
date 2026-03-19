import { Head, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Clock, Settings, Timer, Hourglass, Sunrise, Sunset, Save } from 'lucide-react';
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
    duration_minutes: number;
    interval_minutes: number;
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

export default function TimeSlotCapacity({ capacities }: Props) {
    const [visitTypeFilter, setVisitTypeFilter] = useState<string>('all');
    const [editingCapacity, setEditingCapacity] = useState<TimeSlotCapacity | null>(null);
    const [capacityValue, setCapacityValue] = useState<string>('');

    // Get default duration, interval, and operating hours from capacities
    const getDefaultSettings = () => {
        const virtualCap = capacities.find((cap) => cap.visit_type === 'virtual');
        const physicalCap = capacities.find((cap) => cap.visit_type === 'physical');
        return {
            virtualDuration: virtualCap?.duration_minutes ?? 20,
            virtualInterval: virtualCap?.interval_minutes ?? 5,
            virtualStartTime: virtualCap?.start_time ?? '07:00',
            virtualEndTime: virtualCap?.end_time ?? '22:00',
            physicalDuration: physicalCap?.duration_minutes ?? 30,
            physicalInterval: physicalCap?.interval_minutes ?? 10,
            physicalStartTime: physicalCap?.start_time ?? '07:00',
            physicalEndTime: physicalCap?.end_time ?? '18:00',
        };
    };

    const defaults = getDefaultSettings();

    // Separate duration and interval for virtual and physical
    const [virtualDuration, setVirtualDuration] = useState<string>(defaults.virtualDuration.toString());
    const [virtualInterval, setVirtualInterval] = useState<string>(defaults.virtualInterval.toString());
    const [virtualStartTime, setVirtualStartTime] = useState<string>(defaults.virtualStartTime);
    const [virtualEndTime, setVirtualEndTime] = useState<string>(defaults.virtualEndTime);
    const [physicalDuration, setPhysicalDuration] = useState<string>(defaults.physicalDuration.toString());
    const [physicalInterval, setPhysicalInterval] = useState<string>(defaults.physicalInterval.toString());
    const [physicalStartTime, setPhysicalStartTime] = useState<string>(defaults.physicalStartTime);
    const [physicalEndTime, setPhysicalEndTime] = useState<string>(defaults.physicalEndTime);

    // Get current duration and interval based on visit type filter
    const getCurrentSettings = () => {
        if (visitTypeFilter === 'physical') {
            const duration = parseInt(physicalDuration, 10);
            const interval = parseInt(physicalInterval, 10);
            return {
                duration: isNaN(duration) ? 30 : duration,
                interval: isNaN(interval) ? 10 : interval,
            };
        }
        // Default to virtual for 'all' and 'virtual'
        const duration = parseInt(virtualDuration, 10);
        const interval = parseInt(virtualInterval, 10);
        return {
            duration: isNaN(duration) ? 20 : duration,
            interval: isNaN(interval) ? 5 : interval,
        };
    };

    // Generate time slots based on duration and interval
    const generatedTimeSlots = useMemo(() => {
        const { duration, interval } = getCurrentSettings();
        const slotInterval = duration + interval;

        const slots: string[] = [];
        
        // Parse start and end times based on visit type filter
        let startMinutes = 7 * 60; // Default 7:00 AM
        let endMinutes = 22 * 60;  // Default 10:00 PM
        
        if (visitTypeFilter === 'virtual') {
            const [startHour, startMinute] = virtualStartTime.split(':').map(Number);
            const [endHour, endMinute] = virtualEndTime.split(':').map(Number);
            startMinutes = startHour * 60 + startMinute;
            endMinutes = endHour * 60 + endMinute;
        } else if (visitTypeFilter === 'physical') {
            const [startHour, startMinute] = physicalStartTime.split(':').map(Number);
            const [endHour, endMinute] = physicalEndTime.split(':').map(Number);
            startMinutes = startHour * 60 + startMinute;
            endMinutes = endHour * 60 + endMinute;
        }

        let currentMinutes = startMinutes;

        while (currentMinutes < endMinutes) {
            const hours = Math.floor(currentMinutes / 60);
            const minutes = currentMinutes % 60;
            slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            currentMinutes += slotInterval;
        }

        return slots;
    }, [virtualDuration, virtualInterval, physicalDuration, physicalInterval, visitTypeFilter, virtualStartTime, virtualEndTime, physicalStartTime, physicalEndTime]);

    // Filter capacities by visit type and match with generated time slots
    const filteredCapacities = useMemo(() => {
        const { duration, interval } = getCurrentSettings();
        let filtered = capacities;
        if (visitTypeFilter !== 'all') {
            filtered = capacities.filter((cap) => cap.visit_type === visitTypeFilter);
        }

        // Map capacities to generated time slots
        return generatedTimeSlots.map((timeSlot) => {
            const existingCapacity = filtered.find((cap) => cap.time_slot === timeSlot);
            if (existingCapacity) {
                return existingCapacity;
            }
            // Return default capacity for new time slots
            return {
                id: null,
                time_slot: timeSlot,
                visit_type: (visitTypeFilter === 'all' ? 'virtual' : visitTypeFilter) as 'physical' | 'virtual',
                max_capacity: 4,
                duration_minutes: duration,
                interval_minutes: interval,
            };
        });
    }, [capacities, visitTypeFilter, generatedTimeSlots, virtualDuration, virtualInterval, physicalDuration, physicalInterval]);

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

        // Get duration and interval based on visit type
        const isPhysical = capacity.visit_type === 'physical';
        const duration = isPhysical ? parseInt(physicalDuration, 10) : parseInt(virtualDuration, 10);
        const interval = isPhysical ? parseInt(physicalInterval, 10) : parseInt(virtualInterval, 10);

        if (isNaN(duration) || duration < 1 || duration > 180) {
            toast.error('Duration must be between 1 and 180 minutes');
            return;
        }

        if (isNaN(interval) || interval < 0 || interval > 60) {
            toast.error('Interval must be between 0 and 60 minutes');
            return;
        }

        if (capacity.id) {
            // Update existing
            router.put(`/admin/time-slot-capacities/${capacity.id}`, {
                max_capacity: newCapacity,
                duration_minutes: duration,
                interval_minutes: interval,
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
                duration_minutes: duration,
                interval_minutes: interval,
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
        
        router.post(`/admin/time-slot-capacities/operating-hours`, {
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

    // Save duration and interval settings for all time slots of a visit type
    const handleSaveSettings = (visitType: 'virtual' | 'physical') => {
        const duration = visitType === 'virtual' ? parseInt(virtualDuration, 10) : parseInt(physicalDuration, 10);
        const interval = visitType === 'virtual' ? parseInt(virtualInterval, 10) : parseInt(physicalInterval, 10);

        if (isNaN(duration) || duration < 1 || duration > 180) {
            toast.error('Duration must be between 1 and 180 minutes');
            return;
        }

        if (isNaN(interval) || interval < 0 || interval > 60) {
            toast.error('Interval must be between 0 and 60 minutes');
            return;
        }

        router.post('/admin/time-slot-capacities/update-settings', {
            visit_type: visitType,
            duration_minutes: duration,
            interval_minutes: interval,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${visitType === 'virtual' ? 'Virtual' : 'Physical'} settings saved successfully`);
            },
            onError: () => {
                toast.error('Failed to save settings');
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
                                className="w-20"
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

                    {/* Operating Hours Settings */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Virtual Visit Hours */}
                        <div className="rounded-lg border bg-card p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sunrise className="h-5 w-5 text-blue-500" />
                                <h3 className="font-semibold">Virtual Visit Hours</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium w-16">Start:</label>
                                <Input
                                    type="time"
                                    value={virtualStartTime}
                                    onChange={(e) => setVirtualStartTime(e.target.value)}
                                    className="w-32"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium w-16">End:</label>
                                <Input
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
                        </div>

                        {/* Physical Visit Hours */}
                        <div className="rounded-lg border bg-card p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sunset className="h-5 w-5 text-green-500" />
                                <h3 className="font-semibold">Physical Visit Hours</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium w-16">Start:</label>
                                <Input
                                    type="time"
                                    value={physicalStartTime}
                                    onChange={(e) => setPhysicalStartTime(e.target.value)}
                                    className="w-32"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium w-16">End:</label>
                                <Input
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
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Filter by Visit Type:</label>
                                <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="physical">Physical</SelectItem>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {visitTypeFilter === 'virtual' && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-500">Virtual</Badge>
                                        <Timer className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium">Duration:</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="180"
                                            value={virtualDuration}
                                            onChange={(e) => setVirtualDuration(e.target.value)}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-muted-foreground">min</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hourglass className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium">Interval:</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={virtualInterval}
                                            onChange={(e) => setVirtualInterval(e.target.value)}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-muted-foreground">min</span>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveSettings('virtual')}
                                        >
                                            Save Virtual
                                        </Button>
                                    </div>
                                </>
                            )}
                            {visitTypeFilter === 'physical' && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-green-500">Physical</Badge>
                                        <Timer className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium">Duration:</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="180"
                                            value={physicalDuration}
                                            onChange={(e) => setPhysicalDuration(e.target.value)}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-muted-foreground">min</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hourglass className="h-4 w-4 text-muted-foreground" />
                                        <label className="text-sm font-medium">Interval:</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={physicalInterval}
                                            onChange={(e) => setPhysicalInterval(e.target.value)}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-muted-foreground">min</span>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveSettings('physical')}
                                        >
                                            Save Physical
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        <Tabs defaultValue="AM" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="AM">
                                    AM ({visitTypeFilter === 'virtual' ? virtualStartTime : physicalStartTime} - {(() => {
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
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

