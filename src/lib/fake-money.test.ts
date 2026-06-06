import { describe, expect, it } from "vitest";

import {
  formatFakeDollars,
  isValidBuySide,
  parseDollarsToCents,
  totalSharesCents,
} from "@/lib/fake-money";

describe("parseDollarsToCents", () => {
  it("accepts whole and two-decimal dollar amounts", () => {
    expect(parseDollarsToCents("1")).toBe(100);
    expect(parseDollarsToCents("1.5")).toBe(150);
    expect(parseDollarsToCents("10.00")).toBe(1000);
  });

  it("rejects invalid amounts and extra decimal places", () => {
    expect(parseDollarsToCents("")).toBeNull();
    expect(parseDollarsToCents("0")).toBeNull();
    expect(parseDollarsToCents("-5")).toBeNull();
    expect(parseDollarsToCents("1.234")).toBeNull();
    expect(parseDollarsToCents("abc")).toBeNull();
    expect(parseDollarsToCents("1.999")).toBeNull();
  });
});

describe("formatFakeDollars", () => {
  it("labels amounts as fake money", () => {
    expect(formatFakeDollars(1000)).toBe("$10.00 fake");
  });
});

describe("totalSharesCents", () => {
  it("sums Yes and No share cents", () => {
    expect(totalSharesCents(500, 250)).toBe(750);
    expect(totalSharesCents(0, 100)).toBe(100);
  });
});

describe("isValidBuySide", () => {
  it("accepts yes and no only", () => {
    expect(isValidBuySide("yes")).toBe(true);
    expect(isValidBuySide("no")).toBe(true);
    expect(isValidBuySide("maybe")).toBe(false);
    expect(isValidBuySide("")).toBe(false);
  });
});
