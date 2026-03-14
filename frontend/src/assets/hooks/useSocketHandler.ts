import { connectSignalServer, setSignalMessageHandler } from "../utils/signals/signalSocket";
import type { SignalMessageDto } from "../utils/signals/signalMessage";

export const useSocketHandler = () => {
  const connectSocket = () => {
    const socket = connectSignalServer();
    if (!socket) return;
    return socket;
  };

  const setMessageHandler = (handler: (data: SignalMessageDto) => void) => {
    setSignalMessageHandler(handler);
  };

  return { connectSocket, setMessageHandler };
};
