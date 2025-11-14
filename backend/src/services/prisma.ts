import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    logger.error({ error }, 'Prisma query failed');
    throw error;
  }
});
