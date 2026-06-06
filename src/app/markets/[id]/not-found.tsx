import Link from "next/link";

import { EmptyState } from "@/components/marketlab/empty-state";
import { Header } from "@/components/marketlab/header";
import { Button } from "@/components/ui/button";

export default function MarketNotFound() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <EmptyState
          title="Market not found"
          description="That market id does not exist or is no longer available."
          action={
            <Button asChild variant="outline">
              <Link href="/markets">Back to markets</Link>
            </Button>
          }
        />
      </main>
    </div>
  );
}
