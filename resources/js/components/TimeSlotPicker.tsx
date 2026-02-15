import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TimeSlot = {
    value: string; // HH:MM format (start time)
    label: string; // Display format (e.g., "7:00 AM - 7:10 AM")
    rangeLabel: string; // Full range display
    period: 'AM' | 'PM';
    currentBookings?: number;
    maxCapacity?: number;
    isFull?: boolean;
};

type TimeSlotPickerProps = {
    selectedTime?: string;
    bookedSlots?: string[];
    slotCapacities?: Record<string, { current: number; max: number; isFull: boolean }>;
    onTimeSelect: (time: string) => void;
    className?: string;
    visitType?: 'physical' | 'virtual';
};

export function TimeSlotPicker({
    selectedTime,
    bookedSlots = [],
    slotCapacities = {},
    onTimeSelect,
    className,
    visitType,
}: TimeSlotPickerProps) {
    const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');

    // Helper to format time for display
    const formatTime = (hour: number, minute: number, period: 'AM' | 'PM'): string => {
        const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        const displayMinute = `:${minute.toString().padStart(2, '0')}`;
        return `${displayHour}${displayMinute} ${period}`;
    };

    // Generate time slots: 10-minute intervals for virtual, hourly for physical
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        const isHourly = visitType === 'physical';

        if (isHourly) {
            // Physical: hourly slots 7:00–8:00, 8:00–9:00, … 17:00–18:00
            for (let hour = 7; hour < 18; hour++) {
                const time24 = `${hour.toString().padStart(2, '0')}:00`;
                const period: 'AM' | 'PM' = hour < 12 ? 'AM' : 'PM';
                const endHour = hour + 1;
                const endPeriod: 'AM' | 'PM' = endHour < 12 ? 'AM' : 'PM';
                const startLabel = formatTime(hour, 0, period);
                const endLabel = formatTime(endHour, 0, endPeriod);
                const rangeLabel = `${startLabel} - ${endLabel}`;
                const capacity = slotCapacities[time24] || { current: 0, max: 4, isFull: false };
                slots.push({
                    value: time24,
                    label: rangeLabel,
                    rangeLabel: rangeLabel,
                    period: hour < 12 ? 'AM' : 'PM',
                    currentBookings: capacity.current,
                    maxCapacity: capacity.max,
                    isFull: capacity.isFull,
                });
            }
            return slots;
        }

        // Virtual: 10-minute intervals
        const getEndTime = (hour: number, minute: number): { hour: number; minute: number } => {
            let endMinute = minute + 10;
            let endHour = hour;
            if (endMinute >= 60) {
                endMinute = 0;
                endHour += 1;
            }
            return { hour: endHour, minute: endMinute };
        };

        for (let hour = 7; hour < 12; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const startLabel = formatTime(hour, minute, 'AM');
                const endTime = getEndTime(hour, minute);
                const endLabel = formatTime(endTime.hour, endTime.minute, endTime.hour < 12 ? 'AM' : 'PM');
                const rangeLabel = `${startLabel} - ${endLabel}`;
                const capacity = slotCapacities[time24] || { current: 0, max: 4, isFull: false };
                slots.push({
                    value: time24,
                    label: rangeLabel,
                    rangeLabel: rangeLabel,
                    period: 'AM',
                    currentBookings: capacity.current,
                    maxCapacity: capacity.max,
                    isFull: capacity.isFull,
                });
            }
        }
        for (let hour = 12; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const startLabel = formatTime(hour, minute, 'PM');
                const endTime = getEndTime(hour, minute);
                const endLabel = formatTime(endTime.hour, endTime.minute, endTime.hour < 12 ? 'AM' : 'PM');
                const rangeLabel = `${startLabel} - ${endLabel}`;
                const capacity = slotCapacities[time24] || { current: 0, max: 4, isFull: false };
                slots.push({
                    value: time24,
                    label: rangeLabel,
                    rangeLabel: rangeLabel,
                    period: 'PM',
                    currentBookings: capacity.current,
                    maxCapacity: capacity.max,
                    isFull: capacity.isFull,
                });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const amSlots = timeSlots.filter((slot) => slot.period === 'AM');
    const pmSlots = timeSlots.filter((slot) => slot.period === 'PM');

    const isDisabled = (slot: TimeSlot): boolean => {
        return slot.isFull || false;
    };

    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.isFull) {
            return;
        }
        onTimeSelect(slot.value);
    };

    return (
        <div className={cn('space-y-4 border rounded-lg p-4 bg-card', className)}>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="size-4" />
                    Select Time Range
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-3">
                    <p className="text-xs text-blue-900 dark:text-blue-100 font-medium mb-1">
                        <AlertCircle className="size-3 inline mr-1" />
                        Important: You can only select one 10-minute time range per schedule.
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Each time slot represents exactly 10 minutes. Once a time slot reaches its maximum capacity, it will be unavailable for selection.
                    </p>
                </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'AM' | 'PM')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="AM">AM (7:00 AM - 11:50 AM)</TabsTrigger>
                    <TabsTrigger value="PM">PM (12:00 PM - 5:50 PM)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="AM" className="mt-4">
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/30">
                        {amSlots.map((slot) => {
                            const isSelected = selectedTime === slot.value;
                            const disabled = isDisabled(slot);
                            
                            return (
                                <div key={slot.value} className="relative">
                                    <Button
                                        type="button"
                                        variant={isSelected ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={disabled}
                                        onClick={() => handleSlotClick(slot)}
                                        className={cn(
                                            'w-full text-xs font-medium transition-all',
                                            isSelected && 'bg-primary text-primary-foreground shadow-md',
                                            disabled && 'opacity-40 cursor-not-allowed hover:opacity-40',
                                            !disabled && !isSelected && 'hover:bg-accent'
                                        )}
                                        title={disabled ? `This time slot is full` : `${slot.rangeLabel} — ${Math.max(0, (slot.maxCapacity ?? 0) - (slot.currentBookings ?? 0))}/${slot.maxCapacity} available`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span>{slot.label}</span>
                                            {slot.maxCapacity && (
                                                <span className={cn(
                                                    'text-[10px]',
                                                    slot.isFull ? 'text-destructive' : 'text-muted-foreground'
                                                )}>
                                                    {Math.max(0, (slot.maxCapacity ?? 0) - (slot.currentBookings ?? 0))}/{slot.maxCapacity} available
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                    {disabled && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-md pointer-events-none">
                                            <span className="text-[10px] font-medium text-destructive">Full</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
                
                <TabsContent value="PM" className="mt-4">
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/30">
                        {pmSlots.map((slot) => {
                            const isSelected = selectedTime === slot.value;
                            const disabled = isDisabled(slot);
                            
                            return (
                                <div key={slot.value} className="relative">
                                    <Button
                                        type="button"
                                        variant={isSelected ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={disabled}
                                        onClick={() => handleSlotClick(slot)}
                                        className={cn(
                                            'w-full text-xs font-medium transition-all',
                                            isSelected && 'bg-primary text-primary-foreground shadow-md',
                                            disabled && 'opacity-40 cursor-not-allowed hover:opacity-40',
                                            !disabled && !isSelected && 'hover:bg-accent'
                                        )}
                                        title={disabled ? `This time slot is full` : `${slot.rangeLabel} — ${Math.max(0, (slot.maxCapacity ?? 0) - (slot.currentBookings ?? 0))}/${slot.maxCapacity} available`}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span>{slot.label}</span>
                                            {slot.maxCapacity && (
                                                <span className={cn(
                                                    'text-[10px]',
                                                    slot.isFull ? 'text-destructive' : 'text-muted-foreground'
                                                )}>
                                                    {Math.max(0, (slot.maxCapacity ?? 0) - (slot.currentBookings ?? 0))}/{slot.maxCapacity} available
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                    {disabled && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-md pointer-events-none">
                                            <span className="text-[10px] font-medium text-destructive">Full</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
            
            {selectedTime && (
                <div className="text-sm font-medium text-primary border-t pt-3">
                    Selected Time Range: <span className="font-bold">{timeSlots.find(s => s.value === selectedTime)?.rangeLabel}</span>
                </div>
            )}
        </div>
    );
}
