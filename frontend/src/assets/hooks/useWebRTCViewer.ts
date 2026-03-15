import { createPC } from "../utils/PeerConnectionManager";
import { useSignalMessageSender } from "./useSignalMessageSender";

export const useWebRTCViewer = () => {
  const { sendCandidate } = useSignalMessageSender();

  const createAnswerForOffer = async (
    offer: RTCSessionDescriptionInit,
    streamerSessionId: string,
  ): Promise<RTCSessionDescriptionInit> => {
    const pc = createPC(streamerSessionId, (candidate) => {
      sendCandidate(streamerSessionId, candidate);
    });
    
    pc.ontrack = (event: RTCTrackEvent) => {
      const remoteStream = event.streams[0];
      console.log("✅ viewer received stream", remoteStream);
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return answer;
  };

  return { createAnswerForOffer };
};
