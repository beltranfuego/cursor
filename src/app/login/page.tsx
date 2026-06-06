import { Suspense } from "react";

import { AuthForm } from "@/components/marketlab/auth-form";
import { FakeMoneyChip } from "@/components/marketlab/fake-money-chip";
import { Header } from "@/components/marketlab/header";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:py-14">
        <div className="mb-8 max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Workshop access
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Join MarketLab
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Create an account to browse fictional Yes/No markets using fake
            money. This workshop app does not use real money.
          </p>
          <FakeMoneyChip className="mt-4">
            1 fake cent spent = 1 share cent
          </FakeMoneyChip>
        </div>
        {isSupabaseConfigured ? (
          <Suspense fallback={null}>
            <AuthForm />
          </Suspense>
        ) : (
          <p className="text-muted-foreground">
            Add Supabase env vars to `.env.local`, then restart the dev server.
          </p>
        )}
      </main>
    </div>
  );
}
