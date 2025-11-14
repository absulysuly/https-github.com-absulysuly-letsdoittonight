import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = res.headersSent ? 500 : (error as any)?.status ?? 500;
  const message = (error as Error)?.message ?? 'Internal server error';
  logger.error({ error }, 'Request failed');
  if (res.headersSent) {
    return;
  }
  res.status(status).json({ error: message });
};
