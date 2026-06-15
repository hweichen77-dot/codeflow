# CodeFlow

A coding challenge tracker and portfolio manager for developers.

## Features
- **Dashboard** — track completion stats and streaks
- **Challenges** — browse and track coding challenges by difficulty and category
- **Portfolio** — showcase your projects with links and tech stack
- **Projects** — manage in-progress and completed projects
- **Tracks** — follow structured learning paths

## Tech Stack
- React 18 + Vite
- Tailwind CSS + Radix UI (shadcn/ui)
- Supabase (auth + database)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
npm run dev
```

## Database Setup

Run the SQL in `supabase-schema.sql` in your Supabase project's SQL editor.
