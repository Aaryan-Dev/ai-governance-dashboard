"use client";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/molecules/chart-card";
import { ChartLegend } from "@/components/molecules/chart-legend";
import { CHART_RATIONALE } from "@/lib/chart-rationale";
import { formatUsd, formatUsdCompact } from "@/lib/format";
import type { TrendPoint } from "@/schemas";
import { ChartTooltip, TooltipRow } from "./chart-tooltip";

interface Props {
  points?: TrendPoint[];
  loading: boolean;
  error: Error | null;
}

type Datum = TrendPoint & { axisLabel: string; forecastRest: number };

const AXIS = { fontSize: 11, fill: "var(--muted)" } as const;

function TrendTooltip({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload: Datum }> }) {
  const p = active ? payload?.[0]?.payload : undefined;
  if (!p) return null;
  return (
    <ChartTooltip title={p.partial ? `${p.label} (month to date)` : p.label}>
      <TooltipRow label="Approved tools" value={formatUsd(p.approved)} color="var(--series-1)" />
      <TooltipRow label="Unapproved tools" value={formatUsd(p.unapproved)} color="var(--series-2)" />
      <TooltipRow label={p.partial ? "Spend to date" : "Total"} value={formatUsd(p.total)} />
      {p.partial && p.projectedTotal !== null && <TooltipRow label="Forecast month end" value={formatUsd(p.projectedTotal)} />}
      <TooltipRow label="Budget" value={formatUsd(p.budget)} />
    </ChartTooltip>
  );
}

export function SpendTrendChart({ points = [], loading, error }: Props) {
  // Columns, not an area: the current month is partial, and a falling area would misread as falling spend.
  const data: Datum[] = points.map((p) => ({
    ...p,
    axisLabel: p.partial ? `${p.label} (MTD)` : p.label,
    forecastRest: p.partial && p.projectedTotal !== null ? Math.max(0, p.projectedTotal - p.total) : 0,
  }));
  return (
    <ChartCard
      title="Monthly spend vs. budget"
      subtitle="Last 6 months, split by approval status. The current month shows the forecast for the rest of the month."
      rationale={CHART_RATIONALE.trend}
      loading={loading}
      error={error}
      empty={points.length === 0}
      legend={
        <ChartLegend
          items={[
            { label: "Approved tools", color: "var(--series-1)" },
            { label: "Unapproved tools", color: "var(--series-2)" },
            { label: "Forecast (rest of month)", color: "var(--axis)" },
            { label: "Monthly budget", color: "var(--ink)", kind: "line" },
          ]}
        />
      }
    >
      <div className="h-72 w-full" role="img" aria-label="Stacked column chart of monthly AI spend for approved and unapproved tools against budget">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis dataKey="axisLabel" tick={AXIS} tickLine={false} axisLine={{ stroke: "var(--axis)" }} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} tickFormatter={formatUsdCompact} />
            <Tooltip content={<TrendTooltip />} cursor={{ fill: "var(--wash)" }} />
            <Bar dataKey="approved" stackId="spend" fill="var(--series-1)" stroke="var(--surface)" strokeWidth={2} isAnimationActive={false} />
            <Bar dataKey="unapproved" stackId="spend" fill="var(--series-2)" stroke="var(--surface)" strokeWidth={2} isAnimationActive={false} />
            <Bar dataKey="forecastRest" stackId="spend" fill="var(--axis)" fillOpacity={0.6} stroke="var(--surface)" strokeWidth={2} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Line type="linear" dataKey="budget" stroke="var(--ink)" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
