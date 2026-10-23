import type { Filters, LimitStatus, Sanction, ToolRow } from "@/schemas";
import { addDays, dayOfMonth, daysInMonth, monthKey, prevMonthKey } from "../dates";
import { DEPARTMENTS, TOOLS } from "../seed/catalog";
import { getStore } from "../store";

export const isApproved = (s: Sanction) => s === "approved";
export const round100 = (n: number) => Math.max(100, Math.round(n / 100) * 100);

export function limitStatusOf(limit: number | null, mtd: number, projected: number): LimitStatus {
  if (limit === null) return "no_limit";
  if (mtd >= limit) return "over";
  if (projected > limit) return "at_risk";
  return "ok";
}

/** Distinct users per tool still active inside the lookback window. */
export function activeAdoptions(periodDays: number) {
  const { dataset } = getStore();
  const cutoff = addDays(dataset.asOf, -periodDays);
  return dataset.adoptions.filter((a) => a.startDate <= dataset.asOf && a.lastActive >= cutoff);
}

export function getAllToolRows(periodDays = 30): ToolRow[] {
  const store = getStore();
  const { dataset } = store;
  const cur = monthKey(dataset.asOf);
  const prev = prevMonthKey(cur);
  const dom = dayOfMonth(dataset.asOf);
  const dim = daysInMonth(dataset.asOf);

  const mtd = new Map<string, number>();
  const prevTotal = new Map<string, number>();
  for (const e of dataset.events) {
    const mk = monthKey(e.date);
    if (mk === cur) mtd.set(e.toolId, (mtd.get(e.toolId) ?? 0) + e.cost);
    else if (mk === prev) prevTotal.set(e.toolId, (prevTotal.get(e.toolId) ?? 0) + e.cost);
  }

  const usersByTool = new Map<string, Set<string>>();
  const usersByToolDept = new Map<string, number>();
  for (const a of activeAdoptions(periodDays)) {
    (usersByTool.get(a.toolId) ?? usersByTool.set(a.toolId, new Set()).get(a.toolId)!).add(a.userId);
    const k = `${a.toolId}|${a.deptId}`;
    usersByToolDept.set(k, (usersByToolDept.get(k) ?? 0) + 1);
  }

  return TOOLS.map((t) => {
    const spendMtd = round2(mtd.get(t.id) ?? 0);
    const projected = round2((spendMtd / dom) * dim);
    const limit = store.limits.get(t.id) ?? null;
    const top = DEPARTMENTS.map((d) => ({ d, n: usersByToolDept.get(`${t.id}|${d.id}`) ?? 0 })).sort((a, b) => b.n - a.n)[0];
    return {
      id: t.id,
      name: t.name,
      vendor: t.vendor,
      category: t.category,
      sanction: store.sanctions.get(t.id)!,
      pricing: t.pricing,
      limit,
      spendMtd,
      projected,
      spendPrev: round2(prevTotal.get(t.id) ?? 0),
      utilization: limit ? spendMtd / limit : null,
      projectedUtilization: limit ? projected / limit : null,
      limitStatus: limitStatusOf(limit, spendMtd, projected),
      activeUsers: usersByTool.get(t.id)?.size ?? 0,
      topDepartment: top && top.n > 0 ? top.d.name : "—",
    };
  });
}

export function getToolRows(filters: Filters): ToolRow[] {
  return getAllToolRows(Number(filters.period)).filter(
    (r) =>
      (filters.category === "all" || r.category === filters.category) &&
      (filters.sanction === "all" || r.sanction === filters.sanction),
  );
}

export function setLimit(id: string, limit: number | null): boolean {
  const store = getStore();
  if (!TOOLS.some((t) => t.id === id)) return false;
  store.limits.set(id, limit);
  return true;
}

export function setSanction(id: string, sanction: Sanction): boolean {
  const store = getStore();
  if (!TOOLS.some((t) => t.id === id)) return false;
  store.sanctions.set(id, sanction);
  if (sanction === "unsanctioned") {
    store.limits.set(id, null);
  } else if (store.limits.get(id) == null) {
    // Newly approved tools need a limit; default to 10% headroom over the current run-rate.
    const row = getAllToolRows().find((r) => r.id === id)!;
    store.limits.set(id, round100(row.projected * 1.1));
  }
  return true;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
