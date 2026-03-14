import { createPC } from "../utils/PeerConnectionManager";

export const useWebRTCViewer = () => {

  const createAnswerForOffer = async (
    offer: RTCSessionDescriptionInit,
    streamerSessionId: string
  ): Promise<RTCSessionDescriptionInit> => {
    const pc = createPC(streamerSessionId);

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