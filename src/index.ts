import express from 'express';
import { corsMiddleware } from './cors';
import { errorHandlers } from './errors/handlers';
import { logger } from './logger';
import { resources } from './resources';

const PORT = 8080;
const app = express();

app
  .use(corsMiddleware)
  .use(express.json())
  .use(resources)
  .use(errorHandlers)
  .listen(PORT, handleServerStart);

function handleServerStart() {
  logger.log('SERVER', `escutando http://localhost:${PORT}!`);
}