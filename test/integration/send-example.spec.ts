// TODO: validate websocket connection and

import { application } from '@/main/application';
import {} from 'socket.io-client';

describe('example-event Test Suite', () => {
  beforeAll(async () => {
    application.setBaseUrl('/api/v1');
    application.setWebSocketServerOptions();
  });
  afterAll(async () => {
    application.close();
  });
  it('should receive hello world message on connect to event', () => {});
});
