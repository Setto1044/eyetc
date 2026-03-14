import { createPC } from "../utils/PeerConnectionManager";

export const useWebRTCStreamer = (stream: MediaStream | null) => {

  const createOfferForViewer = async (viewerId: string) => {
    if (!stream) return;

    const pc = createPC(viewerId);

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  };

  return { createOfferForViewer };
};
