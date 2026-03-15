

const peerConnections = new Map<string, RTCPeerConnection>();

export const createPC = (id: string, onCandidate: (candidate: RTCIceCandidate) => void) => {


  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onCandidate(event.candidate);
    }
  };

  peerConnections.set(id, pc);
  return pc;
};

export const getPC = (id: string) => {
  return peerConnections.get(id);
};

export const addCandidateToPC = async (id: string, candidate: RTCIceCandidateInit) => {
  const pc = getPC(id);
  if (!pc) return;
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
};