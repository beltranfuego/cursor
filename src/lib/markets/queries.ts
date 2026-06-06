import type { SupabaseClient } from "@supabase/supabase-js";

import {
  buildProbabilityChartSeries,
  type MarketPositionTotals,
  type ProbabilityChartSeries,
} from "@/lib/markets/probability";
import type { Database, Tables } from "@/lib/supabase/database.types";

type MarketClient = SupabaseClient<Database>;

export async function fetchMarkets(supabase: MarketClient): Promise<{
  markets: Tables<"markets">[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("close_date", { ascending: true });

  const markets =
    data?.slice().sort((left, right) => {
      const statusOrder = { open: 0, closed: 1, resolved: 2 } as const;
      const leftRank =
        statusOrder[left.status as keyof typeof statusOrder] ?? 99;
      const rightRank =
        statusOrder[right.status as keyof typeof statusOrder] ?? 99;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return (
        new Date(left.close_date).getTime() -
        new Date(right.close_date).getTime()
      );
    }) ?? null;

  return {
    markets,
    error: error?.message ?? null,
  };
}

export async function fetchMarketById(
  supabase: MarketClient,
  id: string,
): Promise<{
  market: Tables<"markets"> | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return {
    market: data,
    error: error?.message ?? null,
  };
}

/**
 * Market-level position totals are not readable under current RLS (owner-scoped only).
 * Returns null so callers fall back to the neutral 50% baseline.
 */
export async function fetchMarketPositionTotals(
  _supabase: MarketClient,
  _marketId: string,
): Promise<MarketPositionTotals | null> {
  return null;
}

/**
 * Market-level ledger history is not readable under current RLS (owner-scoped only).
 * Returns an empty list so callers use the flat current-state chart fallback.
 */
export async function fetchMarketLedgerActivity(
  _supabase: MarketClient,
  _marketId: string,
): Promise<never[]> {
  return [];
}

export async function fetchMarketProbabilityChart(
  supabase: MarketClient,
  market: Tables<"markets">,
): Promise<ProbabilityChartSeries> {
  const [positionTotals, ledgerEntries] = await Promise.all([
    fetchMarketPositionTotals(supabase, market.id),
    fetchMarketLedgerActivity(supabase, market.id),
  ]);

  return buildProbabilityChartSeries({
    marketCreatedAt: market.created_at,
    positionTotals,
    ledgerEntries,
  });
}
