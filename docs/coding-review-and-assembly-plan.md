# Coding Review + Assembly Plan (Social / Digital Democracy / Event Management)

## Scope reviewed
- Source scan: `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.config`.
- Runtime checks: `npm run dev`, `npm run build`.
- Targeted review areas: social media UX surface, digital democracy hub, events module, and integration readiness.

## 1) Build issue status (`Identifier 'React' has already been declared`)

### Result
- `TopNavBar` currently has a clean import surface and single default export.
- No duplicate `React` import in `TopNavBar`.

### Evidence
- `TopNavBar` imports only `UI_TEXT` and `Language` and exports default once.
- No extra export declarations in that module.

## 2) Architecture readiness by product track

### A) Social media style (feed/reels/stories/discovery) — **Most ready**

**Why it is most ready now:**
1. App-level mode switching and tab shell already exist in the main app container.
2. Home/social experience is a first-class path in the app navigation structure.
3. Mock API coverage for posts, reels, stories, and login flows is already present.

**Current limitation:**
- Data is in-memory mock data; production persistence/auth is not wired yet.

### B) Digital democracy hub — **Second most ready**

**Why:**
1. Dedicated election management router-like view already maps many routes/pages.
2. Specialized election pages are lazy-loaded and organized under election components.

**Current limitation:**
- Still frontend-driven with simulated APIs and static/mock pipeline for many data flows.

### C) Event management (Event/Compass direction) — **Third (promising, not fully operational)**

**Why:**
1. Event feed UI exists and uses filtering by governorate/party.
2. Event creation and retrieval are implemented in mock API functions.

**Current limitation:**
- RSVP/user attendance and durable event lifecycle are not backend-persistent yet.

## 3) Critical technical gaps to close before consolidation

1. **Mock API boundary**: service layer still clones and mutates mock constants via `simulateDelay`.
2. **Tailwind delivery mode**: app still relies on CDN Tailwind in `index.html` and inline Tailwind config script.
3. **Backend parity**: no real production auth/session + DB persistence in this repo.
4. **Ops layer**: management view is placeholder-level (not operational controls yet).

## 4) Time-saving assembly plan (inventory-preserving)

## Canonical assembly target
Build one unified app from existing parts:
- **Core shell:** current app container + tabbed social UX.
- **Module 1 (MVP first):** Social feed/reels/stories.
- **Module 2:** Election hub pages (as controlled route group).
- **Module 3:** Events (promote from mock into persistent module).

## Keep / Merge / Freeze strategy
- **Keep active:** this repository as canonical frontend shell.
- **Merge next:** event data model + attendance flow into this shell.
- **Freeze:** duplicate/experimental forks while migration is in progress.

## 14-day practical sequence
1. Day 1-2: Introduce real backend adapters in `apiService` shape (same method contracts).
2. Day 3-5: Persist users/posts/events in DB; keep current UI unchanged.
3. Day 6-8: Wire social login/profile/session persistence.
4. Day 9-11: Add event attendee/RSVP persistence + organizer dashboard basics.
5. Day 12-14: Harden ops pages and launch checklist (observability + rollback).

## 5) Tailwind + tooling note

The repository currently builds and runs with Vite scripts and Tailwind CDN usage. For production hardening, migrate to local Tailwind/PostCSS pipeline when package registry access allows dependency install; in the current environment, package fetch restrictions may block installing additional CSS toolchain packages.

## 6) Final readiness verdict

- **Most launch-ready now:** **Social media style module** (best UI depth + interaction surface).
- **Best strategic differentiator:** **Digital democracy hub** (already broad page inventory).
- **Best near-term growth lever:** **Event management** integrated inside the same app (drives recurring engagement).

Recommended release order:
1. Social core live,
2. Election hub as controlled feature set,
3. Event module persistence + organizer workflows,
4. Admin/ops hardening.
