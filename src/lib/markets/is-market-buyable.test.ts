import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "./is-market-buyable";

describe("isMarketBuyable", () => {
  it("returns true for open markets before close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: new Date(Date.now() + 60_000).toISOString(),
      }),
    ).toBe(true);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable({
        status: "closed",
        close_date: new Date(Date.now() + 60_000).toISOString(),
      }),
    ).toBe(false);
  });

  it("returns false after close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: new Date(Date.now() - 60_000).toISOString(),
      }),
    ).toBe(false);
  });
});
