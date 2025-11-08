/**
 * Unified API Service — Live + Mock Fallback
 * Connects frontend to the Hamlet Unified backend, but still works offline using mock data.
 */

import {
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_EVENTS,
  MOCK_ARTICLES,
  MOCK_DEBATES,
  MOCK_TEA_HOUSE_TOPICS,
  MOCK_TEA_HOUSE_MESSAGES,
  PARTY_SLUG_MAP,
  SLUG_PARTY_MAP,
  IRAQI_GOVERNORATES_INFO,
} from "../constants.ts";
import {
  User,
  UserRole,
  Post,
  Event,
  Debate,
  TeaHouseTopic,
  TeaHouseMessage,
  Language,
  Governorate,
  GovernorateInfo,
} from "../types.ts";
import type {
  DashboardStats,
  ParticipationData,
  Candidate as ElectionCandidate,
  NewsArticle,
  PoliticalParty,
  ApiConfig,
  DataCollectionStats,
  ContactValidationItem,
  EnrichmentData,
  QualityAnalyticsData,
} from "../components/election/types.ts";

type SafeFetchRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null | undefined;
};

type Fallback<T> = T | (() => T);

type UserFilters = Partial<{
  role: UserRole;
  governorate: Governorate | "All";
  party: string | "All";
  gender: "Male" | "Female";
  search: string;
}>;

type PostFilters = Partial<{
  authorId: string;
  governorate: Governorate | "All";
  party: string | "All";
  type: Post["type"];
  search: string;
}>;

type EventFilters = Partial<{
  governorate: Governorate | "All";
  party: string | "All";
}>;

type DebateFilters = Partial<{
  governorate: Governorate | "All";
  party: string | "All";
  participantIds: string[];
}>;

const DEFAULT_API_BASE_URL =
  "https://hamlet-unified-complete-2027-production.up.railway.app";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  DEFAULT_API_BASE_URL;
const USE_MOCKS = `${import.meta.env.VITE_USE_MOCKS ?? ""}`.toLowerCase() === "true";

const resolveFallback = <T>(fallback: Fallback<T>): T =>
  typeof fallback === "function" ? (fallback as () => T)() : fallback;

const buildQueryString = (params: Record<string, string | undefined | string[]>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      search.set(key, value.join(","));
    } else {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

async function safeFetch<T>(
  endpoint: string,
  init: SafeFetchRequestInit = {},
  fallback: Fallback<T>,
  parser?: (response: Response) => Promise<T>,
  mockData?: Fallback<T>,
): Promise<T> {
  if (USE_MOCKS) {
    return resolveFallback(mockData ?? fallback);
  }

  const headers = new Headers(init.headers);
  let body = init.body ?? null;

  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  } else if (typeof body === "string" && body.length > 0) {
    headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...init,
      headers,
      body: body as BodyInit | null | undefined,
    });

    if (!response.ok) {
      console.warn(`API request failed for ${endpoint}: ${response.status}`);
      return resolveFallback(fallback);
    }

    if (parser) {
      return await parser(response);
    }

    if (response.status === 204) {
      return resolveFallback(fallback);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return resolveFallback(fallback);
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    return resolveFallback(fallback);
  }
}

const filterUsers = (filters: UserFilters = {}): User[] => {
  const query = filters.search?.toLowerCase().trim();
  return MOCK_USERS.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.governorate && filters.governorate !== "All" && user.governorate !== filters.governorate) return false;
    if (filters.party && filters.party !== "All" && user.party !== filters.party) return false;
    if (filters.gender && user.gender && user.gender !== filters.gender) return false;
    if (query && !user.name.toLowerCase().includes(query)) return false;
    return true;
  });
};

const filterPosts = (filters: PostFilters = {}): Post[] => {
  const query = filters.search?.toLowerCase().trim();
  return MOCK_POSTS.filter((post) => {
    if (filters.authorId && post.author.id !== filters.authorId) return false;
    if (filters.type && post.type !== filters.type) return false;
    if (filters.governorate && filters.governorate !== "All" && post.author.governorate !== filters.governorate) return false;
    if (filters.party && filters.party !== "All" && post.author.party !== filters.party) return false;
    if (query && !post.content.toLowerCase().includes(query)) return false;
    return true;
  });
};

const filterEvents = (filters: EventFilters = {}): Event[] =>
  MOCK_EVENTS.filter((event) => {
    if (filters.governorate && filters.governorate !== "All" && !event.location.includes(filters.governorate)) {
      return false;
    }
    if (filters.party && filters.party !== "All" && event.organizer.party !== filters.party) {
      return false;
    }
    return true;
  });

const filterDebates = (filters: DebateFilters = {}): Debate[] =>
  MOCK_DEBATES.filter((debate) => {
    if (filters.governorate && filters.governorate !== "All") {
      const hasGovernorate = debate.participants.some(
        (participant) => participant.governorate === filters.governorate,
      );
      if (!hasGovernorate) return false;
    }
    if (filters.party && filters.party !== "All") {
      const hasParty = debate.participants.some((participant) => participant.party === filters.party);
      if (!hasParty) return false;
    }
    if (filters.participantIds && filters.participantIds.length > 0) {
      const matchesParticipants = filters.participantIds.every((id) =>
        debate.participants.some((participant) => participant.id === id),
      );
      if (!matchesParticipants) return false;
    }
    return true;
  });

const uniqueParties = (): string[] => Array.from(new Set(MOCK_USERS.map((user) => user.party))).sort();

const ensureUserExists = (user?: User): User => {
  if (user) {
    const existing = MOCK_USERS.find((item) => item.id === user.id);
    if (!existing) {
      MOCK_USERS.push(user);
    }
    return user;
  }

  const fallbackUser = MOCK_USERS.find((item) => item.role === UserRole.Voter) ?? MOCK_USERS[0];
  return fallbackUser;
};

const createMockTeaHouseMessage = (
  topicId: string,
  author: User,
  content: string,
): TeaHouseMessage => ({
  id: `msg-${Date.now()}`,
  author,
  type: "text",
  content,
  timestamp: "just now",
});

const toElectionCandidate = (user: User): ElectionCandidate => ({
  id: user.id,
  name: user.name,
  party: user.party,
  imageUrl: user.avatarUrl,
  verified: Boolean(user.verified),
});

const getMockNewsArticles = (limit = 4): NewsArticle[] =>
  MOCK_ARTICLES.slice(0, limit).map((article, index) => ({
    id: article.id ?? `news-${index}`,
    title: article.title,
    summary: article.contentSnippet,
    date: article.timestamp,
  }));

let cachedContactValidation: ContactValidationItem[] | null = null;

const getMockContactValidationData = (): ContactValidationItem[] => {
  if (cachedContactValidation) {
    return cachedContactValidation;
  }

  const candidates = filterUsers({ role: UserRole.Candidate }).slice(0, 6);
  cachedContactValidation = candidates.map((candidate, index) => {
    const isPhone = index % 2 === 0;
    const contact = isPhone
      ? `+9647${(index + 1).toString().padStart(9, "0")}`
      : `${candidate.name.replace(/\s+/g, ".").toLowerCase()}@campaign.iq`;

    const statusCycle: ContactValidationItem["status"][] = [
      "Verified",
      "Pending",
      "Invalid",
    ];

    return {
      id: `contact-${candidate.id}`,
      contact,
      type: isPhone ? "Phone" : "Email",
      candidate: candidate.name,
      quality: 60 + ((index * 7) % 35),
      status: statusCycle[index % statusCycle.length],
    };
  });

  return cachedContactValidation;
};

const buildPartyProfile = (id: string, name: string, candidateUsers: User[]): PoliticalParty => ({
  id,
  name,
  description: `${name} يركز على الإصلاح والتنمية المتوازنة عبر محافظات العراق.`,
  leader: candidateUsers[0]?.name ?? "غير متوفر",
  founded: 2005,
  logoUrl: `https://ui-avatars.com/api/?background=0ea5e9&color=ffffff&name=${encodeURIComponent(name)}`,
});

const getMockQualityAnalytics = (): QualityAnalyticsData => {
  const contacts = getMockContactValidationData();
  const overall = contacts.reduce(
    (acc, item) => {
      if (item.status === "Verified") acc.verified += 1;
      if (item.status === "Pending") acc.pending += 1;
      if (item.status === "Invalid") acc.invalid += 1;
      return acc;
    },
    { verified: 0, pending: 0, invalid: 0 },
  );

  const qualityByGovMap = new Map<string, { total: number; sum: number }>();
  contacts.forEach((item) => {
    const user = MOCK_USERS.find((candidate) => candidate.name === item.candidate);
    if (!user) return;
    const current = qualityByGovMap.get(user.governorate) ?? { total: 0, sum: 0 };
    current.total += 1;
    current.sum += item.quality;
    qualityByGovMap.set(user.governorate, current);
  });

  const qualityByGov = Array.from(qualityByGovMap.entries()).map(([gov, stats]) => ({
    name: gov,
    quality: Math.round(stats.sum / stats.total),
  }));

  return {
    overallQuality: overall,
    qualityByGov,
  };
};

const getMockEnrichmentData = (candidateId: string): EnrichmentData => {
  const user = MOCK_USERS.find((candidate) => candidate.id === candidateId);
  const baseName = user?.name ?? "المرشح";
  const reachSeed = (user?.id.length ?? 5) * 7500;
  const engagementBase = 2.5 + ((user?.id.charCodeAt(0) ?? 65) % 5) * 0.35;

  return {
    politicalProfile: `${baseName} يركز على الشفافية، مكافحة الفساد، وتمكين المجتمعات المحلية من خلال الابتكار والخدمات العامة.`,
    influence: {
      socialReach: 25_000 + reachSeed,
      engagementRate: parseFloat(engagementBase.toFixed(2)),
      sentiment: "Positive",
    },
  };
};

// --- Authentication & User Management ---
export const socialLogin = async (
  provider: "google" | "facebook",
): Promise<User | null> => {
  const mockUser = () => {
    const baseUser = ensureUserExists({
      id: `social-${provider}-${Date.now()}`,
      name: provider === "google" ? "Google User" : "Facebook User",
      role: UserRole.Voter,
      avatarUrl: "https://i.pravatar.cc/150?u=social-user",
      verified: false,
      party: "Independent",
      governorate: "Baghdad",
      email: `${provider}-user@example.com`,
      emailVerified: true,
    });

    baseUser.emailVerified = true;
    return baseUser;
  };

  return safeFetch<User | null>(
    "/api/auth/social-login",
    {
      method: "POST",
      body: { provider },
    },
    mockUser,
    undefined,
    mockUser,
  );
};

export const registerUser = async (
  details: { name: string; email: string; role: UserRole },
): Promise<User | null> => {
  const mockRegistration = () => {
    const id = `user-${Date.now()}`;
    const newUser: User = {
      id,
      name: details.name,
      role: details.role,
      avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
      verified: false,
      party: "Independent",
      governorate: "Baghdad",
      email: details.email,
      emailVerified: false,
    };
    MOCK_USERS.push(newUser);
    return newUser;
  };

  return safeFetch<User | null>(
    "/api/auth/register",
    {
      method: "POST",
      body: details,
    },
    mockRegistration,
    undefined,
    mockRegistration,
  );
};

export const checkVerificationStatus = async (userId: string): Promise<User | null> => {
  const mockCheck = () => {
    const user = MOCK_USERS.find((item) => item.id === userId);
    if (!user) return null;
    user.emailVerified = true;
    return user;
  };

  return safeFetch<User | null>(
    `/api/auth/verification-status/${userId}`,
    { method: "GET" },
    mockCheck,
    undefined,
    mockCheck,
  );
};

export const resendVerificationEmail = async (userId: string): Promise<{ success: boolean }> => {
  const mockResend = () => ({ success: true });
  return safeFetch<{ success: boolean }>(
    `/api/auth/${userId}/resend-verification`,
    { method: "POST" },
    () => ({ success: false }),
    async () => ({ success: true }),
    mockResend,
  );
};

export const updateUser = async (
  userId: string,
  updates: Partial<User>,
): Promise<User | null> => {
  const mockUpdate = () => {
    const user = MOCK_USERS.find((item) => item.id === userId);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  };

  return safeFetch<User | null>(
    `/api/users/${userId}`,
    {
      method: "PATCH",
      body: updates,
    },
    mockUpdate,
    undefined,
    mockUpdate,
  );
};

// --- Core Collections ---
export const getUsers = async (filters: UserFilters = {}): Promise<User[]> => {
  const query = buildQueryString({
    role: filters.role,
    governorate: filters.governorate && filters.governorate !== "All" ? filters.governorate : undefined,
    party: filters.party && filters.party !== "All" ? filters.party : undefined,
    gender: filters.gender,
    search: filters.search?.trim() || undefined,
  });

  const mock = () => filterUsers(filters);
  return safeFetch<User[]>(
    `/api/users${query}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getCandidates = async (filters: UserFilters = {}): Promise<User[]> =>
  getUsers({ ...filters, role: UserRole.Candidate });

export const getPosts = async (filters: PostFilters = {}): Promise<Post[]> => {
  const query = buildQueryString({
    authorId: filters.authorId,
    governorate: filters.governorate && filters.governorate !== "All" ? filters.governorate : undefined,
    party: filters.party && filters.party !== "All" ? filters.party : undefined,
    type: filters.type,
    search: filters.search?.trim() || undefined,
  });

  const mock = () => filterPosts(filters);
  return safeFetch<Post[]>(
    `/api/posts${query}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getEvents = async (filters: EventFilters = {}): Promise<Event[]> => {
  const query = buildQueryString({
    governorate: filters.governorate && filters.governorate !== "All" ? filters.governorate : undefined,
    party: filters.party && filters.party !== "All" ? filters.party : undefined,
  });

  const mock = () => filterEvents(filters);
  return safeFetch<Event[]>(
    `/api/events${query}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getArticles = async () =>
  safeFetch(
    "/api/articles",
    { method: "GET" },
    () => MOCK_ARTICLES,
    undefined,
    () => MOCK_ARTICLES,
  );

export const getParties = async (): Promise<string[]> => {
  const mock = () => Object.keys(PARTY_SLUG_MAP);
  return safeFetch<string[]>(
    "/api/parties",
    { method: "GET" },
    () => uniqueParties(),
    undefined,
    mock,
  );
};

// --- Election Portal Data ---
export const getGovernorateDataByName = async (
  name: string,
): Promise<{ governorate: GovernorateInfo; candidates: ElectionCandidate[]; news: NewsArticle[] } | null> => {
  const mock = () => {
    const normalized = name.trim().toLowerCase();
    const governorate = IRAQI_GOVERNORATES_INFO.find(
      (info) =>
        info.enName.toLowerCase() === normalized ||
        info.name.toLowerCase() === normalized ||
        info.slug.toLowerCase() === normalized,
    );

    if (!governorate) {
      return null;
    }

    const candidates = filterUsers({
      role: UserRole.Candidate,
      governorate: governorate.enName,
    }).map(toElectionCandidate);

    return {
      governorate,
      candidates,
      news: getMockNewsArticles(),
    };
  };

  return safeFetch(
    `/api/election/governorates/${encodeURIComponent(name)}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getPartyById = async (
  id: string,
): Promise<{ party: PoliticalParty; candidates: ElectionCandidate[] } | null> => {
  const mock = () => {
    const normalized = id.trim().toLowerCase();
    const partyNameFromSlug = SLUG_PARTY_MAP[normalized];
    const partyNameFromMap = Object.keys(PARTY_SLUG_MAP).find(
      (name) => PARTY_SLUG_MAP[name].toLowerCase() === normalized,
    );
    const partyName = partyNameFromSlug ?? partyNameFromMap ?? id;

    const candidateUsers = filterUsers({ role: UserRole.Candidate }).filter(
      (candidate) => candidate.party === partyName,
    );

    if (!partyNameFromSlug && !partyNameFromMap && candidateUsers.length === 0) {
      return null;
    }

    return {
      party: buildPartyProfile(id, partyName, candidateUsers),
      candidates: candidateUsers.map(toElectionCandidate),
    };
  };

  return safeFetch(
    `/api/election/parties/${encodeURIComponent(id)}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getAllElectionCandidates = async (): Promise<ElectionCandidate[]> => {
  const mock = () => filterUsers({ role: UserRole.Candidate }).map(toElectionCandidate);
  return safeFetch<ElectionCandidate[]>(
    "/api/election/candidates",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getApiConfig = async (): Promise<ApiConfig[]> => {
  const timestamp = new Date().toISOString();
  const mock = () => [
    { id: "core", name: "Core API", status: "Connected", lastChecked: timestamp },
    { id: "analytics", name: "Analytics Service", status: "Connected", lastChecked: timestamp },
    { id: "notifications", name: "Notification Queue", status: "Disconnected", lastChecked: timestamp },
  ];

  return safeFetch<ApiConfig[]>(
    "/api/election/api-config",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getDataCollectionStats = async (): Promise<DataCollectionStats> => {
  const mock = () => {
    const totalCandidates = filterUsers({ role: UserRole.Candidate }).length;
    const safeTotal = Math.max(totalCandidates, 1);
    const profilesScraped = Math.round(safeTotal * 0.65);
    const contactsCollected = profilesScraped * 2;
    const progress = Math.min(100, Math.round((profilesScraped / safeTotal) * 100));

    return {
      status: "Running",
      candidatesFound: totalCandidates,
      profilesScraped,
      contactsCollected,
      progress,
      log: [
        "Initializing data collectors...",
        `Scraped ${profilesScraped} candidate profiles.`,
        `Validated ${contactsCollected} contact points.`,
      ],
    };
  };

  return safeFetch<DataCollectionStats>(
    "/api/election/data-collection",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getContactValidationData = async (): Promise<ContactValidationItem[]> => {
  const mock = () => getMockContactValidationData().map((item) => ({ ...item }));
  return safeFetch<ContactValidationItem[]>(
    "/api/election/contact-validation",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getEnrichmentData = async (
  candidateId: string,
): Promise<EnrichmentData> => {
  const mock = () => getMockEnrichmentData(candidateId);
  return safeFetch<EnrichmentData>(
    `/api/election/enrichment/${encodeURIComponent(candidateId)}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getQualityAnalyticsData = async (): Promise<QualityAnalyticsData> => {
  const mock = () => getMockQualityAnalytics();
  return safeFetch<QualityAnalyticsData>(
    "/api/election/quality-analytics",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

// --- Engagement ---
export const likePost = async (postId: string): Promise<{ success: boolean }> => {
  const mockLike = () => {
    const post = MOCK_POSTS.find((item) => item.id === postId);
    if (post) {
      post.likes += 1;
      return { success: true };
    }
    return { success: false };
  };

  return safeFetch<{ success: boolean }>(
    `/api/posts/${postId}/like`,
    { method: "POST" },
    () => ({ success: false }),
    undefined,
    mockLike,
  );
};

export const followCandidate = async (candidateId: string): Promise<{ success: boolean }> => {
  const mockFollow = () => ({ success: MOCK_USERS.some((user) => user.id === candidateId) });
  return safeFetch<{ success: boolean }>(
    `/api/candidates/${candidateId}/follow`,
    { method: "POST" },
    () => ({ success: false }),
    async (response) => (await response.json()) as { success: boolean },
    mockFollow,
  );
};

// --- Debates & Tea House ---
export const getDebates = async (filters: DebateFilters = {}): Promise<Debate[]> => {
  const query = buildQueryString({
    governorate: filters.governorate && filters.governorate !== "All" ? filters.governorate : undefined,
    party: filters.party && filters.party !== "All" ? filters.party : undefined,
    participantIds: filters.participantIds && filters.participantIds.length > 0 ? filters.participantIds : undefined,
  });

  const mock = () => filterDebates(filters);
  return safeFetch<Debate[]>(
    `/api/debates${query}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getTeaHouseTopics = async (language: Language): Promise<TeaHouseTopic[]> => {
  const mock = () =>
    MOCK_TEA_HOUSE_TOPICS.filter((topic) =>
      topic.language ? topic.language === language : true,
    );

  return safeFetch<TeaHouseTopic[]>(
    `/api/teahouse/topics${buildQueryString({ language })}`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getTeaHouseMessages = async (topicId: string): Promise<TeaHouseMessage[]> => {
  const mock = () => MOCK_TEA_HOUSE_MESSAGES[topicId] ?? [];
  return safeFetch<TeaHouseMessage[]>(
    `/api/teahouse/topics/${topicId}/messages`,
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const createTeaHouseTopic = async (
  data: { title: string; firstMessage: string; category: string; language: Language },
): Promise<TeaHouseTopic> => {
  const mockCreate = () => {
    const id = `topic-${Date.now()}`;
    const topic: TeaHouseTopic = {
      id,
      title: data.title,
      lastMessage: data.firstMessage,
      participants: 1,
      lastActivity: "just now",
      category: data.category,
      language: data.language,
    };
    MOCK_TEA_HOUSE_TOPICS.unshift(topic);

    const author = ensureUserExists();
    MOCK_TEA_HOUSE_MESSAGES[id] = [
      createMockTeaHouseMessage(id, author, data.firstMessage),
    ];

    return topic;
  };

  return safeFetch<TeaHouseTopic>(
    "/api/teahouse/topics",
    {
      method: "POST",
      body: data,
    },
    mockCreate,
    undefined,
    mockCreate,
  );
};

// --- Analytics ---
export const getCandidateStats = async (): Promise<{ total: number; women: number }> => {
  const mock = () => {
    const candidates = MOCK_USERS.filter((user) => user.role === UserRole.Candidate);
    const women = candidates.filter((candidate) => candidate.gender === "Female").length;
    return { total: candidates.length, women };
  };

  return safeFetch<{ total: number; women: number }>(
    "/api/candidates/stats",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

export const getDashboardStats = async (): Promise<{
  stats: DashboardStats;
  participation: ParticipationData[];
}> => {
  const mock = () => ({
    stats: {
      totalRegisteredVoters: 12_500_000,
      approvedCandidatesCount: 7_769,
      expectedTurnoutPercentage: 65,
    },
    participation: IRAQI_GOVERNORATES_INFO.map((governorate) => ({
      governorateId: governorate.id,
      governorateName: governorate.name,
      estimatedTurnout: parseFloat((40 + Math.random() * 30).toFixed(2)),
    })),
  });

  return safeFetch(
    "/api/dashboard/stats",
    { method: "GET" },
    mock,
    undefined,
    mock,
  );
};

// --- Content Creation ---
export const createPost = async (data: Partial<Post>, user?: User): Promise<Post> => {
  const author = ensureUserExists(user);
  const mockCreate = () => {
    const id = `post-${Date.now()}`;
    const newPost: Post = {
      id,
      author,
      content: data.content || "",
      timestamp: "just now",
      likes: 0,
      comments: 0,
      shares: 0,
      type: data.type ?? "Post",
      mediaUrl: data.mediaUrl,
      duration: data.duration,
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  };

  return safeFetch<Post>(
    "/api/posts",
    {
      method: "POST",
      body: { ...data, authorId: author.id },
    },
    mockCreate,
    undefined,
    mockCreate,
  );
};

export const createReel = async (
  reelDetails: { caption: string; videoFile?: File },
  user: User,
): Promise<Post> => {
  const author = ensureUserExists(user);
  const mockCreate = () => {
    const id = `reel-${Date.now()}`;
    const newReel: Post = {
      id,
      author,
      content: reelDetails.caption,
      timestamp: "just now",
      likes: 0,
      comments: 0,
      shares: 0,
      type: "Reel",
      mediaUrl: reelDetails.videoFile ? `blob:mock-reel-${id}` : undefined,
    };
    MOCK_POSTS.unshift(newReel);
    return newReel;
  };

  return safeFetch<Post>(
    "/api/reels",
    {
      method: "POST",
      body: {
        caption: reelDetails.caption,
        authorId: author.id,
      },
    },
    mockCreate,
    undefined,
    mockCreate,
  );
};

export const createEvent = async (
  eventDetails: { title: string; date: string; location: string },
  user: User,
): Promise<Event> => {
  const organizer = ensureUserExists(user);
  const mockCreate = () => {
    const event: Event = {
      id: `event-${Date.now()}`,
      title: eventDetails.title,
      date: eventDetails.date,
      location: eventDetails.location,
      organizer,
    };
    MOCK_EVENTS.unshift(event);
    return event;
  };

  return safeFetch<Event>(
    "/api/events",
    {
      method: "POST",
      body: {
        ...eventDetails,
        organizerId: organizer.id,
      },
    },
    mockCreate,
    undefined,
    mockCreate,
  );
};

// --- Reporting ---
export const submitIntegrityReport = async (
  formData: FormData,
): Promise<{ success: boolean; trackingId?: string }> => {
  const mockSubmit = () => ({
    success: true,
    trackingId: `IR-${Date.now().toString(36).toUpperCase()}`,
  });

  return safeFetch<{ success: boolean; trackingId?: string }>(
    "/api/integrity/reports",
    {
      method: "POST",
      body: formData,
    },
    () => ({ success: false }),
    async (response) => (await response.json()) as { success: boolean; trackingId?: string },
    mockSubmit,
  );
};

// --- Utility ---
export const checkBackend = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch (error) {
    console.warn("Backend health check failed", error);
    return false;
  }
};

