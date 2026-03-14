import { sendSignalMessage } from "../utils/signals/signalSocket";
import { SignalMessageType } from "../utils/signals/signalMessage";
import { getStreamerId } from "../utils/store/sessionStore";

export const useSignalMessage = () => {
  
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


  return {
    registerStreamer,
    offerViewer,
    joinStream,
  };
};
