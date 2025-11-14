import { logger } from '../config/logger.js';
import { validateCandidateCount } from '../services/candidateService.js';
import { prisma } from '../services/prisma.js';

const main = async () => {
  try {
    const { count } = await validateCandidateCount();
    logger.info({ count }, 'Candidate table validation succeeded');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Candidate table validation failed');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
