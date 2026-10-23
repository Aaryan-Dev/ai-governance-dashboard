import { cn } from "@/lib/utils";

/** Thin meter, capped visually at 100% of the track while the label carries the true value. */
export function ProgressMeter({ value, tone = "ok", label }: { value: number; tone?: "ok" | "warn" | "bad"; label: string }) {
  const color = tone === "bad" ? "bg-critical" : tone === "warn" ? "bg-warning" : "bg-series-1";
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="h-1.5 w-full overflow-hidden rounded-full bg-wash"
    >
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(100, value * 100)}%` }} />
    </div>
  );
}
