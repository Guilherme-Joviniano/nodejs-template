import { EventSocket } from '@/event';

export type EventOptions = {
  name: string;
  enabled?: boolean;
  payload?: EventSocket.Payload;
};
