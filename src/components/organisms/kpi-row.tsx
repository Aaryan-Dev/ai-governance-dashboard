"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ProgressMeter } from "@/components/atoms/progress-meter";
import { TrendDelta } from "@/components/atoms/trend-delta";
import { KpiTile } from "@/components/molecules/kpi-tile";
import { useFilters } from "@/hooks/use-filters";
import { useOverview } from "@/hooks/use-dashboard-data";
import { formatPct, formatUsd } from "@/lib/format";

export function KpiRow() {
  const { filters } = useFilters();
  const { data: o, isPending, error } = useOverview(filters);
  const loading = isPending || !o;

  if (error) return <p role="alert" className="text-sm text-critical-text">Couldn&apos;t load summary: {error.message}</p>;

  const overBudget = o ? o.projected - o.budget : 0;
  const spendRatio = o && o.budget > 0 ? o.spendMtd / o.budget : 0;

  return (
    <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <KpiTile
        label="AI spend this month"
        loading={loading}
        value={o && formatUsd(o.spendMtd)}
        sub={o && <TrendDelta value={o.momDeltaPct} label="vs. same point last month" />}
        footer={o && <ProgressMeter value={spendRatio} tone={spendRatio > 1 ? "bad" : "ok"} label="Spend as share of monthly budget" />}
      />
      <KpiTile
        label="Forecast vs. budget"
        loading={loading}
        value={o && formatUsd(o.projected)}
        sub={
          o &&
          (overBudget > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-critical-text">
              <AlertTriangle className="size-3.5" aria-hidden /> {formatUsd(overBudget)} over {formatUsd(o.budget)} budget
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-good-text">
              <CheckCircle2 className="size-3.5" aria-hidden /> {formatUsd(-overBudget)} under {formatUsd(o.budget)} budget
            </span>
          ))
        }
      />
      <KpiTile
        label="Active AI users"
        loading={loading}
        value={o?.activeUsers.toLocaleString()}
        sub={o && `${formatPct(o.activeUsers / o.employees)} of ${o.employees.toLocaleString()} employees`}
      />
      <KpiTile
        label="Unapproved tools"
        loading={loading}
        value={o && `${o.toolsUnapproved} of ${o.toolsTracked}`}
        sub="Under review or unsanctioned"
      />
      <KpiTile
        label="Limit breaches"
        loading={loading}
        value={o && `${o.toolsOver} over`}
        sub={o && `${o.toolsAtRisk} more forecast to exceed`}
      />
    </section>
  );
}
