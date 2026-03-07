# Gemini Integration Notes

## Current state
- Gemini is already integrated via `@google/genai` in `services/geminiService.ts`.
- API key source: `import.meta.env.VITE_GEMINI_API_KEY`.
- Components call the service layer; AI logic is mostly centralized.

## Free-tier alignment
- Current integration can use Google AI Studio API keys.
- For stricter portability and minimal lock-in, add a small REST wrapper (`lib/gemini.ts`) using:
  - `POST /v1beta/models/gemini-pro:generateContent`
  - `VITE_GEMINI_API_KEY`

## Suggested minimal next step
1. Create `lib/gemini.ts` with `geminiPrompt(prompt: string)`.
2. Refactor text-only generation paths to use `geminiPrompt`.
3. Keep advanced multimodal/live paths on SDK unless parity is needed.

## Env requirements
- `VITE_GEMINI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
