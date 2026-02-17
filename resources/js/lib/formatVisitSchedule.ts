/**
 * Single source of truth for displaying visit schedule date and time across all modules.
 * All visits use 1-hour slots. Times are shown in 12-hour format.
 */
export type VisitType = 'virtual' | 'physical';

export interface FormattedSchedule {
    dateLabel: string;
    timeLabel: string;
}

const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};

/** Format hour/minute as 12-hour string (e.g. "3:00 PM"). */
function to12hr(hours: number, minutes: number): string {
    const period = hours < 12 ? 'AM' : 'PM';
    const h = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
}

/**
 * Format scheduled_date + scheduled_time + visit_type into consistent date and time strings (12-hour format).
 */
export function formatVisitSchedule(
    scheduledDate: string,
    scheduledTime: string | null,
    _visitType: VisitType
): FormattedSchedule {
    const dateLabel = new Date(scheduledDate).toLocaleDateString('en-US', dateOptions);

    if (!scheduledTime) {
        return { dateLabel, timeLabel: '—' };
    }

    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const endH = hours + 1;
    const endM = minutes;
    const timeLabel = `${to12hr(hours, minutes)} – ${to12hr(endH, endM)}`;

    return { dateLabel, timeLabel };
}

/**
 * Format session scheduled_start and scheduled_end (ISO strings) into 12-hour time style.
 */
export function formatSessionSchedule(scheduledStart: string, scheduledEnd: string): FormattedSchedule {
    const start = new Date(scheduledStart);
    const end = new Date(scheduledEnd);
    const dateLabel = start.toLocaleDateString('en-US', dateOptions);
    const timeLabel = `${to12hr(start.getHours(), start.getMinutes())} – ${to12hr(end.getHours(), end.getMinutes())}`;
    return { dateLabel, timeLabel };
}

/**
 * Whether the visit's scheduled slot has ended (so video link should be disabled). 1-hour slots.
 */
export function isScheduleEnded(scheduledDate: string, scheduledTime: string | null, _visitType: VisitType): boolean {
    if (!scheduledTime) return true;
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const end = new Date(scheduledDate);
    end.setHours(hours + 1, minutes, 0, 0);
    return new Date() >= end;
}
