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

type EmitPayload = Record<string, unknown> | Record<string, unknown>[];

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
  payload: EmitPayload;
  status: EventStatus;
  disconnect?: boolean;
  error?: EmitPayload;
};

export namespace EventSocket {
  type SetState = <T = SharedState>(state: T) => void;
  type Properties = {
    queue: string;
    exchange: string;
    routingKey: string;
  };

  export type Socket = SocketIO;

  export type Emit = (event: string, options: EmitParams) => void;

  export type Payload<B = any, H = any> = {
    body: B;
    headers: H;
    properties?: Properties;
  };

  export type State = [SharedState, SetState];

  export type Next = Function;

  export type Result = Promise<void>;
}
