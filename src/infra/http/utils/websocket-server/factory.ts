import { ServerOptions } from 'socket.io';

import { HttpServer } from '../http-server/http-server';
import { WebSocketServer } from './websocket-server';

export const makeWebSocketServer = (
  options?: ServerOptions
): WebSocketServer => {
  return WebSocketServer.getInstance(
    HttpServer.getInstance().getHttpServerInstance(),
    options
  );
};
