import type { ReactNode } from "react";

/** Shared tooltip chrome for Recharts charts. */
export function ChartTooltip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-border bg-surface shadow-pop min-w-40 rounded-lg border px-3 py-2 text-xs">
      <p className="text-ink mb-1 font-semibold">{title}</p>
      <div className="text-ink-2 space-y-0.5">{children}</div>
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
      <span className="text-ink font-medium tabular-nums">{value}</span>
    </p>
  );
}
