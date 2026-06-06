import Link from "next/link";

import { Header } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";

export default function MarketNotFound() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <section className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Market not found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            That market id does not exist or is no longer available.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/markets">Back to markets</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
