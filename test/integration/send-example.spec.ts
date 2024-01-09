// TODO: validate websocket connection and

import { application } from '@/main/application';

describe('example-event Test Suite', () => {
  beforeAll(async () => {
    application.setBaseUrl('/api/v1');
    application.setWebSocketServerOptions();
  });
  afterAll(async () => {
    application.close();
  });
});
