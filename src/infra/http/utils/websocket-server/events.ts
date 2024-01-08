import { EventSocket } from '@/event';

import { EventOptions } from './types';
import { WebSocketServer } from './websocket-server';

export class Event {
  constructor(private readonly webSocketServer: WebSocketServer) {}
  public on(
    options: EventOptions,
    ...callbacks: (Function | EventSocket)[]
  ): void {
    this.webSocketServer.register(options, ...callbacks);
  }
}
