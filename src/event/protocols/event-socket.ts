import { Socket as SocketIO } from 'socket.io';

import { SharedState } from './shared-state';

export interface EventSocket {
  handle(
    payload: EventSocket.Payload,
    state: EventSocket.State,
    next: EventSocket.Next,
    emit: EventSocket.Emit
  ): EventSocket.Result;
}

type Payload = Record<string, unknown> | Record<string, unknown>[];

export type EventStatus =
  | 'OK'
  | 'CREATED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'CONNECTION_TIMEOUT'
  | 'SERVER_ERROR';

export type EmitParams = {
  message: string;
  payload: Payload;
  status: EventStatus;
  disconnect?: boolean;
  error?: Payload;
};

export namespace EventSocket {
  type SetState = <T = SharedState>(state: T) => void;

  export type Socket = SocketIO;

  export type Emit = (event: string, options: EmitParams) => void;

  export type Payload<B = unknown, H = unknown> = {
    body: B;
    headers: H;
  };

  export type State = [SharedState, SetState];

  export type Next = Function;

  export type Result = Promise<void>;
}
