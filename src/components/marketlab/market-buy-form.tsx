"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  type BuySide,
  formatFakeDollars,
  parseDollarsToCents,
} from "@/lib/fake-money";
import type { MarketBuyFormProps } from "@/lib/markets/buy-types";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

function MarketBuySignInPrompt() {
  return (
    <section className="surface-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-card-foreground">
        Buy with fake money
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Sign in to buy Yes or No shares using your workshop fake balance. This
        workshop app does not use real money.
      </p>
      <Button asChild className="mt-4 w-full">
        <Link href="/login?mode=sign-in">Sign in</Link>
      </Button>
    </section>
  );
}

function MarketBuyClosedMessage() {
  return (
    <section className="surface-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-card-foreground">
        Buy with fake money
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This market is closed, resolved, or past its close date. New fake-money
        purchases are not available.
      </p>
    </section>
  );
}

function MarketBuyFormActive({
  marketId,
  balanceCents: initialBalanceCents,
  yesSharesCents: initialYesSharesCents,
  noSharesCents: initialNoSharesCents,
  buyAction,
}: Omit<MarketBuyFormProps, "isSignedIn" | "isBuyable">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [side, setSide] = useState<BuySide>("yes");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [balanceCents, setBalanceCents] = useState(initialBalanceCents);
  const [yesSharesCents, setYesSharesCents] = useState(initialYesSharesCents);
  const [noSharesCents, setNoSharesCents] = useState(initialNoSharesCents);

  const previewCents = useMemo(() => parseDollarsToCents(amount), [amount]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await buyAction(marketId, side, amount);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setBalanceCents(result.balanceCents);
      setYesSharesCents(result.yesSharesCents);
      setNoSharesCents(result.noSharesCents);
      setAmount("");
      setSuccessMessage(
        `Purchase complete. Your fake balance is now ${formatFakeDollars(result.balanceCents)}.`,
      );
      router.refresh();
    });
  }

  return (
    <section className="surface-card p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-card-foreground">
        Buy with fake money
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Spend fake cents to collect Yes or No shares. 1 fake cent spent = 1
        share cent.
      </p>

      <dl className="mt-4 space-y-2.5 surface-inset p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Available fake balance</dt>
          <dd className="font-semibold text-brand">
            {formatFakeDollars(balanceCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Your Yes shares</dt>
          <dd className="font-medium text-emerald-700 dark:text-emerald-300">
            {formatFakeDollars(yesSharesCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">Your No shares</dt>
          <dd className="font-medium text-rose-700 dark:text-rose-300">
            {formatFakeDollars(noSharesCents)}
          </dd>
        </div>
      </dl>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Side</legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={side === "yes"}
              disabled={isPending}
              onClick={() => setSide("yes")}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/30",
                side === "yes"
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-900 shadow-sm dark:text-emerald-100"
                  : "border-emerald-500/25 bg-emerald-500/8 text-emerald-800 hover:border-emerald-500/40 dark:text-emerald-200",
              )}
            >
              Buy Yes
            </button>
            <button
              type="button"
              aria-pressed={side === "no"}
              disabled={isPending}
              onClick={() => setSide("no")}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/30",
                side === "no"
                  ? "border-rose-500/60 bg-rose-500/15 text-rose-900 shadow-sm dark:text-rose-100"
                  : "border-rose-500/25 bg-rose-500/8 text-rose-800 hover:border-rose-500/40 dark:text-rose-200",
              )}
            >
              Buy No
            </button>
          </div>
        </fieldset>

        <div className="space-y-2">
          <label
            htmlFor="buy-amount"
            className="text-sm font-medium text-foreground"
          >
            Fake dollars to spend
          </label>
          <input
            id="buy-amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="10.00"
            value={amount}
            disabled={isPending}
            onChange={(event) => setAmount(event.target.value)}
            className={inputClassName}
          />
          {amount.trim() ? (
            <p className="text-xs text-muted-foreground">
              Preview:{" "}
              <span className="font-medium text-foreground">
                {previewCents !== null
                  ? `${previewCents.toLocaleString()} share cents on ${side === "yes" ? "Yes" : "No"}`
                  : "Enter a valid amount like 10.00"}
              </span>
            </p>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        {successMessage ? (
          <p
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200"
          >
            {successMessage}
          </p>
        ) : null}

        <Button type="submit" className="h-10 w-full" disabled={isPending}>
          {isPending
            ? "Buying…"
            : `Buy ${side === "yes" ? "Yes" : "No"} shares`}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/positions"
            className="underline underline-offset-4 hover:text-foreground"
          >
            View My Positions
          </Link>
        </p>
      </form>
    </section>
  );
}

export function MarketBuyForm({
  isSignedIn,
  isBuyable,
  ...activeProps
}: MarketBuyFormProps) {
  if (!isSignedIn) {
    return <MarketBuySignInPrompt />;
  }

  if (!isBuyable) {
    return <MarketBuyClosedMessage />;
  }

  return <MarketBuyFormActive {...activeProps} />;
}
