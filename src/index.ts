import 'express-async-errors';
import express from 'express';
import { corsMiddleware } from './cors';
import { errorHandlers } from './errors/handlers';
import { logger } from './logger';
import { resources } from './resources';
import { config } from './config';

const app = express();

app
  .use(corsMiddleware)
  .use(express.json({ strict: true }))
  .use(resources)
  .use(errorHandlers)
  .listen(config.port, handleServerStart);

function handleServerStart() {
  if (config.log.start) {
    logger.log('SERVER', `escutando http://localhost:${config.port}!`);
  }
}