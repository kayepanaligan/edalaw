import { Head, router } from '@inertiajs/react';
import { Video } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

type ScheduleReminder = {
    scheduled_start: string;
    scheduled_end: string;
    scheduled_label: string;
    minutes_until_start: number;
    hours_until_start: number;
};

type Props = {
    session: {
        id: number;
        room_id: string;
        token: string | null;
        participant_id: string;
        session_type: string;
        inmate_name: string;
        schedule_reminder?: ScheduleReminder | null;
        can_join_now: boolean;
        join_url: string | null;
    };
};

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function formatTimeLeft(reminder: ScheduleReminder): string {
    if (reminder.hours_until_start > 0) {
        return `${reminder.hours_until_start} hour${reminder.hours_until_start !== 1 ? 's' : ''} and ${reminder.minutes_until_start % 60} minute${reminder.minutes_until_start % 60 !== 1 ? 's' : ''}`;
    }
    return `${reminder.minutes_until_start} minute${reminder.minutes_until_start !== 1 ? 's' : ''}`;
}

export default function VisitSession({ session }: Props) {
    const [joining, setJoining] = useState(false);
    const [reminderOpen, setReminderOpen] = useState(!!session.schedule_reminder);

    const videoSdkUrl = session.join_url ?? null;

    useEffect(() => {
        if (!session.can_join_now) return;
        fetch(`/visit/session/${session.id}/participant-joined`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ participant_id: session.participant_id }),
            credentials: 'same-origin',
        }).catch(() => {});
    }, [session.id, session.participant_id, session.can_join_now]);

    const handleJoin = () => {
        if (!videoSdkUrl) return;
        setJoining(true);
        window.location.href = videoSdkUrl;
    };

    const handleRefresh = () => {
        router.reload();
    };

    return (
        <AppLayout>
            <Head title="Join Video Call" />
            <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <Video className="h-16 w-16 text-primary" />
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Video Call</h1>
                    <p className="text-sm text-muted-foreground">
                        {session.session_type === 'visit' ? 'Visit' : 'E-Burol'} with {session.inmate_name}
                    </p>
                </div>
                {session.can_join_now && videoSdkUrl ? (
                    <Button size="lg" onClick={handleJoin} disabled={joining} className="w-full">
                        {joining ? 'Opening...' : 'Join Call'}
                    </Button>
                ) : session.schedule_reminder ? (
                    <div className="space-y-3 w-full">
                        <p className="text-sm text-muted-foreground text-center">
                            Join will be available at your scheduled time. You can stay on this page and refresh when ready.
                        </p>
                        <Button size="lg" variant="secondary" onClick={handleRefresh} className="w-full">
                            Refresh to check if it&apos;s time
                        </Button>
                    </div>
                ) : null}
                <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to the video call. The call is monitored and recorded.
                </p>
            </div>

            {session.schedule_reminder && (
                <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Session schedule</DialogTitle>
                            <DialogDescription>
                                Your session has not started yet. You can stay on this page and join when it&apos;s time.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-2">
                            <p className="text-sm font-medium">Scheduled: {session.schedule_reminder.scheduled_label}</p>
                            <p className="text-sm text-muted-foreground">
                                Time left: {formatTimeLeft(session.schedule_reminder)}
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setReminderOpen(false)}>
                                I&apos;ll wait
                            </Button>
                            <Button onClick={handleRefresh}>Refresh when it&apos;s time</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
