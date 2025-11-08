import React from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';

// A public Looker Studio report URL as a placeholder
const DATA_VIZ_URL = "https://lookerstudio.google.com/embed/reporting/0B5FF6JBKb4f9flFRN2d5ZllwRzV5OU56M2xQS3d2OFpYemFIZEtfM04yOUdDR2o0a2s1SXc/page/6zXD";

interface DataVizEmbedViewProps {
    language: Language;
}

const DataVizEmbedView: React.FC<DataVizEmbedViewProps> = ({ language }) => {
    const texts = UI_TEXT[language];

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Election Data Insights</h1>
                <p className="text-theme-text-muted mt-1">
                    An embedded Looker Studio dashboard for visualizing campaign data.
                </p>
            </div>
            <div className="glass-card rounded-lg p-2 aspect-[16/9] w-full mx-auto">
                <iframe
                    src={DATA_VIZ_URL}
                    title="Election Data Visualization"
                    className="w-full h-full border-0 rounded-md"
                    allow="fullscreen"
                ></iframe>
            </div>
            <div className="text-center text-xs text-theme-text-muted mt-4 max-w-lg mx-auto">
                <p>
                    Please note: This is an embedded version of an external app. Its appearance and functionality may differ from the rest of this platform.
                </p>
            </div>
        </div>
    );
};

export default DataVizEmbedView;
