# LaserFocus Prompt (AppSumo-Credit Efficient)

Use this prompt in Codex for repo `absulysuly/https-github.com-absulysuly-letsdoittonight`.

```text
Objective: Stabilize frontend and ensure all AI text features use the free Gemini API from Google AI Studio.

Constraints:
- Keep edits minimal and production-safe.
- No paid AI providers.
- Maintain TypeScript + Vite compatibility.
- Do not remove working features unless they are broken.

Tasks:
1) Frontend audit
- Check for broken imports, unresolved symbols, and missing env vars.
- Identify views/components with empty or degraded states.
- Identify features blocked when Supabase or Gemini env vars are missing.
- Output: FRONTEND_STATUS.md with sections:
  - Working
  - Partially broken
  - Nonfunctional
  - Required env vars

2) AI usage inventory
- Search for: openai, chatgpt, gpt, gemini, completion, generate.
- Map each usage in AI_USAGE_MAP.md table:
  File | Function | Purpose | Replacement required (Y/N)

3) Gemini integration normalization
- Create reusable client at `lib/gemini.ts`:
  - export async function geminiPrompt(prompt: string): Promise<string>
  - call `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`
  - safe parse of response text
  - consistent error handling
- Refactor text-generation callsites to use `geminiPrompt()`.
- Preserve loading + error states in UI.

4) Config + runtime checks
- Ensure `.env.example` contains:
  VITE_GEMINI_API_KEY=
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
- Run: npm install, npm run dev, npm run build.
- Fix blockers found during runtime/build.

5) Deliverables
- Commit changes.
- Create:
  - FRONTEND_STATUS.md
  - AI_USAGE_MAP.md
  - GEMINI_INTEGRATION.md

Success criteria:
- Frontend runs locally.
- No OpenAI dependency remains.
- Gemini-based AI features work with free API key.
```
