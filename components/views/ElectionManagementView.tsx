import React, { lazy } from 'react';
import { Language } from '../../types.ts';

// Election portal components
const LandingPage = lazy(() => import('../election/pages/LandingPage.tsx'));
const DashboardPage = lazy(() => import('../election/pages/DashboardPage.tsx'));
const IntegrityHubPage = lazy(() => import('../election/pages/IntegrityHubPage.tsx'));
const InternationalPortalPage = lazy(() => import('../election/pages/InternationalPortalPage.tsx'));
const GovernoratePage = lazy(() => import('../election/pages/GovernoratePage.tsx'));
const PoliticalPartyPage = lazy(() => import('../election/pages/PoliticalPartyPage.tsx'));
const PartiesPage = lazy(() => import('../election/pages/PartiesPage.tsx'));
const ElectionHubPage = lazy(() => import('../election/pages/ElectionHubPage.tsx'));
const PrivacyPolicyPage = lazy(() => import('../election/pages/PrivacyPolicyPage.tsx'));
const TermsOfServicePage = lazy(() => import('../election/pages/TermsOfServicePage.tsx'));
const PricingPage = lazy(() => import('../election/pages/PricingPage.tsx'));
const CandidateComparisonPage = lazy(() => import('../election/pages/CandidateComparisonPage.tsx'));
const VoterRegistrationPage = lazy(() => import('../election/pages/VoterRegistrationPage.tsx'));
const ApiConfigPage = lazy(() => import('../election/pages/ApiConfigPage.tsx'));
const DataCollectionPage = lazy(() => import('../election/pages/DataCollectionPage.tsx'));
const ContactValidationPage = lazy(() => import('../election/pages/ContactValidationPage.tsx'));
const CandidateEnrichmentPage = lazy(() => import('../election/pages/CandidateEnrichmentPage.tsx'));
const QualityAnalyticsPage = lazy(() => import('../election/pages/QualityAnalyticsPage.tsx'));
const DataVizEmbedView = lazy(() => import('./DataVizEmbedView.tsx'));


interface ElectionManagementViewProps {
    path: string;
    onNavigate: (path: string) => void;
    language: Language;
}

const ElectionManagementView: React.FC<ElectionManagementViewProps> = ({ path, onNavigate, language }) => {

    const renderPage = () => {
        const pageProps = { onNavigate, language };
        // A simple router based on the path prop
        if (path.startsWith('/governorate/')) {
            const name = path.split('/')[2];
            return <GovernoratePage name={name} {...pageProps} />;
        }
         if (path.startsWith('/party/')) {
            const id = path.split('/')[2];
            return <PoliticalPartyPage id={id} {...pageProps} />;
        }
        
        switch (path) {
            case '/':
                return <LandingPage {...pageProps} />;
            case '/dashboard':
                return <DashboardPage {...pageProps} />;
            case '/integrity-hub':
                return <IntegrityHubPage {...pageProps} />;
            case '/international-portal':
                return <InternationalPortalPage {...pageProps} />;
            case '/parties':
                return <PartiesPage {...pageProps} />;
            case '/election-hub':
                return <ElectionHubPage {...pageProps} />;
             case '/privacy-policy':
                return <PrivacyPolicyPage {...pageProps} />;
            case '/terms-of-service':
                return <TermsOfServicePage {...pageProps} />;
            case '/pricing':
                return <PricingPage {...pageProps} />;
            case '/compare':
                return <CandidateComparisonPage {...pageProps} />;
             case '/voter-registration':
                return <VoterRegistrationPage {...pageProps} />;
            // New Data Management Routes
            case '/api-config':
                return <ApiConfigPage {...pageProps} />;
            case '/data-collection':
                return <DataCollectionPage {...pageProps} />;
            case '/contact-validation':
                return <ContactValidationPage {...pageProps} />;
            case '/candidate-enrichment':
                return <CandidateEnrichmentPage {...pageProps} />;
            case '/quality-analytics':
                return <QualityAnalyticsPage {...pageProps} />;
            case '/data-viz':
                return <DataVizEmbedView language={language} />;
            default:
                return <LandingPage {...pageProps} />;
        }
    }

    return (
        <div className="font-arabic">
            <main>
                {renderPage()}
            </main>
        </div>
    );
};

export default ElectionManagementView;