"use client";

import { BarChart3, Table2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { InfoPopover } from "@/components/atoms/info-popover";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  rationale?: { question: string; why: string };
  legend?: ReactNode;
  /** Accessible tabular equivalent of the chart; enables the Chart / Table toggle. */
  table?: ReactNode;
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shared frame so every chart gets the same title, legend, rationale, table view and loading/error/empty states. */
export function ChartCard({ title, subtitle, rationale, legend, table, loading, error, empty, className, children }: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const headingId = useId();
  const showTable = view === "table" && table;

  return (
    <Card className={cn("flex flex-col p-5", className)} aria-labelledby={headingId} role="region">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-[15px] leading-snug font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-ink-2 mt-0.5 text-xs">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {table && !loading && !error && !empty && (
            <div role="group" aria-label={`${title} view`} className="border-border flex rounded-md border p-0.5">
              {(
                [
                  ["chart", BarChart3, "Chart"],
                  ["table", Table2, "Table"],
                ] as const
              ).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-medium",
                    view === id ? "bg-ink text-surface" : "text-ink-2 hover:bg-wash hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden /> <span className="sr-only sm:not-sr-only">{label}</span>
                </button>
              ))}
            </div>
          )}
          {rationale && <InfoPopover {...rationale} />}
        </div>
      </header>
      {legend && !showTable && <div className="mt-3">{legend}</div>}
      <div className="mt-4 min-h-0 flex-1">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <p role="alert" className="text-critical-text py-16 text-center text-sm">
            Couldn&apos;t load this chart: {error.message}
          </p>
        ) : empty ? (
          <p className="text-muted py-16 text-center text-sm">No data for the selected filters.</p>
        ) : showTable ? (
          table
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
