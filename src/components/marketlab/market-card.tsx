import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/format";
import type { Tables } from "@/lib/supabase/database.types";

export function MarketCard({ market }: { market: Tables<"markets"> }) {
  return (
    <article className="group flex h-full flex-col surface-card p-5 transition-all hover:border-brand/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-snug text-card-foreground group-hover:text-brand">
          {market.title}
        </h2>
        <MarketStatusBadge status={market.status} />
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {market.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <p className="text-xs font-medium text-muted-foreground">
          Closes {formatCloseDate(market.close_date)}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={`/markets/${market.id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}
