import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

/** For spend, up is bad. `invert` flips the tone for metrics where up is good. */
export function TrendDelta({ value, invert = false, label }: { value: number | null; invert?: boolean; label?: string }) {
  if (value === null) return null;
  const up = value > 0;
  const bad = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", bad ? "text-critical-text" : "text-good-text")}>
      <Icon className="size-3.5" aria-hidden />
      {formatSigned(value, 1)}
      {label && <span className="text-muted ml-1 font-normal">{label}</span>}
    </span>
  );
}
