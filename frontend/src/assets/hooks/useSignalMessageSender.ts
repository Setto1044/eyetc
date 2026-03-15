import { sendSignalMessage } from "../utils/signals/signalSocket";
import { SignalMessageType } from "../utils/signals/signalMessage";
import { getStreamerId } from "../utils/store/sessionStore";

export const useSignalMessageSender = () => {
  
  const registerStreamer = () => {
    sendSignalMessage({
      type: SignalMessageType.REGISTER_STREAMER,
      streamerId: getStreamerId(),
    });
  };

  const joinStream = (streamerId:string) => {
    
    sendSignalMessage({
      type: SignalMessageType.JOIN_STREAM,
      streamerId: streamerId,
    });
  }

  const offerViewer = (
    viewerId: string, 
    offer: RTCSessionDescriptionInit) => {
    sendSignalMessage({
      type: SignalMessageType.OFFER,
      streamerId: getStreamerId(),
      receiver: viewerId,
      message: JSON.stringify(offer),
    });
  };

  const answerToOffer = (answer: RTCSessionDescriptionInit) => {
    sendSignalMessage({
      type: SignalMessageType.ANSWER,
      streamerId: getStreamerId(),
      message: JSON.stringify(answer),
    });
  }

  const sendCandidate = (targetId: string, candidate: RTCIceCandidate) => {
  sendSignalMessage({
    type: SignalMessageType.CANDIDATE,
    streamerId: getStreamerId(),
    receiver: targetId,
    message: JSON.stringify(candidate),
  });
};

  return {
    registerStreamer,
    offerViewer,
    joinStream,
    answerToOffer,
    sendCandidate,
  };
};
