export type LocaleCode = 'en' | 'ar' | 'ku';

export enum UserRole {
  Voter = 'Voter',
  Candidate = 'Candidate',
  Admin = 'Admin',
  Staff = 'Staff'
}

export interface CandidateBiography {
  en: string;
  ar: string;
}

export interface CandidateContact {
  email?: string;
  phone?: string;
  website?: string;
  telegram?: string;
}

export interface Candidate {
  id: string;
  slug?: string;
  name: string;
  nameAr?: string;
  party: string;
  governorate: string;
  avatarUrl: string;
  imageUrl?: string;
  biography?: CandidateBiography;
  languages?: LocaleCode[];
  verified: boolean;
  gender?: 'Male' | 'Female' | 'Other';
  contact?: CandidateContact;
  updatedAt?: string;
}

export type AgentType = 'content' | 'outreach' | 'segmentation' | 'compliance' | 'analytics';

export type AgentTaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentTask<TPayload = Record<string, unknown>, TResult = Record<string, unknown>> {
  id: string;
  agent: AgentType;
  status: AgentTaskStatus;
  payload: TPayload;
  result?: TResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentStatus {
  agent: AgentType;
  healthy: boolean;
  lastRunAt?: string;
  tasksCompleted: number;
}
