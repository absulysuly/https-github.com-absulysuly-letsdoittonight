import React, { useState, useEffect } from 'react';
import { Language } from '../../types.ts';
import { UI_TEXT } from '../../translations.ts';
import { generateTextWithGoogleMaps } from '../../services/geminiService.ts';
import Spinner from '../Spinner.tsx';
import { MapIcon, LocationIcon } from '../icons/Icons.tsx';

interface AskNeighborViewProps {
    language: Language;
}

const AskNeighborView: React.FC<AskNeighborViewProps> = ({ language }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ text: string, chunks: any[] } | null>(null);
    const [location, setLocation] = useState<GeolocationPosition | null>(null);
    const [locationError, setLocationError] = useState('');
    const texts = UI_TEXT[language];

    useEffect(() => {
        setIsLoading(true);
        setLocationError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
                setIsLoading(false);
            },
            (err) => {
                setLocationError('Could not get your location. Please enable location services in your browser settings.');
                setError('Location is required for this feature.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !location) {
            setError('Please enter a question and ensure location is enabled.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const { latitude, longitude } = location.coords;
            const response = await generateTextWithGoogleMaps(prompt, { latitude, longitude });
            setResult(response);
        } catch (e: any) {
            setError(e.message || 'Failed to get an answer.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const examplePrompts = [
        "What are the best places to get tea nearby?",
        "Find parks in my area.",
        "Are there any government offices near my location?",
        "Show me historical sites around here."
    ];

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-arabic text-white">{texts.askNeighbor}</h2>
                <p className="text-theme-text-muted mt-2 max-w-2xl mx-auto">{texts.askNeighborDesc}</p>
            </div>
            
             {locationError && <p className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg mb-4">{locationError}</p>}

            <div className="glass-card p-6 rounded-lg">
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-[var(--color-glass-border)] rounded-md bg-white/10 text-theme-text-base placeholder-theme-text-muted focus:outline-none focus:ring-1 focus:ring-primary font-arabic"
                        placeholder={texts.askNeighborPlaceholder}
                        disabled={!location}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !location}
                            className="px-6 py-2 font-bold bg-primary text-on-primary rounded-full transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed font-arabic"
                        >
                            {isLoading ? texts.submitting : texts.ask}
                        </button>
                    </div>
                </form>
            </div>
            
            {!result && !isLoading && (
                 <div className="mt-6">
                    <h3 className="text-lg font-semibold text-theme-text-muted mb-3 text-center">Try asking:</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {examplePrompts.map(p => (
                            <button key={p} onClick={() => setPrompt(p)} className="p-3 text-sm text-left glass-card rounded-lg hover:border-primary disabled:opacity-50" disabled={!location}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {isLoading && <Spinner />}
            {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            
            {result && (
                <div className="mt-6 glass-card p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">{texts.results}</h3>
                    <p className="whitespace-pre-wrap font-arabic">{result.text}</p>
                    
                    {result.chunks && result.chunks.length > 0 && (
                        <div className="mt-6 border-t border-[var(--color-glass-border)] pt-4">
                            <h4 className="font-bold mb-3">{texts.relevantLocations}</h4>
                            <div className="space-y-3">
                                {result.chunks.map((chunk, index) => chunk.maps && (
                                    <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" key={index} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                            <LocationIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-primary">{chunk.maps.title}</p>
                                            <p className="text-xs text-theme-text-muted">{chunk.maps.placeAnswerSources?.reviewSnippets?.[0] || 'View on Map'}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default AskNeighborView;