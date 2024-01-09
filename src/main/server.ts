import mongoose from 'mongoose';

import { sqlConnection } from '@/infra/db/mssql/util/connection';
import { logger } from '@/util';
import { MONGO, SERVER } from '@/util/constants';

import { application } from './application';

application.onStart(async () => {
  try {
    const mongoPromise = mongoose
      .set('strictQuery', false)
      .connect(MONGO.URL(), {
        dbName: MONGO.NAME,
        authSource: MONGO.AUTH_SOURCE,
        authMechanism: 'SCRAM-SHA-1'
      });

    const sqlPromise = sqlConnection.raw('SELECT 1');

    await Promise.all([mongoPromise, sqlPromise]);
  } catch (error) {
    logger.log(error);
    throw error;
  }
});

application.listenAsync(SERVER.PORT, () => {
  logger.log({
    level: 'info',
    message: `Server is running on port: ${SERVER.PORT}`
  });
  logger.log({
    level: 'info',
    message: `WebSocketServer is running on port: ${SERVER.PORT} \n Powered by https://socket.io`
  });
});
