import type { Filters, ShadowMatrix } from "@/schemas";
import { DEPARTMENTS } from "../seed/catalog";
import { activeAdoptions, getToolRows, isApproved } from "./tools.service";

/** Department x unapproved-tool matrix of active users (the shadow-AI heatmap). */
export function getShadowMatrix(filters: Filters): ShadowMatrix {
  const shadowTools = getToolRows(filters).filter((t) => !isApproved(t.sanction));
  const ids = new Set(shadowTools.map((t) => t.id));
  const cells = new Map<string, Record<string, number>>(DEPARTMENTS.map((d) => [d.id, {}]));
  const people = new Map<string, Set<string>>(DEPARTMENTS.map((d) => [d.id, new Set()]));
  const perTool = new Map<string, number>();

  for (const a of activeAdoptions(Number(filters.period))) {
    if (!ids.has(a.toolId)) continue;
    const row = cells.get(a.deptId)!;
    row[a.toolId] = (row[a.toolId] ?? 0) + 1;
    people.get(a.deptId)!.add(a.userId);
    perTool.set(a.toolId, (perTool.get(a.toolId) ?? 0) + 1);
  }

  return {
    tools: shadowTools
      .map((t) => ({ id: t.id, name: t.name, sanction: t.sanction, users: perTool.get(t.id) ?? 0 }))
      .sort((a, b) => b.users - a.users),
    rows: DEPARTMENTS.map((d) => ({
      departmentId: d.id,
      department: d.name,
      headcount: d.headcount,
      shadowUsers: people.get(d.id)!.size,
      cells: cells.get(d.id)!,
    })).sort((a, b) => b.shadowUsers / b.headcount - a.shadowUsers / a.headcount),
  };
}
