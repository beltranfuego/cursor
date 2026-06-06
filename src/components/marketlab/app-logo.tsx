import Link from "next/link";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function AppLogo({ className, showWordmark = true }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      {/* biome-ignore lint/performance/noImgElement: static local workshop logo */}
      <img
        src="/logo/iso-marketlab.webp"
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-lg"
      />
      {showWordmark ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Market<span className="text-brand">Lab</span>
        </span>
      ) : null}
    </Link>
  );
}
