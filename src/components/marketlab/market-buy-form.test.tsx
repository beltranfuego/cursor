import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import type { BuyActionResult } from "@/lib/markets/buy-types";

async function noopBuyAction(): Promise<BuyActionResult> {
  return { ok: false, error: "Not used in static render tests." };
}

describe("MarketBuyForm import boundary", () => {
  it("does not import server-only Supabase or next/headers modules", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/marketlab/market-buy-form.tsx"),
      "utf8",
    );

    expect(source).not.toContain("@/lib/supabase/server");
    expect(source).not.toContain("next/headers");
    expect(source).not.toContain("cookies(");
  });
});

describe("MarketBuyForm signed-out state", () => {
  it("asks the user to sign in", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        isSignedIn={false}
        isBuyable
        balanceCents={0}
        yesSharesCents={0}
        noSharesCents={0}
        buyAction={noopBuyAction}
      />,
    );

    expect(html).toMatch(/sign in/i);
    expect(html).toContain("/login?mode=sign-in");
  });
});

describe("MarketBuyForm closed market state", () => {
  it("shows that buying is unavailable", () => {
    const html = renderToStaticMarkup(
      <MarketBuyForm
        marketId="market-1"
        isSignedIn
        isBuyable={false}
        balanceCents={100000}
        yesSharesCents={0}
        noSharesCents={0}
        buyAction={noopBuyAction}
      />,
    );

    expect(html).toMatch(/not available/i);
    expect(html).not.toContain('name="amount"');
  });
});

describe("MarketBuyForm signed-in buyable state", () => {
  it("renders buy controls in the active form source", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/marketlab/market-buy-form.tsx"),
      "utf8",
    );

    expect(source).toContain('id="buy-amount"');
    expect(source).toContain("formatFakeDollars(balanceCents)");
    expect(source).toContain("parseDollarsToCents");
    expect(source).toContain("/positions");
    expect(source).toContain("router.refresh()");
  });
});
