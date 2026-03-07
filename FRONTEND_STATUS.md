# Frontend Status (Current Inspection)

Date: 2026-03-07

## Working features
- Vite + React + TypeScript project structure is intact (`index.tsx`, `App.tsx`, routed views, and reusable components are present).
- Supabase client has explicit offline fallback behavior when env vars are missing (`supabase` becomes `null` and warnings are emitted instead of crashing).
- Auth context gracefully handles no-Supabase mode and returns controlled errors for login/signup.
- Tailwind is configured locally via `tailwind.config.ts`, `postcss.config.cjs`, and `styles.css` (`@tailwind base/components/utilities`).
- No OpenAI references were found in the codebase search; AI functionality appears Gemini-only.
- React duplicate-import diagnostic script reports zero findings.

## Partially broken / risk areas
- Runtime validation (`npm run dev`, `npm run build`) could not be fully completed because dependency installation did not finish correctly in this environment (missing local vite binary path despite partial install).
- AI service uses `@google/genai` SDK and advanced tools in some paths; this is functional in principle, but not yet normalized to the explicit REST `gemini-pro:generateContent` flow requested for ultra-portable free-tier usage.
- Data services are mixed between mock APIs and Supabase APIs; behavior depends on configuration and route path.

## Completely nonfunctional (confirmed)
- None confirmed from static inspection.

## Required environment variables
- `VITE_GEMINI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Key inspection commands run
- `node scripts/diagnose-react-imports.mjs`
- `rg -n "import\.meta\.env\.VITE_[A-Z0-9_]+"`
- `rg -n "openai|chatgpt|gpt-" --glob '*.{ts,tsx,js,jsx,md,json}'`
- `npm run build` (failed due local vite executable not resolved from incomplete install)
