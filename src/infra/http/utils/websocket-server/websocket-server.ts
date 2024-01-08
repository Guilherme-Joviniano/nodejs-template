import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Server, ServerOptions, Socket } from 'socket.io';

import { EventSocket } from '@/event';

import { Event as EventHandler } from './events';
import { HttpServer } from '../http-server/http-server';
import { EventOptions } from './types';

export class WebSocketServer {
  private server!: Server;
  private static instance: WebSocketServer;
  private eventHandler!: EventHandler;
  private constructor(
    private httpServer: HttpServer,
    private options?: ServerOptions
  ) {
    this.server = new Server(httpServer.getServer(), this.options);
    this.eventHandler = new EventHandler(this);
  }

  private events: {
    options: EventOptions;
    callbacks: (Function | EventSocket)[];
  }[] = [];

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

        setup(this.eventHandler);
      }
    }
  }

  public register(
    options: EventOptions,
    ...callbacks: (Function | EventSocket)[]
  ) {
    if (!options.enabled) return;
    this.events.push({ options, callbacks });
  }

  public async connect(
    disconnectCallback: (socket: Socket) => void | Promise<void> = () => {}
  ) {
    this.server.on('connection', (socket) => {
      socket.on('disconnect', () => disconnectCallback(socket));
    });
  }
}
