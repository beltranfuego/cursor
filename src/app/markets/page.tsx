import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { MarketCard } from "@/components/marketlab/market-card";
import { Button } from "@/components/ui/button";
import { fetchMarkets } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MarketsPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14 text-muted-foreground">
          Configure Supabase in `.env.local` to load markets.
        </main>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { markets, error } = await fetchMarkets(supabase);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Fake-money dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Browse Yes/No markets
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Browse fictional Yes/No markets using fake money. Pick a market to
            inspect outcomes, close dates, and current sentiment.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : markets && markets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">
              No markets yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Workshop markets appear here after the database is seeded. Run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                task db:push
              </code>{" "}
              to apply migrations and seed data.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/">Back home</Link>
            </Button>
          </section>
        )}
      </main>
    </div>
  );
}
