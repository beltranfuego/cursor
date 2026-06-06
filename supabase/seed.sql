-- Workshop sample markets (idempotent)
insert into public.markets (id, title, description, status, close_date)
values
  (
    'a0000001-0000-4000-8000-000000000001',
    'Will Cursor ship a major release this month?',
    'Resolves Yes if Cursor announces a major product release before close.',
    'open',
    now() + interval '14 days'
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'Will it rain in Quito this weekend?',
    'Workshop weather market. Resolves from a simple public forecast check.',
    'open',
    now() + interval '3 days'
  ),
  (
    'a0000001-0000-4000-8000-000000000003',
    'Will our team finish the trade RPC before lunch?',
    'A meta-market for the workshop build sprint.',
    'open',
    now() + interval '5 hours'
  )
on conflict (id) do nothing;
