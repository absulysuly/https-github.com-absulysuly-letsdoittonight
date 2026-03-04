# Iraqi Community Hub (Vite + React + Supabase)

Iraqi Community Hub — A space for students and the general public to share ideas, stories, and updates.

## Platform Structure

- General feed (`/`) for everyone
- Student feed (`/students`) for student-focused posts
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
- `/students` → `StudentFeedView`
- `/profile` → `ProtectedRoute(ProfileView)`

## Deployment

`vercel.json` includes SPA rewrite support so all routes resolve to `index.html`.
