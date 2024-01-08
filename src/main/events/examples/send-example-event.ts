import { Event } from '@/infra/http/utils/websocket-server/';
import { makeSendExampleEvent } from '@/main/factories/events';

export default (event: Event) => {
  event.on(
    {
      name: 'example-event',
      payload: { body: { message: 'Hello World!' }, headers: {} }
    },
    makeSendExampleEvent()
  );
};