const peerConnections = new Map<string, RTCPeerConnection>();

export const createPC = (id: string) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  peerConnections.set(id, pc);
  return pc;
};

export const getPC = (id: string) => {
  return peerConnections.get(id);
};