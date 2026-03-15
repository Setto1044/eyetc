import { useEffect } from "react";
import { useSocketHandler } from "./useSocketHandler";
import { SignalMessageType } from "../utils/signals/signalMessage";

export const useSignalMessageHandler = ({
  onJoinRequest,
  onOffer,
  onAnswer,
  onCandidate,
}: {
  onJoinRequest?: (viewerId: string) => void;
  onOffer?: (sender: string, offer: RTCSessionDescriptionInit) => void;
  onAnswer?: (viewerId: string, answer: any) => void;
  onCandidate?: (viewerId: string, candidate: any) => void;
}) => {
  const { setMessageHandler } = useSocketHandler();

  useEffect(() => {
    setMessageHandler(async (data) => {
      switch (data.type) {
        case SignalMessageType.JOIN_STREAM:
          if (data.sender && onJoinRequest) {
            onJoinRequest(data.sender);
          }
          break;

        case SignalMessageType.OFFER:
          if (data.sender && data.message && onOffer)
            onOffer(data.sender, JSON.parse(data.message));
          break;

        case SignalMessageType.ANSWER:
          if (data.sender && data.message && onAnswer) {
            onAnswer(data.sender, JSON.parse(data.message));
          }
          break;

        case SignalMessageType.CANDIDATE:
          if (data.sender && data.message && onCandidate) {
            onCandidate(data.sender, JSON.parse(data.message));
          }
          break;
      }
    });
  }, [setMessageHandler, onJoinRequest, onOffer, onAnswer, onCandidate]);
};
