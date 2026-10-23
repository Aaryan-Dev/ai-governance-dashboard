import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiTileProps {
  label: string;
  icon: LucideIcon;
  value?: ReactNode;
  sub?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
}

export function KpiTile({ label, icon: Icon, value, sub, footer, loading }: KpiTileProps) {
  return (
    <Card className="flex h-full flex-col gap-1 p-4">
      <div className="flex items-center justify-between">
        <p className="text-ink-2 text-xs font-medium">{label}</p>
        <span className="bg-wash text-ink-2 flex size-7 items-center justify-center rounded-md">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      {loading ? <Skeleton className="mt-1 h-9 w-28" /> : <p className="text-3xl leading-9 font-semibold tracking-tight">{value}</p>}
      <div className="text-ink-2 min-h-5 text-xs">{loading ? <Skeleton className="h-4 w-36" /> : sub}</div>
      <div className="mt-auto pt-1">{footer}</div>
    </Card>
  );
}
