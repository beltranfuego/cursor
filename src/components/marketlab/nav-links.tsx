"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/positions", label: "My Positions" },
] as const;

type NavLinksProps = {
  className?: string;
  onNavigate?: () => void;
};

export function NavLinks({ className, onNavigate }: NavLinksProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {links.map(({ href, label }) => {
        const isActive =
          href === "/markets"
            ? pathname === "/markets" || pathname.startsWith("/markets/")
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand/10 text-foreground dark:bg-brand/15"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
