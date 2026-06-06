import { cn } from "@/lib/utils";

type FakeMoneyChipProps = {
  children: React.ReactNode;
  className?: string;
};

export function FakeMoneyChip({ children, className }: FakeMoneyChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand/25 bg-brand/8 px-2.5 py-0.5 text-xs font-medium text-brand dark:border-brand/30 dark:bg-brand/12 dark:text-brand-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FakeMoneyChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <FakeMoneyChip>Fake money only</FakeMoneyChip>
      <FakeMoneyChip>Workshop demo</FakeMoneyChip>
      <FakeMoneyChip>No real payments</FakeMoneyChip>
    </div>
  );
}
