import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
}

export default function CameraPreview({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        width: "800px",
        maxWidth: "100%",
        backgroundColor: "black",
        borderRadius: "10px",
      }}
    />
  );
}