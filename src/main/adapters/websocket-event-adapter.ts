import {
  HTTP_STATUS_DICTIONARY,
  convertCamelCaseKeysToSnakeCase
} from '@/util';
import { EmitParams, EventSocket } from '@/event';

import makeFlow from './flow-adapter';

const STATE_KEY = Symbol('STATE');
const SOCKET_KEY = Symbol('SOCKET');

type State = Record<string, unknown>;

type Payload = EventSocket.Payload & { [key: string | symbol]: State } & {
  [SOCKET_KEY]: EventSocket.Socket;
};

export const webSocketEventAdapter = (
  ...events: (EventSocket | Function)[]
) => {
  const adaptedEvents = events.map((event) => {
    return (
      { [STATE_KEY]: state, [SOCKET_KEY]: socket, ...payload }: Payload,
      next: EventSocket.Next
    ) => {
      const setState = (data: State) => {
        for (const key in data) {
          if (typeof key === 'string' || typeof key === 'number')
            state[key] = data[key];
        }
      };

      const emit = (event: string, options: EmitParams) => {
        const currentStatusCode = HTTP_STATUS_DICTIONARY[options.status];

        const result = convertCamelCaseKeysToSnakeCase({
          httpStatusCode: currentStatusCode,
          message: options.message,
          payload: options.payload,
          error: options.error
        });

        socket.emit(event, result);

        if (options.disconnect) socket.disconnect();
      };

      const stateHook = <[any, any]>[state, setState];

      if (typeof event === 'function') return event(payload, stateHook, next);

      return event.handle(payload, stateHook, next, emit);
    };
  });

  return async (payload: Record<string, unknown>): Promise<void> => {
    await makeFlow({
      ...payload,
      [STATE_KEY]: {}
    })(...adaptedEvents)();
  };
};
