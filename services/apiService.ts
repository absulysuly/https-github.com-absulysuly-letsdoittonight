import type {
  User,
  UserRole,
  Post,
  Event,
  Article,
  Debate,
  TeaHouseTopic,
  TeaHouseMessage,
  Language,
  Governorate
} from '../types.ts';
import type {
  Candidate as ElectionCandidate,
  PoliticalParty,
  ApiConfig,
  DataCollectionStats,
  ContactValidationItem,
  EnrichmentData,
  QualityAnalyticsData,
  DashboardStats,
  ParticipationData,
  NewsArticle
} from '../components/election/types.ts';

const DEFAULT_BASE_URL = 'https://hamlet-unified-complete-2027-production.up.railway.app';
const BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL;

type QueryValue = string | number | boolean | null | undefined | (string | number | boolean | null | undefined)[];
type QueryParams = Record<string, QueryValue>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<T> {
  method?: HttpMethod;
  body?: unknown;
  query?: QueryParams;
  defaultValue: T;
  headers?: Record<string, string>;
  expectJson?: boolean;
}

const JSON_HEADERS: Record<string, string> = { 'Content-Type': 'application/json' };

const cleanFilters = (filters: QueryParams = {}): QueryParams => {
  const cleaned: QueryParams = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (entry) => entry !== undefined && entry !== null && entry !== '' && entry !== 'All'
      );
      if (filtered.length > 0) {
        cleaned[key] = filtered as (string | number | boolean)[];
      }
      return;
    }

    if (value === undefined || value === null || value === '' || value === 'All') {
      return;
    }

    cleaned[key] = value;
  });
  return cleaned;
};

const buildQuery = (params?: QueryParams) => {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => searchParams.append(key, String(entry)));
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
};

async function request<T>(path: string, options: RequestOptions<T>): Promise<T> {
  const {
    method = 'GET',
    body,
    query,
    defaultValue,
    headers = {},
    expectJson = true,
  } = options;

  try {
    const url = new URL(path, BASE_URL);
    const queryString = buildQuery(query);
    if (Array.from(queryString.keys()).length > 0) {
      queryString.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(url.toString(), {
      method,
      headers: isFormData ? headers : { ...JSON_HEADERS, ...headers },
      body:
        method === 'GET' || body === undefined
          ? undefined
          : isFormData
          ? (body as BodyInit)
          : JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!expectJson || response.status === 204) {
      return defaultValue;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error(`[api] ${path} request failed`, error);
    return defaultValue;
  }
}

const withDefaultStats = (): { stats: DashboardStats; participation: ParticipationData[] } => ({
  stats: {
    totalRegisteredVoters: 0,
    approvedCandidatesCount: 0,
    expectedTurnoutPercentage: 0,
  },
  participation: [],
});

export const getParties = async (): Promise<string[]> => {
  const response = await request<Array<string | { name: string }>>('/api/parties', {
    defaultValue: [],
  });

  return response
    .map((entry) => (typeof entry === 'string' ? entry : entry?.name))
    .filter((name): name is string => Boolean(name));
};

interface PostFilters {
  governorate?: Governorate | 'All';
  party?: string | 'All';
  type?: Post['type'];
  authorId?: string;
}

export const getPosts = (filters: PostFilters = {}): Promise<Post[]> =>
  request<Post[]>('/api/posts', {
    query: cleanFilters(filters),
    defaultValue: [],
  });

interface UserFilters {
  role?: UserRole;
  governorate?: Governorate | 'All';
  party?: string | 'All';
  gender?: 'Male' | 'Female';
  partySlug?: string;
  governorateSlug?: string;
}

export const getUsers = (filters: UserFilters = {}): Promise<User[]> =>
  request<User[]>('/api/users', {
    query: cleanFilters(filters),
    defaultValue: [],
  });

interface EventFilters {
  governorate?: Governorate | 'All';
  party?: string | 'All';
}

export const getEvents = (filters: EventFilters = {}): Promise<Event[]> =>
  request<Event[]>('/api/events', {
    query: cleanFilters(filters),
    defaultValue: [],
  });

interface ArticleFilters {
  governorate?: Governorate | 'All';
}

export const getArticles = (filters: ArticleFilters = {}): Promise<Article[]> =>
  request<Article[]>('/api/articles', {
    query: cleanFilters(filters),
    defaultValue: [],
  });

export const createPost = async (data: Partial<Post>, user: User): Promise<Post | null> => {
  const payload = { ...data, authorId: user.id };
  const created = await request<Post | null>('/api/posts', {
    method: 'POST',
    body: payload,
    defaultValue: null,
  });

  if (created) {
    return {
      ...created,
      author: created.author ?? user,
    };
  }

  return null;
};

export const createReel = (details: { caption: string; videoFile?: File }, user: User): Promise<Post | null> => {
  const formData = new FormData();
  formData.append('caption', details.caption);
  formData.append('authorId', user.id);
  if (details.videoFile) {
    formData.append('video', details.videoFile);
  }

  return request<Post | null>('/api/reels', {
    method: 'POST',
    body: formData,
    defaultValue: null,
    headers: {},
  });
};

export const createEvent = (
  details: { title: string; date: string; location: string },
  user: User,
): Promise<Event | null> =>
  request<Event | null>('/api/events', {
    method: 'POST',
    body: { ...details, organizerId: user.id },
    defaultValue: null,
  });

export const followCandidate = async (candidateId: string): Promise<boolean> => {
  const response = await request<{ success: boolean }>('/api/candidates/follow', {
    method: 'POST',
    body: { candidateId },
    defaultValue: { success: false },
  });

  return Boolean(response?.success);
};

export const likePost = async (postId: string): Promise<boolean> => {
  const response = await request<{ success: boolean }>(`/api/posts/${postId}/like`, {
    method: 'POST',
    defaultValue: { success: false },
  });

  return Boolean(response?.success);
};

export const socialLogin = (provider: 'google' | 'facebook'): Promise<User | null> =>
  request<User | null>('/auth/social-login', {
    method: 'POST',
    body: { provider },
    defaultValue: null,
  });

export const registerUser = (details: { name: string; email: string; role: UserRole }): Promise<User | null> =>
  request<User | null>('/auth/register', {
    method: 'POST',
    body: details,
    defaultValue: null,
  });

export const checkVerificationStatus = (userId: string): Promise<User | null> =>
  request<User | null>(`/auth/users/${userId}`, {
    defaultValue: null,
  });

export const resendVerificationEmail = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/users/${userId}/resend-verification`, {
      method: 'POST',
      headers: JSON_HEADERS,
    });
    return response.ok;
  } catch (error) {
    console.error('[api] resend verification email failed', error);
    return false;
  }
};

export const updateUser = (userId: string, updates: Partial<User>): Promise<User | null> =>
  request<User | null>(`/api/users/${userId}`, {
    method: 'PATCH',
    body: updates,
    defaultValue: null,
  });

export type CandidateStats = { total: number; women: number };

export const getCandidateStats = (): Promise<CandidateStats> =>
  request<CandidateStats>('/api/candidates/stats', {
    defaultValue: { total: 0, women: 0 },
  });

export const getDashboardStats = (): Promise<{ stats: DashboardStats; participation: ParticipationData[] }> =>
  request<{ stats: DashboardStats; participation: ParticipationData[] }>('/api/dashboard/stats', {
    defaultValue: withDefaultStats(),
  });

export const getAllElectionCandidates = (): Promise<ElectionCandidate[]> =>
  request<ElectionCandidate[]>('/api/election/candidates', {
    defaultValue: [],
  });

export const getPartyById = (
  id: string,
): Promise<{ party: PoliticalParty; candidates: ElectionCandidate[] } | null> =>
  request<{ party: PoliticalParty; candidates: ElectionCandidate[] } | null>(`/api/parties/${id}`, {
    defaultValue: null,
  });

export const getApiConfig = (): Promise<ApiConfig[]> =>
  request<ApiConfig[]>('/api/integrations', {
    defaultValue: [],
  });

export const getDataCollectionStats = (): Promise<DataCollectionStats | null> =>
  request<DataCollectionStats | null>('/api/operations/data-collection', {
    defaultValue: null,
  });

export const getContactValidationData = (): Promise<ContactValidationItem[]> =>
  request<ContactValidationItem[]>('/api/operations/contact-validation', {
    defaultValue: [],
  });

export const getEnrichmentData = (candidateId: string): Promise<EnrichmentData | null> =>
  request<EnrichmentData | null>(`/api/operations/enrichment/${candidateId}`, {
    defaultValue: null,
  });

export const getQualityAnalyticsData = (): Promise<QualityAnalyticsData | null> =>
  request<QualityAnalyticsData | null>('/api/operations/quality-analytics', {
    defaultValue: null,
  });

export interface GovernoratePortalData {
  governorate: Record<string, unknown>;
  candidates: ElectionCandidate[];
  news: NewsArticle[];
}

export const getGovernorateDataByName = (name: string): Promise<GovernoratePortalData | null> =>
  request<GovernoratePortalData | null>(`/api/governorates/${encodeURIComponent(name)}`, {
    defaultValue: null,
  });

export const getTeaHouseTopics = (language: Language): Promise<TeaHouseTopic[]> =>
  request<TeaHouseTopic[]>('/api/tea-house/topics', {
    query: cleanFilters({ language }),
    defaultValue: [],
  });

export const getTeaHouseMessages = (topicId: string): Promise<TeaHouseMessage[]> =>
  request<TeaHouseMessage[]>(`/api/tea-house/topics/${topicId}/messages`, {
    defaultValue: [],
  });

export const createTeaHouseTopic = (
  data: { title: string; firstMessage: string; category: string; language: Language },
): Promise<TeaHouseTopic | null> =>
  request<TeaHouseTopic | null>('/api/tea-house/topics', {
    method: 'POST',
    body: data,
    defaultValue: null,
  });

export const submitIntegrityReport = (
  formData: FormData,
): Promise<{ success: boolean; trackingId?: string }> =>
  request<{ success: boolean; trackingId?: string }>('/api/integrity/reports', {
    method: 'POST',
    body: formData,
    defaultValue: { success: false },
  });

interface DebateFilters {
  governorate?: Governorate | 'All';
  party?: string | 'All';
  participantIds?: string[];
}

export const getDebates = (filters: DebateFilters = {}): Promise<Debate[]> =>
  request<Debate[]>('/api/debates', {
    query: cleanFilters(filters),
    defaultValue: [],
  });

export const checkBackend = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('[api] Backend health check failed', error);
    return false;
  }
};
