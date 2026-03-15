let socket: WebSocket | null = null;
let messageHandler: ((data: any) => void) | null = null;

const SIGNAL_SERVER_URL = import.meta.env.VITE_SIGNAL_SERVER_URL as string;

export function connectSignalServer(): WebSocket | null {
  if (!SIGNAL_SERVER_URL) {
    console.error("❌ VITE_SIGNAL_SERVER_URL is not defined");
    return null;
  }

  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    console.warn("⚠️ Already has Connected");
    return socket;
  }

  socket = new WebSocket(SIGNAL_SERVER_URL);

  socket.onopen = () => {
    console.log("✅ signal server connected");
  };


  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log("signal message received:", data.type, data);

      if (messageHandler) {
        messageHandler(data);
      }
    } catch (error) {
      console.error("❌ failed to parse signal message", error);
    }
  };

  socket.onclose = () => {
    console.log("✅ signal server disconnected");
    socket = null;
  };

  socket.onerror = (err: Event) => {
    console.error("❌ signal socket error", err);
  };

  return socket;
}

export function getSocket(): WebSocket | null {
  return socket;
}

export function sendSignalMessage(payload: any) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("❌ socket not connected");
    return;
  }

  socket.send(JSON.stringify(payload));
}

export function setSignalMessageHandler(handler: (data: any) => void) {
  messageHandler = handler;
}
