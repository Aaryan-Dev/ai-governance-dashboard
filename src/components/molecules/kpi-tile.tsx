import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiTileProps {
  label: string;
  value?: ReactNode;
  sub?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
}

export function KpiTile({ label, value, sub, footer, loading }: KpiTileProps) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-xs font-medium text-ink-2">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-8 w-28" />
      ) : (
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      )}
      <div className="min-h-5 text-xs text-ink-2">{loading ? <Skeleton className="h-4 w-36" /> : sub}</div>
      {footer && <div className="mt-1">{footer}</div>}
    </Card>
  );
}
