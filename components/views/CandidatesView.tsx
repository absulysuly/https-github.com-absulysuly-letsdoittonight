// Fix: Populating components/views/CandidatesView.tsx with a list of candidates.
import React, { useState, useEffect } from 'react';
import { Governorate, User, Language } from '../../types.ts';
import { GOVERNORATES, GOVERNORATE_AR_MAP } from '../../constants.ts';
import CandidatePill from '../CandidatePill.tsx';
import { ResponsiveGrid } from '../UI/Responsive.tsx';
import { UI_TEXT } from '../../translations.ts';
import Spinner from '../Spinner.tsx';
import { loadCandidateDirectory } from '../../services/candidateDataService.ts';

interface CandidatesViewProps {
    selectedGovernorate: Governorate | 'All';
    selectedParty: string | 'All';
    parties: string[];
    onSelectCandidate: (candidate: User) => void;
    user: User | null;
    requestLogin: () => void;
    language: Language;
}

const CandidatesView: React.FC<CandidatesViewProps> = ({ selectedGovernorate, selectedParty, parties, onSelectCandidate, user, requestLogin, language }) => {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const texts = UI_TEXT[language];

    // Local state for filters, initialized from global props but managed independently.
    const [localGovernorate, setLocalGovernorate] = useState<Governorate | 'All'>(selectedGovernorate);
    const [localParty, setLocalParty] = useState<string | 'All'>(selectedParty);
    const [localGender, setLocalGender] = useState<'Male' | 'Female' | 'All'>('All');


    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                const users = await loadCandidateDirectory({
                    governorate: localGovernorate,
                    party: localParty,
                    gender: localGender,
                    limit: 200,
                });
                setCandidates(users);
            } catch (error) {
                console.error('Failed to fetch candidates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, [localGovernorate, localParty, localGender]);


    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 className="text-2xl font-bold font-arabic text-white">{texts.candidates}</h2>
            </div>

            {/* Custom Filters for this View */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 p-3 glass-card mb-6 rounded-lg shadow-lg">
                {/* Governorate Filter */}
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="gov-filter" className="block text-sm font-medium text-theme-text-muted font-arabic">{texts.governorate}</label>
                    <select 
                        id="gov-filter"
                        value={localGovernorate}
                        onChange={(e) => setLocalGovernorate(e.target.value as Governorate | 'All')}
                        className="mt-1 block w-full p-2 border border-white/20 rounded-md bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-hot-pink font-arabic text-right"
                    >
                        <option value="All">{texts.allIraq}</option>
                        {GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{GOVERNORATE_AR_MAP[gov]}</option>
                        ))}
                    </select>
                </div>
                {/* Party Filter */}
                 <div className="flex-1 min-w-[150px]">
                    <label htmlFor="party-filter" className="block text-sm font-medium text-theme-text-muted font-arabic">{texts.party}</label>
                    <select 
                        id="party-filter"
                        value={localParty}
                        onChange={(e) => setLocalParty(e.target.value)}
                        className="mt-1 block w-full p-2 border border-white/20 rounded-md bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-hot-pink font-arabic text-right"
                    >
                        <option value="All">{texts.all}</option>
                        {parties.map(party => (
                            <option key={party} value={party}>{party}</option>
                        ))}
                    </select>
                </div>
                 {/* Gender Filter */}
                 <div className="flex-1 min-w-[150px]">
                    <label htmlFor="gender-filter" className="block text-sm font-medium text-theme-text-muted font-arabic">{texts.gender}</label>
                    <select 
                        id="gender-filter"
                        value={localGender}
                        onChange={(e) => setLocalGender(e.target.value as 'Male' | 'Female' | 'All')}
                        className="mt-1 block w-full p-2 border border-white/20 rounded-md bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-hot-pink font-arabic text-right"
                    >
                        <option value="All">{texts.all}</option>
                        <option value="Male">{texts.male}</option>
                        <option value="Female">{texts.female}</option>
                    </select>
                </div>
            </div>

             {isLoading ? (
                <Spinner />
             ) : (
                <ResponsiveGrid>
                    {candidates.length > 0 ? (
                        candidates.map(candidate => (
                            <CandidatePill 
                                key={candidate.id} 
                                candidate={candidate} 
                                onSelect={onSelectCandidate} 
                                user={user}
                                requestLogin={requestLogin}
                                language={language}
                            />
                        ))
                    ) : (
                        <p className="text-theme-text-muted col-span-full text-center mt-8">{texts.noPostsFound}</p>
                    )}
                </ResponsiveGrid>
            )}
        </div>
    );
};

export default CandidatesView;