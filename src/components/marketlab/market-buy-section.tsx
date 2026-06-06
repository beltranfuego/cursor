import { buyMarketShares } from "@/app/markets/[id]/actions";
import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import { fetchPositionForMarket } from "@/lib/markets/positions";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import type { Tables } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function MarketBuySection({
  market,
}: {
  market: Tables<"markets">;
}) {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const supabase = await createServerSupabaseClient();
  const position = user
    ? await fetchPositionForMarket(supabase, market.id)
    : null;

  return (
    <MarketBuyForm
      marketId={market.id}
      isSignedIn={Boolean(user)}
      isBuyable={isMarketBuyable(market)}
      balanceCents={profile?.balance_cents ?? 0}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
      buyAction={buyMarketShares}
    />
  );
}
