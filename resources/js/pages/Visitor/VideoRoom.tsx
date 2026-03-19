import { useEffect, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  VideoPlayer,
} from "@videosdk.live/react-sdk";

type Props = {
  room_id: string;
  token: string; // server-generated JWT
  participant_name: string;
  participant_id: string;
  is_observer?: boolean;
};

/* Participant tile */
function ParticipantTile({ participantId }: { participantId: string }) {
  const { displayName, webcamOn, isLocal } = useParticipant(participantId);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative aspect-video bg-black">
        {webcamOn ? (
          <VideoPlayer
            participantId={participantId}
            videoStyle={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/50">
            Camera Off
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          {displayName} {isLocal && "(You)"}
        </div>
      </div>
    </div>
  );
}

/* Meeting initializer */
function MeetingInitializer({ onLeave }: { onLeave: () => void }) {
  const joinCalled = useRef(false);
  const [joined, setJoined] = useState(false);
  const { join, leave, participants } = useMeeting({
    onMeetingJoined: () => setJoined(true),
    onMeetingLeft: () => onLeave(),
    onError: (error) => console.error("[VideoRoom] Meeting error:", error),
  });

  useEffect(() => {
    if (!joinCalled.current) {
      joinCalled.current = true;
      join();
    }
  }, [join]);

  if (!joined)
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-500">Connecting to secure session...</p>
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-4 py-2">
        <span className="font-semibold text-orange-600">eDalaw | Secure Video</span>
        <button
          onClick={leave}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          End Session
        </button>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        {[...participants.keys()].map((pid) => (
          <ParticipantTile key={pid} participantId={pid} />
        ))}
      </div>
    </div>
  );
}

/* Main VideoRoom */
export default function VideoRoom(props: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50">
      <MeetingProvider
        config={{
          meetingId: props.room_id,
          name: props.participant_name,
          participantId: props.participant_id,
          micEnabled: true,
          webcamEnabled: !props.is_observer,
        }}
        token={props.token} // <- use server JWT
      >
        <MeetingInitializer onLeave={() => (window.location.href = "/dashboard")} />
      </MeetingProvider>
    </div>
  );
}