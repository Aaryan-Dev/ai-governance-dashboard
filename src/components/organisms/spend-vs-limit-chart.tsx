"use client";

import { AlertTriangle, ChevronDown, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { SanctionBadge } from "@/components/atoms/sanction-badge";
import { StatusBadge } from "@/components/atoms/status-badge";
import { ChartCard } from "@/components/molecules/chart-card";
import { ChartLegend } from "@/components/molecules/chart-legend";
import { DataTable, type DataColumn } from "@/components/molecules/data-table";
import { Button } from "@/components/ui/button";
import { CHART_RATIONALE } from "@/lib/chart-rationale";
import { formatPct, formatUsd, formatUsdCompact } from "@/lib/format";
import type { LimitStatus, ToolRow } from "@/schemas";

/** Every row is scaled to its own limit; the track spans 0-150% so the 100% marker lines up across rows. */
const SCALE = 1.5;
const LIMIT_AT = (1 / SCALE) * 100;
const COLLAPSED_ROWS = 7;
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

const TABLE_COLUMNS: DataColumn<ToolRow>[] = [
  { key: "tool", header: "Tool", cell: (r) => r.name },
  { key: "approval", header: "Approval", cell: (r) => <SanctionBadge sanction={r.sanction} /> },
  { key: "mtd", header: "Spend MTD", numeric: true, cell: (r) => formatUsd(r.spendMtd) },
  { key: "forecast", header: "Forecast", numeric: true, cell: (r) => formatUsd(r.projected) },
  { key: "limit", header: "Limit", numeric: true, cell: (r) => (r.limit === null ? "None" : formatUsd(r.limit)) },
  { key: "used", header: "% of limit", numeric: true, cell: (r) => (r.utilization === null ? "—" : formatPct(r.utilization)) },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.limitStatus} /> },
];

export function SpendVsLimitChart({ rows = [], loading, error, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const limited = rows
    .filter((r) => r.limit !== null)
    .sort((a, b) => RANK[a.limitStatus] - RANK[b.limitStatus] || (b.projectedUtilization ?? 0) - (a.projectedUtilization ?? 0));
  const unlimited = rows.filter((r) => r.limit === null).sort((a, b) => b.spendMtd - a.spendMtd);
  const visible = expanded ? limited : limited.slice(0, COLLAPSED_ROWS);
  const hidden = limited.length - visible.length;

  return (
    <ChartCard
      title="Spend vs. approved limit"
      subtitle="This month so far vs. each tool's monthly limit, with forecast to month end. Not affected by the time range. Select a tool to change its limit."
      rationale={CHART_RATIONALE.limits}
      loading={loading}
      error={error}
      empty={rows.length === 0}
      table={
        <DataTable
          caption="Spend, forecast and approved limit by tool"
          columns={TABLE_COLUMNS}
          rows={[...limited, ...unlimited]}
          rowKey={(r) => r.id}
        />
      }
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
      <div className="text-muted hidden grid-cols-[minmax(0,10rem)_1fr_minmax(0,8rem)] items-end gap-x-3 pb-1 text-[11px] sm:grid">
        <span />
        <div className="relative h-4" aria-hidden>
          {[0, 50, 100, 150].map((p) => (
            <span
              key={p}
              className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(p / 100 / SCALE) * 100}%` }}
            >
              {p}%
            </span>
          ))}
        </div>
        <span />
      </div>

      <ul className="divide-grid divide-y">
        {visible.map((r) => (
          <LimitRow key={r.id} row={r} onEdit={onEdit} />
        ))}
      </ul>

      {limited.length > COLLAPSED_ROWS && (
        <Button variant="ghost" size="sm" className="mt-2 w-full" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
          {expanded ? "Show fewer" : `Show ${hidden} more tools`}
        </Button>
      )}

      {unlimited.length > 0 && (
        <div className="mt-5">
          <h3 className="text-ink-2 text-xs font-medium">No approved limit ({unlimited.length})</h3>
          <ul className="divide-grid mt-1 divide-y">
            {unlimited.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <SanctionBadge sanction={r.sanction} />
                </div>
                <p className="text-ink-2 ml-auto text-right text-xs">
                  {formatUsd(r.spendMtd)} MTD · {r.activeUsers} users
                </p>
                <Button size="sm" onClick={() => onEdit(r)}>
                  Set limit
                </Button>
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
        className="group hover:bg-wash relative grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-md px-1 py-2 text-left sm:grid-cols-[minmax(0,10rem)_1fr_minmax(0,8rem)]"
      >
        <span className="order-1 min-w-0">
          <span className="block truncate text-sm font-medium">{row.name}</span>
          <span className="text-ink-2 flex items-center gap-1 text-xs">
            {StatusIcon && (
              <StatusIcon
                className="size-3 shrink-0"
                aria-hidden
                style={{ color: row.limitStatus === "over" ? "var(--critical-text)" : "var(--warning-text)" }}
              />
            )}
            {formatPct(util)} used{row.limitStatus === "at_risk" && ` · ${formatPct(proj)} forecast`}
          </span>
        </span>

        <span className="relative order-3 col-span-2 block h-3 sm:order-2 sm:col-span-1" aria-hidden>
          <span className="bg-wash absolute inset-y-0 right-0 left-0 rounded-sm" />
          <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: width(proj), background: color, opacity: 0.3 }} />
          <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: width(util), background: color }} />
          <span className="bg-ink-2 absolute -inset-y-1 w-0.5" style={{ left: `${LIMIT_AT}%` }} />
        </span>

        <span className="order-2 text-right text-xs tabular-nums sm:order-3">
          <span className="block font-medium">
            {formatUsdCompact(row.spendMtd)} <span className="text-muted">/ {formatUsdCompact(row.limit!)}</span>
          </span>
          <span className="text-ink-2 block">→ {formatUsdCompact(row.projected)}</span>
        </span>

        <span
          role="tooltip"
          className="border-border bg-surface text-ink-2 shadow-pop pointer-events-none absolute top-full right-2 z-20 mt-1 hidden w-max min-w-44 rounded-lg border px-3 py-2 text-xs group-hover:block group-focus-visible:block"
        >
          <span className="text-ink block font-semibold">{row.name}</span>
          <TipRow label="Spend to date" value={formatUsd(row.spendMtd)} />
          <TipRow label="Forecast month end" value={formatUsd(row.projected)} />
          <TipRow label="Approved limit" value={formatUsd(row.limit!)} />
          <TipRow label="Used / forecast" value={`${formatPct(util)} / ${formatPct(proj)}`} />
        </span>
      </button>
    </li>
  );
}

function TipRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-ink font-medium tabular-nums">{value}</span>
    </span>
  );
}
