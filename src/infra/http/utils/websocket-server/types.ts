import { ServerOptions } from 'socket.io';

import { EventSocket } from '@/event';

import { Event as EventClass } from './events';

export type EventOptions = {
  name: string;
  enabled: boolean;
  payload?: EventSocket.Payload;
};

export type Event = EventClass;

export type WebSocketServerOptions = Partial<ServerOptions>;
