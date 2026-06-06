/** Neutral baseline when market-level position totals are unavailable under RLS. */
export const NEUTRAL_YES_CHANCE = 0.5;

export type MarketPositionTotals = {
  yesTotal: number;
  noTotal: number;
};

export type LedgerActivityEntry = {
  created_at: string;
  amount_cents: number;
  entry_type: string;
  description: string;
};

export type ProbabilityChartPoint = {
  timestamp: number;
  yesChance: number;
};

export type ProbabilityChartSeries = {
  points: ProbabilityChartPoint[];
  currentYesChance: number;
  isFlatFallback: boolean;
  fallbackLabel: string | null;
};

export function computeYesChanceFromTotals(
  totals: MarketPositionTotals | null,
): number {
  if (!totals) {
    return NEUTRAL_YES_CHANCE;
  }

  const total = totals.yesTotal + totals.noTotal;
  if (total <= 0) {
    return NEUTRAL_YES_CHANCE;
  }

  return totals.yesTotal / total;
}

export function parseLedgerSide(
  entry: Pick<LedgerActivityEntry, "entry_type" | "description">,
): "yes" | "no" | null {
  const type = entry.entry_type.toLowerCase();
  if (type.includes("yes")) {
    return "yes";
  }
  if (type.includes("no")) {
    return "no";
  }

  const description = entry.description.toLowerCase();
  if (/\byes\b/.test(description)) {
    return "yes";
  }
  if (/\bno\b/.test(description)) {
    return "no";
  }

  return null;
}

export function buildLedgerHistoryPoints(
  entries: LedgerActivityEntry[],
  marketCreatedAt: string,
): ProbabilityChartPoint[] | null {
  const marketEntries = entries
    .map((entry) => ({ entry, side: parseLedgerSide(entry) }))
    .filter(
      (item): item is { entry: LedgerActivityEntry; side: "yes" | "no" } =>
        item.side !== null,
    )
    .sort(
      (a, b) =>
        new Date(a.entry.created_at).getTime() -
        new Date(b.entry.created_at).getTime(),
    );

  if (marketEntries.length === 0) {
    return null;
  }

  let yesTotal = 0;
  let noTotal = 0;
  const points: ProbabilityChartPoint[] = [
    {
      timestamp: new Date(marketCreatedAt).getTime(),
      yesChance: NEUTRAL_YES_CHANCE,
    },
  ];

  for (const { entry, side } of marketEntries) {
    const amount = Math.abs(entry.amount_cents);
    if (side === "yes") {
      yesTotal += amount;
    } else {
      noTotal += amount;
    }

    points.push({
      timestamp: new Date(entry.created_at).getTime(),
      yesChance: computeYesChanceFromTotals({ yesTotal, noTotal }),
    });
  }

  return points;
}

export function buildProbabilityChartSeries({
  marketCreatedAt,
  now = Date.now(),
  positionTotals,
  ledgerEntries = [],
}: {
  marketCreatedAt: string;
  now?: number;
  positionTotals: MarketPositionTotals | null;
  ledgerEntries?: LedgerActivityEntry[];
}): ProbabilityChartSeries {
  const currentYesChance = computeYesChanceFromTotals(positionTotals);
  const historicalPoints = buildLedgerHistoryPoints(
    ledgerEntries,
    marketCreatedAt,
  );

  if (historicalPoints && historicalPoints.length > 1) {
    const lastPoint = historicalPoints.at(-1);
    if (lastPoint && lastPoint.timestamp < now) {
      historicalPoints.push({
        timestamp: now,
        yesChance: currentYesChance,
      });
    }

    return {
      points: historicalPoints,
      currentYesChance,
      isFlatFallback: false,
      fallbackLabel: null,
    };
  }

  const createdAt = new Date(marketCreatedAt).getTime();

  return {
    points: [
      { timestamp: createdAt, yesChance: currentYesChance },
      { timestamp: now, yesChance: currentYesChance },
    ],
    currentYesChance,
    isFlatFallback: true,
    fallbackLabel:
      "Current market balance — no historical trading activity yet",
  };
}

export function filterChartPointsByRange(
  points: ProbabilityChartPoint[],
  range: "all" | "7d" | "24h",
  now = Date.now(),
): ProbabilityChartPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const windowMs =
    range === "7d" ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const cutoff = now - windowMs;
  const filtered = points.filter((point) => point.timestamp >= cutoff);

  if (filtered.length === 0) {
    const lastPoint = points.at(-1);
    return lastPoint ? [lastPoint] : points;
  }

  if (filtered[0].timestamp > cutoff) {
    const prior = [...points]
      .reverse()
      .find((point) => point.timestamp <= cutoff);
    if (prior) {
      return [prior, ...filtered];
    }
  }

  return filtered;
}
