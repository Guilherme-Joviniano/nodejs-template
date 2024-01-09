import path from 'path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { httpServer } from '@/infra/http/utils/http-server';
import { elasticAPM } from '@/util';
import { SERVER } from '@/util/constants';

import { apmHttpLoggerMiddleware, dbHttpLoggerMiddleware } from './middlewares';

elasticAPM();

const application = httpServer();

application.use(cors({ exposedHeaders: 'X-Total-Count' }));
application.use(helmet());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(apmHttpLoggerMiddleware);
application.use(dbHttpLoggerMiddleware);
application.setBaseUrl(SERVER.BASE_URI);
application.setWebSocketServerOptions({
  path: `${SERVER.BASE_URI}/events`,
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const routesFolder = path.resolve(__dirname, 'routes');
const publicRoutesFolder = path.resolve(routesFolder, 'public');
const privateRoutesFolder = path.resolve(routesFolder, 'private');

application.routesDirectory(publicRoutesFolder);
application.routesDirectory(privateRoutesFolder);

export { application };
