import { Event } from '@/infra/http/utils/websocket-server';
import { makeSendExampleEvent } from '@/main/factories/events';

export default function (event: Event) {
  event.on(
    {
      enabled: true,
      name: 'example-event',
      payload: { body: { message: 'Hello World!' }, headers: {} }
    },
    makeSendExampleEvent()
  );
}
