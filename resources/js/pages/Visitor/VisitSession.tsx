import { Head } from '@inertiajs/react';
import { Video } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

type Props = {
    session: {
        id: number;
        room_id: string;
        token: string;
        participant_id: string;
        session_type: string;
        inmate_name: string;
    };
};

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function VisitSession({ session }: Props) {
    const [joining, setJoining] = useState(false);

    const videoSdkUrl = `https://app.videosdk.live/meetings/${session.room_id}?token=${encodeURIComponent(session.token)}`;

    useEffect(() => {
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
    }, [session.id, session.participant_id]);

    const handleJoin = () => {
        setJoining(true);
        window.location.href = videoSdkUrl;
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
                <Button size="lg" onClick={handleJoin} disabled={joining} className="w-full">
                    {joining ? 'Opening...' : 'Join Call'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                    You will be redirected to the video call. The call is monitored and recorded.
                </p>
            </div>
        </AppLayout>
    );
}
