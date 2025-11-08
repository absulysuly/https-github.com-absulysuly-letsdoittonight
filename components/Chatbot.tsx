import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../translations.ts';
import { XMarkIcon, SparklesIcon } from './icons/Icons.tsx';
import * as gemini from '../services/geminiService.ts';

interface ChatbotProps {
    language: Language;
    onClose: () => void;
}

interface Message {
    text: string;
    sender: 'user' | 'bot';
    sources?: any[];
}

const Chatbot: React.FC<ChatbotProps> = ({ language, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const texts = UI_TEXT[language];
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { text, chunks } = await gemini.generateTextWithGoogleSearch(input);
            const botMessage: Message = { text, sender: 'bot', sources: chunks };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm h-[70vh] max-h-[600px] flex flex-col glass-card rounded-2xl shadow-2xl animate-fade-in">
             <header className="flex items-center justify-between p-4 border-b border-[var(--color-glass-border)]">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-primary" />
                    <h2 className="font-bold text-lg">{texts.aiAssistant}</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`message-bubble ${msg.sender === 'user' ? 'is-user' : 'is-other'}`}>
                            <p className="text-sm">{msg.text}</p>
                            {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 border-t border-white/20 pt-2">
                                    <h4 className="text-xs font-bold mb-1 opacity-80">{texts.sources}:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((source, i) => source.web && (
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" key={i} className="text-xs bg-black/20 px-2 py-0.5 rounded-full hover:bg-black/40 truncate">
                                                {source.web.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="message-bubble is-other animate-pulse">
                            <span className="text-sm">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-[var(--color-glass-border)]">
                 <div className="flex items-center space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={texts.askAnything}
                        className="flex-grow p-2.5 border border-[var(--color-glass-border)] rounded-full bg-white/10 placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2.5 rounded-full bg-primary text-on-primary hover:brightness-110 disabled:opacity-50">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chatbot;
