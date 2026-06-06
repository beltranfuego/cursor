-- MarketLab workshop schema: profiles, markets, positions, ledger_entries

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- $1,000.00 fake starting balance for new users
create or replace function public.starting_balance_cents()
returns bigint
language sql
immutable
as $$
  select 100000::bigint;
$$;

-- ---------------------------------------------------------------------------
-- profiles (one-to-one with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, balance_cents, first_name, last_name)
  values (
    new.id,
    public.starting_balance_cents(),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

grant select on table public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- markets (binary Yes/No only)
-- ---------------------------------------------------------------------------

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'open'
    check (status in ('open', 'closed', 'resolved')),
  close_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger markets_set_updated_at
  before update on public.markets
  for each row
  execute function public.set_updated_at();

alter table public.markets enable row level security;

create policy "Markets are publicly readable"
  on public.markets
  for select
  to anon, authenticated
  using (true);

grant select on table public.markets to anon, authenticated;

-- ---------------------------------------------------------------------------
-- positions (one row per user per market; 1 cent spent = 1 share cent)
-- ---------------------------------------------------------------------------

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid not null references public.markets (id) on delete cascade,
  yes_shares_cents bigint not null default 0 check (yes_shares_cents >= 0),
  no_shares_cents bigint not null default 0 check (no_shares_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, market_id)
);

create index positions_user_id_idx on public.positions (user_id);

create trigger positions_set_updated_at
  before update on public.positions
  for each row
  execute function public.set_updated_at();

alter table public.positions enable row level security;

create policy "Users can read own positions"
  on public.positions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on table public.positions to authenticated;

-- ---------------------------------------------------------------------------
-- ledger_entries (balance changes happen server-side later via RPC)
-- ---------------------------------------------------------------------------

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  market_id uuid references public.markets (id) on delete set null,
  amount_cents bigint not null,
  entry_type text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create index ledger_entries_user_id_idx on public.ledger_entries (user_id);

alter table public.ledger_entries enable row level security;

create policy "Users can read own ledger entries"
  on public.ledger_entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on table public.ledger_entries to authenticated;
