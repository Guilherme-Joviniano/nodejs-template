import { readdirSync } from 'fs';
import { Server as HttpServer } from 'http';
import { resolve } from 'path';
import { Server, ServerOptions, Socket } from 'socket.io';

import { webSocketEventAdapter } from '@/main/adapters/websocket-event-adapter';
import { EventSocket } from '@/event';

import { Event as EventHandler } from './events';
import { EventOptions } from './types';

export class WebSocketServer {
  private server!: Server;
  private static instance: WebSocketServer;
  private eventHandler!: EventHandler;

  private constructor(
    httpServer: HttpServer,
    private options?: Partial<ServerOptions>
  ) {
    this.server = new Server(httpServer, this.options);
    this.eventHandler = new EventHandler(this);
  }

  private events: {
    options: EventOptions;
    callbacks: (Function | EventSocket)[];
  }[] = [];

  public static getInstance(
    httpServer: HttpServer,
    options?: Partial<ServerOptions>
  ) {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer(httpServer, options);
    }
    return WebSocketServer.instance;
  }

  public close() {
    this.server.close();
  }

  private loadEvents(socket: Socket): void {
    this.events.forEach((event) => {
      socket.on(event.options.name, (socket) => {
        const payload = event.options.payload ?? {};
        webSocketEventAdapter(...event.callbacks)(payload, socket);
      });
    });
  }

  private async loadEventsAsync(socket: Socket): Promise<void> {
    const promises = this.events.map(async (event) => {
      socket.on(event.options.name, (socket) => {
        const payload = event.options.payload ?? {};
        webSocketEventAdapter(...event.callbacks)(payload, socket);
      });
    });
    await Promise.all(promises);
  }

  public async eventsDirectory(path: string): Promise<void> {
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

  public connect() {
    this.server.on('connection', (socket) => {
      this.loadEvents(socket);
    });
  }
}
