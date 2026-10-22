-- Tix owns only tix_* objects in the shared project. Existing apps are unchanged.
create function public.tix_valid_tiers(tiers jsonb)
returns boolean language plpgsql immutable security invoker set search_path = '' as $$
declare tier jsonb; seen text[] := '{}';
begin
 if jsonb_typeof(tiers) <> 'array' or jsonb_array_length(tiers) not between 1 and 20 then return false; end if;
 for tier in select value from jsonb_array_elements(tiers) loop
  if jsonb_typeof(tier) <> 'object'
   or coalesce(tier->>'id','') !~ '^[a-zA-Z0-9-]{1,64}$'
   or (tier->>'id') = any(seen)
   or length(trim(coalesce(tier->>'name',''))) not between 1 and 100
   or jsonb_typeof(tier->'price') is distinct from 'number'
   or jsonb_typeof(tier->'available') is distinct from 'number'
  then return false; end if;
  if (tier->>'price')::numeric not between 0 and 100000000
   or round((tier->>'price')::numeric,2) <> (tier->>'price')::numeric
   or (tier->>'available')::numeric not between 1 and 1000000
   or trunc((tier->>'available')::numeric) <> (tier->>'available')::numeric
  then return false; end if;
  seen := array_append(seen, tier->>'id');
 end loop;
 return true;
exception when others then return false;
end;
$$;
revoke all on function public.tix_valid_tiers(jsonb) from public;
grant execute on function public.tix_valid_tiers(jsonb) to authenticated;

create table public.tix_events (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'draft' check (status in ('draft','published')),
 title text not null check (length(trim(title)) between 1 and 160),
 category text not null check (category in ('music','festival','sports','theater','comedy','conference')),
 tagline text not null default '' check (length(tagline) <= 240),
 event_date date,
 event_time time,
 venue text not null default '' check (length(venue) <= 200),
 city text not null default '' check (length(city) <= 100),
 description text not null default '' check (length(description) <= 10000),
 image text not null default '' check (image = '' or (image like 'https://%' and length(image) <= 2000)),
 lineup jsonb not null default '[]' check (jsonb_typeof(lineup) = 'array' and jsonb_array_length(lineup) <= 100),
 tiers jsonb not null default '[]' check (jsonb_typeof(tiers) = 'array' and jsonb_array_length(tiers) <= 20),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint tix_published_complete check (status = 'draft' or (
  event_date is not null and event_time is not null and length(trim(venue)) > 0
  and length(trim(city)) > 0 and length(trim(description)) > 0
  and public.tix_valid_tiers(tiers)
 ))
);
create index tix_events_owner_created on public.tix_events(owner_id, created_at desc);
create index tix_events_public_date on public.tix_events(event_date) where status = 'published';
alter table public.tix_events enable row level security;
revoke all on public.tix_events from anon, authenticated;
grant select on public.tix_events to anon;
grant select, insert, update on public.tix_events to authenticated;
create policy tix_public_events on public.tix_events for select to anon, authenticated using (status = 'published');
create policy tix_owner_events on public.tix_events for select to authenticated using ((select auth.uid()) = owner_id);
create policy tix_create_own_event on public.tix_events for insert to authenticated
 with check ((select auth.uid()) = owner_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') <> 'true');
create policy tix_update_own_event on public.tix_events for update to authenticated
 using ((select auth.uid()) = owner_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') <> 'true')
 with check ((select auth.uid()) = owner_id and coalesce((select auth.jwt()->>'is_anonymous'), 'false') <> 'true');
