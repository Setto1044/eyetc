export const SignalMessageType = {
  REGISTER_STREAMER: "REGISTER_STREAMER",
  JOIN_STREAM: "JOIN_STREAM",
  CHAT: "CHAT",
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  CANDIDATE: "CANDIDATE",
} as const;

export type SignalMessageType =
  (typeof SignalMessageType)[keyof typeof SignalMessageType];


export interface SignalMessageDto {
  type: SignalMessageType
  streamerId?: string
  sender?: string
  receiver?: string
  message?: string
}