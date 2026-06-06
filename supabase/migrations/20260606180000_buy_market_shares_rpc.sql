-- Atomic fake-money buy: deduct balance, upsert position, write ledger entry.

create or replace function public.buy_market_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_market public.markets%rowtype;
  v_balance bigint;
  v_position public.positions%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'Sign in to buy shares.');
  end if;

  if p_side is distinct from 'yes' and p_side is distinct from 'no' then
    return jsonb_build_object('ok', false, 'error', 'Choose Yes or No.');
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    return jsonb_build_object('ok', false, 'error', 'Enter a positive fake dollar amount.');
  end if;

  select *
  into v_market
  from public.markets
  where id = p_market_id;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Market not found.');
  end if;

  if v_market.status <> 'open' or v_market.close_date <= now() then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'This market is not open for new fake-money purchases.'
    );
  end if;

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Profile not found.');
  end if;

  if v_balance < p_amount_cents then
    return jsonb_build_object(
      'ok',
      false,
      'error',
      'Not enough fake balance for this purchase.'
    );
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user_id;

  insert into public.positions (
    user_id,
    market_id,
    yes_shares_cents,
    no_shares_cents
  )
  values (
    v_user_id,
    p_market_id,
    case when p_side = 'yes' then p_amount_cents else 0 end,
    case when p_side = 'no' then p_amount_cents else 0 end
  )
  on conflict (user_id, market_id) do update
  set
    yes_shares_cents = public.positions.yes_shares_cents + excluded.yes_shares_cents,
    no_shares_cents = public.positions.no_shares_cents + excluded.no_shares_cents;

  insert into public.ledger_entries (
    user_id,
    market_id,
    amount_cents,
    entry_type,
    description
  )
  values (
    v_user_id,
    p_market_id,
    -p_amount_cents,
    'buy',
    case
      when p_side = 'yes' then 'Bought Yes shares with fake money'
      else 'Bought No shares with fake money'
    end
  );

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user_id;

  select *
  into v_position
  from public.positions
  where user_id = v_user_id
    and market_id = p_market_id;

  return jsonb_build_object(
    'ok', true,
    'balance_cents', v_balance,
    'yes_shares_cents', v_position.yes_shares_cents,
    'no_shares_cents', v_position.no_shares_cents
  );
end;
$$;

revoke all on function public.buy_market_shares(uuid, text, bigint) from public;
grant execute on function public.buy_market_shares(uuid, text, bigint) to authenticated;
