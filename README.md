# Byond Election Platform

This repository hosts the production-ready Byond Election stack, combining the voter-facing frontend, operational backend, shared types, and curated assets required to run the 2025 Iraqi election experience. The project is structured as a multi-package workspace so each surface can be deployed independently while still sharing contracts and tooling.

## Repository Layout

```
/
├── frontend/              # Vite + React 19 application
│   ├── src/               # UI components, views, services, and utilities
│   ├── index.html         # Single entry point (uses local Tailwind build)
│   ├── tailwind.config.ts # Tailwind configuration wired to CSS variables
│   └── package.json       # Frontend dependencies and scripts
├── backend/               # Express + Prisma API service
│   ├── src/
│   │   ├── agents/        # Agent status aggregation helpers
│   │   ├── config/        # Environment + logger configuration
│   │   ├── middleware/    # Error handling
│   │   ├── routes/        # /api endpoints (health, candidates, agent)
│   │   └── services/      # Prisma client + candidate domain logic
│   ├── prisma/            # Prisma schema
│   └── package.json
├── shared/                # Shared TypeScript contracts (Candidate, AgentTask, UserRole)
├── assets/                # Checked-in minimal asset set for deployment
├── .env.production.example# Reference environment variables for all services
└── package.json           # Workspace scripts
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL instance for the backend (Railway recommended)

## Environment Variables

Copy `.env.production.example` to an environment-specific file (never commit private secrets):

```bash
cp .env.production.example .env
```

Populate the values:

- `DATABASE_URL` – PostgreSQL connection string (Railway provides this automatically)
- `JWT_SECRET` – long random secret for auth flows
- `CORS_ORIGINS` – comma-separated list of allowed origins (e.g. your Vercel frontend URL)
- `NODE_ENV` – `production` in deployed environments
- `EXPECTED_CANDIDATE_COUNT` – must remain `7769`
- `VITE_API_URL` – public API base URL consumed by the frontend

Both the backend and frontend load these variables at build/runtime. `.env*` files are ignored by Git to prevent accidental leaks.

## Installing Dependencies

From the repository root, install all workspace dependencies:

```bash
npm install
```

This will bootstrap the frontend, backend, and shared packages.

## Local Development

Run the backend API (port 4000 by default):

```bash
npm run dev:backend
```

In a separate terminal, start the frontend:

```bash
npm run dev:frontend
```

The frontend uses `VITE_API_URL` to talk to the backend. If you run both locally the default value of `http://localhost:4000` will be used.

## Production Builds

Generate production bundles for both services:

```bash
npm run build
```

- Backend build → `backend/dist`
- Frontend build → `frontend/dist`

### Railway (Backend)

- Root directory: `backend`
- Build command: `npm run build`
- Start command: `npm run start:prod`

### Vercel or Railway (Frontend)

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `frontend/dist`

Ensure `VITE_API_URL` is set to the deployed backend URL in the hosting dashboard.

## Key Backend Endpoints

| Endpoint                | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `GET /api/health`       | Returns `{ ok: true }` with timestamp + environment    |
| `GET /api/candidates`   | Returns candidate array (7,769 bilingual records)      |
| `GET /api/candidates?summary=true` | Returns `{ count: 7769 }`                      |
| `GET /api/candidates/stats` | Returns totals + gender split                        |
| `GET /api/agent/status` | Reports content/outreach/segmentation agent health     |

`GET /api/candidates/validate` can be used in CI to enforce the canonical record count.

## Candidate Count Verification

The script `npm --prefix backend run verify:candidates` ensures the `Candidate` table contains exactly **7,769** bilingual entries. The command exits with a non-zero status if the count deviates so it can be wired into CI/CD pipelines.

## Testing & Validation

- `npm run build` – compiles backend and frontend
- `npm run dev:backend` – launches the API for manual QA
- `npm run dev:frontend` – launches the Vite dev server

## Branch Protection Recommendation

Enable the following rules on `main` in your Git host:

- Require pull request reviews before merging
- Require the workspace `npm run build` job to pass
- Block force pushes and deletions

## Deployment Checklist

1. Confirm `npm run build` succeeds.
2. Deploy backend (Railway) with the environment variables from `.env.production.example`.
3. Deploy frontend (Vercel or Railway) pointing to the backend API URL.
4. Run `npm --prefix backend run verify:candidates` or call `/api/candidates/validate` to confirm the 7,769 record set.
5. Visit the production frontend and ensure:
   - Candidate list loads with the correct count
   - Agent dashboard surfaces agent status
   - Assets load from `/assets`
   - No `.env` or `.git` artefacts are exposed
6. Review deployment logs for warnings or errors.

Once the above steps succeed, mark the status as **ready for review**.
