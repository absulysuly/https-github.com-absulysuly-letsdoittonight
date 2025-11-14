import React from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';
import { SparklesIcon } from '../icons/Icons.tsx';

// The published URL from your AI Studio project is placed here.
const AI_STUDIO_URL = "https://aistudio.google.com/apps/drive/1zjZLSV2QIxfO0yN6540XuxrPyQ9CkTn_?showPreview=true";

interface AIStudioEmbedViewProps {
    language: Language;
}

const AIStudioEmbedView: React.FC<AIStudioEmbedViewProps> = ({ language }) => {
    const texts = UI_TEXT[language];

    return (
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
            <div className="glass-card rounded-lg p-8 max-w-lg mx-auto text-center">
                <div className="flex justify-center mb-4">
                    <SparklesIcon className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Open AI Studio Project</h1>
                <p className="text-theme-text-muted mb-6">
                    Google AI Studio projects cannot be embedded directly on other websites for security reasons. Click the button below to open the project in a new tab.
                </p>
                <a
                    href={AI_STUDIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110"
                >
                    Open AI Studio
                </a>
            </div>
        </div>
    );
};

export default AIStudioEmbedView;