import express from 'express';
import { corsMiddleware } from './cors';
import { errorHandlers } from './errors/handlers';
import { logger } from './logger';
import { resources } from './resources';
import { config } from './config';

const PORT = config.port;
const app = express();

app
  .use(corsMiddleware)
  .use(express.json({ strict: true }))
  .use(resources)
  .use(errorHandlers)
  .listen(PORT, handleServerStart);

function handleServerStart() {
  logger.log('SERVER', `escutando http://localhost:${PORT}!`);
}