import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatFakeDollars, totalSharesCents } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/format";
import { fetchUserPositionsWithMarkets } from "@/lib/markets/positions";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
          <section className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold text-card-foreground">
              My Positions
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to see the markets where you hold fake-money Yes or No
              shares.
            </p>
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

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Positions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Fake-money shares you hold across workshop markets. Amounts are for
            learning only, not real investing.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!error && activePositions.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <h2 className="text-lg font-medium text-card-foreground">
              No positions yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Buy Yes or No shares on an open market to see your fake-money
              positions here.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/markets">Browse markets</Link>
            </Button>
          </section>
        ) : null}

        {!error && activePositions.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
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
                          className="font-medium text-foreground underline-offset-4 hover:underline"
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
        ) : null}
      </main>
    </div>
  );
}
