# Mega Prompt for Codex / Claude Code

You are a senior full-stack engineer operating in **Full Diagnostic + Auto-Fix mode**.

## Mission
Finalize this repository into a production-ready MVP by:
1. auditing and repairing the frontend architecture,
2. fixing current build/runtime blockers,
3. preparing and integrating Supabase safely,
4. validating deployment readiness (Vercel-compatible),
5. producing documentation and a clean commit set.

Repo context:
- Framework: React + TypeScript + Vite
- Existing scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run diagnose`
- Current pain points: mixed prototype code, mock data coupling, auth not fully real, backend integration not completed

---

## Execution Rules
- Do not ask clarifying questions; infer and proceed.
- Keep UI behavior unchanged unless required to fix a bug or support routing/auth/data correctness.
- Prefer minimal-risk refactors with high maintainability.
- Preserve TypeScript strictness; remove `any` where practical.
- No secrets in repo. Use environment variables only.
- Ensure every changed component compiles and is imported/exported exactly once.

---

## Phase 1 — Repository Audit + Stabilization
1. Scan all source/config files (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.mjs`, configs).
2. Detect and fix:
   - duplicate imports (especially React imports),
   - duplicate declarations/exports,
   - invalid default/named export combinations,
   - dead or unused imports causing build warnings/failures.
3. Run and resolve failures for:
   - `npm run diagnose`
   - `npm run build`
4. Produce `FRONTEND_AUDIT_REPORT.md` updates with:
   - issues found,
   - severity (Critical/Major/Minor),
   - exact fixes implemented.

---

## Phase 2 — Routing + App Structure Hardening
1. Ensure URL-based routing exists and is used as source of truth.
2. Required routes:
   - `/feed`
   - `/candidates`
   - `/candidate/:id`
   - `/events`
   - `/login`
3. Add/verify `router/AppRouter.tsx` and route-driven rendering (remove fragile view-state switching where applicable).
4. Keep shared layout/navigation stable.
5. Ensure deep links and refreshes work on all route paths.

---

## Phase 3 — Data Layer Refactor (Backend-Agnostic)
1. Remove direct mock-data imports from UI components.
2. Enforce service boundary under `services/`:
   - `postService`
   - `candidateService`
   - `eventService`
   - `authService` (if needed)
3. During transition, services may return Promise-wrapped mock data, but components must never import mock constants directly.
4. For all data-consuming views, implement:
   - loading state,
   - error state,
   - empty state.

---

## Phase 4 — Auth Architecture
1. Implement/upgrade `context/AuthContext.tsx` with clear interface:
   - `user`
   - `isAuthenticated`
   - `login`
   - `signup` (if present in UI)
   - `logout`
2. Ensure App root is wrapped in `AuthProvider`.
3. Ensure actions that require auth are guarded consistently.
4. Persist and restore session where applicable.

---

## Phase 5 — Supabase Integration
1. Install/verify `@supabase/supabase-js`.
2. Add `services/supabaseClient.ts` using:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Replace service-layer mock implementations with Supabase queries (not direct component calls).
4. Add storage upload service (bucket: `media`) for images/files.
5. Add `.env.example` with:
   - `VITE_API_URL=`
   - `VITE_SUPABASE_URL=`
   - `VITE_SUPABASE_ANON_KEY=`
6. Never commit actual keys.

---

## Phase 6 — Supabase Schema + Security Artifacts
Create SQL artifacts in `docs/`:
- `docs/SUPABASE_SCHEMA.sql`
- `docs/SUPABASE_RLS_POLICIES.sql`

Schema must include at least:
- `users`
- `posts`
- `candidates`
- `events`

Security requirements:
- Enable RLS on all application tables.
- Public read where intended (`posts`, `candidates`, `events`).
- Authenticated users can manage only their own records (`posts`, `events`).
- Candidate mutations restricted to admin role policy.

---

## Phase 7 — Build, Quality, and Deployment Readiness
1. Validate:
   - `npm run dev` starts successfully.
   - `npm run build` succeeds.
2. If lint/type checks are available, run and fix.
3. Confirm no runtime crashes on key routes.
4. Confirm Vercel readiness:
   - no server-only imports in client paths,
   - env vars referenced safely,
   - SPA route behavior documented.

---

## Required Deliverables
1. Code changes fully applied in repo.
2. `ARCHITECTURE_UPGRADE_SUMMARY.md` with:
   - before/after architecture,
   - key refactors,
   - migration notes.
3. `BACKEND_READINESS_CHECKLIST.md` with explicit GO/NO-GO criteria for:
   - Supabase integration,
   - Railway migration path.
4. Updated `README.md` sections for:
   - local setup,
   - environment variables,
   - run/build commands,
   - deployment notes.
5. Final status block including:
   - Frontend completion score (0–100),
   - Integration risk level,
   - GO/NO-GO recommendation,
   - remaining known issues (if any).

---

## Acceptance Criteria (Must Pass)
- App runs with `npm run dev`.
- App builds with `npm run build`.
- No duplicate React import/declaration errors.
- Components import/export cleanly.
- No direct mock constant usage in view components.
- Route-driven navigation works with deep links.
- Auth context functional and centralized.
- Supabase service layer integrated and env-driven.
- SQL + RLS docs provided.
- Repository is deployable and maintainable.
