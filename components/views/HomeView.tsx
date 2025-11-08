import React, { useState, useEffect, lazy, Suspense } from 'react';
import { User, Governorate, Language, MainContentTab, AppTab, Post, UserRole } from '../../types.ts';
import { GOVERNORATES, GOVERNORATE_AR_MAP } from '../../constants.ts';
import { UI_TEXT } from '../../translations.ts';
import * as api from '../../services/apiService.ts';

import HeroSection from '../HeroSection.tsx';
import Stories from '../Stories.tsx';
import ComposeView from './ComposeView.tsx';
import PostCard from '../PostCard.tsx';
import TopNavBar from '../TopNavBar.tsx';
import Spinner from '../Spinner.tsx';
import ReelsView from './ReelsView.tsx';
import CandidatesView from './CandidatesView.tsx';
import DebatesView from './DebatesView.tsx';
import TeaHouseView from './TeaHouseView.tsx';
import EventsView from './EventsView.tsx';
import ReelComposer from './compose/ReelComposer.tsx';
import EventComposer from './compose/EventComposer.tsx';
import SeriousnessView from './SeriousnessView.tsx';
import WomenCandidatesView from './WomenCandidatesView.tsx';

const AskNeighborView = lazy(() => import('./AskNeighborView.tsx'));


interface HomeViewProps {
    user: User | null;
    requestLogin: () => void;
    selectedGovernorate: Governorate | 'All';
    onGovernorateChange: (gov: Governorate | 'All') => void;
    selectedParty: string | 'All';
    onPartyChange: (party: string | 'All') => void;
    parties: string[];
    onSelectProfile: (profile: User) => void;
    onSelectReel: (reel: Post) => void;
    onSelectPost: (post: Post) => void;
    onSelectStory: (user: User) => void;
    language: Language;
    activeTab: MainContentTab;
    onTabChange: (tab: MainContentTab) => void;
    onCompose: () => void;
}

const TABS_WITH_FILTERS: MainContentTab[] = [AppTab.Posts, AppTab.Reels, AppTab.Candidates, AppTab.Debates, AppTab.Events, AppTab.Articles, AppTab.AskNeighbor];
const TABS_WITH_HERO: MainContentTab[] = [AppTab.Posts];
const SUB_TABS: MainContentTab[] = [AppTab.Posts, AppTab.Reels, AppTab.Candidates, AppTab.WomenCandidates, AppTab.Debates, AppTab.AskNeighbor, AppTab.Events, AppTab.Articles, AppTab.TeaHouse];


const HomeView: React.FC<HomeViewProps> = ({ user, requestLogin, selectedGovernorate, onGovernorateChange, selectedParty, onPartyChange, parties, onSelectProfile, onSelectReel, onSelectPost, onSelectStory, language, activeTab, onTabChange, onCompose }) => {
    
    // --- STATE FOR ASYNC DATA ---
    const [socialPosts, setSocialPosts] = useState<Post[]>([]);
    const [candidates, setCandidates] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const filters = { governorate: selectedGovernorate, party: selectedParty };
                const postsPromise = api.getPosts(filters);
                // Fix: Changed 'Candidate' to UserRole.Candidate to match the expected enum type.
                const candidatesPromise = api.getUsers({ role: UserRole.Candidate, ...filters });
                
                const [postsData, candidatesData] = await Promise.all([postsPromise, candidatesPromise]);
                
                setSocialPosts(postsData);
                setCandidates(candidatesData);
            } catch (error) {
                console.error("Failed to fetch home view data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedGovernorate, selectedParty]);

    // --- API HANDLERS ---
    const handlePost = (postDetails: Partial<Post>) => {
        if (!user) return;
        api.createPost(postDetails, user).then(newPost => {
            setSocialPosts(prevPosts => [newPost, ...prevPosts]);
             alert("Post created successfully (simulation).");
        });
    };
    
    const handleCreateReel = (reelDetails: { caption: string; videoFile?: File }) => {
        if (!user) return;
        api.createReel(reelDetails, user).then(newReel => {
            // In a real app, you might want a separate state for reels
            console.log("New reel created (simulation):", newReel);
            alert("Reel created successfully (simulation).");
        });
    };
    
    const handleCreateEvent = (eventDetails: { title: string; date: string; location: string; }) => {
        if (!user) return;
        api.createEvent(eventDetails, user).then(newEvent => {
            console.log("New event created (simulation):", newEvent);
            alert("Event created successfully (simulation).");
        });
    };

    const handleFollow = (e: React.MouseEvent, candidateId: string) => {
        if (!user) {
            e.preventDefault();
            requestLogin();
        } else {
            api.followCandidate(candidateId);
        }
    };

    // --- DERIVED DATA & TEXTS ---
    const candidatesToFollow = candidates.filter(c => c.id !== user?.id).slice(0, 3);
    const storyCandidates = candidates.slice(0, 10);
    const texts = UI_TEXT[language];
    
    const showHeroAndStories = TABS_WITH_HERO.includes(activeTab);
    const showFilters = TABS_WITH_FILTERS.includes(activeTab);

    const MobileFilterBar = () => (
        <div className="sm:hidden flex gap-4 p-3 bg-black/20 backdrop-blur-sm my-4 rounded-lg border border-[var(--color-glass-border)]">
            {/* Governorate Filter */}
            <div className="flex-1">
                <label htmlFor="mobile-gov-filter" className="block text-xs font-medium text-theme-text-muted font-arabic">{texts.governorate}</label>
                <select 
                    id="mobile-gov-filter"
                    value={selectedGovernorate}
                    onChange={(e) => onGovernorateChange(e.target.value as Governorate | 'All')}
                    className="mt-1 block w-full p-1.5 border border-[var(--color-glass-border)] rounded-md bg-white/20 text-theme-text-base text-sm focus:outline-none focus:ring-1 focus:ring-primary font-arabic text-right"
                >
                    <option value="All">{texts.allIraq}</option>
                    {GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{GOVERNORATE_AR_MAP[gov]}</option>
                    ))}
                </select>
            </div>
            {/* Party Filter */}
            <div className="flex-1">
                <label htmlFor="mobile-party-filter" className="block text-xs font-medium text-theme-text-muted font-arabic">{texts.party}</label>
                <select 
                    id="mobile-party-filter"
                    value={selectedParty}
                    onChange={(e) => onPartyChange(e.target.value)}
                    className="mt-1 block w-full p-1.5 border border-[var(--color-glass-border)] rounded-md bg-white/20 text-theme-text-base text-sm focus:outline-none focus:ring-1 focus:ring-primary font-arabic text-right"
                >
                    <option value="All">{texts.all}</option>
                    {parties.map(party => (
                        <option key={party} value={party}>{party}</option>
                    ))}
                </select>
            </div>
        </div>
    );
    
    const renderComposer = () => {
        if (!user) return null;

        if (user.role === 'Candidate') {
            switch (activeTab) {
                case AppTab.Posts:
                    return <ComposeView user={user} onPost={handlePost} language={language} />;
                case AppTab.Reels:
                    return <ReelComposer user={user} onCreateReel={handleCreateReel} />;
                case AppTab.Events:
                    return <EventComposer user={user} onCreateEvent={handleCreateEvent} />;
                default:
                    return null;
            }
        }
        
        // For Voters, only show a simple composer prompt on the Posts tab
        if (activeTab === AppTab.Posts) {
            return (
                <div 
                    onClick={onCompose}
                    className="glass-card rounded-lg p-3 flex items-center space-x-4 cursor-pointer hover:border-primary"
                >
                    <img className="w-10 h-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                    <div className="flex-1 text-theme-text-muted font-arabic">{texts.whatsOnYourMind}</div>
                    <button className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-full">
                        {texts.post}
                    </button>
                </div>
            );
        }

        return null;
    };


    // --- RENDER LOGIC ---
    const renderSocialContent = () => {
        if (isLoading && TABS_WITH_FILTERS.includes(activeTab)) {
            return <Spinner />;
        }

        switch (activeTab) {
            case AppTab.Posts:
                const postsWithStories = socialPosts.reduce((acc, post, index) => {
                    acc.push(<PostCard key={post.id} post={post} user={user} requestLogin={requestLogin} language={language} onSelectAuthor={onSelectProfile} onSelectPost={onSelectPost} />);
                    // Inject stories every 4 posts
                    if ((index + 1) % 4 === 0) {
                        acc.push(<div key={`stories-${index}`} className="my-6"><Stories users={storyCandidates} onSelectStory={onSelectStory} /></div>);
                    }
                    return acc;
                }, [] as React.ReactNode[]);

                return (
                     <div className="mt-4">
                        <div className="mb-4">{renderComposer()}</div>
                        {postsWithStories.length > 0 
                            ? postsWithStories
                            : <p className="text-center py-10 text-theme-text-muted">{texts.noPostsFound}</p>
                        }
                    </div>
                );
            case AppTab.Reels:
                return (
                    <div className="mt-4">
                        <div className="mb-4">{renderComposer()}</div>
                        <ReelsView selectedGovernorate={selectedGovernorate} selectedParty={selectedParty} onSelectReel={onSelectReel} user={user} requestLogin={requestLogin} language={language} />
                    </div>
                );
            case AppTab.Candidates:
                return <CandidatesView selectedGovernorate={selectedGovernorate} selectedParty={selectedParty} parties={parties} onSelectCandidate={onSelectProfile} user={user} requestLogin={requestLogin} language={language} />;
            case AppTab.WomenCandidates:
                return <WomenCandidatesView onSelectCandidate={onSelectProfile} user={user} requestLogin={requestLogin} language={language} />;
            case AppTab.Debates:
                return <DebatesView selectedGovernorate={selectedGovernorate} selectedParty={selectedParty} language={language} />;
            case AppTab.Events:
                 return (
                    <div className="mt-4">
                        <div className="mb-4">{renderComposer()}</div>
                        <EventsView selectedGovernorate={selectedGovernorate} selectedParty={selectedParty} language={language} />
                    </div>
                );
            case AppTab.Articles:
                return <SeriousnessView selectedGovernorate={selectedGovernorate} language={language} />;
            case AppTab.TeaHouse:
                return <TeaHouseView user={user} requestLogin={requestLogin} language={language} />;
            case AppTab.AskNeighbor:
                return (
                    <Suspense fallback={<Spinner />}>
                        <AskNeighborView language={language} />
                    </Suspense>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 sm:p-6">
            {/* Main Content Column */}
            <main className="lg:col-span-3">
                {showHeroAndStories && (
                    <>
                        <div className="mt-6">
                            <HeroSection />
                        </div>
                        <div className="mt-6">
                            <Stories users={storyCandidates} onSelectStory={onSelectStory}/>
                        </div>
                    </>
                )}
                
                {showFilters && <MobileFilterBar />}

                {/* Non-sticky TopNavBar */}
                <div className="mt-2 z-10 py-2">
                    <TopNavBar<MainContentTab>
                        tabs={SUB_TABS}
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        language={language}
                    />
                </div>
                
                {renderSocialContent()}
            </main>

            {/* Right Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                <div className="glass-card rounded-lg p-4">
                    <h3 className="font-bold mb-3 font-arabic">{texts.whoToFollow}</h3>
                    <div className="space-y-3">
                        {candidatesToFollow.length > 0 ? candidatesToFollow.map(candidate => (
                            <div key={candidate.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectProfile(candidate)}>
                                    <img src={candidate.avatarUrl} alt={candidate.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm">{candidate.name}</p>
                                        <p className="text-xs text-theme-text-muted">{candidate.party}</p>
                                    </div>
                                </div>
                                <button onClick={(e) => handleFollow(e, candidate.id)} className="px-3 py-1 text-xs font-semibold rounded-full bg-primary text-on-primary transition-all hover:brightness-110">{texts.follow}</button>
                            </div>
                        )) : <p className="text-xs text-theme-text-muted">{texts.noCandidatesToShow}</p>}
                    </div>
                </div>

                <div className="glass-card rounded-lg p-4">
                    <h3 className="font-bold mb-3 font-arabic">{texts.platformRules}</h3>
                    <ul className="text-sm space-y-2 list-disc list-inside text-theme-text-muted font-arabic">
                        <li>{texts.rule1}</li>
                        <li>{texts.rule2}</li>
                        <li>{texts.rule3}</li>
                        <li>{texts.rule4}</li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default HomeView;