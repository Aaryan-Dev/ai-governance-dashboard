"use client";

import { AlertTriangle, OctagonAlert } from "lucide-react";
import { SanctionBadge } from "@/components/atoms/sanction-badge";
import { ChartCard } from "@/components/molecules/chart-card";
import { ChartLegend } from "@/components/molecules/chart-legend";
import { Button } from "@/components/ui/button";
import { CHART_RATIONALE } from "@/lib/chart-rationale";
import { formatPct, formatUsd, formatUsdCompact } from "@/lib/format";
import type { LimitStatus, ToolRow } from "@/schemas";

/** Every row is scaled to its own limit; the track spans 0-150% so the 100% marker lines up across rows. */
const SCALE = 1.5;
const LIMIT_AT = (1 / SCALE) * 100;
const RANK: Record<LimitStatus, number> = { over: 0, at_risk: 1, ok: 2, no_limit: 3 };
const COLOR: Record<LimitStatus, string> = {
  over: "var(--critical)",
  at_risk: "var(--warning)",
  ok: "var(--series-1)",
  no_limit: "var(--muted)",
};

interface Props {
  rows?: ToolRow[];
  loading: boolean;
  error: Error | null;
  onEdit: (tool: ToolRow) => void;
}

export function SpendVsLimitChart({ rows = [], loading, error, onEdit }: Props) {
  const limited = rows
    .filter((r) => r.limit !== null)
    .sort((a, b) => RANK[a.limitStatus] - RANK[b.limitStatus] || (b.projectedUtilization ?? 0) - (a.projectedUtilization ?? 0));
  const unlimited = rows.filter((r) => r.limit === null).sort((a, b) => b.spendMtd - a.spendMtd);

  return (
    <ChartCard
      title="Spend vs. approved limit"
      subtitle="Month to date, with forecast to month end. Select a tool to change its limit."
      rationale={CHART_RATIONALE.limits}
      loading={loading}
      error={error}
      empty={rows.length === 0}
      legend={
        <ChartLegend
          items={[
            { label: "Within limit", color: "var(--series-1)" },
            { label: "Forecast to exceed", color: "var(--warning)" },
            { label: "Over limit", color: "var(--critical)" },
            { label: "Approved limit (100%)", color: "var(--ink-2)", kind: "line" },
          ]}
        />
      }
    >
      <div className="grid grid-cols-[minmax(0,10rem)_1fr_minmax(0,8rem)] items-end gap-x-3 pb-1 text-[11px] text-muted">
        <span />
        <div className="relative h-4" aria-hidden>
          {[0, 50, 100, 150].map((p) => (
            <span key={p} className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full" style={{ left: `${(p / 100 / SCALE) * 100}%` }}>
              {p}%
            </span>
          ))}
        </div>
        <span />
      </div>

      <ul className="divide-y divide-grid">
        {limited.map((r) => (
          <LimitRow key={r.id} row={r} onEdit={onEdit} />
        ))}
      </ul>

      {unlimited.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-medium text-ink-2">No approved limit ({unlimited.length})</h3>
          <ul className="mt-1 divide-y divide-grid">
            {unlimited.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <SanctionBadge sanction={r.sanction} />
                </div>
                <p className="ml-auto text-right text-xs text-ink-2">
                  {formatUsd(r.spendMtd)} MTD · {r.activeUsers} users
                </p>
                <Button size="sm" onClick={() => onEdit(r)}>Set limit</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}

function LimitRow({ row, onEdit }: { row: ToolRow; onEdit: (t: ToolRow) => void }) {
  const util = row.utilization ?? 0;
  const proj = row.projectedUtilization ?? 0;
  const color = COLOR[row.limitStatus];
  const width = (v: number) => `${(Math.min(v, SCALE) / SCALE) * 100}%`;
  const StatusIcon = row.limitStatus === "over" ? OctagonAlert : row.limitStatus === "at_risk" ? AlertTriangle : null;

  return (
    <li>
      <button
        type="button"
        onClick={() => onEdit(row)}
        aria-label={`${row.name}: ${formatUsd(row.spendMtd)} of ${formatUsd(row.limit!)} limit, forecast ${formatUsd(row.projected)}. Edit limit.`}
        className="grid w-full grid-cols-[minmax(0,10rem)_1fr_minmax(0,8rem)] items-center gap-x-3 rounded-md py-2 text-left hover:bg-wash cursor-pointer"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{row.name}</span>
          <span className="flex items-center gap-1 text-xs text-ink-2">
            {StatusIcon && <StatusIcon className="size-3" aria-hidden style={{ color }} />}
            {formatPct(util)} used{row.limitStatus === "at_risk" && ` · ${formatPct(proj)} forecast`}
          </span>
        </span>

        <span className="relative block h-3">
          <span className="absolute inset-y-0 left-0 right-0 rounded-sm bg-wash" />
          <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: width(proj), background: color, opacity: 0.3 }} />
          <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: width(util), background: color }} />
          <span className="absolute -inset-y-1 w-0.5 bg-ink-2" style={{ left: `${LIMIT_AT}%` }} aria-hidden />
        </span>

        <span className="text-right text-xs tabular-nums">
          <span className="block font-medium">
            {formatUsdCompact(row.spendMtd)} <span className="text-muted">/ {formatUsdCompact(row.limit!)}</span>
          </span>
          <span className="block text-ink-2">→ {formatUsdCompact(row.projected)}</span>
        </span>
      </button>
    </li>
  );
}
