import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <section className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Cursor workshop
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Browse fictional Yes/No markets using fake money.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            MarketLab is a simple fake-money dashboard for exploring binary
            prediction markets. Review open questions, inspect probabilities,
            and get ready to trade in a later step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/markets">Browse markets</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Workshop markets",
              body: "Seeded Yes/No questions with clear close dates and statuses.",
            },
            {
              title: "Fake balance",
              body: "Practice trading mechanics without real money on the line.",
            },
            {
              title: "Live sentiment",
              body: "See current Yes probability from aggregate positions when available.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
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
