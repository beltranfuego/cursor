import { describe, expect, it } from "vitest";

import {
  buildLedgerHistoryPoints,
  buildProbabilityChartSeries,
  computeYesChanceFromTotals,
  NEUTRAL_YES_CHANCE,
  parseLedgerSide,
} from "./probability";

describe("computeYesChanceFromTotals", () => {
  it("returns neutral baseline when totals are unavailable", () => {
    expect(computeYesChanceFromTotals(null)).toBe(NEUTRAL_YES_CHANCE);
  });

  it("returns neutral baseline when totals are empty", () => {
    expect(computeYesChanceFromTotals({ yesTotal: 0, noTotal: 0 })).toBe(
      NEUTRAL_YES_CHANCE,
    );
  });

  it("calculates yes chance from aggregate positions when available", () => {
    expect(
      computeYesChanceFromTotals({ yesTotal: 600, noTotal: 400 }),
    ).toBeCloseTo(0.6);
  });
});

describe("parseLedgerSide", () => {
  it("detects yes/no sides from entry metadata", () => {
    expect(
      parseLedgerSide({ entry_type: "buy_yes", description: "Workshop trade" }),
    ).toBe("yes");
    expect(
      parseLedgerSide({ entry_type: "buy_no", description: "Workshop trade" }),
    ).toBe("no");
  });
});

describe("buildProbabilityChartSeries", () => {
  const createdAt = "2026-06-01T12:00:00.000Z";
  const now = new Date("2026-06-06T12:00:00.000Z").getTime();

  it("uses a flat current-state line when ledger history is unavailable", () => {
    const series = buildProbabilityChartSeries({
      marketCreatedAt: createdAt,
      now,
      positionTotals: null,
      ledgerEntries: [],
    });

    expect(series.isFlatFallback).toBe(true);
    expect(series.points).toHaveLength(2);
    expect(series.points[0].yesChance).toBe(NEUTRAL_YES_CHANCE);
    expect(series.points[1].yesChance).toBe(NEUTRAL_YES_CHANCE);
    expect(series.fallbackLabel).toMatch(/current market balance/i);
  });

  it("builds historical points from ledger activity when available", () => {
    const ledgerEntries = [
      {
        created_at: "2026-06-02T12:00:00.000Z",
        amount_cents: -100,
        entry_type: "buy_yes",
        description: "Buy Yes",
      },
      {
        created_at: "2026-06-03T12:00:00.000Z",
        amount_cents: -200,
        entry_type: "buy_no",
        description: "Buy No",
      },
    ];

    const history = buildLedgerHistoryPoints(ledgerEntries, createdAt);
    expect(history).not.toBeNull();
    expect(history?.length).toBeGreaterThan(2);

    const series = buildProbabilityChartSeries({
      marketCreatedAt: createdAt,
      now,
      positionTotals: { yesTotal: 100, noTotal: 200 },
      ledgerEntries,
    });

    expect(series.isFlatFallback).toBe(false);
    expect(series.currentYesChance).toBeCloseTo(1 / 3);
  });
});
