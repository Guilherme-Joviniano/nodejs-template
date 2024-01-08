import { WebSocketServer } from '@/infra/http/utils/websocket-server/websocket-server';
import { makeSendExampleEvent } from '@/main/factories/events';

export default (server: WebSocketServer) => {
  server.makeEvent(
    {
      name: 'example-event',
      payload: { body: { message: 'Hello World!' }, headers: {} }
    },
    makeSendExampleEvent()
  );
};
