# Community Hub (Vite + React + Supabase)

Community Hub is a role-aware social platform with:
- General feed (`/`) for everyone
- Campus feed (`/campus`) with student-only posting
- Protected profile (`/profile`)

The app uses a centralized Supabase service layer (`services/postService.ts`, `services/profileService.ts`) and Vite for development and production builds.

## Tech Stack

- React + TypeScript
- Vite
- React Router
- Supabase JS
- Tailwind CSS + PostCSS + Autoprefixer

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Set the following required keys:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production bundle
npm run preview  # Preview production build
```

## Routing

- `/` → `GeneralFeedView`
- `/campus` → `CampusView`
- `/profile` → `ProtectedRoute(ProfileView)`

## Deployment

`vercel.json` includes SPA rewrite support so all routes resolve to `index.html`.
