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

  return {
    registerStreamer,
  };
};
