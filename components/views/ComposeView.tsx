import React, { useState, useRef } from 'react';
import { User, Post, PostPrivacy, Language } from '../../types.ts';
import { SparklesIcon, PhotoIcon, VideoIcon, MicIcon, GlobeAltIcon, UsersIcon, LockClosedIcon, ChevronDownIcon, ImageIcon } from '../icons/Icons.tsx';
import { generatePostSuggestion, refinePostText } from '../../services/geminiService.ts';
import { UI_TEXT } from '../../translations.ts';

// Add SpeechRecognition to the window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface ComposeViewProps {
    user: User;
    onPost: (postDetails: Partial<Post> & { mediaFile?: File }) => void;
    language: Language;
}

const ComposeView: React.FC<ComposeViewProps> = ({ user, onPost, language }) => {
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [privacy, setPrivacy] = useState<PostPrivacy>(PostPrivacy.Public);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const recognitionRef = useRef<any>(null);
    const contentOnRecordStartRef = useRef('');
    const texts = UI_TEXT[language];

    const handleGenerateSuggestion = async () => {
        if (!topic) {
            alert(texts.promptTopic);
            return;
        }
        setIsGenerating(true);
        try {
            const suggestion = await generatePostSuggestion(topic);
            setContent(suggestion);
        } catch (e) {
            console.error(e);
            setContent("Failed to get suggestion.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleRefinePost = async () => {
        if (!content.trim()) return;
        setIsGenerating(true);
        try {
            const refined = await refinePostText(content);
            setContent(refined);
        } catch(e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePost = () => {
        if (content.trim() || mediaFile) {
            onPost({ content, type: 'Post', privacy, mediaFile: mediaFile || undefined });
            setContent('');
            setTopic('');
            setMediaFile(null);
            setMediaPreview(null);
        }
    };
    
    const handleSaveDraft = () => {
        console.log("Saving draft:", { content, privacy });
        alert(texts.draftSaved);
    };

    const handlePreview = () => {
        alert(`${texts.previewingPost}:\n\n${content}\n\n${texts.privacy}: ${privacy}`);
    };

    const handleFileIconClick = (accept: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };


    const handleToggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(texts.speechRecognitionNotSupported);
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'ar-IQ'; // Iraqi Arabic
        recognitionRef.current.interimResults = true;
        recognitionRef.current.continuous = true;

        contentOnRecordStartRef.current = content;

        recognitionRef.current.onstart = () => setIsRecording(true);
        recognitionRef.current.onend = () => { setIsRecording(false); recognitionRef.current = null; };
        recognitionRef.current.onerror = (event: any) => { console.error("Speech recognition error", event.error); setIsRecording(false); };
        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
                else interimTranscript += event.results[i][0].transcript;
            }
            const separator = contentOnRecordStartRef.current.length > 0 ? ' ' : '';
            setContent(contentOnRecordStartRef.current + separator + finalTranscript + interimTranscript);
        };
        recognitionRef.current.start();
    };

    const privacyOptions = [
        { value: PostPrivacy.Public, label: texts.public, icon: <GlobeAltIcon className="w-5 h-5" /> },
        { value: PostPrivacy.Friends, label: texts.friends, icon: <UsersIcon className="w-5 h-5" /> },
        { value: PostPrivacy.Private, label: texts.private, icon: <LockClosedIcon className="w-5 h-5" /> },
    ];
    const selectedPrivacyOption = privacyOptions.find(opt => opt.value === privacy)!;

    return (
        <div className="glass-card rounded-lg p-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="flex space-x-4">
                <img className="w-12 h-12 rounded-full ring-2 ring-white/50" src={user.avatarUrl} alt={user.name} />
                <div className="w-full">
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border-none rounded-md bg-transparent focus:ring-0 text-lg placeholder-theme-text-muted" rows={5} placeholder={texts.whatsOnYourMind} />
                    
                    {mediaPreview && (
                        <div className="mt-2 relative">
                            {mediaFile?.type.startsWith('video') ? (
                                <video src={mediaPreview} controls className="max-h-60 rounded-lg" />
                            ) : (
                                <img src={mediaPreview} alt="Preview" className="max-h-60 rounded-lg" />
                            )}
                            <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">&times;</button>
                        </div>
                    )}
                    
                    <div className="border-t border-[var(--color-glass-border)] my-2"></div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={texts.enterTopicForAI} className="flex-grow p-2 text-sm border border-[var(--color-glass-border)] rounded-md bg-white/10 placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary" />
                        <button onClick={handleGenerateSuggestion} disabled={isGenerating || !topic} className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SparklesIcon className="w-4 h-4"/>
                            <span>{isGenerating ? texts.generating : texts.getSuggestion}</span>
                        </button>
                         <button onClick={handleRefinePost} disabled={isGenerating || !content} className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-secondary bg-secondary/10 rounded-md hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SparklesIcon className="w-4 h-4"/>
                            <span>{texts.refineWithAI}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="flex space-x-1 items-center">
                    <button onClick={() => handleFileIconClick('image/*')} className="p-2 rounded-full hover:bg-white/10 text-theme-text-muted"><PhotoIcon className="w-6 h-6"/></button>
                    <button onClick={() => handleFileIconClick('video/*')} className="p-2 rounded-full hover:bg-white/10 text-theme-text-muted"><VideoIcon className="w-6 h-6"/></button>
                     <button className="p-2 rounded-full hover:bg-white/10 text-theme-text-muted"><ImageIcon className="w-6 h-6"/></button>
                    <button onClick={handleToggleRecording} className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/10 text-red-400' : 'hover:bg-white/10 text-theme-text-muted'}`}>
                        <MicIcon className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <button onClick={() => setIsPrivacyOpen(!isPrivacyOpen)} className="flex items-center space-x-1 p-2 rounded-full hover:bg-white/10 text-theme-text-muted">
                            {selectedPrivacyOption.icon}
                            <span className="text-xs font-semibold hidden sm:inline">{selectedPrivacyOption.label}</span>
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        {isPrivacyOpen && (
                            <div className="absolute bottom-full mb-2 w-48 glass-card rounded-md shadow-lg z-10">
                                {privacyOptions.map(option => (
                                    <button key={option.value} onClick={() => { setPrivacy(option.value); setIsPrivacyOpen(false); }} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-theme-text-base hover:bg-white/10">
                                        {option.icon} <span>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-semibold bg-white/10 text-theme-text-base rounded-full hover:bg-white/20">{texts.saveDraft}</button>
                    <button onClick={handlePreview} className="px-4 py-2 text-sm font-semibold bg-white/10 text-theme-text-base rounded-full hover:bg-white/20">{texts.preview}</button>
                    <button onClick={handlePost} disabled={!content.trim() && !mediaFile} className="px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                        {texts.post}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComposeView;