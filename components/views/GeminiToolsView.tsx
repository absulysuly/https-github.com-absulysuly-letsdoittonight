import React, { useState, Suspense, lazy } from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';
import { SparklesIcon, ImageIcon, VideoIcon, PencilIcon, MicIcon } from '../icons/Icons.tsx';
import * as gemini from '../../services/geminiService.ts';
import Spinner from '../Spinner.tsx';

const LiveConversationView = lazy(() => import('./LiveConversationView.tsx'));

interface GeminiToolsViewProps {
    language: Language;
}

type Tool = 'image-gen' | 'video-gen-text' | 'video-gen-image' | 'image-analyze' | 'image-edit' | 'live-chat';
type ViewState = 'grid' | Tool;

const GeminiToolsView: React.FC<GeminiToolsViewProps> = ({ language }) => {
    const [view, setView] = useState<ViewState>('grid');
    const texts = UI_TEXT[language];

    const tools: { id: Tool, title: string, description: string, icon: React.ReactNode }[] = [
        { id: 'image-gen', title: texts.generateImage, description: texts.generateImageDesc, icon: <ImageIcon className="w-8 h-8 text-primary"/> },
        { id: 'video-gen-text', title: texts.generateVideoFromText, description: texts.generateVideoFromTextDesc, icon: <VideoIcon className="w-8 h-8 text-primary"/> },
        { id: 'video-gen-image', title: texts.generateVideoFromImage, description: texts.generateVideoFromImageDesc, icon: <VideoIcon className="w-8 h-8 text-primary"/> },
        { id: 'image-analyze', title: texts.analyzeImage, description: texts.analyzeImageDesc, icon: <SparklesIcon className="w-8 h-8 text-primary"/> },
        { id: 'image-edit', title: texts.editImage, description: texts.editImageDesc, icon: <PencilIcon className="w-8 h-8 text-primary"/> },
        { id: 'live-chat', title: texts.liveConversation, description: texts.liveConversationDesc, icon: <MicIcon className="w-8 h-8 text-primary"/> },
    ];

    const renderTool = () => {
        switch(view) {
            case 'live-chat':
                return (
                    <Suspense fallback={<Spinner />}>
                        <LiveConversationView language={language} onClose={() => setView('grid')} />
                    </Suspense>
                );
            // Other tools can be implemented as separate components for cleanliness
            case 'image-gen':
                return <ImageGeneratorTool language={language} onClose={() => setView('grid')} />;
            default:
                return <div className="text-center glass-card p-8">{texts.featureComingSoon} <button className="underline" onClick={() => setView('grid')}>Back</button></div>;
        }
    };
    
    if (view !== 'grid') {
        return <div className="p-4 sm:p-6">{renderTool()}</div>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-arabic text-white">{texts.geminiTools}</h2>
                <p className="text-theme-text-muted mt-2 max-w-2xl mx-auto">{texts.geminiToolsDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => (
                    <button key={tool.id} onClick={() => setView(tool.id)} className="glass-card p-6 text-center hover:border-primary transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-center mb-4">{tool.icon}</div>
                        <h3 className="font-bold text-lg">{tool.title}</h3>
                        <p className="text-sm text-theme-text-muted mt-1">{tool.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Example of a sub-component for a specific tool
const ImageGeneratorTool: React.FC<{language: Language, onClose: () => void}> = ({ language, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const texts = UI_TEXT[language];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const base64Image = await gemini.generateImage(prompt, aspectRatio);
            setResult(`data:image/png;base64,${base64Image}`);
        } catch(e: any) {
            setError(e.message || 'Failed to generate image');
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
         <div className="max-w-2xl mx-auto">
             <button onClick={onClose} className="text-sm text-primary mb-4">&larr; {texts.backToTools}</button>
            <div className="glass-card p-6 rounded-lg space-y-4">
                 <h2 className="text-2xl font-bold text-center">{texts.generateImage}</h2>
                 <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder={texts.imagePromptPlaceholder} className="w-full p-2 border border-[var(--color-glass-border)] rounded-md bg-white/10 text-theme-text-base placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary font-arabic" />
                 <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">{texts.aspectRatio}:</span>
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="p-2 border border-[var(--color-glass-border)] rounded-md bg-white/10 text-theme-text-base focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="1:1">1:1</option>
                        <option value="16:9">16:9</option>
                        <option value="9:16">9:16</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                    </select>
                </div>
                 <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex justify-center items-center gap-2 px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50">
                    <SparklesIcon className="w-5 h-5"/> {isLoading ? texts.generating : texts.generate}
                 </button>
            </div>
            {isLoading && <Spinner />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-6 glass-card p-4 rounded-lg">
                    <img src={result} alt="Generated image" className="w-full rounded-lg" />
                     <a href={result} download="generated-image.png" className="mt-4 inline-block px-4 py-2 text-sm font-bold bg-secondary text-on-primary rounded-full">{texts.downloadImage}</a>
                </div>
            )}
        </div>
    )
}

export default GeminiToolsView;
