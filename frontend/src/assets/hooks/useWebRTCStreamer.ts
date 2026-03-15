import { createPC, getPC } from "../utils/PeerConnectionManager";
import { useSignalMessageSender } from "./useSignalMessageSender";

export const useWebRTCStreamer = (stream: MediaStream | null) => {
  
  const {sendCandidate} = useSignalMessageSender();
  
  const createOfferForViewer = async (viewerId: string) => {
    if (!stream) return;

    const pc = createPC(viewerId, (candidate) => {
      sendCandidate(viewerId, candidate);
    });

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  };

  const handleAnswer = async (
    viewerId: string,
    answer: RTCSessionDescriptionInit,
  ) => {
    const pc = getPC(viewerId);
    if (!pc) {
      console.error("❌ PC not found for viewer:", viewerId);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(answer));

    console.log("✅ answer applied to pc:", viewerId);
  };

  return { createOfferForViewer, handleAnswer };
};
