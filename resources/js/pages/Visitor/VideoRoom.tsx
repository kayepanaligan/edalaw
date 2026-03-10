import { Head } from '@inertiajs/react';
import {
    AudioPlayer,
    MeetingProvider,
    useMeeting,
    useParticipant,
    VideoPlayer,
} from '@videosdk.live/react-sdk';
import { useEffect, useRef, useState } from 'react';

const LOG_PREFIX = '[VideoRoom]';

/**
 * VideoRoom: single user-triggered SDK initialization only.
 * - We do NOT call /infra/v1/meetings/init-config; the SDK does internally when we pass token + meetingId to MeetingProvider.
 * - meetingId (room_id) must match the roomId used server-side when generating the JWT; backend sends both from the same session.
 */

type Props = {
    room_id: string;
    token: string;
    api_key: string;
    participant_name: string;
    participant_id?: string | null;
    is_observer?: boolean;
    branding_logo_url?: string | null;
    branding_name?: string | null;
};

/**
 * Validates meeting ID and token. Logs meetingId and token length for debugging (no secrets).
 * Returns error message or null if valid.
 */
function validateAndLogMeetingParams(meetingId: string, token: string): string | null {
    const trimmedId = meetingId?.trim();
    const trimmedToken = token?.trim();
    if (!trimmedId || trimmedId.length < 2) {
        return 'Missing or invalid meeting ID.';
    }
    if (!trimmedToken || trimmedToken.length < 10) {
        return 'Missing or invalid token.';
    }
    if (import.meta.env.DEV) {
        console.info(
            `${LOG_PREFIX} init params: meetingId=${trimmedId} length=${trimmedId.length} tokenLength=${trimmedToken.length}`
        );
    }
    return null;
}

/**
 * Child of MeetingProvider: runs join() exactly once after mount (useEffect []).
 * All meeting initialization is here so lifecycle is deterministic; no reliance on joinWithoutUserInteraction.
 */
function MeetingInitializer({
    meetingId,
    tokenForLog,
    brandingName,
    onLeave,
}: {
    meetingId: string;
    tokenForLog: string;
    brandingName: string | null;
    onLeave: () => void;
}) {
    const joinCalledRef = useRef(false);
    const [joined, setJoined] = useState(false);
    const [connectingTooLong, setConnectingTooLong] = useState(false);

    const { join, leave, participants } = useMeeting({
        onMeetingJoined: () => {
            console.info(`${LOG_PREFIX} onMeetingJoined — signaling/meeting joined successfully.`);
            setJoined(true);
        },
        onMeetingLeft: () => {
            console.info(`${LOG_PREFIX} onMeetingLeft — participant left.`);
            onLeave();
        },
        onConnectionOpen: () => {
            console.info(`${LOG_PREFIX} onConnectionOpen — WebSocket/signaling connected (expect wss in Network).`);
        },
        onConnetionClose: () => {
            console.warn(`${LOG_PREFIX} onConnectionClose — signaling closed.`);
        },
        onError: ({ code, message }: { code: string; message: string }) => {
            console.error(`${LOG_PREFIX} meeting error: code=${code} message=${message}`);
        },
    });

    // Single-execution join: exactly once after mount. Ref guards against double-invocation (e.g. if StrictMode is reintroduced).
    useEffect(() => {
        if (joinCalledRef.current) return;
        joinCalledRef.current = true;

        console.info(`${LOG_PREFIX} MEETING ID VALUE: ${meetingId}`);
        console.info(`${LOG_PREFIX} TOKEN VALUE: length=${tokenForLog?.length ?? 0} prefix=${(tokenForLog ?? '').slice(0, 24)}...`);
        console.info(`${LOG_PREFIX} JOIN CALLED (join() invoked once).`);
        join();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setConnectingTooLong(true), 25000);
        return () => clearTimeout(t);
    }, []);

    if (!joined) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-6">
                <p className="text-muted-foreground">Connecting…</p>
                <p className="text-sm text-blue-600">
                    Voice communication is disabled. Please use the chat feature to communicate.
                </p>
                {connectingTooLong && (
                    <p className="max-w-sm text-center text-sm text-muted-foreground">
                        Taking a while? The meeting may be unavailable, or your network may be blocking the connection.
                        Check the browser console (F12) for errors, try refreshing, or contact support.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col bg-background">
            <header className="flex shrink-0 items-center justify-between border-b px-4 py-2">
                <span className="font-medium">{brandingName ?? 'eDalaw'}</span>
                <span className="text-muted-foreground text-sm">Meeting: {meetingId}</span>
                <button
                    type="button"
                    onClick={() => leave()}
                    className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground hover:bg-destructive/90"
                >
                    Leave
                </button>
            </header>
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-auto p-4 md:grid-cols-2">
                {[...participants.keys()].map((participantId) => (
                    <ParticipantTile key={participantId} participantId={participantId} />
                ))}
            </div>
        </div>
    );
}

function ParticipantTile({ participantId }: { participantId: string }) {
    const { displayName, webcamOn, isLocal } = useParticipant(participantId);

    return (
        <div className="flex flex-col rounded-lg border bg-muted/30 p-2">
            <div className="flex items-center gap-2 pb-1">
                <span className="font-medium">{displayName || participantId}</span>
                {isLocal && <span className="text-muted-foreground text-xs">(You)</span>}
            </div>
            <div className="relative aspect-video min-h-[120px] rounded bg-black/80">
                {webcamOn ? (
                    <VideoPlayer
                        participantId={participantId}
                        type="video"
                        videoStyle={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        Camera off
                    </div>
                )}
            </div>
            {!isLocal && <AudioPlayer participantId={participantId} type="audio" />}
        </div>
    );
}

/**
 * VideoRoom: deterministic single-entry flow.
 * 1. Guard: do not mount MeetingProvider until token and meetingId are defined and validated.
 * 2. Join is called explicitly once inside MeetingProvider child (useEffect []), not via joinWithoutUserInteraction.
 */
export default function VideoRoom({
    room_id,
    token,
    api_key,
    participant_name,
    participant_id,
    is_observer,
    branding_logo_url,
    branding_name,
}: Props) {
    const [userRequestedJoin, setUserRequestedJoin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasInitializedRef = useRef(false);

    const meetingId = room_id?.trim() ?? '';
    const tokenTrimmed = token?.trim() ?? '';
    const hasValidProps = meetingId.length >= 2 && tokenTrimmed.length >= 10 && api_key?.trim().length > 0;

    const handleEnterCallClick = () => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        setError(null);
        const validationError = validateAndLogMeetingParams(meetingId, tokenTrimmed);
        if (validationError) {
            setError(validationError);
            hasInitializedRef.current = false;
            return;
        }

        if (!api_key?.trim()) {
            setError('Missing API key. Please use the join link again.');
            hasInitializedRef.current = false;
            return;
        }

        setUserRequestedJoin(true);
    };

    // Log init-config and other VideoSDK API calls when meeting is active (diagnostic).
    useEffect(() => {
        if (!userRequestedJoin) return;
        const originalFetch = window.fetch;
        window.fetch = function (...args: Parameters<typeof fetch>) {
            const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url ?? '';
            if (url.includes('videosdk.live') && url.includes('infra')) {
                return originalFetch.apply(this, args).then((res) => {
                    if (!res.ok) {
                        console.warn(`${LOG_PREFIX} API request failed: ${url} → ${res.status} ${res.statusText}`);
                    } else if (import.meta.env.DEV) {
                        console.info(`${LOG_PREFIX} API request ok: ${url} → ${res.status}`);
                    }
                    return res;
                });
            }
            return originalFetch.apply(this, args);
        };
        return () => {
            window.fetch = originalFetch;
        };
    }, [userRequestedJoin]);

    // Network/resource error logging when meeting is active (diagnostic only).
    useEffect(() => {
        if (!userRequestedJoin) return;
        const onError = (event: ErrorEvent) => {
            const target = event.target;
            if (target && target !== window && 'src' in target) {
                const src = (target as { src?: string }).src;
                if (src && (src.includes('videosdk') || src.includes('static.'))) {
                    console.warn(
                        `${LOG_PREFIX} resource load failed:`,
                        src,
                        event.message || 'unknown'
                    );
                }
            }
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            const err = event?.reason;
            const msg = err?.message ?? String(err);
            if (
                typeof msg === 'string' &&
                (msg.includes('WebSocket') ||
                    msg.includes('signaling') ||
                    msg.includes('connection') ||
                    msg.includes('101'))
            ) {
                console.warn(`${LOG_PREFIX} signaling/connection:`, err);
            }
        };
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, [userRequestedJoin]);

    // Guard: do not render MeetingProvider until token and meetingId are defined and validated.
    if (!hasValidProps) {
        return (
            <>
                <Head title="Video Call" />
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-6">
                    <p className="text-muted-foreground">Preparing…</p>
                    <p className="text-sm text-muted-foreground">
                        {!meetingId ? 'Missing meeting ID.' : !tokenTrimmed ? 'Missing token.' : 'Missing API key.'}
                    </p>
                </div>
            </>
        );
    }

    if (!userRequestedJoin) {
        return (
            <>
                <Head title="Video Call" />
                <div className="fixed inset-0 z-0 flex h-full w-full flex-col bg-background">
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                        <div className="w-full max-w-md space-y-4 rounded-2xl bg-black/20 p-6 backdrop-blur">
                            <div className="flex items-center gap-3">
                                {branding_logo_url && (
                                    <img
                                        src={branding_logo_url}
                                        alt=""
                                        className="h-10 w-10"
                                    />
                                )}
                                <div>
                                    <p className="text-lg font-semibold">{branding_name ?? 'eDalaw'}</p>
                                    <p className="text-sm text-white/80">Ready to enter your session</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/90">
                                For security, the meeting link is not shareable and your name is set automatically.
                            </p>
                            {error && (
                                <p className="text-sm text-red-200" role="alert">
                                    {error}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleEnterCallClick}
                                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-white/95"
                            >
                                Join call
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // MeetingProvider mounts only after user clicked Join and props are validated. Join is called inside child (MeetingInitializer) once.
    // For visitors and inmates: mic is disabled (chat-only communication), webcam can be enabled
    // For observers: both mic and webcam are disabled
    return (
        <>
            <Head title="Video Call" />
            <div className="fixed inset-0 z-0 flex h-full w-full flex-col bg-background">
                <MeetingProvider
                    config={{
                        meetingId,
                        micEnabled: false, // Always disable microphone - chat only communication
                        webcamEnabled: !is_observer, // Only visitors/inmates can enable webcam, not observers
                        name: participant_name,
                        mode: is_observer ? 'RECV_ONLY' : 'SEND_AND_RECV',
                        debugMode: import.meta.env.DEV,
                        ...(participant_id && { participantId: participant_id }),
                    }}
                    token={tokenTrimmed}
                    joinWithoutUserInteraction={false}
                >
                    <MeetingInitializer
                        meetingId={meetingId}
                        tokenForLog={tokenTrimmed}
                        brandingName={branding_name ?? null}
                        onLeave={() => setUserRequestedJoin(false)}
                    />
                </MeetingProvider>
            </div>
        </>
    );
}
