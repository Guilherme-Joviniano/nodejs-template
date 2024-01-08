import { EventSocket } from '@/event/protocols';

export class SendExampleEvent implements EventSocket {
  async handle(
    payload: EventSocket.Payload<
      {
        message: string;
      },
      unknown
    >,
    [state]: EventSocket.State,
    next: Function,
    emit: EventSocket.Emit
  ): EventSocket.Result {
    try {
      const { message } = payload.body;

      emit('example-event', { message, payload: {}, status: 'OK' });

      return next();
    } catch (error) {
      emit('example-event', {
        error,
        payload: {},
        status: 'SERVER_ERROR',
        message: 'INTERNAL_SERVER_ERROR'
      });
      return next();
    }
  }
}
