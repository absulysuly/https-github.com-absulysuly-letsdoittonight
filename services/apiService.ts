import { User, UserRole, Post, Event, Article, Debate, Region, TeaHouseTopic, TeaHouseMessage, Language } from '../types.ts';
import { MOCK_USERS, MOCK_POSTS, MOCK_EVENTS, MOCK_ARTICLES, MOCK_DEBATES, MOCK_TEA_HOUSE_TOPICS, MOCK_TEA_HOUSE_MESSAGES, IRAQI_REGIONS_INFO, MOCK_IHEC_POSTS } from '../constants.ts';
import { Member, NewsArticle, PoliticalParty, DashboardStats, ParticipationData, ApiConfig, DataCollectionStats, ContactValidationItem, EnrichmentData, QualityAnalyticsData } from '../components/community/types.ts';

// --- MOCK API Service ---
// This service simulates API calls by returning mock data after a short delay.

const simulateDelay = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 300 + Math.random() * 500);
    });
};

export const getParties = (): Promise<string[]> => {
    const parties = [...new Set(MOCK_USERS.filter(u => u.role === UserRole.Member).map(u => u.party))];
    return simulateDelay(parties);
};

export const getMemberStats = (): Promise<{ total: number; women: number; men: number; }> => {
    const members = MOCK_USERS.filter(u => u.role === UserRole.Member);
    const women = members.filter(c => c.gender === 'Female').length;
    const men = members.length - women;
    return simulateDelay({ total: members.length, women, men });
};

export const getUsers = (filters: { role?: UserRole, region?: Region | 'All', party?: string | 'All', gender?: 'Male' | 'Female' | 'All', authorId?: string, partySlug?: string, regionSlug?: string }): Promise<User[]> => {
    let users = MOCK_USERS;
    if (filters.role) {
        users = users.filter(u => u.role === filters.role);
    }
    if (filters.region && filters.region !== 'All') {
        users = users.filter(u => u.region === filters.region);
    }
    if (filters.party && filters.party !== 'All') {
        users = users.filter(u => u.party === filters.party);
    }
    if (filters.gender && filters.gender !== 'All') {
        users = users.filter(u => u.gender === filters.gender);
    }
    if (filters.authorId) {
        users = users.filter(u => u.id === filters.authorId);
    }
    if (filters.partySlug) {
        users = users.filter(u => u.partySlug === filters.partySlug);
    }
    if (filters.regionSlug) {
        users = users.filter(u => u.regionSlug === filters.regionSlug);
    }
    return simulateDelay(users);
};

export const getPosts = (filters: { type?: 'Post' | 'Reel' | 'VoiceNote', authorId?: string, region?: Region | 'All', party?: string | 'All' }): Promise<Post[]> => {
    let posts = MOCK_POSTS;
    if (filters.type) {
        posts = posts.filter(p => p.type === filters.type);
    }
    if (filters.authorId) {
        posts = posts.filter(p => p.author.id === filters.authorId);
    }
    if (filters.region && filters.region !== 'All') {
        posts = posts.filter(p => p.author.region === filters.region);
    }
    if (filters.party && filters.party !== 'All') {
        posts = posts.filter(p => p.author.party === filters.party);
    }
    return simulateDelay(posts);
};

export const getUserStories = (userId: string): Promise<Post[]> => {
    const user = MOCK_USERS.find(u => u.id === userId);
    const stories = user?.stories || [];
    return simulateDelay(stories);
};

export const getIHECPosts = (): Promise<Post[]> => {
    return simulateDelay(MOCK_IHEC_POSTS);
};

export const getEvents = (filters: { region?: Region | 'All', party?: string | 'All' }): Promise<Event[]> => {
    let events = MOCK_EVENTS;
    if (filters.region && filters.region !== 'All') {
        events = events.filter(e => e.organizer.region === filters.region);
    }
    if (filters.party && filters.party !== 'All') {
        events = events.filter(e => e.organizer.party === filters.party);
    }
    return simulateDelay(events);
};

export const getArticles = (filters: { region?: Region | 'All' }): Promise<Article[]> => {
    return simulateDelay(MOCK_ARTICLES);
};

export const getDebates = (filters: { region?: Region | 'All', party?: string | 'All', participantIds?: string[] }): Promise<Debate[]> => {
    let debates = MOCK_DEBATES;
    // Apply filters if needed
    return simulateDelay(debates);
};

export const createPost = (postDetails: Partial<Post> & { mediaFile?: File }, author: User): Promise<Post> => {
    const newPost: Post = {
        id: `post-${Date.now()}`,
        author,
        content: postDetails.content || '',
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'Post',
        ...postDetails,
    };
    if (postDetails.mediaFile) {
        newPost.mediaUrl = URL.createObjectURL(postDetails.mediaFile);
        newPost.mediaType = postDetails.mediaFile.type.startsWith('video') ? 'video' : 'image';
    }

    MOCK_POSTS.unshift(newPost);
    return simulateDelay(newPost);
};

export const createStory = (mediaFile: File, author: User): Promise<Post> => {
    const newStory: Post = {
        id: `story-${Date.now()}`,
        author,
        content: '',
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'Story',
        mediaUrl: URL.createObjectURL(mediaFile),
        mediaType: mediaFile.type.startsWith('video') ? 'video' : 'image',
    };
    
    const user = MOCK_USERS.find(u => u.id === author.id);
    if (user) {
        if (!user.stories) {
            user.stories = [];
        }
        user.stories.push(newStory);
    }
    return simulateDelay(newStory);
};


export const createReel = (details: { caption: string; videoFile?: File }, author: User): Promise<Post> => {
     const newReel: Post = {
        id: `reel-${Date.now()}`,
        author,
        content: details.caption,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'Reel',
        mediaUrl: '/assets/mock-video.mp4', // Placeholder
    };
    MOCK_POSTS.unshift(newReel);
    return simulateDelay(newReel);
};

export const createEvent = (details: { title: string, date: string, location: string }, organizer: User): Promise<Event> => {
    const newEvent: Event = {
        id: `event-${Date.now()}`,
        organizer,
        ...details,
    };
    MOCK_EVENTS.unshift(newEvent);
    return simulateDelay(newEvent);
};

export const socialLogin = (provider: 'google' | 'facebook'): Promise<User> => {
    // Return a mock supportr user that is already verified
    const user = { ...MOCK_USERS.find(u => u.role === UserRole.Supportr)! };
    user.emailVerified = true;
    return simulateDelay(user);
};

export const registerUser = (details: { name: string; email: string; role: UserRole }): Promise<User> => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: details.name,
        role: details.role,
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        verified: details.role === UserRole.Member,
        party: 'Independent',
        region: 'Baghdad',
        email: details.email,
        emailVerified: false,
        verificationCode,
    };
    MOCK_USERS.push(newUser);
    return simulateDelay(newUser);
};

export const checkVerificationStatus = (userId: string, code: string): Promise<User | null> => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user && user.verificationCode === code) {
        // If code matches, verify the user and remove the code.
        user.emailVerified = true;
        delete user.verificationCode;
    }
    return simulateDelay(user || null);
};

export const resendVerificationEmail = (userId: string): Promise<{ success: boolean }> => {
    return simulateDelay({ success: true });
};

export const updateUser = (userId: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates };
        return simulateDelay(MOCK_USERS[userIndex]);
    }
    return simulateDelay(null);
};

export const followMember = (memberId: string): Promise<{ success: boolean }> => {
    return simulateDelay({ success: true });
};

export const likePost = (postId: string): Promise<{ success: boolean }> => {
    return simulateDelay({ success: true });
};

export const uploadVoiceNote = async (audioBlob: Blob): Promise<{ success: boolean; url: string }> => {
    return simulateDelay({ success: true, url: URL.createObjectURL(audioBlob) });
};

// --- Tea House API ---
export const getTeaHouseTopics = (language: Language): Promise<TeaHouseTopic[]> => {
    return simulateDelay(MOCK_TEA_HOUSE_TOPICS.filter(t => t.language === language));
};

export const getTeaHouseMessages = (topicId: string): Promise<TeaHouseMessage[]> => {
    return simulateDelay(MOCK_TEA_HOUSE_MESSAGES[topicId] || []);
};

export const createTeaHouseTopic = (data: { title: string; firstMessage: string; category: string; language: Language; }): Promise<TeaHouseTopic> => {
    const newTopic: TeaHouseTopic = {
        id: `topic-${Date.now()}`,
        title: data.title,
        lastMessage: data.firstMessage,
        participants: 1,
        lastActivity: 'Just now',
        language: data.language,
        category: data.category,
    };
    MOCK_TEA_HOUSE_TOPICS.unshift(newTopic);
    return simulateDelay(newTopic);
};

// --- Community Portal API ---
export const submitIntegrityReport = async (formData: FormData): Promise<{ success: boolean; trackingId: string }> => {
    console.log("Submitting integrity report with data:", Object.fromEntries(formData));
    return simulateDelay({ success: true, trackingId: `IQ-REP-${Date.now()}` });
};

export const getDashboardStats = (): Promise<{ stats: DashboardStats; participation: ParticipationData[] }> => {
    return simulateDelay({
        stats: { totalRegisteredSupportrs: 12500000, approvedMembersCount: 7769, expectedTurnoutPercentage: 65 },
        participation: IRAQI_REGIONS_INFO.map(g => ({
            regionId: g.id,
            regionName: g.name,
            estimatedTurnout: parseFloat((40 + Math.random() * 30).toFixed(2))
        }))
    });
};

export const getRegionDataByName = (name: string): Promise<{ region: any; members: Member[]; news: NewsArticle[] }> => {
    const region = IRAQI_REGIONS_INFO.find(g => g.enName === name);
    const members = MOCK_USERS.filter(u => u.role === UserRole.Member && u.region === name).slice(0, 12).map(c => ({
        id: c.id, name: c.name, party: c.party, imageUrl: c.avatarUrl, verified: c.verified
    }));
    const news = MOCK_ARTICLES.slice(0, 4).map(a => ({
        id: a.id, title: a.title, summary: a.contentSnippet, date: a.timestamp
    }));
    return simulateDelay({ region, members, news });
};

export const getPartyById = (id: string): Promise<{ party: PoliticalParty; members: Member[] }> => {
    // This is a mock; in a real app, you'd fetch the party by its ID.
    const members = MOCK_USERS.filter(u => u.role === UserRole.Member).slice(0, 8).map(c => ({
        id: c.id, name: c.name, party: c.party, imageUrl: c.avatarUrl, verified: c.verified
    }));
    return simulateDelay({
        party: { id, name: 'Future Alliance', description: 'A forward-thinking party...', leader: 'Dr. Ahmad Al-Jubouri', founded: 2020, logoUrl: '' },
        members
    });
};

export const getAllCommunityMembers = (): Promise<Member[]> => {
    const members = MOCK_USERS.filter(u => u.role === UserRole.Member).map(c => ({
        id: c.id, name: c.name, party: c.party, imageUrl: c.avatarUrl, verified: c.verified
    }));
    return simulateDelay(members);
};

export const getApiConfig = (): Promise<ApiConfig[]> => {
    return simulateDelay([
        { id: '1', name: 'Facebook Graph API', status: 'Connected', lastChecked: '2m ago' },
        { id: '2', name: 'X (Twitter) API v2', status: 'Connected', lastChecked: '2m ago' },
        { id: '3', name: 'TikTok Developer API', status: 'Disconnected', lastChecked: '1h ago' },
    ]);
};

export const getDataCollectionStats = (): Promise<DataCollectionStats> => {
    return simulateDelay({
        status: 'Running',
        membersFound: 1289,
        profilesScraped: 980,
        contactsCollected: 450,
        progress: 76.0,
        log: [
            `[INFO] ${new Date().toLocaleTimeString()} - Found 5 new profiles on Facebook.`,
            `[INFO] ${new Date().toLocaleTimeString()} - Scraped profile for 'Ahmed Al-Maliki'.`,
            `[WARN] ${new Date().toLocaleTimeString()} - Rate limit approaching for X API.`,
            `[INFO] ${new Date().toLocaleTimeString()} - Batch processing complete.`,
        ]
    });
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getContactValidationData = (): Promise<ContactValidationItem[]> => {
     return simulateDelay(MOCK_USERS.slice(0, 10).map(u => ({
        id: u.id,
        contact: `+964 78********${Math.floor(10 + Math.random() * 89)}`,
        type: 'Phone',
        member: u.name,
        quality: parseFloat((60 + Math.random() * 40).toFixed(1)),
        status: getRandom(['Verified', 'Pending', 'Invalid'])
    })));
};

export const getEnrichmentData = (memberId: string): Promise<EnrichmentData> => {
    return simulateDelay({
        politicalProfile: 'Leans socially conservative with a focus on economic liberalization. Strong proponent of foreign investment and developing the private sector. Has supportd consistently for measures that reduce government spending.',
        influence: { socialReach: 120500, engagementRate: 4.5, sentiment: 'Positive' },
    });
};

export const getQualityAnalyticsData = (): Promise<QualityAnalyticsData> => {
    return simulateDelay({
        overallQuality: { verified: 78, pending: 15, invalid: 7 },
        qualityByGov: IRAQI_REGIONS_INFO.map(g => ({ name: g.name.substring(0, 3), quality: 50 + Math.random() * 50 })).slice(0, 6),
    });
};