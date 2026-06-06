-- Supabase API roles need explicit table grants in addition to RLS policies.
-- Without these, PostgREST returns "permission denied for table ...".

grant select on table public.markets to anon, authenticated;

grant select on table public.profiles to authenticated;

grant select on table public.positions to authenticated;

grant select on table public.ledger_entries to authenticated;
