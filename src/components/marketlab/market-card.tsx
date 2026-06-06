import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/format";
import type { Tables } from "@/lib/supabase/database.types";

export function MarketCard({ market }: { market: Tables<"markets"> }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-emerald-500/40">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-card-foreground">
          {market.title}
        </h2>
        <MarketStatusBadge status={market.status} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
        {market.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Closes {formatCloseDate(market.close_date)}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={`/markets/${market.id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}
