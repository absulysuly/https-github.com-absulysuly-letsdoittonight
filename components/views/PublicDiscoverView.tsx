import React, { useState, useEffect } from 'react';
import { User, Governorate, Language } from '../../types.ts';
import PublicDiscoverCandidateCard from '../PublicDiscoverCandidateCard.tsx';
import { SLUG_PARTY_MAP, SLUG_GOVERNORATE_MAP, GOVERNORATE_AR_MAP } from '../../constants.ts';
import { UI_TEXT } from '../../translations.ts';
import { loadCandidateDirectory } from '../../services/candidateDataService.ts';

interface PublicDiscoverViewProps {
    language: Language;
}

const PublicDiscoverView: React.FC<PublicDiscoverViewProps> = ({ language }) => {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [partyName, setPartyName] = useState('');
    const [governorateName, setGovernorateName] = useState('');
    const [governorateArName, setGovernorateArName] = useState('');
    const texts = UI_TEXT[language];

    useEffect(() => {
        let isMounted = true;

        const loadCandidates = async () => {
            setIsLoading(true);

            const params = new URLSearchParams(window.location.search);
            const partySlug = params.get('party') ?? undefined;
            const govSlug = params.get('gov') ?? undefined;

            const party = partySlug ? SLUG_PARTY_MAP[partySlug] : '';
            const governorate = govSlug ? SLUG_GOVERNORATE_MAP[govSlug] : '';

            if (!isMounted) return;

            setPartyName(party);
            setGovernorateName(governorate);

            if (governorate && GOVERNORATE_AR_MAP[governorate as Governorate]) {
                setGovernorateArName(GOVERNORATE_AR_MAP[governorate as Governorate]);
            } else {
                setGovernorateArName('');
            }

            try {
                const resolvedGovernorate =
                    governorate && GOVERNORATE_AR_MAP[governorate as Governorate]
                        ? (governorate as Governorate)
                        : undefined;

                const directoryCandidates = await loadCandidateDirectory({
                    limit: 200,
                    party: party || 'All',
                    partySlug: partySlug ?? undefined,
                    governorate: resolvedGovernorate ?? 'All',
                    governorateSlug: govSlug ?? undefined,
                });

                if (!isMounted) return;
                setCandidates(directoryCandidates);
            } catch (error) {
                console.error('Failed to load candidates:', error);
                if (isMounted) {
                    setCandidates([]);
                }
            }
        };

        loadCandidates().finally(() => {
            if (isMounted) {
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const pageTitle = partyName && governorateArName 
        ? `${texts.candidates} ${partyName} ${language === 'ar' ? 'في' : 'in'} ${governorateArName}`
        : texts.discoverCandidates;

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4 text-center font-arabic">{pageTitle}</h1>
            <p className="text-center text-slate-200 mb-8">
                {texts.discoverCandidatesDesc}
            </p>
            {isLoading ? (
                <p className="text-slate-300 text-center mt-8">{texts.loadingCandidates}</p>
            ) : candidates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {candidates.map(candidate => (
                        <PublicDiscoverCandidateCard 
                            key={candidate.id}
                            candidate={candidate}
                            language={language}
                        />
                    ))}
                </div>
            ) : (
                 <p className="text-slate-200 text-center mt-8 glass-card p-8 rounded-lg">
                    {texts.noCandidatesFoundQR}
                </p>
            )}
        </div>
    );
};

export default PublicDiscoverView;