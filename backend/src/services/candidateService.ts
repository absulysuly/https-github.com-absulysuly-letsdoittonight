import type { Candidate } from '@byond-election/shared/types';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { prisma } from './prisma.js';

const toSharedCandidate = (candidate: any): Candidate => ({
  id: candidate.id,
  slug: candidate.slug,
  name: candidate.name,
  nameAr: candidate.nameAr,
  party: candidate.party,
  governorate: candidate.governorate,
  avatarUrl: candidate.avatarUrl,
  imageUrl: candidate.imageUrl ?? candidate.avatarUrl,
  biography: candidate.biographyEn && candidate.biographyAr
    ? {
        en: candidate.biographyEn,
        ar: candidate.biographyAr,
      }
    : undefined,
  languages: candidate.languages ?? [],
  verified: candidate.verified,
  gender: candidate.gender ?? undefined,
  contact:
    candidate.contactEmail || candidate.contactPhone
      ? {
          email: candidate.contactEmail ?? undefined,
          phone: candidate.contactPhone ?? undefined,
        }
      : undefined,
  updatedAt: candidate.updatedAt?.toISOString(),
});

export const getAllCandidates = async (): Promise<Candidate[]> => {
  const results = await prisma.candidate.findMany({ orderBy: { name: 'asc' } });
  return results.map(toSharedCandidate);
};

export const getCandidateStats = async () => {
  const total = await prisma.candidate.count();
  const women = await prisma.candidate.count({ where: { gender: { equals: 'Female', mode: 'insensitive' } } });
  const men = total - women;
  return { total, women, men };
};

export const getCandidateSummary = async () => {
  const total = await prisma.candidate.count();
  return { count: total };
};

export const validateCandidateCount = async () => {
  const { count } = await getCandidateSummary();
  if (count !== env.expectedCandidateCount) {
    const message = `Candidate count mismatch. Expected ${env.expectedCandidateCount}, received ${count}.`;
    logger.error(message);
    throw new Error(message);
  }
  return { count };
};
