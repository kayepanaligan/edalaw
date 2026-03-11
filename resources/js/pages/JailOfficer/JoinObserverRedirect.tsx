import { Head } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

type Props = {
    join_url: string;
};

export default function JoinObserverRedirect({ join_url }: Props) {
    const [joining, setJoining] = useState(false);

    const handleJoin = () => {
        setJoining(true);
        window.location.href = join_url;
    };

    return (
        <AppLayout>
            <Head title="Join as observer" />
            <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <Eye className="h-16 w-16 text-primary" />
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Join as observer</h1>
                    <p className="text-sm text-muted-foreground">
                        You will join the video call in view-only mode (no camera or microphone).
                    </p>
                </div>
                <Button size="lg" onClick={handleJoin} disabled={joining} className="w-full">
                    {joining ? 'Opening...' : 'Join call'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                    If the video call asks you to log in or does not open, the meeting may have expired or the room may
                    be unavailable. A console error from aplo-evnt.com is from a third-party service and can be ignored.
                </p>
            </div>
        </AppLayout>
    );
}
