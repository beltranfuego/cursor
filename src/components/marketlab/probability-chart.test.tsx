import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { NEUTRAL_YES_CHANCE } from "@/lib/markets/probability";

describe("ProbabilityChart", () => {
  it("renders a probability chart with current yes chance", () => {
    const now = Date.now();
    const html = renderToStaticMarkup(
      <ProbabilityChart
        points={[
          { timestamp: now - 86_400_000, yesChance: NEUTRAL_YES_CHANCE },
          { timestamp: now, yesChance: NEUTRAL_YES_CHANCE },
        ]}
        currentYesChance={NEUTRAL_YES_CHANCE}
        isFlatFallback
        fallbackLabel="Current market balance — no historical trading activity yet"
      />,
    );

    expect(html).toContain("Yes probability");
    expect(html).toContain("50%");
    expect(html).toContain("Current market balance");
    expect(html).toContain("<svg");
  });
});
