import type { FC } from 'react';
import { Language } from '../../types.ts';

// Election portal components
import LandingPage from '../election/pages/LandingPage.tsx';
import DashboardPage from '../election/pages/DashboardPage.tsx';
import IntegrityHubPage from '../election/pages/IntegrityHubPage.tsx';
import InternationalPortalPage from '../election/pages/InternationalPortalPage.tsx';
import GovernoratePage from '../election/pages/GovernoratePage.tsx';
import PoliticalPartyPage from '../election/pages/PoliticalPartyPage.tsx';
import PartiesPage from '../election/pages/PartiesPage.tsx';
import ElectionHubPage from '../election/pages/ElectionHubPage.tsx';
import PrivacyPolicyPage from '../election/pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from '../election/pages/TermsOfServicePage.tsx';
import PricingPage from '../election/pages/PricingPage.tsx';
import CandidateComparisonPage from '../election/pages/CandidateComparisonPage.tsx';
import VoterRegistrationPage from '../election/pages/VoterRegistrationPage.tsx';
import ApiConfigPage from '../election/pages/ApiConfigPage.tsx';
import DataCollectionPage from '../election/pages/DataCollectionPage.tsx';
import ContactValidationPage from '../election/pages/ContactValidationPage.tsx';
import CandidateEnrichmentPage from '../election/pages/CandidateEnrichmentPage.tsx';
import QualityAnalyticsPage from '../election/pages/QualityAnalyticsPage.tsx';

interface ElectionManagementViewProps {
    path: string;
    onNavigate: (path: string) => void;
    language: Language;
}

const ElectionManagementView: FC<ElectionManagementViewProps> = ({ path, onNavigate, language }) => {
    const renderPage = () => {
        if (path.startsWith('/governorate/')) {
            const name = path.split('/')[2];
            return <GovernoratePage name={name} onNavigate={onNavigate} />;
        }

        if (path.startsWith('/party/')) {
            const id = path.split('/')[2];
            return <PoliticalPartyPage id={id} onNavigate={onNavigate} />;
        }

        switch (path) {
            case '/':
                return <LandingPage onNavigate={onNavigate} language={language} />;
            case '/dashboard':
                return <DashboardPage language={language} />;
            case '/integrity-hub':
                return <IntegrityHubPage language={language} />;
            case '/international-portal':
                return <InternationalPortalPage language={language} />;
            case '/parties':
                return <PartiesPage onNavigate={onNavigate} />;
            case '/election-hub':
                return <ElectionHubPage />;
            case '/privacy-policy':
                return <PrivacyPolicyPage />;
            case '/terms-of-service':
                return <TermsOfServicePage />;
            case '/pricing':
                return <PricingPage />;
            case '/compare':
                return <CandidateComparisonPage />;
            case '/voter-registration':
                return <VoterRegistrationPage language={language} />;
            case '/api-config':
                return <ApiConfigPage onNavigate={onNavigate} />;
            case '/data-collection':
                return <DataCollectionPage onNavigate={onNavigate} />;
            case '/contact-validation':
                return <ContactValidationPage onNavigate={onNavigate} />;
            case '/candidate-enrichment':
                return <CandidateEnrichmentPage onNavigate={onNavigate} />;
            case '/quality-analytics':
                return <QualityAnalyticsPage onNavigate={onNavigate} />;
            default:
                return <LandingPage onNavigate={onNavigate} language={language} />;
        }
    };

    return (
        <div className="font-arabic">
            <main>
                {renderPage()}
            </main>
        </div>
    );
};

export default ElectionManagementView;
