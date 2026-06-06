import Link from "next/link";

import { FakeMoneyChips } from "@/components/marketlab/fake-money-chip";
import { Header } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function Home() {
  const user = isSupabaseConfigured ? await getCurrentUser() : null;

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <section className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Cursor + Supabase workshop
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Browse fictional Yes/No markets using fake money.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            MarketLab is a simple fake-money dashboard for exploring binary
            markets. Review open questions, inspect probabilities, and collect
            Yes or No shares with workshop balance.
          </p>
          <FakeMoneyChips className="mt-5" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/markets">Browse markets</Link>
            </Button>
            {!user ? (
              <Button asChild variant="outline" size="lg">
                <Link href="/login?mode=sign-in">Sign in</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg">
                <Link href="/positions">My Positions</Link>
              </Button>
            )}
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Workshop markets",
              body: "Seeded Yes/No questions with clear close dates and statuses.",
            },
            {
              title: "Fake balance",
              body: "Practice market mechanics without real money on the line.",
            },
            {
              title: "Live sentiment",
              body: "See current Yes probability from aggregate positions when available.",
            },
          ].map((item) => (
            <article key={item.title} className="surface-card p-5">
              <h2 className="font-medium text-card-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
