"use client";

import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import { ChartCard } from "@/components/molecules/chart-card";
import { useFilters } from "@/hooks/use-filters";
import { useOverview } from "@/hooks/use-dashboard-data";
import type { Alert, ToolRow } from "@/schemas";

const ICON = { critical: OctagonAlert, warning: AlertTriangle, info: Info } as const;
const TONE = { critical: "text-critical-text", warning: "text-warning-text", info: "text-ink-2" } as const;
const LABEL = { critical: "Critical", warning: "Warning", info: "Info" } as const;

export function AlertsPanel({ tools = [], onEdit }: { tools?: ToolRow[]; onEdit: (t: ToolRow) => void }) {
  const { filters } = useFilters();
  const { data, isPending, error } = useOverview(filters);
  const alerts = data?.alerts ?? [];

  const open = (a: Alert) => {
    const tool = tools.find((t) => t.id === a.toolId);
    if (tool) onEdit(tool);
  };

  return (
    <ChartCard title="Needs attention" subtitle={`${alerts.length} open alerts`} loading={isPending} error={error} empty={alerts.length === 0} className="h-full">
      <ul className="max-h-[28rem] divide-y divide-grid overflow-y-auto">
        {alerts.map((a) => {
          const Icon = ICON[a.severity];
          return (
            <li key={a.id}>
              <button
                type="button"
                disabled={!a.toolId}
                onClick={() => open(a)}
                className="flex w-full gap-2.5 rounded-md px-1 py-2.5 text-left enabled:hover:bg-wash enabled:cursor-pointer"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${TONE[a.severity]}`} aria-hidden />
                <span>
                  <span className="block text-sm font-medium"><span className="sr-only">{LABEL[a.severity]}: </span>{a.title}</span>
                  <span className="block text-xs text-ink-2">{a.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}
