import type { Governorate, User } from '../types.ts';
import { UserRole } from '../types.ts';
import { fetchCandidates, mapBackendCandidateToUser } from './backendClient.ts';
import { getUsers } from './apiService.ts';

export interface CandidateQueryOptions {
    governorate?: Governorate | 'All';
    party?: string | 'All';
    gender?: 'Male' | 'Female' | 'All';
    search?: string;
    governorateSlug?: string;
    partySlug?: string;
    page?: number;
    limit?: number;
}

const toOptionalFilter = (value: string | undefined | null) => {
    const trimmed = value?.trim();
    return trimmed && trimmed !== 'All' ? trimmed : undefined;
};

const toOptionalGovernorate = (value: Governorate | 'All' | undefined) => {
    return value && value !== 'All' ? value : undefined;
};

export const loadCandidateDirectory = async (options: CandidateQueryOptions = {}): Promise<User[]> => {
    const { governorate, party, gender, search, governorateSlug, partySlug, page, limit } = options;

    const backendParams: Record<string, string | number | undefined> = {
        governorate: toOptionalGovernorate(governorate),
        party: toOptionalFilter(party),
        gender: toOptionalFilter(gender),
        search: toOptionalFilter(search),
        page,
        limit,
    };

    try {
        const response = await fetchCandidates(backendParams);
        const remoteCandidates = response.data.map(mapBackendCandidateToUser);
        if (remoteCandidates.length > 0) {
            return remoteCandidates;
        }
    } catch (error) {
        console.warn('Falling back to mock candidate directory data due to backend error.', error);
    }

    return getUsers({
        role: UserRole.Candidate,
        governorate: governorate ?? 'All',
        governorateSlug: governorateSlug ?? (governorate && governorate !== 'All' ? governorate : undefined),
        party: party ?? 'All',
        partySlug: partySlug ?? (party && party !== 'All' ? party : undefined),
        gender: (gender ?? 'All') as 'Male' | 'Female' | 'All',
    });
};
