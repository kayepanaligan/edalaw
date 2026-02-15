import { Head } from '@inertiajs/react';
import { Phone } from 'lucide-react';
import { useState } from 'react';

type Props = {
    tunnel_token: string;
    session: {
        id: number;
        room_id: string;
        session_type: string;
    };
};

export default function JoinSession({ tunnel_token, session }: Props) {
    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const [token, setToken] = useState<{ token: string; room_id: string; participant_id: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async () => {
        setError(null);
        setJoining(true);
        try {
            const res = await fetch(`/inmate/join/${tunnel_token}/token`, { method: 'GET', headers: { Accept: 'application/json' } });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to join');
                setJoining(false);
                return;
            }
            setToken({ token: data.token, room_id: data.room_id, participant_id: data.participant_id });
            setJoined(true);
            const url = `https://app.videosdk.live/meetings/${data.room_id}?token=${encodeURIComponent(data.token)}`;
            window.location.href = url;
        } catch {
            setError('Failed to connect');
        }
        setJoining(false);
    };

    return (
        <>
            <Head title="Join Call" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
                <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
                    <h1 className="text-center text-lg font-semibold">Join Video Call</h1>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {session.session_type === 'visit' ? 'Visit' : 'E-Burol'} session
                    </p>
                    {error && (
                        <p className="mt-4 text-center text-sm text-destructive">{error}</p>
                    )}
                    <div className="mt-6 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleJoin}
                            disabled={joining}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            <Phone className="h-4 w-4" />
                            {joining ? 'Joining...' : 'Join Call'}
                        </button>
                        <p className="text-center text-xs text-muted-foreground">
                            This call is monitored and recorded.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
