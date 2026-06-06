import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/money";

describe("formatFakeBalance", () => {
  it("appends fake to formatted currency", () => {
    expect(formatFakeBalance(100000)).toBe("$1,000.00 fake");
    expect(formatFakeBalance(1000)).toBe("$10.00 fake");
  });
});
