-- Retention return-trigger: a daily pg_cron sweep that finds users whose streak
-- is alive but at risk (active yesterday, nothing today) and POSTs the
-- retention-email Edge Function so it sends a Resend nudge. Run this once in the
-- Supabase SQL editor (project usehtyzsxuyiyjdpnplv).
--
-- Prereq: cloudSync.js now writes state->'streak' = { current, lastVisit(ISO
-- YYYY-MM-DD), longest } to public.user_state on every push.
--
-- Before scheduling, store two secrets in Vault (values are yours):
--   select vault.create_secret(
--     'https://usehtyzsxuyiyjdpnplv.functions.supabase.co/retention-email',
--     'retention_function_url');
--   select vault.create_secret('<YOUR-RETENTION_TRIGGER_SECRET>',
--     'retention_trigger_secret');
-- The trigger secret must match the RETENTION_TRIGGER_SECRET Edge Function secret,
-- and the function must be deployed with --no-verify-jwt (its own secret guards it).

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Dedup guard: never email the same user twice for the same day/kind.
create table if not exists public.retention_email_log (
  user_id uuid references auth.users on delete cascade,
  sent_on date not null default current_date,
  kind    text not null default 'streak_risk',
  primary key (user_id, sent_on, kind)
);
-- RLS on with NO policies: locks out the public anon/authenticated roles entirely
-- (else PostgREST would expose this table for read/write via the shipped anon key,
-- leaking user ids + letting anyone suppress or duplicate retention emails).
-- run_retention_sweep is SECURITY DEFINER so it bypasses RLS and keeps working.
alter table public.retention_email_log enable row level security;

create or replace function public.run_retention_sweep()
returns integer
language plpgsql
security definer
set search_path = public, vault, net
as $$
declare
  v_url    text;
  v_secret text;
  r        record;
  n        integer := 0;
begin
  select decrypted_secret into v_url
    from vault.decrypted_secrets where name = 'retention_function_url';
  select decrypted_secret into v_secret
    from vault.decrypted_secrets where name = 'retention_trigger_secret';
  if v_url is null or v_secret is null then
    raise notice 'retention sweep skipped: vault secrets not set';
    return 0;
  end if;

  for r in
    select u.id,
           u.email,
           coalesce(u.raw_user_meta_data->>'full_name',
                    u.raw_user_meta_data->>'name') as name,
           (us.state->'streak'->>'current')::int   as streak
    from public.user_state us
    join auth.users u on u.id = us.user_id
    where us.state ? 'streak'
      and (us.state->'streak'->>'current') ~ '^[0-9]+$'
      and (us.state->'streak'->>'current')::int > 0
      and (us.state->'streak'->>'lastVisit') ~ '^\d{4}-\d{2}-\d{2}$'
      and (us.state->'streak'->>'lastVisit')::date = current_date - 1
      and u.email is not null
      and not exists (
        select 1 from public.retention_email_log l
        where l.user_id = u.id
          and l.sent_on = current_date
          and l.kind = 'streak_risk'
      )
  loop
    perform net.http_post(
      url     := v_url,
      headers := jsonb_build_object('content-type', 'application/json'),
      body    := jsonb_build_object(
        'secret', v_secret,
        'email',  r.email,
        'name',   r.name,
        'streak', r.streak,
        'kind',   'streak_risk'
      )
    );
    insert into public.retention_email_log(user_id, sent_on, kind)
      values (r.id, current_date, 'streak_risk')
      on conflict do nothing;
    n := n + 1;
  end loop;

  return n;
end;
$$;

-- Daily at 23:00 UTC — late enough to catch a full day of inactivity, before the
-- streak breaks at local midnight for most US timezones.
select cron.schedule('retention-sweep-daily', '0 23 * * *',
  $$select public.run_retention_sweep()$$);

-- Manual test (sends real email if a matching at-risk user exists):
--   select public.run_retention_sweep();
-- Unschedule if needed:
--   select cron.unschedule('retention-sweep-daily');
