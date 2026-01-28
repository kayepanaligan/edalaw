import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

type TimeSlot = {
    value: string; // HH:MM format (start time)
    label: string; // Display format (e.g., "7:00 AM - 7:10 AM")
    rangeLabel: string; // Full range display
    period: 'AM' | 'PM';
};

type TimeSlotPickerProps = {
    selectedTime?: string;
    bookedSlots?: string[];
    onTimeSelect: (time: string) => void;
    className?: string;
};

export function TimeSlotPicker({
    selectedTime,
    bookedSlots = [],
    onTimeSelect,
    className,
}: TimeSlotPickerProps) {
    // Generate time slots with 10-minute intervals
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        
        // Helper function to format time for display
        const formatTime = (hour: number, minute: number, period: 'AM' | 'PM'): string => {
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            const displayMinute = `:${minute.toString().padStart(2, '0')}`;
            return `${displayHour}${displayMinute} ${period}`;
        };
        
        // Helper function to calculate end time
        const getEndTime = (hour: number, minute: number): { hour: number; minute: number } => {
            let endMinute = minute + 10;
            let endHour = hour;
            if (endMinute >= 60) {
                endMinute = 0;
                endHour += 1;
            }
            return { hour: endHour, minute: endMinute };
        };
        
        // AM slots: 7:00 AM to 11:50 AM
        for (let hour = 7; hour < 12; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const startLabel = formatTime(hour, minute, 'AM');
                
                // Calculate end time
                const endTime = getEndTime(hour, minute);
                const endLabel = formatTime(endTime.hour, endTime.minute, endTime.hour < 12 ? 'AM' : 'PM');
                
                const rangeLabel = `${startLabel} - ${endLabel}`;
                
                slots.push({
                    value: time24,
                    label: rangeLabel,
                    rangeLabel: rangeLabel,
                    period: 'AM',
                });
            }
        }
        
        // PM slots: 12:00 PM to 5:50 PM
        for (let hour = 12; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const startLabel = formatTime(hour, minute, 'PM');
                
                // Calculate end time
                const endTime = getEndTime(hour, minute);
                const endLabel = formatTime(endTime.hour, endTime.minute, endTime.hour < 12 ? 'AM' : 'PM');
                
                const rangeLabel = `${startLabel} - ${endLabel}`;
                
                slots.push({
                    value: time24,
                    label: rangeLabel,
                    rangeLabel: rangeLabel,
                    period: 'PM',
                });
            }
        }
        
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const amSlots = timeSlots.filter((slot) => slot.period === 'AM');
    const pmSlots = timeSlots.filter((slot) => slot.period === 'PM');

    const isBooked = (time: string): boolean => {
        return bookedSlots.includes(time);
    };

    return (
        <div className={cn('space-y-4 border rounded-lg p-4 bg-card', className)}>
            <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" />
                Select Time Range (10-minute intervals)
            </div>
            <p className="text-xs text-muted-foreground">
                Each selection represents a 10-minute time range
            </p>
            
            <div className="grid grid-cols-2 gap-4">
                {/* AM Slots */}
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                        AM (7:00 AM - 11:50 AM)
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/30">
                        {amSlots.map((slot) => {
                            const isSelected = selectedTime === slot.value;
                            const isDisabled = isBooked(slot.value);
                            
                            return (
                                <Button
                                    key={slot.value}
                                    type="button"
                                    variant={isSelected ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={isDisabled}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            onTimeSelect(slot.value);
                                        }
                                    }}
                                    className={cn(
                                        'text-xs font-medium transition-all',
                                        isSelected && 'bg-primary text-primary-foreground shadow-md scale-105',
                                        isDisabled && 'opacity-40 cursor-not-allowed hover:opacity-40',
                                        !isDisabled && !isSelected && 'hover:bg-accent hover:scale-105 active:scale-95'
                                    )}
                                >
                                    {slot.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* PM Slots */}
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                        PM (12:00 PM - 5:50 PM)
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/30">
                        {pmSlots.map((slot) => {
                            const isSelected = selectedTime === slot.value;
                            const isDisabled = isBooked(slot.value);
                            
                            return (
                                <Button
                                    key={slot.value}
                                    type="button"
                                    variant={isSelected ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={isDisabled}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            onTimeSelect(slot.value);
                                        }
                                    }}
                                    className={cn(
                                        'text-xs font-medium transition-all',
                                        isSelected && 'bg-primary text-primary-foreground shadow-md scale-105',
                                        isDisabled && 'opacity-40 cursor-not-allowed hover:opacity-40',
                                        !isDisabled && !isSelected && 'hover:bg-accent hover:scale-105 active:scale-95'
                                    )}
                                >
                                    {slot.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {selectedTime && (
                <div className="text-sm font-medium text-primary border-t pt-3">
                    Selected Time Range: <span className="font-bold">{timeSlots.find(s => s.value === selectedTime)?.rangeLabel}</span>
                </div>
            )}
            
            {bookedSlots.length > 0 && (
                <p className="text-xs text-muted-foreground border-t pt-3">
                    ⚠️ {bookedSlots.length} time slot(s) are already booked and disabled.
                </p>
            )}
        </div>
    );
}

