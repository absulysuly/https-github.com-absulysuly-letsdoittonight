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
        { id: 'image-edit', title: texts.editImage, description: texts.editImageDesc, icon: <PencilIcon className="w-8 h-8 text-primary"/> },
        { id: 'image-analyze', title: texts.analyzeImage, description: texts.analyzeImageDesc, icon: <SparklesIcon className="w-8 h-8 text-primary"/> },
        { id: 'live-chat', title: texts.liveConversation, description: texts.liveConversationDesc, icon: <MicIcon className="w-8 h-8 text-primary"/> },
        // Video tools are part of Reel Composer for better UX, but could be standalone too
        // { id: 'video-gen-text', title: texts.generateVideoFromText, description: texts.generateVideoFromTextDesc, icon: <VideoIcon className="w-8 h-8 text-primary"/> },
        // { id: 'video-gen-image', title: texts.generateVideoFromImage, description: texts.generateVideoFromImageDesc, icon: <VideoIcon className="w-8 h-8 text-primary"/> },
    ];

    const renderTool = () => {
        switch(view) {
            case 'live-chat':
                return (
                    <Suspense fallback={<Spinner />}>
                        <LiveConversationView language={language} onClose={() => setView('grid')} />
                    </Suspense>
                );
            case 'image-gen':
                return <ImageGeneratorTool language={language} onClose={() => setView('grid')} />;
            case 'image-analyze':
                return <ImageAnalyzerTool language={language} onClose={() => setView('grid')} />;
            case 'image-edit':
                return <ImageEditorTool language={language} onClose={() => setView('grid')} />;
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

// --- TOOL IMPLEMENTATIONS ---

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
                    <img src={result} alt="Generated" className="w-full rounded-lg" />
                     <a href={result} download="generated-image.png" className="mt-4 inline-block px-4 py-2 text-sm font-bold bg-secondary text-on-primary rounded-full">{texts.downloadImage}</a>
                </div>
            )}
        </div>
    )
}

const ImageAnalyzerTool: React.FC<{language: Language, onClose: () => void}> = ({ language, onClose }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [prompt, setPrompt] = useState('What is in this image?');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const texts = UI_TEXT[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };
    
    const handleAnalyze = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const analysis = await gemini.analyzeImage(base64, imageFile.type, prompt);
                setResult(analysis);
                setIsLoading(false);
            };
            reader.readAsDataURL(imageFile);
        } catch (e: any) {
            setError(e.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={onClose} className="text-sm text-primary mb-4">&larr; {texts.backToTools}</button>
            <div className="glass-card p-6 rounded-lg space-y-4">
                 <h2 className="text-2xl font-bold text-center">{texts.analyzeImage}</h2>
                 <label className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 cursor-pointer">
                    <ImageIcon className="w-5 h-5"/>
                    <span className="truncate">{imageFile?.name || 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {preview && <img src={preview} alt="preview" className="max-h-48 rounded-lg mx-auto" />}
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} placeholder="e.g., Describe this scene, what is happening here?" className="w-full p-2 border border-[var(--color-glass-border)] rounded-md bg-white/10 text-theme-text-base placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary"/>
                 <button onClick={handleAnalyze} disabled={isLoading || !imageFile} className="w-full flex justify-center items-center gap-2 px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50">
                    <SparklesIcon className="w-5 h-5"/> {isLoading ? texts.generating : 'Analyze'}
                 </button>
            </div>
             {isLoading && <Spinner />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-6 glass-card p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Analysis Result:</h3>
                    <p className="whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    )
}

const ImageEditorTool: React.FC<{language: Language, onClose: () => void}> = ({ language, onClose }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string>('');
    const [prompt, setPrompt] = useState('add a hat on the person');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const texts = UI_TEXT[language];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setOriginalPreview(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };
    
    const handleEdit = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const editedImageBase64 = await gemini.editImage(base64, imageFile.type, prompt);
                setResult(`data:image/png;base64,${editedImageBase64}`);
                setIsLoading(false);
            };
            reader.readAsDataURL(imageFile);
        } catch (e: any) {
            setError(e.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onClose} className="text-sm text-primary mb-4">&larr; {texts.backToTools}</button>
            <div className="glass-card p-6 rounded-lg space-y-4">
                 <h2 className="text-2xl font-bold text-center">{texts.editImage}</h2>
                 <label className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 cursor-pointer">
                    <ImageIcon className="w-5 h-5"/>
                    <span className="truncate">{imageFile?.name || 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} placeholder="e.g., make the sky blue, add sunglasses" className="w-full p-2 border border-[var(--color-glass-border)] rounded-md bg-white/10 text-theme-text-base placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary"/>
                 <button onClick={handleEdit} disabled={isLoading || !imageFile} className="w-full flex justify-center items-center gap-2 px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50">
                    <PencilIcon className="w-5 h-5"/> {isLoading ? texts.generating : 'Edit'}
                 </button>
            </div>
             {isLoading && <Spinner />}
            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {originalPreview && <div className="glass-card p-4 rounded-lg"><h3 className="font-bold mb-2 text-center">Original</h3><img src={originalPreview} alt="Original" className="w-full rounded-lg" /></div>}
                {result && <div className="glass-card p-4 rounded-lg"><h3 className="font-bold mb-2 text-center">Edited</h3><img src={result} alt="Edited" className="w-full rounded-lg" /></div>}
            </div>
        </div>
    )
}


export default GeminiToolsView;