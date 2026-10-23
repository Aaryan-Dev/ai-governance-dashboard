import { cn } from "@/lib/utils";

export interface LegendItem {
  label: string;
  color: string;
  kind?: "swatch" | "line" | "dashed";
}

export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
      {items.map(({ label, color, kind = "swatch" }) => (
        <li key={label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(kind === "swatch" ? "size-2.5 rounded-sm" : "h-0 w-4 border-t-2", kind === "dashed" && "border-dashed")}
            style={kind === "swatch" ? { background: color } : { borderColor: color }}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
