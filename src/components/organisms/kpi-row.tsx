"use client";

import { AlertTriangle, CheckCircle2, DollarSign, ShieldAlert, TrendingUp, Users, EyeOff } from "lucide-react";
import { ProgressMeter } from "@/components/atoms/progress-meter";
import { TrendDelta } from "@/components/atoms/trend-delta";
import { KpiTile } from "@/components/molecules/kpi-tile";
import { useOverview } from "@/hooks/use-dashboard-data";
import { useFilters } from "@/hooks/use-filters";
import { formatPct, formatUsd } from "@/lib/format";

export function KpiRow() {
  const { filters } = useFilters();
  const { data: o, isPending, error } = useOverview(filters);
  const loading = isPending || !o;

  if (error)
    return (
      <p role="alert" className="text-critical-text text-sm">
        Couldn&apos;t load summary: {error.message}
      </p>
    );

  const overBudget = o ? o.projected - o.budget : 0;
  const spendRatio = o && o.budget > 0 ? o.spendMtd / o.budget : 0;

  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiTile
        label={`AI spend, last ${o?.periodDays ?? filters.period} days`}
        icon={DollarSign}
        loading={loading}
        value={o && formatUsd(o.spendWindow)}
        sub={
          o &&
          (o.windowDeltaPct === null ? (
            <span className="text-muted">No earlier period to compare</span>
          ) : (
            <TrendDelta value={o.windowDeltaPct} label={`vs. prior ${o.periodDays} days`} />
          ))
        }
      />
      <KpiTile
        label="Forecast this month"
        icon={TrendingUp}
        loading={loading}
        value={o && formatUsd(o.projected)}
        sub={
          o &&
          (overBudget > 0 ? (
            <span className="text-critical-text inline-flex items-center gap-1 font-medium">
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden /> {formatUsd(overBudget)} over {formatUsd(o.budget)} budget
            </span>
          ) : (
            <span className="text-good-text inline-flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-3.5 shrink-0" aria-hidden /> {formatUsd(-overBudget)} under {formatUsd(o.budget)} budget
            </span>
          ))
        }
        footer={
          o && (
            <>
              <ProgressMeter
                value={spendRatio}
                tone={spendRatio > 1 ? "bad" : "ok"}
                label={`Spend so far is ${formatPct(spendRatio)} of the monthly budget`}
              />
              <p className="text-ink-2 mt-1 text-xs">{formatUsd(o.spendMtd)} spent so far</p>
            </>
          )
        }
      />
      <KpiTile
        label={`Active AI users, ${o?.periodDays ?? filters.period}d`}
        icon={Users}
        loading={loading}
        value={o?.activeUsers.toLocaleString()}
        sub={o && `${formatPct(o.activeUsers / o.employees)} of ${o.employees.toLocaleString()} employees`}
      />
      <KpiTile
        label="Unapproved tools"
        icon={EyeOff}
        loading={loading}
        value={o && `${o.toolsUnapproved} of ${o.toolsTracked}`}
        sub="Under review or unsanctioned"
      />
      <KpiTile
        label="Limit breaches, this month"
        icon={ShieldAlert}
        loading={loading}
        value={o && `${o.toolsOver} over`}
        sub={o && `${o.toolsAtRisk} more forecast to exceed`}
      />
    </section>
  );
}
