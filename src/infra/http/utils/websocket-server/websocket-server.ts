import { Server, ServerOptions, Socket } from 'socket.io';

import { Job } from '@/job/protocols';
import { jobAdapter } from '@/main/adapters';
import { webSocketEventAdapter } from '@/main/adapters/websocket-event-adapter';

import { HttpServer } from '../http-server/http-server';
import { EventOptions } from './types';

export class WebSocketServer {
  private server!: Server;
  private static instance: WebSocketServer;

  private constructor(
    private httpServer: HttpServer,
    private options?: ServerOptions
  ) {
    this.server = new Server(httpServer.getServer(), this.options);
  }

  public static getInstance(httpServer: HttpServer, options?: ServerOptions) {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(httpServer, options);
    }

    return WebSocketServer.instance;
  }

  public makeEvent(options: EventOptions, ...callbacks: (Function | Job)[]) {
    if (!options.enabled) return;

    const payload = options.payload ?? {};

    this.server.on(options.name, async (socket) => {
      webSocketEventAdapter(...callbacks)(payload, socket);
    });
  }

  public async connect(
    disconnectCallback: (socket: Socket) => void | Promise<void> = () => {}
  ) {
    this.server.on('connection', (socket) => {
      socket.on('disconnect', () => disconnectCallback(socket));
    });
  }
}
