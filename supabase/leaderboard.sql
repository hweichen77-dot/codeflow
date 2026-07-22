create table if not exists public.lab_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  lab_id text not null,
  prompt_chars integer not null check (prompt_chars > 0 and prompt_chars <= 4000),
  attacks_held integer not null check (attacks_held >= 0 and attacks_held <= 50),
  handle text check (handle is null or handle ~ '^[A-Za-z0-9_-]{2,20}$'),
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lab_id)
);

create index if not exists lab_scores_board_idx
  on public.lab_scores (lab_id, prompt_chars)
  where published;

alter table public.lab_scores enable row level security;

drop policy if exists "own scores readable" on public.lab_scores;
create policy "own scores readable" on public.lab_scores
  for select using (auth.uid() = user_id);

drop policy if exists "own scores writable" on public.lab_scores;
create policy "own scores writable" on public.lab_scores
  for insert with check (auth.uid() = user_id);

drop policy if exists "own scores updatable" on public.lab_scores;
create policy "own scores updatable" on public.lab_scores
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own scores deletable" on public.lab_scores;
create policy "own scores deletable" on public.lab_scores
  for delete using (auth.uid() = user_id);

create or replace function public.lab_leaderboard(p_lab_id text, p_limit integer default 20)
returns table (rank bigint, handle text, prompt_chars integer, attacks_held integer)
language sql
security definer
set search_path = public
stable
as $$
  select
    row_number() over (order by s.prompt_chars asc, s.updated_at asc) as rank,
    s.handle,
    s.prompt_chars,
    s.attacks_held
  from public.lab_scores s
  where s.lab_id = p_lab_id
    and s.published
    and s.handle is not null
  order by s.prompt_chars asc, s.updated_at asc
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

revoke all on function public.lab_leaderboard(text, integer) from public;
grant execute on function public.lab_leaderboard(text, integer) to anon, authenticated;
