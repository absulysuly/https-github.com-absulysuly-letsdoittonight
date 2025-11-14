import 'dotenv/config';

const getCorsOrigins = (): string[] => {
  const origins = process.env.CORS_ORIGINS;
  if (!origins) {
    return ['https://byond-election.vercel.app'];
  }
  return origins.split(',').map(origin => origin.trim()).filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  expectedCandidateCount: Number(process.env.EXPECTED_CANDIDATE_COUNT ?? 7769),
  corsOrigins: getCorsOrigins(),
  apiVersion: process.env.API_VERSION ?? 'v1',
};

if (!env.databaseUrl) {
  console.warn('[env] DATABASE_URL is not set. Prisma operations will fail until configured.');
}

if (!env.jwtSecret) {
  console.warn('[env] JWT_SECRET is not set. Authentication features are disabled.');
}
