export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatFakeBalance(cents: number): string {
  return `${formatCents(cents)} fake`;
}
