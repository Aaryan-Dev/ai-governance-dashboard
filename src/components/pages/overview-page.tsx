"use client";

import { useState } from "react";
import { FilterBar } from "@/components/molecules/filter-bar";
import { LimitEditDialog } from "@/components/molecules/limit-edit-dialog";
import { AlertsPanel } from "@/components/organisms/alerts-panel";
import { KpiRow } from "@/components/organisms/kpi-row";
import { ShadowHeatmap } from "@/components/organisms/shadow-heatmap";
import { SpendTrendChart } from "@/components/organisms/spend-trend-chart";
import { SpendVsLimitChart } from "@/components/organisms/spend-vs-limit-chart";
import { ToolsTable } from "@/components/organisms/tools-table";
import { DashboardGrid, GridCell } from "@/components/templates/dashboard-grid";
import { useShadowMatrix, useOverview, useSpendTrend, useTools } from "@/hooks/use-dashboard-data";
import { useFilters } from "@/hooks/use-filters";
import { formatAsOf } from "@/lib/format";
import type { ToolRow } from "@/schemas";

export function OverviewPage() {
  const { filters } = useFilters();
  const [editing, setEditing] = useState<ToolRow | null>(null);
  const overview = useOverview(filters);
  const tools = useTools(filters);
  const trend = useSpendTrend(filters);
  const matrix = useShadowMatrix(filters);

  return (
    <div className="mx-auto max-w-[1400px] space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI usage &amp; spend</h1>
          <p className="text-ink-2 mt-0.5 text-sm">
            {overview.data
              ? `As of ${formatAsOf(overview.data.asOf)} · day ${overview.data.daysElapsed} of ${overview.data.daysInMonth}`
              : "Loading…"}
          </p>
        </div>
        <FilterBar />
      </header>

      <KpiRow />

      <DashboardGrid>
        <GridCell span={7}>
          <SpendVsLimitChart rows={tools.data?.rows} loading={tools.isPending} error={tools.error} onEdit={setEditing} />
        </GridCell>
        <GridCell span={5}>
          <AlertsPanel tools={tools.data?.rows} onEdit={setEditing} />
        </GridCell>
        <GridCell span={5}>
          <SpendTrendChart points={trend.data?.points} loading={trend.isPending} error={trend.error} />
        </GridCell>
        <GridCell span={7}>
          <ShadowHeatmap data={matrix.data} loading={matrix.isPending} error={matrix.error} />
        </GridCell>
        <GridCell span={12}>
          <ToolsTable rows={tools.data?.rows} loading={tools.isPending} error={tools.error} onEdit={setEditing} />
        </GridCell>
      </DashboardGrid>

      <LimitEditDialog tool={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
