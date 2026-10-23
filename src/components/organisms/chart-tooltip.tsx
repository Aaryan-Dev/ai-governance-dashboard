import type { ReactNode } from "react";

/** Shared tooltip chrome for Recharts charts. */
export function ChartTooltip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-40 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-ink">{title}</p>
      <div className="space-y-0.5 text-ink-2">{children}</div>
    </div>
  );
}

export function TooltipRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <p className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-1.5">
        {color && <span className="size-2 rounded-sm" style={{ background: color }} aria-hidden />}
        {label}
      </span>
      <span className="font-medium tabular-nums text-ink">{value}</span>
    </p>
  );
}
