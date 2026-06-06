import Link from "next/link";

import { EmptyState } from "@/components/marketlab/empty-state";
import { FakeMoneyChips } from "@/components/marketlab/fake-money-chip";
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Fake-money dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse fictional Yes/No markets using fake money.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Spend fake cents to collect Yes or No shares. Pick a market to
            inspect outcomes, close dates, and current sentiment.
          </p>
          <FakeMoneyChips className="mt-4" />
        </div>

        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : markets && markets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No markets yet"
            description={
              <>
                Workshop markets appear here after the database is seeded. Run{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  task db:push
                </code>{" "}
                to apply migrations and seed data.
              </>
            }
            action={
              <Button asChild variant="outline">
                <Link href="/">Back home</Link>
              </Button>
            }
          />
        )}
      </main>
    </div>
  );
}
