import type { ReactNode } from "react";
import { InfoPopover } from "@/components/atoms/info-popover";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  rationale?: { question: string; why: string };
  legend?: ReactNode;
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shared frame so every chart gets the same title, legend slot, rationale and loading/error/empty states. */
export function ChartCard({ title, subtitle, rationale, legend, loading, error, empty, className, children }: ChartCardProps) {
  return (
    <Card className={cn("flex flex-col p-5", className)}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-ink-2">{subtitle}</p>}
        </div>
        {rationale && <InfoPopover {...rationale} />}
      </header>
      {legend && <div className="mt-3">{legend}</div>}
      <div className="mt-4 min-h-0 flex-1">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <p role="alert" className="py-16 text-center text-sm text-critical-text">Couldn&apos;t load this chart: {error.message}</p>
        ) : empty ? (
          <p className="py-16 text-center text-sm text-muted">No data for the selected filters.</p>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
