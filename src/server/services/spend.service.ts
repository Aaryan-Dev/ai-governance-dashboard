import type { Filters, TrendPoint } from "@/schemas";
import { dayOfMonth, daysInMonth, monthKey, monthLabel, prevMonthKey } from "../dates";
import { getStore } from "../store";
import { getToolRows, isApproved } from "./tools.service";

/** Trend span follows the selected window: current month plus enough prior months to cover it (min 3 points). */
export const trendMonths = (periodDays: number) => Math.min(6, Math.max(3, Math.ceil(periodDays / 30) + 1));

export function getTrend(filters: Filters, months = trendMonths(Number(filters.period))): TrendPoint[] {
  const { dataset } = getStore();
  const tools = new Map(getToolRows(filters).map((t) => [t.id, t]));
  const cur = monthKey(dataset.asOf);
  const keys = Array.from({ length: months }, (_, i) => prevMonthKey(cur, months - 1 - i));
  const sums = new Map<string, { approved: number; unapproved: number }>(keys.map((k) => [k, { approved: 0, unapproved: 0 }]));

  for (const e of dataset.events) {
    const tool = tools.get(e.toolId);
    const bucket = sums.get(monthKey(e.date));
    if (!tool || !bucket) continue;
    bucket[isApproved(tool.sanction) ? "approved" : "unapproved"] += e.cost;
  }

  const budget = budgetFor(filters);
  const dom = dayOfMonth(dataset.asOf);
  const dim = daysInMonth(dataset.asOf);
  return keys.map((k, i) => {
    const s = sums.get(k)!;
    const total = s.approved + s.unapproved;
    const partial = k === cur;
    const nextIsCurrent = keys[i + 1] === cur;
    return {
      month: k,
      label: monthLabel(k),
      approved: Math.round(s.approved),
      unapproved: Math.round(s.unapproved),
      total: Math.round(total),
      // The dashed forecast line starts at the last full month so it visually connects.
      projectedTotal: partial ? Math.round((total / dom) * dim) : nextIsCurrent ? Math.round(total) : null,
      budget,
      partial,
    };
  });
}

/** Org budget when unfiltered; otherwise the sum of the visible tools' limits. */
export function budgetFor(filters: Filters): number {
  const store = getStore();
  if (filters.category === "all" && filters.sanction === "all") return store.budget;
  return getToolRows(filters).reduce((s, t) => s + (t.limit ?? 0), 0);
}
