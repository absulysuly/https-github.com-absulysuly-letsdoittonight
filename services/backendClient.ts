import type { Governorate, User } from '../types.ts';
import { UserRole } from '../types.ts';
import { GOVERNORATES } from '../constants.ts';

const DEFAULT_API_BASE = 'https://hamlet-unified-complete-2027-production.up.railway.app';

const runtimeEnv = (() => {
    try {
        // Vite exposes environment variables on import.meta.env, Next on process.env
        if (typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined') {
            return import.meta.env as Record<string, string | undefined>;
        }
    } catch (error) {
        // noop - import.meta not supported in this environment
    }
    return undefined;
})();

const envApiBase =
    (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL)) ??
    (runtimeEnv?.VITE_API_BASE_URL ?? runtimeEnv?.NEXT_PUBLIC_API_BASE_URL);

export const API_BASE = (envApiBase?.replace(/\/$/, '') || DEFAULT_API_BASE) as string;

const resolveApiUrl = (path: string) => {
    if (!path.startsWith('/')) {
        return `${API_BASE}/${path}`;
    }
    return `${API_BASE}${path}`;
};

interface BackendCandidateRecord {
    id?: string;
    full_name?: string;
    gender?: string;
    governorate?: string;
    party?: string;
    avatar_url?: string;
    biography?: string;
}

interface BackendCandidateResponse {
    data: BackendCandidateRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const isGovernorate = (value: string): value is Governorate => {
    return (GOVERNORATES as readonly string[]).includes(value);
};

const slugify = (value: string | undefined) => {
    if (!value) {
        return undefined;
    }
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

export const mapBackendCandidateToUser = (record: BackendCandidateRecord): User => {
    const name = record.full_name?.trim() || 'Candidate';
    const governorate = record.governorate && isGovernorate(record.governorate) ? record.governorate : 'Baghdad';
    const party = record.party?.trim() || 'Independent';

    return {
        id: record.id ?? `candidate-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name,
        role: UserRole.Candidate,
        avatarUrl:
            record.avatar_url ||
            `https://ui-avatars.com/api/?background=0D9488&color=fff&name=${encodeURIComponent(name)}`,
        verified: false,
        party,
        governorate,
        partySlug: slugify(party),
        governorateSlug: slugify(governorate),
        bio: record.biography,
        gender: record.gender === 'Female' ? 'Female' : 'Male',
    };
};

const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${text}`);
    }
    return response.json() as Promise<T>;
};

export const fetchJson = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const url = resolveApiUrl(path);
    const response = await fetch(url, {
        credentials: 'include',
        headers: { ...defaultHeaders, ...init.headers },
        ...init,
    });
    return handleResponse<T>(response);
};

export const fetchCandidates = async (
    params: Partial<{
        page: number;
        limit: number;
        governorate: string;
        party: string;
        gender: string;
        search: string;
    }> = {}
): Promise<BackendCandidateResponse> => {
    const url = new URL(resolveApiUrl('/api/candidates'));
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, String(value));
        }
    });
    const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: defaultHeaders,
    });
    return handleResponse<BackendCandidateResponse>(response);
};

export const fetchStats = async () => {
    return fetchJson<{ totalCandidates: number; loadedAt: string }>('/api/stats');
};

export const fetchHealth = async () => {
    return fetchJson<{ status: string; time: number }>('/api/health');
};

export type { BackendCandidateRecord, BackendCandidateResponse };
