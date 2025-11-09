import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cachePath = path.resolve(__dirname, '../../data/candidates_cache.json');

const readCacheCount = () => {
  if (!fs.existsSync(cachePath)) {
    return { count: 0, lastModified: null };
  }

  const fileContents = fs.readFileSync(cachePath, 'utf-8');
  const parsed = JSON.parse(fileContents);
  const stats = fs.statSync(cachePath);

  return {
    count: Array.isArray(parsed) ? parsed.length : 0,
    lastModified: stats.mtime.toISOString(),
  };
};

router.get('/', async (req, res) => {
  try {
    const candidateCount = typeof req.app.locals.getCandidateCount === 'function'
      ? req.app.locals.getCandidateCount()
      : null;
    const loadedAt = typeof req.app.locals.getCandidatesLoadedAt === 'function'
      ? req.app.locals.getCandidatesLoadedAt()
      : null;

    const { count: cacheCount, lastModified } = readCacheCount();
    const usingMemory = typeof candidateCount === 'number';
    const totalCandidates = usingMemory ? candidateCount : cacheCount;

    res.json({
      status: 'ok',
      totalCandidates,
      loadedAt,
      cacheLastUpdated: lastModified,
      dataSource: usingMemory ? 'memory' : 'cache',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
