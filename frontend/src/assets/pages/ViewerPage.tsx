import { useState, useEffect, useRef } from "react";
import { connectSignalServer } from "../utils/signals/signalSocket";
import { useSignalMessageHandler } from "../hooks/useSignalMessageHandler";
import { useSignalMessageSender } from "../hooks/useSignalMessageSender";
import { useWebRTCViewer } from "../hooks/useWebRTCViewer";
import { addCandidateToPC } from "../utils/PeerConnectionManager";

export default function ViewerPage() {

  const [streamerIdInput, setStreamerIdInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const { joinStream, answerToOffer } = useSignalMessageSender();
  const { createAnswerForOffer } = useWebRTCViewer(videoRef);

  useEffect(() => {
    const socket = connectSignalServer();
    if (!socket) {
      console.error("❌ Socket 연결 실패")
      return
    }
  }, [])

  useSignalMessageHandler({
    onOffer: async (sender, offer) => {
      const answer = await createAnswerForOffer(offer, sender);
      answerToOffer(answer);
    },

    onCandidate: (sender, candidate) => addCandidateToPC(sender, candidate),
  });



  const handleJoinStream = () => {
    const streamerId = streamerIdInput.trim();

    if (!streamerId) {
      console.error("❌ streamerId를 입력하세요");
      return;
    }

    joinStream(streamerId);

    console.log("✅ JOIN_STREAM 전송:", streamerId);
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
      <h1>Viewer</h1>
      <p>스트리머 방송 시청 화면</p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={streamerIdInput}
          onChange={(e) => setStreamerIdInput(e.target.value)}
          placeholder="스트리머 ID 입력"
          style={{
            width: "240px",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #444",
            outline: "none",
          }}
        />

        <button
          onClick={handleJoinStream}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          연결 요청
        </button>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "800px",
          height: "450px",
          backgroundColor: "black",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}