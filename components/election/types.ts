// Fix: Defining types for the election portal part of the application.
export interface Candidate {
    id: string;
    name: string;
    party: string;
    imageUrl: string;
    verified: boolean;
}

export interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    date: string;
}

export interface PoliticalParty {
    id: string;
    name: string;
    description: string;
    leader: string;
    founded: number;
    logoUrl: string;
}


// --- Data Management & Dashboard Types ---

export interface DashboardStats {
    totalElections: number;
    activeElections: number;
    totalCandidates: number;
    validatedContacts: number;
}
export interface ParticipationData {
    governorateId: number;
    governorateName: string;
    estimatedTurnout: number;
}

export interface ApiConfig {
    id: string;
    name: string;
    status: 'Connected' | 'Disconnected';
    lastChecked: string;
}

export interface DataCollectionStats {
    status: 'Running' | 'Stopped' | 'Paused';
    candidatesFound: number;
    profilesScraped: number;
    contactsCollected: number;
    progress: number;
    log: string[];
}

export interface ContactValidationItem {
    id: string;
    contact: string;
    type: 'Phone' | 'Email';
    candidate: string;
    quality: number;
    status: 'Verified' | 'Pending' | 'Invalid';
}

export interface EnrichmentData {
    politicalProfile: string;
    influence: {
        socialReach: number;
        engagementRate: number;
        sentiment: 'Positive' | 'Negative' | 'Neutral';
    };
}

export interface QualityAnalyticsData {
    overallQuality: {
        verified: number;
        pending: number;
        invalid: number;
    };
    qualityByGov: { name: string; quality: number }[];
}

export interface Election {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'inactive';
    startDate: string; // ISO string
    endDate: string; // ISO string
    createdAt: string; // ISO string
}
