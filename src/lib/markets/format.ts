export function formatCloseDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatMarketStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatYesChancePercent(yesChance: number): string {
  return `${Math.round(yesChance * 100)}%`;
}
