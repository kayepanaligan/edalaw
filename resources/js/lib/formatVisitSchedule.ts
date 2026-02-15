/**
 * Single source of truth for displaying visit schedule date and time across all modules.
 * Virtual visits: 10-minute slot (e.g. 07:00 – 07:10).
 * Physical visits: 1-hour slot (e.g. 07:00 – 08:00).
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

/**
 * Format scheduled_date + scheduled_time + visit_type into consistent date and time strings.
 */
export function formatVisitSchedule(
    scheduledDate: string,
    scheduledTime: string | null,
    visitType: VisitType
): FormattedSchedule {
    const dateLabel = new Date(scheduledDate).toLocaleDateString('en-US', dateOptions);

    if (!scheduledTime) {
        return { dateLabel, timeLabel: '—' };
    }

    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const isVirtual = visitType === 'virtual';
    let endH: number;
    let endM: number;
    if (isVirtual) {
        endM = minutes + 10;
        endH = endM >= 60 ? hours + 1 : hours;
        endM = endM % 60;
    } else {
        endH = hours + 1;
        endM = minutes;
    }
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    const timeLabel = `${startTime} – ${endTime}`;

    return { dateLabel, timeLabel };
}

/**
 * Format session scheduled_start and scheduled_end (ISO strings) into the same date + time style.
 * Used when we only have session window (e.g. monitoring officer assigned sessions, e-burol).
 */
export function formatSessionSchedule(scheduledStart: string, scheduledEnd: string): FormattedSchedule {
    const start = new Date(scheduledStart);
    const end = new Date(scheduledEnd);
    const dateLabel = start.toLocaleDateString('en-US', dateOptions);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeLabel = `${pad(start.getHours())}:${pad(start.getMinutes())} – ${pad(end.getHours())}:${pad(end.getMinutes())}`;
    return { dateLabel, timeLabel };
}

/**
 * Whether the visit's scheduled slot has ended (so video link should be disabled).
 */
export function isScheduleEnded(scheduledDate: string, scheduledTime: string | null, visitType: VisitType): boolean {
    if (!scheduledTime) return true;
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const end = new Date(scheduledDate);
    end.setHours(hours, minutes, 0, 0);
    if (visitType === 'virtual') {
        end.setMinutes(end.getMinutes() + 10);
    } else {
        end.setHours(end.getHours() + 1);
    }
    return new Date() >= end;
}
