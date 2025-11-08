import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';
import { startLiveConversation, decode, decodeAudioData, createBlob } from '../../services/geminiService.ts';
import { MicIcon, SparklesIcon } from '../icons/Icons.tsx';
import { LiveServerMessage, LiveSession } from '@google/genai';
import Spinner from '../Spinner.tsx';

interface LiveConversationViewProps {
    language: Language;
    onClose: () => void;
}

const LiveConversationView: React.FC<LiveConversationViewProps> = ({ language, onClose }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState('');
    const [transcription, setTranscription] = useState<{ user: string, bot: string}[]>([]);
    const [currentTurn, setCurrentTurn] = useState({ user: '', bot: '' });

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    
    // Audio playback queue state
    const nextStartTimeRef = useRef(0);
    const audioQueueRef = useRef(new Set<AudioBufferSourceNode>());

    const texts = UI_TEXT[language];

    const cleanup = () => {
        console.log('Cleaning up resources...');
        scriptProcessorRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        audioContextRef.current = null;
        outputAudioContextRef.current = null;
        mediaStreamRef.current = null;
        scriptProcessorRef.current = null;
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
    };

    const handleStart = async () => {
        setIsConnecting(true);
        setError('');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;
            
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            outputAudioContextRef.current = outputAudioContext;

            const sessionPromise = startLiveConversation({
                onOpen: () => {
                    setIsConnecting(false);
                    setIsConnected(true);
                    console.log('Session opened. Streaming microphone audio.');
                    
                    const source = inputAudioContext.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;
                    
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext.destination);
                },
                onMessage: async (message: LiveServerMessage) => {
                     // Handle transcription
                    if (message.serverContent?.inputTranscription) {
                        setCurrentTurn(prev => ({...prev, user: prev.user + message.serverContent.inputTranscription.text}));
                    }
                     if (message.serverContent?.outputTranscription) {
                        setCurrentTurn(prev => ({...prev, bot: prev.bot + message.serverContent.outputTranscription.text}));
                    }
                    if (message.serverContent?.turnComplete) {
                        setTranscription(prev => [...prev, currentTurn]);
                        setCurrentTurn({ user: '', bot: ''});
                    }

                    // Handle audio output
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio && outputAudioContextRef.current) {
                        const outCtx = outputAudioContextRef.current;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                        
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                        const source = outCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outCtx.destination);

                        source.addEventListener('ended', () => {
                            audioQueueRef.current.delete(source);
                        });
                        
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        audioQueueRef.current.add(source);
                    }
                },
                onError: (e) => {
                    console.error('Session error:', e);
                    setError('A connection error occurred.');
                    cleanup();
                },
                onClose: () => {
                    console.log('Session closed.');
                    cleanup();
                },
            });

            sessionPromiseRef.current = sessionPromise;

        } catch (err) {
            console.error('Failed to start conversation:', err);
            setError('Could not access microphone. Please grant permission and try again.');
            setIsConnecting(false);
        }
    };
    
    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            cleanup();
        }
    }, []);

    return (
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-2 text-center">{texts.liveConversation}</h2>
            <p className="text-theme-text-muted mb-6 text-center">{texts.liveConversationDesc}</p>

            {!isConnected && (
                <button
                    onClick={handleStart}
                    disabled={isConnecting}
                    className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-50 glow transition-transform hover:scale-105"
                >
                    {isConnecting ? <Spinner /> : <MicIcon className="w-10 h-10" />}
                </button>
            )}

            {isConnected && (
                 <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
                    <MicIcon className="w-10 h-10 text-red-400 animate-pulse" />
                </div>
            )}
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            <div className="mt-8 w-full max-w-xl h-64 overflow-y-auto glass-card rounded-lg p-4 space-y-3">
                 {transcription.map((turn, index) => (
                    <div key={index}>
                        <p><strong className="text-primary">{texts.you}:</strong> {turn.user}</p>
                        <p><strong className="text-secondary">{texts.aiAssistant}:</strong> {turn.bot}</p>
                    </div>
                ))}
                 {(currentTurn.user || currentTurn.bot) && (
                     <div>
                        <p><strong className="text-primary">{texts.you}:</strong> {currentTurn.user}</p>
                        <p><strong className="text-secondary">{texts.aiAssistant}:</strong> {currentTurn.bot}</p>
                    </div>
                )}
            </div>
            
            <button onClick={onClose} className="mt-6 px-4 py-2 text-sm font-semibold bg-white/10 text-theme-text-base rounded-full hover:bg-white/20">{texts.endSession}</button>
        </div>
    );
};

export default LiveConversationView;