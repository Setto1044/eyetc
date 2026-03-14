import { useState } from "react";

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);
    return mediaStream;
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return {
    stream,
    startCamera,
    stopCamera,
  };
};