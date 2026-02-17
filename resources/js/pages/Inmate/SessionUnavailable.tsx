import { Head, Link } from '@inertiajs/react';
import { CalendarClock, Info } from 'lucide-react';

type Props = {
    message: string;
    title?: string;
    schedule_window?: string;
    time_until_active?: string | null;
};

export default function SessionUnavailable({ message, title = 'Not available', schedule_window, time_until_active }: Props) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
                <div
                    className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Info className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-lg font-medium">{title}</h1>
                            <p className="text-sm text-muted-foreground">{message}</p>
                            {schedule_window && (
                                <div className="flex items-center justify-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                                    <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="font-medium">Scheduled:</span>
                                    <span>{schedule_window}</span>
                                </div>
                            )}
                            {time_until_active && (
                                <p className="text-sm text-muted-foreground">
                                    This link will be active in <span className="font-medium text-foreground">{time_until_active}</span>.
                                </p>
                            )}
                        </div>
                        <Link
                            href="/inmate-tunnel"
                            className="text-sm text-primary hover:underline"
                        >
                            Try another link
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
