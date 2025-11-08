// In-memory cache to store translations { [cacheKey]: translation }
const translationCache: { [key: string]: string } = {};

export const generatePostSuggestion = async (topic: string): Promise<string> => {
    try {
        const response = await fetch('/api/generate-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.suggestion;
    } catch (error) {
        console.error("Error getting post suggestion:", error);
        // In a real app, you might want a more user-friendly error.
        // For this simulation, we return a clear error message.
        return "Failed to generate content. The backend API is not available in this demo.";
    }
};

export const translateText = async (text: string, targetLanguage: 'en' | 'ku' | 'ar'): Promise<string> => {
    if (!text) return "";

    const cacheKey = `${targetLanguage}:${text}`;
    // If the translation is already in our cache, return it immediately.
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, targetLanguage }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const translatedText = data.translation;
        
        // Store the new translation in the cache before returning it.
        translationCache[cacheKey] = translatedText;

        return translatedText;

    } catch (error) {
        console.error("Error translating text:", error);
        // Fallback to original text in case of an API error
        // Also inform the user that the backend is a simulation.
        console.warn("Translation failed. The backend API is not available in this demo.");
        return text;
    }
};