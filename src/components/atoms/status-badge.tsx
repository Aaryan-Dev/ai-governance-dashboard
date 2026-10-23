import { AlertTriangle, CheckCircle2, CircleSlash, OctagonAlert } from "lucide-react";
import type { LimitStatus } from "@/schemas";
import { cn } from "@/lib/utils";

const CONFIG: Record<LimitStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  ok: { label: "Within limit", icon: CheckCircle2, className: "text-good-text" },
  at_risk: { label: "At risk", icon: AlertTriangle, className: "text-warning-text" },
  over: { label: "Over limit", icon: OctagonAlert, className: "text-critical-text" },
  no_limit: { label: "No limit", icon: CircleSlash, className: "text-muted" },
};

/** Status never relies on color alone: icon + label always render together. */
export function StatusBadge({ status, className }: { status: LimitStatus; className?: string }) {
  const { label, icon: Icon, className: tone } = CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap", tone, className)}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
