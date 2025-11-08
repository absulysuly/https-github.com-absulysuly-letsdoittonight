import { useState, useEffect } from 'react';
import * as api from '../../../services/apiService.ts';
import { User, UserRole } from '../../../types.ts';
import { ApiConfig, DataCollectionStats, ContactValidationItem, EnrichmentData, QualityAnalyticsData } from '../types.ts';

const useApiData = <T>(fetcher: () => Promise<T>) => {
    const [state, setState] = useState<{ data: T | null, isLoading: boolean, error: Error | null }>({ data: null, isLoading: true, error: null });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetcher();
                setState({ data, isLoading: false, error: null });
            } catch (err: any) {
                setState({ data: null, isLoading: false, error: err });
            }
        };
        fetchData();
    }, [fetcher]);

    return state;
};

// --- HOOKS ---
export const useApiConfig = () => useApiData<ApiConfig[]>(api.getApiConfig);

export const useDataCollection = () => {
    // This hook can remain slightly more complex if it needs to simulate real-time updates via polling
    const [stats, setStats] = useState<DataCollectionStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getDataCollectionStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch initial collection stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        
        // Polling to simulate real-time updates
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return { data: stats, isLoading };
};

export const useContactValidationData = () => useApiData<ContactValidationItem[]>(api.getContactValidationData);

export const useEnrichmentData = (candidateId: string) => {
    const [state, setState] = useState<{ data: EnrichmentData | null, isLoading: boolean, error: Error | null }>({ data: null, isLoading: true, error: null });
    
    useEffect(() => {
        if (!candidateId) {
            setState({ data: null, isLoading: false, error: null });
            return;
        }
        const fetchData = async () => {
            setState({ data: null, isLoading: true, error: null });
            try {
                const data = await api.getEnrichmentData(candidateId);
                setState({ data, isLoading: false, error: null });
            } catch (err: any) {
                setState({ data: null, isLoading: false, error: err });
            }
        };
        fetchData();
    }, [candidateId]);

    return state;
};

export const useQualityAnalyticsData = () => useApiData<QualityAnalyticsData>(api.getQualityAnalyticsData);

export const useAllCandidates = () => {
    const [candidates, setCandidates] = useState<User[]>([]);
    useEffect(() => {
        api.getUsers({ role: UserRole.Candidate }).then(setCandidates);
    }, []);
    return candidates;
}