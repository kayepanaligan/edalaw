import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const VIDEOSDK_PREBUILT_SCRIPT = 'https://sdk.videosdk.live/rtc-js-prebuilt/0.3.43/rtc-js-prebuilt.js';

type Props = {
    room_id: string;
    token: string;
    api_key: string;
    participant_name: string;
    is_observer?: boolean;
    branding_logo_url?: string | null;
    branding_name?: string | null;
};

declare global {
    interface Window {
        VideoSDKMeeting?: new () => { init: (config: Record<string, unknown>) => void };
    }
}

export default function VideoRoom({
    room_id,
    token,
    api_key,
    participant_name,
    is_observer,
    branding_logo_url,
    branding_name,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        if (!room_id || !token || !api_key) {
            setError('Missing room or token. Please use the join link again.');
            setLoading(false);
            return;
        }
        if (!containerRef.current) {
            setLoading(false);
            return;
        }

        function initMeeting() {
            if (!window.VideoSDKMeeting || !containerRef.current) {
                setLoading(false);
                return;
            }
            try {
                const meeting = new window.VideoSDKMeeting();
                meeting.init({
                    containerId: containerRef.current.id,
                    meetingId: room_id,
                    apiKey: api_key,
                    token,
                    name: participant_name,
                    micEnabled: is_observer ? false : true,
                    webcamEnabled: is_observer ? false : true,
                    participantCanToggleSelfWebcam: true,
                    participantCanToggleSelfMic: true,
                    chatEnabled: true,
                    screenShareEnabled: true,
                    // Security: do not show shareable meeting URL or name input.
                    joinWithoutUserInteraction: true,
                    joinScreen: { visible: false },
                    notificationSoundEnabled: false,
                    notificationAlertsEnabled: false,
                    ...(branding_logo_url &&
                        branding_name && {
                            branding: {
                                enabled: true,
                                logoURL: branding_logo_url,
                                name: branding_name,
                                poweredBy: false,
                            },
                        }),
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Failed to start video call.');
            }
            setLoading(false);
        }

        if (!armed) {
            setLoading(false);
            return;
        }

        const existing = document.querySelector(`script[src="${VIDEOSDK_PREBUILT_SCRIPT}"]`);
        if (existing) {
            initMeeting();
            return;
        }

        // Shim so the prebuilt script (which expects CommonJS `exports`) runs in the browser.
        const shim = document.createElement('script');
        shim.textContent = 'window.exports = {}; window.module = { exports: window.exports };';
        document.head.appendChild(shim);

        const script = document.createElement('script');
        script.src = VIDEOSDK_PREBUILT_SCRIPT;
        script.async = true;
        script.onload = () => {
            const exp = (window as unknown as { exports?: { VideoSDKMeeting?: unknown } }).exports;
            if (exp?.VideoSDKMeeting) {
                window.VideoSDKMeeting = exp.VideoSDKMeeting as typeof window.VideoSDKMeeting;
            }
            initMeeting();
        };
        script.onerror = () => {
            setError('Failed to load video call. Please refresh and try again.');
            setLoading(false);
        };
        document.head.appendChild(script);
    }, [armed, room_id, token, api_key, participant_name, is_observer, branding_logo_url, branding_name]);

    return (
        <>
            <Head title="Video Call" />
            <div className="fixed inset-0 z-0 flex h-full w-full flex-col bg-background">
                {!armed && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="w-full max-w-md space-y-4 rounded-2xl bg-black/20 p-6 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <img src="/logo.svg" alt="eDalaw" className="h-10 w-10" />
                                <div>
                                    <p className="text-lg font-semibold">{branding_name ?? 'eDalaw'}</p>
                                    <p className="text-sm text-white/80">Ready to enter your session</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/90">
                                For security, the meeting link is not shareable and your name is set automatically.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setError(null);
                                    setLoading(true);
                                    setArmed(true);
                                }}
                                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-white/95"
                            >
                                Enter call
                            </button>
                        </div>
                    </div>
                )}

                {loading && armed && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background" aria-hidden>
                        <p className="text-muted-foreground">Loading video call...</p>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background p-4">
                        <p className="text-destructive">{error}</p>
                    </div>
                )}
                <div
                    id="videosdk-meeting-container"
                    ref={containerRef}
                    className="fixed inset-0 z-0 h-full w-full min-h-full"
                    style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', minHeight: '100dvh' }}
                />
            </div>
        </>
    );
}
