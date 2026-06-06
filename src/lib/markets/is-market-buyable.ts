import type { Tables } from "@/lib/supabase/database.types";

export function isMarketBuyable(
  market: Pick<Tables<"markets">, "status" | "close_date">,
): boolean {
  if (market.status !== "open") {
    return false;
  }

  return new Date(market.close_date).getTime() > Date.now();
}
