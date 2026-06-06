import Link from "next/link";
import { notFound } from "next/navigation";

import { FakeMoneyChip } from "@/components/marketlab/fake-money-chip";
import { Header } from "@/components/marketlab/header";
import { MarketBuySection } from "@/components/marketlab/market-buy-section";
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
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/markets">← Back to markets</Link>
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FakeMoneyChip>
            This workshop app does not use real money.
          </FakeMoneyChip>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
            <section className="surface-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                  {market.title}
                </h1>
                <MarketStatusBadge status={market.status} />
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {market.description}
              </p>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="surface-inset p-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {formatMarketStatus(market.status)}
                  </dd>
                </div>
                <div className="surface-inset p-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Close date
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {formatCloseDate(market.close_date)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="surface-card p-6">
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
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                    {formatYesChancePercent(chart.currentYesChance)}
                  </p>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                  <p className="text-sm font-medium text-rose-800 dark:text-rose-200">
                    No
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
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

          <aside>
            <MarketBuySection market={market} />
          </aside>
        </div>
      </main>
    </div>
  );
}
