import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Tables } from "@/lib/supabase/database.types";

export function MarketBuyPlaceholder({
  market,
}: {
  market: Pick<Tables<"markets">, "status" | "close_date">;
}) {
  const buyable = isMarketBuyable(market);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground">Trade</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {buyable
          ? "Buying and selling will be available in a later workshop step. For now, review market details and probability."
          : "Trading is unavailable because this market is closed or no longer open for new positions."}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-left text-sm font-medium text-emerald-800 opacity-60 dark:text-emerald-200"
        >
          Buy Yes
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            {buyable ? "Coming soon" : "Unavailable"}
          </span>
        </button>
        <button
          type="button"
          disabled
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left text-sm font-medium text-rose-800 opacity-60 dark:text-rose-200"
        >
          Buy No
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            {buyable ? "Coming soon" : "Unavailable"}
          </span>
        </button>
      </div>
    </section>
  );
}
