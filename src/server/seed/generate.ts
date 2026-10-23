import { addDays, daysInMonth, monthKey, prevMonthKey, today } from "../dates";
import { DEPARTMENTS, TOOLS, type ToolSeed } from "./catalog";
import { createRng } from "./prng";

export const WINDOW_DAYS = 180;
/** Adoption can predate the event window so month one is not an empty ramp. */
const ADOPTION_LOOKBACK_DAYS = 330;

export interface Adoption {
  userId: string;
  deptId: string;
  toolId: string;
  startDate: string;
  lastActive: string;
}

/** Daily grain, normalized across all connectors. */
export interface UsageEvent {
  date: string;
  toolId: string;
  deptId: string;
  activeUsers: number;
  cost: number;
}

export interface Dataset {
  asOf: string;
  employees: number;
  adoptions: Adoption[];
  events: UsageEvent[];
  /** Initial monthly limit per tool (null = none approved). */
  initialLimits: Record<string, number | null>;
  initialBudget: number;
}

const round100 = (n: number) => Math.max(100, Math.round(n / 100) * 100);

export function generateDataset(seed = 20260101): Dataset {
  const rng = createRng(seed);
  const asOf = today();
  const adoptions: Adoption[] = [];
  const toolById = new Map<string, ToolSeed>(TOOLS.map((t) => [t.id, t]));

  let uid = 0;
  for (const dept of DEPARTMENTS) {
    for (let i = 0; i < dept.headcount; i++) {
      const userId = `u${++uid}`;
      for (const tool of TOOLS) {
        const p = Math.min(0.97, tool.adoption * (tool.affinity[dept.id] ?? 1));
        if (rng() > p) continue;
        const offset = Math.floor(Math.pow(rng(), tool.recency) * (ADOPTION_LOOKBACK_DAYS - 2));
        const startDate = addDays(asOf, -offset);
        const churned = rng() < 0.12;
        const lastActive = churned ? addDays(asOf, -Math.min(offset, 30 + Math.floor(rng() * 90))) : asOf;
        adoptions.push({ userId, deptId: dept.id, toolId: tool.id, startDate, lastActive });
      }
    }
  }

  // Aggregate to tool x department x day.
  const agg = new Map<string, UsageEvent>();
  for (let d = WINDOW_DAYS - 1; d >= 0; d--) {
    const date = addDays(asOf, -d);
    const dim = daysInMonth(date);
    const progress = 1 - d / WINDOW_DAYS;
    for (const a of adoptions) {
      if (a.startDate > date || a.lastActive < date) continue;
      const tool = toolById.get(a.toolId)!;
      const growth = 1 + tool.growth * progress;
      const noise = tool.pricing === "usage" ? 0.5 + rng() : 1;
      const cost = (tool.unitMonthly / dim) * growth * noise;
      const key = `${date}|${a.toolId}|${a.deptId}`;
      const ev = agg.get(key) ?? { date, toolId: a.toolId, deptId: a.deptId, activeUsers: 0, cost: 0 };
      ev.activeUsers += 1;
      ev.cost += cost;
      agg.set(key, ev);
    }
  }
  const events = [...agg.values()].map((e) => ({ ...e, cost: Math.round(e.cost * 100) / 100 }));

  // Limits are derived from recent full-month run-rate, then scaled by each tool's factor.
  const lastFull = prevMonthKey(monthKey(asOf), 1);
  const prior = prevMonthKey(monthKey(asOf), 2);
  const initialLimits: Record<string, number | null> = {};
  for (const tool of TOOLS) {
    if (tool.limitFactor === null) {
      initialLimits[tool.id] = null;
      continue;
    }
    let sum = 0;
    for (const e of events) {
      if (e.toolId !== tool.id) continue;
      const mk = monthKey(e.date);
      if (mk === lastFull || mk === prior) sum += e.cost;
    }
    initialLimits[tool.id] = round100((sum / 2) * tool.limitFactor);
  }
  const limitTotal = Object.values(initialLimits).reduce<number>((s, v) => s + (v ?? 0), 0);

  return { asOf, employees: uid, adoptions, events, initialLimits, initialBudget: Math.round((limitTotal + 2000) / 1000) * 1000 };
}
