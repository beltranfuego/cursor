import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/lib/supabase/database.types";

type MarketClient = SupabaseClient<Database>;

export type PositionWithMarket = Tables<"positions"> & {
  markets: Tables<"markets">;
};

export async function fetchPositionForMarket(
  supabase: MarketClient,
  marketId: string,
): Promise<Tables<"positions"> | null> {
  const { data } = await supabase
    .from("positions")
    .select("*")
    .eq("market_id", marketId)
    .maybeSingle();

  return data;
}

export async function fetchUserPositionsWithMarkets(
  supabase: MarketClient,
): Promise<{
  positions: PositionWithMarket[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("positions")
    .select("*, markets(*)")
    .order("updated_at", { ascending: false });

  return {
    positions: (data as PositionWithMarket[] | null) ?? null,
    error: error?.message ?? null,
  };
}
