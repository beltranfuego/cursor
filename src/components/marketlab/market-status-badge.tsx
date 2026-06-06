export function MarketStatusBadge({ status }: { status: string }) {
  const styles =
    status === "open"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "closed"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {status}
    </span>
  );
}
