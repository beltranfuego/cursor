import Link from "next/link";

import { signOut } from "@/app/login/actions";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatFakeBalance } from "@/lib/money";
import type { Tables } from "@/lib/supabase/database.types";

type HeaderNavProps = {
  user: { email?: string | null } | null;
  profile: Tables<"profiles"> | null;
};

export function HeaderNav({ user, profile }: HeaderNavProps) {
  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      user?.email
    : user?.email;

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            MarketLab
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/markets" className="hover:text-foreground">
              Markets
            </Link>
            <Link href="/positions" className="hover:text-foreground">
              My Positions
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              {profile ? (
                <span className="text-sm text-muted-foreground">
                  <span className="sr-only">Balance</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatFakeBalance(profile.balance_cents)}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Balance unavailable
                </span>
              )}
              {displayName ? (
                <span className="max-w-32 truncate text-sm text-muted-foreground">
                  {displayName}
                </span>
              ) : null}
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login?mode=sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login?mode=sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
