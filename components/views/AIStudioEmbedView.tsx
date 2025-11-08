import React from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';

// The published URL from your AI Studio project is placed here.
const AI_STUDIO_URL = "https://aistudio.google.com/apps/drive/1zjZLSV2QIxfO0yN6540XuxrPyQ9CkTn_?showPreview=true";

interface AIStudioEmbedViewProps {
    language: Language;
}

const AIStudioEmbedView: React.FC<AIStudioEmbedViewProps> = ({ language }) => {
    const texts = UI_TEXT[language];

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">AI Studio Project</h1>
                <p className="text-theme-text-muted mt-1">
                    Embedded project from Google AI Studio.
                </p>
            </div>
            <div className="glass-card rounded-lg p-2 aspect-[9/16] max-w-lg mx-auto">
                <iframe
                    src={AI_STUDIO_URL}
                    title="AI Studio Embedded Project"
                    className="w-full h-full border-0 rounded-md"
                    allow="camera; microphone; geolocation; fullscreen"
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

export default AIStudioEmbedView;