import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { candidatesRouter } from './routes/candidates.js';
import { agentRouter } from './routes/agent.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(pinoHttp({ logger }));

app.get('/api', (_req, res) => {
  res.json({ ok: true, version: env.apiVersion });
});

app.use('/api/health', healthRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/agent', agentRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

const server = app.listen(env.port, () => {
  logger.info(`API listening on port ${env.port}`);
});

const shutdown = () => {
  logger.info('Received termination signal, shutting down.');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
