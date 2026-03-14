import { useRef } from "react";

export const useWebRTCStreamer = (stream: MediaStream | null) => {
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const createOfferForViewer = async (viewerId: string) => {
    if (!stream) return;

    const pc = new RTCPeerConnection();

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
    peerConnections.current.set(viewerId, pc);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  };

  return { createOfferForViewer };
};
