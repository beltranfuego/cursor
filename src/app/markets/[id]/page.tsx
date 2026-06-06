import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/marketlab/header";
import { MarketBuyPlaceholder } from "@/components/marketlab/market-buy-placeholder";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { Button } from "@/components/ui/button";
import {
  formatCloseDate,
  formatMarketStatus,
  formatYesChancePercent,
} from "@/lib/markets/format";
import {
  fetchMarketById,
  fetchMarketProbabilityChart,
} from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14 text-muted-foreground">
          Configure Supabase in `.env.local` to load market details.
        </main>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { market, error } = await fetchMarketById(supabase, id);

  if (error) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14">
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        </main>
      </div>
    );
  }

  if (!market) {
    notFound();
  }

  const chart = await fetchMarketProbabilityChart(supabase, market);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/markets">← Back to markets</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
                  {market.title}
                </h1>
                <MarketStatusBadge status={market.status} />
              </div>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {market.description}
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {formatMarketStatus(market.status)}
                  </dd>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Close date
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {formatCloseDate(market.close_date)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-card-foreground">
                Outcomes
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Binary Yes/No market. Probabilities reflect aggregate workshop
                positions when available.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    Yes
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {formatYesChancePercent(chart.currentYesChance)}
                  </p>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                    No
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {formatYesChancePercent(1 - chart.currentYesChance)}
                  </p>
                </div>
              </div>
            </section>

            <ProbabilityChart
              points={chart.points}
              currentYesChance={chart.currentYesChance}
              isFlatFallback={chart.isFlatFallback}
              fallbackLabel={chart.fallbackLabel}
            />
          </div>

          <aside className="space-y-6">
            <MarketBuyPlaceholder market={market} />
          </aside>
        </div>
      </main>
    </div>
  );
}
