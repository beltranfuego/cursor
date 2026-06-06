import Link from "next/link";

import { signOut } from "@/app/login/actions";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function Header() {
  const user = isSupabaseConfigured ? await getCurrentUser() : null;
  const profile = user ? await getCurrentProfile() : null;
  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      user?.email
    : null;

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
            {user && profile ? (
              <span className="hidden sm:inline">
                Balance{" "}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCents(profile.balance_cents)}
                </span>
              </span>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-32 truncate text-sm text-muted-foreground">
                {displayName}
              </span>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
