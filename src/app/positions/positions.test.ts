import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { totalSharesCents } from "@/lib/fake-money";

describe("positions page", () => {
  it("requires sign-in before showing private position data", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(source).toMatch(/getCurrentUser/);
    expect(source).toMatch(/Sign in to see/i);
    expect(source).not.toMatch(/user_id.*searchParams/);
  });

  it("fetches positions through authenticated Supabase context", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(source).toContain("fetchUserPositionsWithMarkets");
    expect(source).toContain("createServerSupabaseClient");
  });

  it("links positions back to market detail pages", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(source).toContain("/markets/");
    expect(source).toContain("position.market_id");
  });

  it("shows an empty state when the user has no positions", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(source).toMatch(/No positions yet/i);
  });

  it("shows a summary row when the user has positions", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/positions/page.tsx"),
      "utf8",
    );

    expect(source).toMatch(/Markets held/i);
    expect(source).toMatch(/Yes exposure/i);
    expect(source).toMatch(/No exposure/i);
  });
});

describe("positions rendering helpers", () => {
  it("computes total shares from Yes and No share cents", () => {
    expect(totalSharesCents(300, 700)).toBe(1000);
  });
});

describe("buy server action validation", () => {
  it("validates amounts and sides before RPC", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/markets/[id]/actions.ts"),
      "utf8",
    );

    expect(source).toContain("getCurrentUser");
    expect(source).toContain("parseDollarsToCents");
    expect(source).toContain("isValidBuySide");
    expect(source).toContain('rpc("buy_market_shares"');
    expect(source).not.toMatch(/user_id.*formData/i);
  });
});

describe("header navigation", () => {
  it("includes My Positions link", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/marketlab/nav-links.tsx"),
      "utf8",
    );

    expect(source).toContain('href: "/positions"');
    expect(source).toContain("My Positions");
  });
});
