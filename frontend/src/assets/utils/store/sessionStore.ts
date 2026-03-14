let streamerId: string | null = null;

export function setStreamerId(id: string) {
  streamerId = id;
}

export function getStreamerId(): string | null {
  return streamerId;
}