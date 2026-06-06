"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

import { type AuthActionState, signIn, signUp } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-600/60 focus:ring-2 focus:ring-emerald-600/20 dark:focus:border-emerald-400/60 dark:focus:ring-emerald-400/20";

function AuthFields({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <>
      {mode === "sign-up" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-foreground">
            First name
            <input
              className={fieldClassName}
              name="first_name"
              autoComplete="given-name"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-foreground">
            Last name
            <input
              className={fieldClassName}
              name="last_name"
              autoComplete="family-name"
            />
          </label>
        </div>
      ) : null}
      <label className="grid gap-1.5 text-sm text-foreground">
        Email
        <input
          className={fieldClassName}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm text-foreground">
        Password
        <input
          className={fieldClassName}
          name="password"
          type="password"
          autoComplete={
            mode === "sign-up" ? "new-password" : "current-password"
          }
          required
          minLength={6}
        />
      </label>
    </>
  );
}

export function EmailConfirmationNotice({
  email,
  onBackToSignIn,
}: {
  email: string;
  onBackToSignIn?: () => void;
}) {
  return (
    <div className="grid gap-4 text-center">
      <div className="grid gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Check your email
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{email}</span>. Open it
          to finish creating your account, then sign in.
        </p>
      </div>
      {onBackToSignIn ? (
        <Button type="button" variant="outline" onClick={onBackToSignIn}>
          Back to sign in
        </Button>
      ) : null}
    </div>
  );
}

function getInitialMode(
  searchParams: ReturnType<typeof useSearchParams>,
): "sign-in" | "sign-up" {
  const mode = searchParams.get("mode");
  return mode === "sign-in" ? "sign-in" : "sign-up";
}

export function AuthForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"sign-in" | "sign-up">(() =>
    getInitialMode(searchParams),
  );
  const action = mode === "sign-up" ? signUp : signIn;
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(action, {});

  if (state.needsEmailConfirmation && state.email) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <EmailConfirmationNotice
          email={state.email}
          onBackToSignIn={() => setMode("sign-in")}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex rounded-lg border border-border p-1">
        {(["sign-up", "sign-in"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === value
                ? "bg-emerald-600/10 text-foreground dark:bg-emerald-400/15"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value === "sign-up" ? "Sign up" : "Sign in"}
          </button>
        ))}
      </div>

      <form action={formAction} className="grid gap-4">
        <AuthFields mode={mode} />
        {state.error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="h-10 w-full">
          {pending
            ? "Working..."
            : mode === "sign-up"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      {mode === "sign-up" ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          New accounts receive $1,000 in fake workshop balance.
        </p>
      ) : null}
    </div>
  );
}
