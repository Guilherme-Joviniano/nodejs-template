import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Server, ServerOptions, Socket } from 'socket.io';

import { webSocketEventAdapter } from '@/main/adapters/websocket-event-adapter';
import { EventSocket } from '@/event';

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

  public async loadEvents(path: string): Promise<void> {
    const extensionsToSearch = ['.TS', '.JS'];
    const ignoreIfIncludes = ['.MAP.', '.SPEC.', '.TEST.'];

    const files = readdirSync(path);

    for await (const fileName of files) {
      const fileNameToUpperCase = fileName.toLocaleUpperCase();

      const hasAValidExtension = ignoreIfIncludes.map((text) =>
        fileNameToUpperCase.includes(text)
      );

      const haveAValidName = extensionsToSearch.map((ext) =>
        fileNameToUpperCase.endsWith(ext)
      );

      if (haveAValidName && hasAValidExtension) {
        const filePath = resolve(path, fileName);
        const setup = (await import(filePath)).default;

        if (typeof setup !== 'function') continue;

        setup(this);
      }
    }
  }

  public on(options: EventOptions, ...callbacks: (Function | EventSocket)[]) {
    if (!options.enabled) return;

    const payload = options.payload ?? {};

    // carregar em memoria as configs de eventos
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
