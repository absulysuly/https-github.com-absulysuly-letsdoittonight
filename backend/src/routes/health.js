import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const getCandidateCount = req.app.locals.getCandidateCount;
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    candidateCount: typeof getCandidateCount === 'function' ? getCandidateCount() : null,
    timestamp: new Date().toISOString(),
  });
});

export default router;
