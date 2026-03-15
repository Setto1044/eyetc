import { createPC } from "../utils/PeerConnectionManager";
import { useSignalMessageSender } from "./useSignalMessageSender";

export const useWebRTCViewer = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const { sendCandidate } = useSignalMessageSender();

  const createAnswerForOffer = async (
    offer: RTCSessionDescriptionInit,
    streamerSessionId: string,
  ): Promise<RTCSessionDescriptionInit> => {
    const pc = createPC(streamerSessionId, (candidate) => {
      sendCandidate(streamerSessionId, candidate);
    });

    pc.ontrack = (event: RTCTrackEvent) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return answer;
  };

  return { createAnswerForOffer };
};
