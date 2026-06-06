import { Suspense } from "react";

import { AuthForm } from "@/components/marketlab/auth-form";
import { Header } from "@/components/marketlab/header";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14">
        <div className="mb-8 max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Join MarketLab
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sign up with your name so your profile is ready for trading.
          </p>
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
