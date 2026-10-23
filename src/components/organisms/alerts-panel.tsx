"use client";

import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { ChartCard } from "@/components/molecules/chart-card";
import { useOverview } from "@/hooks/use-dashboard-data";
import { useFilters } from "@/hooks/use-filters";
import type { Alert, ToolRow } from "@/schemas";

const SEVERITIES = ["critical", "warning", "info"] as const;
const ICON = { critical: OctagonAlert, warning: AlertTriangle, info: Info } as const;
const TONE = { critical: "text-critical-text", warning: "text-warning-text", info: "text-ink-2" } as const;
const LABEL = { critical: "Critical", warning: "Warnings", info: "Info" } as const;

export function AlertsPanel({ tools = [], onEdit }: { tools?: ToolRow[]; onEdit: (t: ToolRow) => void }) {
  const { filters } = useFilters();
  const { data, isPending, error } = useOverview(filters);
  const alerts = data?.alerts ?? [];

  const open = (a: Alert) => {
    const tool = tools.find((t) => t.id === a.toolId);
    if (tool) onEdit(tool);
  };

  return (
    <ChartCard
      title="Needs attention"
      subtitle={
        alerts.length
          ? `${alerts.length} open ${alerts.length === 1 ? "alert" : "alerts"}. Select one to review the tool's limit.`
          : undefined
      }
      loading={isPending}
      error={error}
      className="h-full"
    >
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <CheckCircle2 className="text-good-text size-8" aria-hidden />
          <p className="text-sm font-medium">All clear</p>
          <p className="text-ink-2 text-xs">No limit breaches, shadow tools or budget risk for these filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {SEVERITIES.map((sev) => {
            const group = alerts.filter((a) => a.severity === sev);
            if (group.length === 0) return null;
            const Icon = ICON[sev];
            return (
              <section key={sev} aria-label={`${LABEL[sev]} (${group.length})`}>
                <h3 className={`mb-1 flex items-center gap-1.5 text-xs font-semibold ${TONE[sev]}`}>
                  <Icon className="size-3.5" aria-hidden /> {LABEL[sev]}
                  <span className="bg-wash text-ink-2 rounded-full px-1.5 py-px text-[11px]">{group.length}</span>
                </h3>
                <ul className="divide-grid divide-y">
                  {group.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        disabled={!a.toolId}
                        onClick={() => open(a)}
                        className="enabled:hover:bg-wash block w-full rounded-md px-1 py-2 text-left enabled:cursor-pointer"
                      >
                        <span className="block text-sm font-medium">{a.title}</span>
                        <span className="text-ink-2 block text-xs">{a.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}
