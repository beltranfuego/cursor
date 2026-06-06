"use client";

import { useMemo, useState } from "react";
import { formatYesChancePercent } from "@/lib/markets/format";
import {
  filterChartPointsByRange,
  type ProbabilityChartPoint,
} from "@/lib/markets/probability";
import { cn } from "@/lib/utils";

type ChartRange = "all" | "7d" | "24h";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 32, left: 44 };

function formatAxisDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function buildPath(points: ProbabilityChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const minTime = points[0].timestamp;
  const maxTime = points.at(-1)?.timestamp ?? minTime;
  const timeSpan = Math.max(maxTime - minTime, 1);
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return points
    .map((point, index) => {
      const x =
        PADDING.left + ((point.timestamp - minTime) / timeSpan) * innerWidth;
      const y = PADDING.top + (1 - point.yesChance) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ProbabilityChart({
  points,
  currentYesChance,
  isFlatFallback,
  fallbackLabel,
}: {
  points: ProbabilityChartPoint[];
  currentYesChance: number;
  isFlatFallback: boolean;
  fallbackLabel: string | null;
}) {
  const [range, setRange] = useState<ChartRange>("all");

  const visiblePoints = useMemo(
    () => filterChartPointsByRange(points, range),
    [points, range],
  );

  const path = buildPath(visiblePoints);
  const minTime = visiblePoints[0]?.timestamp ?? Date.now();
  const maxTime = visiblePoints.at(-1)?.timestamp ?? minTime;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Yes probability
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current Yes chance:{" "}
            <span className="font-semibold tabular-nums text-brand">
              {formatYesChancePercent(currentYesChance)}
            </span>
          </p>
          {isFlatFallback && fallbackLabel ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {fallbackLabel}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
          {(["all", "7d", "24h"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
                range === option
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setRange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="min-w-full text-muted-foreground"
          role="img"
          aria-label={`Yes probability chart showing ${formatYesChancePercent(currentYesChance)}`}
        >
          <title>Yes probability over time</title>
          {yTicks.map((tick) => {
            const y = PADDING.top + (1 - tick / 100) * innerHeight;
            return (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={PADDING.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-current text-[10px]"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          <line
            x1={PADDING.left}
            x2={CHART_WIDTH - PADDING.right}
            y1={CHART_HEIGHT - PADDING.bottom}
            y2={CHART_HEIGHT - PADDING.bottom}
            stroke="currentColor"
            strokeOpacity={0.2}
          />

          <text
            x={PADDING.left}
            y={CHART_HEIGHT - 8}
            className="fill-current text-[10px]"
          >
            {formatAxisDate(minTime)}
          </text>
          <text
            x={CHART_WIDTH - PADDING.right}
            y={CHART_HEIGHT - 8}
            textAnchor="end"
            className="fill-current text-[10px]"
          >
            {formatAxisDate(maxTime)}
          </text>

          {path ? (
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="text-brand"
            />
          ) : null}
        </svg>
      </div>
    </section>
  );
}
