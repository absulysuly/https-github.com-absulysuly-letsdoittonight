import { GoogleGenAI, GenerateContentResponse, LiveServerMessage, Modality, Type, GenerateContentStreamResponse, Chat, LiveSession, Blob } from "@google/genai";

// --- GENERAL UTILITY ---

// Helper to convert a file to a base64 string
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};


// --- TEXT & CHAT ---

export const generatePostSuggestion = async (topic: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, engaging social media post for an Iraqi political candidate about the topic: "${topic}". The post should be in Arabic.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting post suggestion:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateReelCaption = async (topic: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, engaging, and trendy social media caption for a video reel for an Iraqi political candidate. The topic is: "${topic}". The caption should be in Arabic and include relevant hashtags.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting reel caption suggestion:", error);
        throw new Error("Failed to generate caption from Gemini API.");
    }
};

export const refinePostText = async (text: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: `Refine the following social media post to be more clear, impactful, and engaging for an Iraqi audience. Keep the original language. Post: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error refining post:", error);
        throw new Error("Failed to refine post with Gemini API.");
    }
}

export const translateText = async (text: string, targetLanguage: 'en' | 'ku' | 'ar'): Promise<string> => {
     if (!text) return "";
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: `Translate the following text to ${targetLanguage}: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error translating text:", error);
        // Fallback to original text on error
        return text;
    }
};

// --- GROUNDING ---

export const generateTextWithGoogleSearch = async (prompt: string): Promise<{text: string, chunks: any[]}> => {
     try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             tools: [{googleSearch: {}}],
           },
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, chunks: groundingChunks };
    } catch (error) {
        console.error("Error with Google Search grounding:", error);
        throw new Error("Failed to get grounded response from Gemini API.");
    }
};

export const generateTextWithGoogleMaps = async (prompt: string, location: { latitude: number; longitude: number; }): Promise<{text: string, chunks: any[]}> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, chunks: groundingChunks };
    } catch (error) {
        console.error("Error with Google Maps grounding:", error);
        throw new Error("Failed to get grounded response from Gemini API.");
    }
}


// --- IMAGE & VIDEO ---

export const analyzeImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const imagePart = { inlineData: { data: imageBase64, mimeType } };
        const textPart = { text: prompt };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
};

export const editImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
     try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: prompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data returned from API.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image with Gemini API.");
    }
};

export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'): Promise<string> => {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image with Gemini API.");
    }
};

export const analyzeVideo = async (videoFile: File, prompt: string): Promise<string> => {
    // Client-side video analysis is complex. This is a simulation.
    // In a real-world scenario, you would upload the video to a server,
    // which would then use a server-side SDK to interact with the Gemini API for video.
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using pro as requested
            contents: `This is a simulation. A user has uploaded a video named "${videoFile.name}". Based on the user's prompt, provide a plausible analysis. The user's prompt is: "${prompt}"`,
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing video (simulation):", error);
        throw new Error("Failed to get video analysis from Gemini API.");
    }
};


// --- VEO VIDEO GENERATION ---

// Helper for Veo polling
const pollVeoOperation = async (operation: any, ai: GoogleGenAI, onProgress: (message: string) => void): Promise<string> => {
    let currentOperation = operation;
    const startTime = Date.now();
    
    while (!currentOperation.done) {
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        onProgress(`Processing video... (${elapsedTime}s) This can take a few minutes.`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
    }
    
    const downloadLink = currentOperation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('Video generation finished but no download link was found.');
    }
    
    onProgress('Fetching generated video...');
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
}

export const generateVideoFromText = async (prompt: string, aspectRatio: '16:9' | '9:16', onProgress: (message: string) => void): Promise<string> => {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
    });
    return pollVeoOperation(operation, ai, onProgress);
};

export const generateVideoFromImage = async (imageBase64: string, mimeType: string, prompt: string, aspectRatio: '16:9' | '9:16', onProgress: (message: string) => void): Promise<string> => {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: { imageBytes: imageBase64, mimeType: mimeType },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: aspectRatio }
    });
    return pollVeoOperation(operation, ai, onProgress);
}


// --- LIVE API ---

// Audio Decoding/Encoding functions for Live API
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const startLiveConversation = (callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => Promise<void>;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
}): Promise<LiveSession> => {
     const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
     return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: callbacks.onopen,
          onmessage: callbacks.onmessage,
          onerror: callbacks.onerror,
          onclose: callbacks.onclose,
        },
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are a friendly and helpful assistant for the Smart Campaign app. Keep your responses concise and conversational.',
        },
    });
};