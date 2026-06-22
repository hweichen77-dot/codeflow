-- CodeFlow Database Schema
-- Run in Supabase SQL editor: Settings > SQL Editor

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
-- Without an INSERT policy, RLS denies all inserts and FK-dependent writes fail.
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up. SECURITY DEFINER so
-- the trigger bypasses RLS (it runs as the function owner, not the new user).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Challenge catalog (global)
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard', 'expert')),
  category text,
  tags text[],
  url text,
  description text,
  created_at timestamptz default now()
);
alter table public.challenges enable row level security;
create policy "Anyone can read challenges" on public.challenges for select using (true);

-- User challenge progress
create table public.user_challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  challenge_id uuid references public.challenges(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  notes text,
  solution_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, challenge_id)
);
alter table public.user_challenges enable row level security;
create policy "Users manage own challenge progress" on public.user_challenges
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Portfolio projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  tech_stack text[],
  repo_url text,
  demo_url text,
  thumbnail_url text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Users manage own projects" on public.projects
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Anyone can view public projects" on public.projects for select using (is_public = true);

-- Learning tracks (global catalog)
create table public.tracks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  lessons jsonb not null default '[]'::jsonb,
  order_index int default 0,
  created_at timestamptz default now()
);
alter table public.tracks enable row level security;
create policy "Anyone can read tracks" on public.tracks for select using (true);

-- User track progress
create table public.user_tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  track_id uuid references public.tracks(id) on delete cascade,
  current_lesson_index int not null default 0,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, track_id)
);
alter table public.user_tracks enable row level security;
create policy "Users manage own track progress" on public.user_tracks
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Cloud progress sync ───────────────────────────────────────────────────────
-- One JSONB blob per user mirroring the local-first progress store
-- (codeflow_progress_v1 / _challenges_v1 / _capstones_v1). The app merges this
-- with localStorage on sign-in (see src/api/cloudSync.js), giving durable,
-- cross-device progress without per-entity tables.
create table public.user_state (
  user_id uuid references auth.users on delete cascade primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.user_state enable row level security;
create policy "Users can read own state" on public.user_state
  for select using (auth.uid() = user_id);
create policy "Users can insert own state" on public.user_state
  for insert with check (auth.uid() = user_id);
create policy "Users can update own state" on public.user_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
