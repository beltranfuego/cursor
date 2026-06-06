import { formatCents } from "@/lib/money";

const DOLLAR_INPUT_PATTERN = /^\d+(\.\d{1,2})?$/;

export type BuySide = "yes" | "no";

export function formatFakeDollars(cents: number): string {
  return `${formatCents(cents)} fake`;
}

export function parseDollarsToCents(input: string): number | null {
  const trimmed = input.trim();

  if (!trimmed || !DOLLAR_INPUT_PATTERN.test(trimmed)) {
    return null;
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const whole = Number(wholePart);
  const fraction = Number(fractionPart.padEnd(2, "0"));

  if (!Number.isInteger(whole) || !Number.isInteger(fraction)) {
    return null;
  }

  const totalCents = whole * 100 + fraction;

  if (totalCents <= 0) {
    return null;
  }

  return totalCents;
}

export function totalSharesCents(
  yesSharesCents: number,
  noSharesCents: number,
): number {
  return yesSharesCents + noSharesCents;
}

export function isValidBuySide(value: string): value is BuySide {
  return value === "yes" || value === "no";
}
