import { Router } from 'express';
import { logger } from '../config/logger.js';
import { getAllCandidates, getCandidateStats, getCandidateSummary, validateCandidateCount } from '../services/candidateService.js';

export const candidatesRouter = Router();

candidatesRouter.get('/', async (req, res, next) => {
  try {
    if (req.query.summary === 'true') {
      const summary = await getCandidateSummary();
      return res.json(summary);
    }
    const candidates = await getAllCandidates();
    res.json(candidates);
  } catch (error) {
    next(error);
  }
});

candidatesRouter.get('/stats', async (_req, res, next) => {
  try {
    const stats = await getCandidateStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

candidatesRouter.get('/validate', async (_req, res, next) => {
  try {
    const result = await validateCandidateCount();
    logger.info({ result }, 'Candidate count validation succeeded');
    res.json({ ok: true, ...result });
  } catch (error) {
    next(error);
  }
});
