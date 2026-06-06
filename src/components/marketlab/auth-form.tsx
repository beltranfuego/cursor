"use client";

import { useActionState, useState } from "react";

import { type AuthActionState, signIn, signUp } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#00d395]/60 focus:ring-2 focus:ring-[#00d395]/20";

function AuthFields({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <>
      {mode === "sign-up" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm text-zinc-300">
            First name
            <input
              className={fieldClassName}
              name="first_name"
              autoComplete="given-name"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-zinc-300">
            Last name
            <input
              className={fieldClassName}
              name="last_name"
              autoComplete="family-name"
            />
          </label>
        </div>
      ) : null}
      <label className="grid gap-1.5 text-sm text-zinc-300">
        Email
        <input
          className={fieldClassName}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm text-zinc-300">
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

export function AuthForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-up");
  const action = mode === "sign-up" ? signUp : signIn;
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(action, {});

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10151d]/80 p-6 shadow-xl backdrop-blur">
      <div className="mb-6 flex rounded-lg border border-white/10 p-1">
        {(["sign-up", "sign-in"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === value
                ? "bg-[#00d395]/15 text-white"
                : "text-zinc-400 hover:text-white",
            )}
          >
            {value === "sign-up" ? "Sign up" : "Sign in"}
          </button>
        ))}
      </div>

      <form action={formAction} className="grid gap-4">
        <AuthFields mode={mode} />
        {state.error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {state.error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={pending}
          className="h-10 w-full bg-[#00d395] text-[#080a0d] hover:bg-[#00d395]/90"
        >
          {pending
            ? "Working..."
            : mode === "sign-up"
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      {mode === "sign-up" ? (
        <p className="mt-4 text-center text-xs text-zinc-500">
          New accounts receive $1,000 in fake workshop balance.
        </p>
      ) : null}
    </div>
  );
}
