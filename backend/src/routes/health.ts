import { Router } from 'express';
import { env } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), environment: env.nodeEnv });
});
