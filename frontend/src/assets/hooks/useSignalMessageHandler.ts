import { useEffect } from "react";
import { useSocketHandler } from "./useSocketHandler";
import { SignalMessageType } from "../utils/signals/signalMessage";

export const useSignalMessageHandler = ({
  onJoinRequest,
  onAnswer,
  onCandidate
}: {
  onJoinRequest: (viewerId: string) => void;
  onAnswer: (viewerId: string, answer: any) => void;
  onCandidate: (viewerId: string, candidate: any) => void;
}) => {

  const { setMessageHandler } = useSocketHandler();

  useEffect(() => {
    setMessageHandler(async (data) => {

      switch (data.type) {

        case SignalMessageType.JOIN_STREAM:
          if (data.sender) {
            onJoinRequest(data.sender);
          }
          break;

        case SignalMessageType.ANSWER:
          if (data.sender && data.message) {
            onAnswer(data.sender, JSON.parse(data.message));
          }
          break;

        case SignalMessageType.CANDIDATE:
          if (data.sender && data.message) {
            onCandidate(data.sender, JSON.parse(data.message));
          }
          break;

      }

    });
  }, [setMessageHandler, onJoinRequest, onAnswer, onCandidate]);
};