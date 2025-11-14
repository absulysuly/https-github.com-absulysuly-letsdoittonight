import { Router } from 'express';
import { getAgentStatuses } from '../agents/index.js';

export const agentRouter = Router();

agentRouter.get('/status', async (_req, res, next) => {
  try {
    const agents = await getAgentStatuses();
    res.json({ agents });
  } catch (error) {
    next(error);
  }
});
