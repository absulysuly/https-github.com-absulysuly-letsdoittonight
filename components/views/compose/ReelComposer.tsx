import React, { useState, useEffect } from 'react';
import { User } from '../../../types.ts';
import { VideoIcon, SparklesIcon, ImageIcon } from '../../icons/Icons.tsx';
import * as gemini from '../../../services/geminiService.ts';
import Spinner from '../../Spinner.tsx';

interface ReelComposerProps {
    user: User;
    onCreateReel: (reelDetails: { caption: string; videoFile?: File }) => void;
}

type GenerationMode = 'upload' | 'fromText' | 'fromImage';

const ReelComposer: React.FC<ReelComposerProps> = ({ user, onCreateReel }) => {
    const [mode, setMode] = useState<GenerationMode>('upload');
    const [caption, setCaption] = useState('');
    const [fileName, setFileName] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [captionTopic, setCaptionTopic] = useState('');
    const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);


    // State for AI generation
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('9:16');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [generationMessage, setGenerationMessage] = useState('');
    const [error, setError] = useState('');
    
    // State for Veo API Key
    const [hasApiKey, setHasApiKey] = useState(false);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const keyStatus = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keyStatus);
            }
        };
        checkKey();
    }, []);

    const handleOpenKeySelector = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions
            setHasApiKey(true); 
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'image') => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (type === 'video') {
                setVideoFile(file);
                setFileName(file.name);
            } else {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    setImageBase64(base64String);
                };
                reader.readAsDataURL(file);
            }
        }
    };
    
    const handleSubmitUpload = () => {
        if (caption.trim() && videoFile) {
            onCreateReel({ caption, videoFile });
            setCaption('');
            setFileName('');
            setVideoFile(null);
        }
    };

    const handleGenerateCaption = async () => {
        if (!captionTopic.trim()) return;
        setIsGeneratingCaption(true);
        try {
            const newCaption = await gemini.generateReelCaption(captionTopic);
            setCaption(newCaption);
        } catch (e) {
            console.error("Caption generation failed:", e);
            // Optional: Set an error state to display to the user
        } finally {
            setIsGeneratingCaption(false);
        }
    };

    const handleGenerateVideo = async () => {
        if ((mode === 'fromText' && !prompt) || (mode === 'fromImage' && !imageBase64)) {
            setError('Please provide a prompt or an image.');
            return;
        }
        
        setError('');
        setIsGenerating(true);
        setGeneratedVideoUrl(null);
        setGenerationMessage('Initializing video generation... This may take a few minutes.');

        try {
            let videoUrl;
            if (mode === 'fromText') {
                setGenerationMessage('Generating video from your prompt...');
                videoUrl = await gemini.generateVideoFromText(prompt, aspectRatio, setGenerationMessage);
            } else if (mode === 'fromImage' && imageBase64 && imageFile) {
                 setGenerationMessage('Generating video from your image...');
                videoUrl = await gemini.generateVideoFromImage(imageBase64, imageFile.type, prompt, aspectRatio, setGenerationMessage);
            }
            setGeneratedVideoUrl(videoUrl || null);
        } catch (e: any) {
            console.error('Video generation failed:', e);
            setError(e.message || 'An unknown error occurred during video generation.');
            if (e.message.includes("Requested entity was not found")) {
                setHasApiKey(false); // Reset key status on auth error
                setError("Your API key is invalid. Please select a valid key.");
            }
        } finally {
            setIsGenerating(false);
            setGenerationMessage('');
        }
    };

    const renderApiKeyPrompt = () => (
        <div className="text-center p-4 border border-dashed border-[var(--color-glass-border)] rounded-lg">
            <p className="text-sm text-theme-text-muted mb-3">Video generation requires a Project IDX API key. Please select one to continue.</p>
            <p className="text-xs text-theme-text-muted mb-3">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">billing documentation</a>.</p>
            <button onClick={handleOpenKeySelector} className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-full">Select API Key</button>
        </div>
    );

    return (
        <div className="glass-card rounded-lg p-4">
            <h3 className="font-semibold text-theme-text-base mb-3">Create a New Reel</h3>
            <div className="flex border-b border-[var(--color-glass-border)] mb-4">
                <button onClick={() => setMode('upload')} className={`px-4 py-2 text-sm font-semibold ${mode === 'upload' ? 'text-primary border-b-2 border-primary' : 'text-theme-text-muted'}`}>Upload</button>
                <button onClick={() => setMode('fromText')} className={`px-4 py-2 text-sm font-semibold ${mode === 'fromText' ? 'text-primary border-b-2 border-primary' : 'text-theme-text-muted'}`}>Generate from Text</button>
                <button onClick={() => setMode('fromImage')} className={`px-4 py-2 text-sm font-semibold ${mode === 'fromImage' ? 'text-primary border-b-2 border-primary' : 'text-theme-text-muted'}`}>Generate from Image</button>
            </div>

            {mode === 'upload' && (
                <div className="space-y-3">
                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full p-2 border-none rounded-md bg-transparent focus:ring-0 placeholder-theme-text-muted" rows={2} placeholder="Reel caption..." />
                    
                    {/* AI Caption Generation Section */}
                    <div className="p-3 border border-dashed border-[var(--color-glass-border)] rounded-lg space-y-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="text" 
                                value={captionTopic} 
                                onChange={(e) => setCaptionTopic(e.target.value)} 
                                placeholder="Topic for AI caption (e.g., 'visiting the market')" 
                                className="flex-grow p-2 text-sm border border-[var(--color-glass-border)] rounded-md bg-white/10 placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary" 
                            />
                            <button 
                                onClick={handleGenerateCaption} 
                                disabled={isGeneratingCaption || !captionTopic.trim()} 
                                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-secondary bg-secondary/10 rounded-md hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="w-4 h-4"/>
                                <span>{isGeneratingCaption ? 'Generating...' : 'Generate Caption'}</span>
                            </button>
                        </div>
                    </div>

                    <label className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 cursor-pointer">
                        <VideoIcon className="w-5 h-5"/>
                        <span className="truncate">{fileName || 'Upload Video'}</span>
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
                    </label>
                    <div className="flex justify-end pt-2">
                        <button onClick={handleSubmitUpload} disabled={!caption.trim() || !videoFile} className="px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">Post Reel</button>
                    </div>
                </div>
            )}

            {(mode === 'fromText' || mode === 'fromImage') && (
                !hasApiKey ? renderApiKeyPrompt() : (
                <div className="space-y-4">
                    {isGenerating && (
                        <div className="text-center p-4">
                            <Spinner />
                            <p className="mt-4 text-sm text-theme-text-muted animate-pulse">{generationMessage}</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {generatedVideoUrl && !isGenerating && (
                        <div className="text-center">
                            <video src={generatedVideoUrl} controls className="w-full rounded-lg" />
                            <a href={generatedVideoUrl} download="generated-video.mp4" className="mt-2 inline-block px-4 py-2 text-sm font-bold bg-secondary text-on-primary rounded-full">Download Video</a>
                        </div>
                    )}

                    {!isGenerating && !generatedVideoUrl && (
                        <>
                            {mode === 'fromImage' && (
                                <div className="space-y-2">
                                    <label className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 cursor-pointer">
                                        <ImageIcon className="w-5 h-5"/>
                                        <span className="truncate">{imageFile?.name || 'Upload Starting Image'}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                                    </label>
                                     {imageBase64 && <img src={`data:image/png;base64,${imageBase64}`} alt="preview" className="max-h-32 rounded-lg mx-auto" />}
                                </div>
                            )}
                             <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-2 border border-[var(--color-glass-border)] rounded-md bg-transparent focus:ring-1 focus:ring-primary placeholder-theme-text-muted" rows={3} placeholder={mode === 'fromImage' ? "Optional: Describe what should happen in the video..." : "A cinematic shot of..."}/>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-theme-text-muted">Aspect Ratio:</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setAspectRatio('9:16')} className={`px-3 py-1 text-sm rounded-full ${aspectRatio === '9:16' ? 'bg-primary text-on-primary' : 'bg-white/10'}`}>Portrait (9:16)</button>
                                    <button onClick={() => setAspectRatio('16:9')} className={`px-3 py-1 text-sm rounded-full ${aspectRatio === '16:9' ? 'bg-primary text-on-primary' : 'bg-white/10'}`}>Landscape (16:9)</button>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button onClick={handleGenerateVideo} disabled={isGenerating || (mode === 'fromText' && !prompt) || (mode === 'fromImage' && !imageBase64)} className="flex items-center gap-2 px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <SparklesIcon className="w-5 h-5" />
                                    Generate
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReelComposer;