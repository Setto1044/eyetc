import CameraPreview from "../components/CameraPreview";
import StreamControls from "../components/StreamControls";
import { useEffect } from "react";
import { useCamera } from "../hooks/UseCamera"
import { connectSignalServer, sendSignalMessage } from "../utils/signals/signalSocket";
import { SignalMessageType } from "../utils/signals/signalMessage";
import { setStreamerId, getStreamerId } from "../utils/store/sessionStore";


export default function StreamerPage() {

  useEffect(() => {
    setStreamerId("streamer-test-1");
  }, []);

  const { stream, startCamera, stopCamera } = useCamera();

  const handleStartStreaming = async () => {
    try {
      await startCamera();

      const socket = connectSignalServer();
      if (!socket) return;

      const streamerId = getStreamerId();
      

      const sendRegister = () => {
        sendSignalMessage({
          type: SignalMessageType.REGISTER_STREAMER,
          streamerId: streamerId
        });
      };
      
      if (socket.readyState === WebSocket.OPEN) {
        sendRegister();
      } else {
        socket.addEventListener("open", sendRegister, { once: true });
      }

    } catch (error) {
      console.error("failed to start streaming", error);
    }
  }

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
        onStart={handleStartStreaming}
        onStop={stopCamera}
      />

      <CameraPreview stream={stream} />
    </div>
  );
}