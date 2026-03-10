import { Head } from '@inertiajs/react';
import { Eye, Video } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

type Props = {
    join_url: string;
    session_id: number;
    inmate_name: string;
};

export default function JoinAsObserver({ join_url, inmate_name }: Props) {
    const [joining, setJoining] = useState(false);

    const handleJoin = () => {
        setJoining(true);
        window.location.href = join_url;
    };

    return (
        <AppLayout>
            <Head title="Join as Observer" />
            <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-6 rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Join as Observer</h1>
                    <p className="text-sm text-muted-foreground">
                        You will join the video call with <strong>{inmate_name}</strong> in view-only mode. Your camera and microphone will be off; you will not appear on screen.
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full"
                >
                    <Video className="mr-2 h-4 w-4" />
                    {joining ? 'Opening...' : 'Join call'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                    The call is recorded automatically. Chat is logged. You can flag messages and report incidents from the session tools.
                </p>
            </div>
        </AppLayout>
    );
}
