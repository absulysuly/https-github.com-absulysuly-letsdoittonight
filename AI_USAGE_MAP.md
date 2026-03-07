# AI Usage Map

| File | Function / Usage | Purpose | Replacement Required |
|---|---|---|---|
| `services/geminiService.ts` | `generatePostSuggestion` | Generate Arabic campaign post drafts | No (already Gemini; optional refactor to shared REST client) |
| `services/geminiService.ts` | `generateReelCaption` | Generate reel captions + hashtags | No (already Gemini; optional refactor to shared REST client) |
| `services/geminiService.ts` | `refinePostText` | Rewrite/optimize existing post text | No (already Gemini; optional refactor to shared REST client) |
| `services/geminiService.ts` | `translateText` | Translate post text by selected language | No (already Gemini; optional refactor to shared REST client) |
| `services/geminiService.ts` | `generateTextWithGoogleSearch` | Grounded chat answers with web sources | No (already Gemini) |
| `services/geminiService.ts` | `generateTextWithGoogleMaps` | Location-aware grounded answers | No (already Gemini) |
| `services/geminiService.ts` | `analyzeImage` | Vision analysis for uploaded images | No (already Gemini) |
| `services/geminiService.ts` | `editImageWithPrompt` | Prompt-driven image edits | No (already Gemini) |
| `services/geminiService.ts` | `analyzeVideo` | Video analysis | No (already Gemini) |
| `services/geminiService.ts` | Live conversation helpers | Realtime Gemini session + audio helpers | No (already Gemini) |
| `components/views/ComposeView.tsx` | Uses `generatePostSuggestion`, `refinePostText` | AI-assisted post composition | No |
| `components/views/compose/ReelComposer.tsx` | Uses `generateReelCaption` | AI-assisted reel captioning | No |
| `components/PostCard.tsx` | Uses `translateText` | On-demand translation | No |
| `components/Chatbot.tsx` | Uses `generateTextWithGoogleSearch` | User chatbot experience + cited sources | No |
| `components/views/AskNeighborView.tsx` | Uses `generateTextWithGoogleMaps` | Neighborhood/location Q&A | No |
| `components/views/GeminiToolsView.tsx` | Uses multiple Gemini service functions | AI utility workspace (vision/editing/etc.) | No |
| `components/views/CandidateDashboardView.tsx` | Uses `analyzeVideo` | Candidate media analysis | No |
| `components/views/LiveConversationView.tsx` | Uses live conversation helpers | Realtime voice conversation | No |

## OpenAI usage check
- No matches for `openai`, `chatgpt`, or `gpt-` in source/docs search.
