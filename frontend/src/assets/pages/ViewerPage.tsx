import { useState, useEffect } from "react";
import { connectSignalServer, sendSignalMessage } from "../utils/signals/signalSocket";
import { SignalMessageType } from "../utils/signals/signalMessage";


export default function ViewerPage() {

  const [streamerIdInput, setStreamerIdInput] = useState("");

  useEffect(() => {
    const socket = connectSignalServer();
    if(!socket) {
      console.error("❌ Socket 연결 실패")
      return
    }
  }, [])


  const handleJoinStream = () => {
    const streamerId = streamerIdInput.trim();

    if (!streamerId) {
      console.error("❌ streamerId를 입력하세요");
      return;
    }

    sendSignalMessage({
      type: SignalMessageType.JOIN_STREAM,
      streamerId,
    });

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

      <div
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