import { describe, expect, it } from "vitest";

import { buildProbabilityChartSeries } from "@/lib/markets/probability";

describe("fetchMarketProbabilityChart integration", () => {
  it("documents the neutral baseline used when aggregates are unavailable", () => {
    const series = buildProbabilityChartSeries({
      marketCreatedAt: "2026-06-01T12:00:00.000Z",
      positionTotals: null,
      ledgerEntries: [],
    });

    expect(series.currentYesChance).toBe(0.5);
    expect(series.isFlatFallback).toBe(true);
  });
});
