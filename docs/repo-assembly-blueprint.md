# Repository Assembly Blueprint (Social + Digital Democracy + Events)

## Executive Decision
If your goal is the **fastest deployable app with lowest complexity**, prioritize in this order:

1. **Social Media Style Core** (most ready)
2. **Digital Democracy Hub** (feature-rich, second)
3. **Event Management / Era Compass** (merge into social core, third)

This gives you one app with modular sections instead of many disconnected repos.

---

## What is most ready *in this repository* (code evidence)

### 1) Social Media Style Core — **Most Ready**
- Main shell, state and mode switching already exist.
- Social-centric views are already wired as lazy-loaded sections.
- Mock APIs already cover posts/reels/stories and basic interactions.

**Why it wins:** you can ship engagement first with minimal backend migration risk.

### 2) Digital Democracy Hub — **Second Most Ready**
- Election pages are already organized behind one management router.
- Many specialized election surfaces are implemented and lazy-loaded.

**Why second:** rich UI exists, but operational data pipelines are still mock-driven.

### 3) Event Management (Era Compass direction) — **Third, but high impact**
- Event list/view exists and is filterable by governorate/party.
- Event creation/read methods exist in current API service layer.

**Why third:** persistence for RSVP/attendance/lifecycle is not production-ready yet.

---

## Technical health snapshot

### Build/runtime status
- `npm run dev` starts successfully in this repo.
- `npm run build` succeeds (with large chunk warning only).

### React collision issue status
- `components/TopNavBar.tsx` currently has no duplicate React import and a single default export.
- Repo-level scan showed no files with duplicate react import lines in the same file.

### Tailwind status
- Tailwind is currently delivered by CDN + inline config in `index.html`.
- For production hardening: move to local Tailwind/PostCSS pipeline when registry access allows package installation.

---

## “Helmet” clarification (your question)

- This repo is a frontend Vite app and does **not** include backend middleware.
- `helmet` belongs in backend Node/Express services (security headers).
- If backend is separate, add: `helmet`, CORS allowlist, rate limits, auth middleware, and audit logging.

---

## Inventory-preserving assembly plan (save time, don’t lose work)

## Keep / Merge / Freeze

### Keep (active)
- This frontend shell as canonical UI integration surface.

### Merge (next)
- Event management capabilities into this shell as a module.
- Election hub remains as controlled route group under same app.

### Freeze (avoid drift)
- Duplicate and experimental copies while migration is running.
- No new parallel repos until this app has real users and real data flow.

---

## 21-day practical implementation path

### Week 1: Stabilize data contracts
1. Keep current `apiService` method signatures.
2. Replace mock internals with real backend adapters (same API surface).
3. Add minimal error normalization and loading states.

### Week 2: Persist core flows
1. Users/auth/session persistence.
2. Posts/reels/comments persistence.
3. Events + attendee RSVP persistence.

### Week 3: Launch hardening
1. Admin moderation for posts/candidates/events.
2. Observability + rollback checklist.
3. Feature flags for gradual rollout (social first, then election/event expansion).

---

## Concrete next coding tasks (from highest ROI)

1. **Real Auth Adapter**
   - swap mock `socialLogin/registerUser/checkVerificationStatus` internals with backend endpoints.
2. **Persist Feed APIs**
   - migrate `getPosts/createPost/createReel` from in-memory arrays to DB-backed APIs.
3. **Persist Event APIs**
   - implement `getEvents/createEvent` with RSVP relationship table.
4. **Admin Ops Upgrade**
   - replace `ManagementView` placeholder with approval queues and audit actions.

---

## Final recommendation
Ship one application with three modules (Social, Democracy, Events), in that order.
This protects your inventory, cuts duplicate effort, and gives the fastest path from prototype to production.
