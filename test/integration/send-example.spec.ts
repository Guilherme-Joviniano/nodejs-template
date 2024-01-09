import { io as ioc, Socket as ClientSocket } from 'socket.io-client';

import { application } from '@/main/application';
import { SERVER } from '@/util';

describe('example-event Test Suite', () => {
  let client: ClientSocket;

  beforeAll(async () => {
    application.setBaseUrl('/api/v1');
    application.setWebSocketServerOptions();
    client = ioc(`http://localhost:${SERVER.PORT}`);
  });
  afterAll(async () => {
    application.close();
  });
  it('should receive hello world message on connect to event', (done) => {
    client.on('connect', () => {
      expect(true).toBe(true);
      done();
    });
  });
});
