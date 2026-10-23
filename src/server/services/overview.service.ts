import type { Alert, Filters, Overview, ToolRow } from "@/schemas";
import { addDays, dayOfMonth, daysInMonth } from "../dates";
import { WINDOW_DAYS } from "../seed/generate";
import { getStore } from "../store";
import { budgetFor } from "./spend.service";
import { activeAdoptions, getToolRows, isApproved } from "./tools.service";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 } as const;

export function deriveAlerts(rows: ToolRow[], budget: number, projectedTotal: number): Alert[] {
  const alerts: Alert[] = [];
  for (const t of rows) {
    if (t.limitStatus === "over" && t.limit) {
      alerts.push({
        id: `over-${t.id}`,
        severity: "critical",
        title: `${t.name} is over its limit`,
        detail: `${usd(t.spendMtd)} of ${usd(t.limit)} used (${Math.round((t.utilization ?? 0) * 100)}%).`,
        toolId: t.id,
      });
    } else if (t.limitStatus === "at_risk" && t.limit) {
      alerts.push({
        id: `risk-${t.id}`,
        severity: "warning",
        title: `${t.name} will exceed its limit`,
        detail: `Forecast ${usd(t.projected)} vs ${usd(t.limit)} limit by month end.`,
        toolId: t.id,
      });
    }
    if (t.sanction === "unsanctioned" && t.spendMtd > 0) {
      alerts.push({
        id: `shadow-${t.id}`,
        severity: "warning",
        title: `Shadow AI: ${t.name}`,
        detail: `${t.activeUsers} users, ${usd(t.spendMtd)} this month, no approved limit.`,
        toolId: t.id,
      });
    }
  }
  if (budget > 0 && projectedTotal > budget) {
    alerts.push({
      id: "budget",
      severity: "critical",
      title: "Forecast exceeds AI budget",
      detail: `${usd(projectedTotal)} projected vs ${usd(budget)} monthly budget.`,
    });
  }
  return alerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

export function getOverview(filters: Filters): Overview {
  const { dataset } = getStore();
  const rows = getToolRows(filters);
  const ids = new Set(rows.map((r) => r.id));
  const dom = dayOfMonth(dataset.asOf);
  const days = Number(filters.period);

  // Rolling window vs. the window immediately before it. Only comparable while the prior window fits in the data.
  const windowStart = addDays(dataset.asOf, -days);
  const priorStart = addDays(dataset.asOf, -2 * days);
  const hasPrior = 2 * days <= WINDOW_DAYS;
  let prior = 0;
  for (const e of dataset.events) {
    if (ids.has(e.toolId) && e.date > priorStart && e.date <= windowStart) prior += e.cost;
  }
  const spendWindow = rows.reduce((s, r) => s + r.spendWindow, 0);

  const spendMtd = rows.reduce((s, r) => s + r.spendMtd, 0);
  const projected = rows.reduce((s, r) => s + r.projected, 0);
  const budget = budgetFor(filters);
  const users = new Set<string>();
  for (const a of activeAdoptions(Number(filters.period))) if (ids.has(a.toolId)) users.add(a.userId);

  return {
    asOf: dataset.asOf,
    daysElapsed: dom,
    daysInMonth: daysInMonth(dataset.asOf),
    spendMtd: Math.round(spendMtd),
    projected: Math.round(projected),
    budget,
    periodDays: days,
    spendWindow: Math.round(spendWindow),
    windowDeltaPct: hasPrior && prior > 0 ? (spendWindow - prior) / prior : null,
    activeUsers: users.size,
    employees: dataset.employees,
    toolsTracked: rows.length,
    toolsUnapproved: rows.filter((r) => !isApproved(r.sanction)).length,
    toolsOver: rows.filter((r) => r.limitStatus === "over").length,
    toolsAtRisk: rows.filter((r) => r.limitStatus === "at_risk").length,
    alerts: deriveAlerts(rows, budget, projected),
  };
}
