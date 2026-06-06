import Link from "next/link";

import { EmptyState } from "@/components/marketlab/empty-state";
import { FakeMoneyChip } from "@/components/marketlab/fake-money-chip";
import { Header } from "@/components/marketlab/header";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatFakeDollars, totalSharesCents } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import { fetchUserPositionsWithMarkets } from "@/lib/markets/positions";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "yes" | "no" | "default";
}) {
  const valueClass =
    tone === "yes"
      ? "text-emerald-700 dark:text-emerald-300"
      : tone === "no"
        ? "text-rose-700 dark:text-rose-300"
        : "text-foreground";

  return (
    <div className="surface-inset p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

export default async function PositionsPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14 text-muted-foreground">
          Configure Supabase in `.env.local` to load your positions.
        </main>
      </div>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-14">
          <section className="mx-auto max-w-md surface-card p-8 text-center">
            <h1 className="text-2xl font-semibold text-card-foreground">
              My Positions
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to see the markets where you hold fake-money Yes or No
              shares.
            </p>
            <FakeMoneyChip className="mt-4">
              This workshop app does not use real money.
            </FakeMoneyChip>
            <Button asChild className="mt-6">
              <Link href="/login">Sign in</Link>
            </Button>
          </section>
        </main>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { positions, error } = await fetchUserPositionsWithMarkets(supabase);
  const activePositions =
    positions?.filter(
      (position) =>
        totalSharesCents(position.yes_shares_cents, position.no_shares_cents) >
        0,
    ) ?? [];

  const totalYesCents = activePositions.reduce(
    (sum, p) => sum + p.yes_shares_cents,
    0,
  );
  const totalNoCents = activePositions.reduce(
    (sum, p) => sum + p.no_shares_cents,
    0,
  );
  const totalShares = activePositions.reduce(
    (sum, p) => sum + totalSharesCents(p.yes_shares_cents, p.no_shares_cents),
    0,
  );

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Positions
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Fake-money shares you hold across workshop markets. Amounts are for
            learning only, not real investing.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!error && activePositions.length === 0 ? (
          <EmptyState
            title="No positions yet"
            description="Buy Yes or No shares on an open market to see your fake-money positions here."
            action={
              <Button asChild variant="outline">
                <Link href="/markets">Browse markets</Link>
              </Button>
            }
          />
        ) : null}

        {!error && activePositions.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Markets held"
                value={String(activePositions.length)}
              />
              <SummaryCard
                label="Total shares"
                value={formatFakeDollars(totalShares)}
              />
              <SummaryCard
                label="Yes exposure"
                value={formatFakeDollars(totalYesCents)}
                tone="yes"
              />
              <SummaryCard
                label="No exposure"
                value={formatFakeDollars(totalNoCents)}
                tone="no"
              />
            </div>

            <div className="hidden overflow-x-auto surface-card md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Market</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Close date</th>
                    <th className="px-4 py-3 font-medium">Yes shares</th>
                    <th className="px-4 py-3 font-medium">No shares</th>
                    <th className="px-4 py-3 font-medium">Total shares</th>
                  </tr>
                </thead>
                <tbody>
                  {activePositions.map((position) => {
                    const total = totalSharesCents(
                      position.yes_shares_cents,
                      position.no_shares_cents,
                    );

                    return (
                      <tr
                        key={position.id}
                        className="border-b border-border/70 last:border-b-0"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/markets/${position.market_id}`}
                            className="font-medium text-foreground underline-offset-4 hover:text-brand hover:underline"
                          >
                            {position.markets.title}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <MarketStatusBadge status={position.markets.status} />
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {formatCloseDate(position.markets.close_date)}
                        </td>
                        <td className="px-4 py-4 text-emerald-700 dark:text-emerald-300">
                          {formatFakeDollars(position.yes_shares_cents)}
                        </td>
                        <td className="px-4 py-4 text-rose-700 dark:text-rose-300">
                          {formatFakeDollars(position.no_shares_cents)}
                        </td>
                        <td className="px-4 py-4 font-medium text-foreground">
                          {formatFakeDollars(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {activePositions.map((position) => {
                const total = totalSharesCents(
                  position.yes_shares_cents,
                  position.no_shares_cents,
                );

                return (
                  <article key={position.id} className="surface-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/markets/${position.market_id}`}
                        className="font-medium text-foreground hover:text-brand"
                      >
                        {position.markets.title}
                      </Link>
                      <MarketStatusBadge status={position.markets.status} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Closes {formatCloseDate(position.markets.close_date)}
                    </p>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="surface-inset p-2">
                        <dt className="text-muted-foreground">Yes</dt>
                        <dd className="mt-0.5 font-medium text-emerald-700 dark:text-emerald-300">
                          {formatFakeDollars(position.yes_shares_cents)}
                        </dd>
                      </div>
                      <div className="surface-inset p-2">
                        <dt className="text-muted-foreground">No</dt>
                        <dd className="mt-0.5 font-medium text-rose-700 dark:text-rose-300">
                          {formatFakeDollars(position.no_shares_cents)}
                        </dd>
                      </div>
                      <div className="surface-inset p-2">
                        <dt className="text-muted-foreground">Total</dt>
                        <dd className="mt-0.5 font-medium text-foreground">
                          {formatFakeDollars(total)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
