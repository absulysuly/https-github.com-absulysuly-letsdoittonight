# Version Application Recommendation (4 candidate versions)

## Candidates reviewed
1. `e6d1911` — Tailwind/image optimization + CI auto-rollback.
2. `af0b936` — Migration to Vite + Tailwind.
3. `8e57c32` — TopNavBar React import collision fix.
4. `2fb293a` — React import/export diagnostics script.

## Decision
**Apply version `2fb293a` as your target base** (latest of the 4).

## Why this is the correct choice
- It preserves the runtime/tooling path that currently works in this repository (`npm run dev` and `npm run build` are Vite-backed via the local shim).
- It keeps the TopNavBar collision fix lineage already in history (`8e57c32`) and adds repeatable diagnostics to prevent regressions.
- It gives a deterministic preflight command (`npm run diagnose`) that detects duplicate React imports and multiple default exports before build.

## Important clarification
- This repository is **Vite-first**, not a true Next.js app structure.
- Forcing `"dev": "next dev"` here is not recommended unless you migrate to real Next.js conventions (`app/` or `pages/`, Next config, routing/data model, etc.).
- For this codebase, the most stable path is to keep Vite scripts and validate with `diagnose + build`.

## Practical apply plan
1. Keep `2fb293a` checked out on your working branch.
2. Run:
   - `npm run diagnose`
   - `npm run dev`
   - `npm run build`
3. If a future duplicate-import issue appears, fix the reported file and rerun `npm run diagnose` before committing.
