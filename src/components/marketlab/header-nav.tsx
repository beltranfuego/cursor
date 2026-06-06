"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { signOut } from "@/app/login/actions";
import { AppLogo } from "@/components/marketlab/app-logo";
import { NavLinks } from "@/components/marketlab/nav-links";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { Button } from "@/components/ui/button";
import { formatFakeBalance } from "@/lib/money";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type HeaderNavProps = {
  user: { email?: string | null } | null;
  profile: Tables<"profiles"> | null;
};

export function HeaderNav({ user, profile }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      user?.email
    : user?.email;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-4 lg:gap-8">
          <AppLogo />
          <NavLinks className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-2">
          {user && profile ? (
            <div className="hidden items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-3 py-1 sm:flex">
              <span className="sr-only">Balance</span>
              <span className="text-xs font-medium text-muted-foreground">
                Balance
              </span>
              <span className="text-sm font-semibold text-brand">
                {formatFakeBalance(profile.balance_cents)}
              </span>
            </div>
          ) : null}
          {user && !profile ? (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Balance unavailable
            </span>
          ) : null}

          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {displayName ? (
                  <span className="max-w-28 truncate text-sm text-muted-foreground lg:max-w-36">
                    {displayName}
                  </span>
                ) : null}
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login?mode=sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/login?mode=sign-up">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border/80 bg-background md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-4">
          <NavLinks
            className="flex-col items-stretch"
            onNavigate={() => setMobileOpen(false)}
          />

          {user && profile ? (
            <div className="rounded-xl border border-brand/20 bg-brand/8 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                Fake balance
              </p>
              <p className="mt-0.5 text-sm font-semibold text-brand">
                {formatFakeBalance(profile.balance_cents)}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-border/80 pt-4">
            {user ? (
              <>
                {displayName ? (
                  <p className="text-sm text-muted-foreground">{displayName}</p>
                ) : null}
                <form action={signOut}>
                  <Button type="submit" variant="outline" className="w-full">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href="/login?mode=sign-in"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link
                    href="/login?mode=sign-up"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
