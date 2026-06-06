import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AppLogo } from "@/components/marketlab/app-logo";
import { MarketCard } from "@/components/marketlab/market-card";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";

const sampleMarket = {
  id: "a0000001-0000-4000-8000-000000000001",
  title: "Will Cursor ship a major release this month?",
  description:
    "Resolves Yes if Cursor announces a major product release before close.",
  status: "open",
  close_date: "2026-06-20T12:00:00.000Z",
  created_at: "2026-06-01T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

describe("market formatting", () => {
  it("formats close dates and statuses for cards", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatCloseDate(sampleMarket.close_date)).toMatch(/Jun/);
  });
});

describe("MarketCard", () => {
  it("renders title, description, status, close date, and detail link", () => {
    const html = renderToStaticMarkup(<MarketCard market={sampleMarket} />);

    expect(html).toContain(sampleMarket.title);
    expect(html).toContain(sampleMarket.description);
    expect(html).toContain(sampleMarket.status);
    expect(html).toContain("View details");
    expect(html).toContain(`/markets/${sampleMarket.id}`);
  });
});

describe("AppLogo", () => {
  it("renders logo image and wordmark", () => {
    const html = renderToStaticMarkup(<AppLogo />);

    expect(html).toContain("/logo/iso-marketlab.webp");
    expect(html).toContain("Market");
    expect(html).toContain("Lab");
  });
});

describe("ThemeToggle", () => {
  it("renders a theme toggle control", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    expect(html).toMatch(/toggle theme|switch to/i);
  });
});

describe("market pages", () => {
  it("does not reference starter template images in market page sources", () => {
    const root = join(process.cwd(), "src");
    const homeSource = readFileSync(join(root, "app/page.tsx"), "utf8");
    const marketsSource = readFileSync(
      join(root, "app/markets/page.tsx"),
      "utf8",
    );
    const detailSource = readFileSync(
      join(root, "app/markets/[id]/page.tsx"),
      "utf8",
    );

    for (const source of [homeSource, marketsSource, detailSource]) {
      expect(source).not.toContain("quito.png");
      expect(source).not.toContain("hero2-bg.webp");
    }

    expect(detailSource).toContain("MarketBuySection");
  });

  it("includes an empty market state message on the markets page", () => {
    const marketsSource = readFileSync(
      join(process.cwd(), "src/app/markets/page.tsx"),
      "utf8",
    );

    expect(marketsSource).toMatch(/No markets yet/i);
    expect(marketsSource).toMatch(/Configure Supabase/i);
  });
});
