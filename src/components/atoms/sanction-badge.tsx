import type { Sanction } from "@/schemas";
import { cn } from "@/lib/utils";

const CONFIG: Record<Sanction, { label: string; dot: string }> = {
  approved: { label: "Approved", dot: "bg-series-1" },
  under_review: { label: "Under review", dot: "bg-muted" },
  unsanctioned: { label: "Unsanctioned", dot: "bg-series-2" },
};

export function SanctionBadge({ sanction, className }: { sanction: Sanction; className?: string }) {
  const { label, dot } = CONFIG[sanction];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-2 whitespace-nowrap", className)}>
      <span className={cn("size-2 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  );
}
