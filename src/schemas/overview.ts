import { z } from "zod";

export const alertSchema = z.object({
  id: z.string(),
  severity: z.enum(["critical", "warning", "info"]),
  title: z.string(),
  detail: z.string(),
  toolId: z.string().optional(),
});
export type Alert = z.infer<typeof alertSchema>;

export const overviewSchema = z.object({
  asOf: z.string(),
  daysElapsed: z.number(),
  daysInMonth: z.number(),
  spendMtd: z.number(),
  projected: z.number(),
  budget: z.number(),
  momDeltaPct: z.number().nullable(),
  activeUsers: z.number(),
  employees: z.number(),
  toolsTracked: z.number(),
  toolsUnapproved: z.number(),
  toolsOver: z.number(),
  toolsAtRisk: z.number(),
  alerts: z.array(alertSchema),
});
export type Overview = z.infer<typeof overviewSchema>;

export const trendPointSchema = z.object({
  month: z.string(),
  label: z.string(),
  approved: z.number(),
  unapproved: z.number(),
  total: z.number(),
  projectedTotal: z.number().nullable(),
  budget: z.number(),
  partial: z.boolean(),
});
export type TrendPoint = z.infer<typeof trendPointSchema>;
export const trendResponseSchema = z.object({ points: z.array(trendPointSchema) });

export const shadowMatrixSchema = z.object({
  /** Unapproved tools, most-used first; these are the matrix columns. */
  tools: z.array(z.object({ id: z.string(), name: z.string(), sanction: z.string(), users: z.number() })),
  rows: z.array(
    z.object({
      departmentId: z.string(),
      department: z.string(),
      headcount: z.number(),
      /** Distinct people in the department using at least one unapproved tool. */
      shadowUsers: z.number(),
      /** toolId -> users in this department using that tool. */
      cells: z.record(z.string(), z.number()),
    }),
  ),
});
export type ShadowMatrix = z.infer<typeof shadowMatrixSchema>;
