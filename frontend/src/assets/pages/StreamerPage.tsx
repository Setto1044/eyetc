import CameraPreview from "../components/CameraPreview";
import StreamControls from "../components/StreamControls";
import JoinRequestPanel from"../components/JoinRequestPanel";
import ParticipatedViewerList from "../components/ParticipatedViewerList";

import { useState, useEffect } from "react";
import { useCamera } from "../hooks/useCamera"; 
import { useSocketHandler } from "../hooks/useSocketHandler";
import { useSignalMessageSender } from "../hooks/useSignalMessageSender";
import { useSignalMessageHandler } from "../hooks/useSignalMessageHandler";
import { useWebRTCStreamer } from "../hooks/useWebRTCStreamer";

import { setStreamerId } from "../utils/store/sessionStore";

export default function StreamerPage() {

  const { stream, startCamera, stopCamera } = useCamera();
  const { connectSocket } = useSocketHandler();
  const { registerStreamer, offerViewer } = useSignalMessageSender();
  const { createOfferForViewer, handleAnswer } = useWebRTCStreamer(stream);


  const [joinRequests, setJoinRequests] = useState<string[]>([]);
  const [participatedViewers, setParticipatedViewers] = useState<string[]>([]);


useSignalMessageHandler({

  onJoinRequest: (viewerId) => {
    setJoinRequests((prev) => [...prev, viewerId]);
  },

  onAnswer: handleAnswer,

  onCandidate: () => {}
});

  // mock streamer ID
  useEffect(() => {
    setStreamerId("test");
  }, []);

  const startStreaming = async() => {
    try {
      // 1. camera
      await startCamera();

      // 2. socket connect to signal server
      const socket = connectSocket();
      if(!socket) {
        console.error("❌ No Socket Exist");
        return
      }

      // 3. register streamer 
      if (socket.readyState === WebSocket.OPEN) {
        registerStreamer();
      } else {
        socket.addEventListener("open", registerStreamer, { once: true });
      }


    } catch(error) {
      console.error("❌ failed to start streaming", error);
    }
  }

  const acceptViewer = async (viewerId: string) => {
    setJoinRequests((prev) => prev.filter((id) => id !== viewerId));
    console.log("✅ accept viewer", viewerId);

    const offer =  await createOfferForViewer(viewerId);
    if (!offer) return;
    offerViewer(viewerId, offer);

    setParticipatedViewers((prev) => {
    if (prev.includes(viewerId)) return prev;
    return [...prev, viewerId];
  });

  };

  const rejectViewer = (viewerId: string) => {
    setJoinRequests((prev) => prev.filter((id) => id !== viewerId));
    console.log("✅ reject viewer", viewerId);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <h1>Streamer</h1>

      <StreamControls
        onStart={startStreaming}
        onStop={stopCamera}
      />

      <JoinRequestPanel
        requests={joinRequests}
        onAccept={acceptViewer}
        onReject={rejectViewer}
      />

      <ParticipatedViewerList viewers={participatedViewers} />

      <CameraPreview stream={stream} />
    </div>
  );
}