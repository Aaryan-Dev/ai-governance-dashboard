import { z } from "zod";
import { categorySchema, limitStatusSchema, sanctionSchema } from "./common";

export const toolRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  vendor: z.string(),
  category: categorySchema,
  sanction: sanctionSchema,
  pricing: z.enum(["seat", "usage"]),
  limit: z.number().nullable(),
  spendMtd: z.number(),
  projected: z.number(),
  spendPrev: z.number(),
  /** Spend over the selected rolling window (last N days). */
  spendWindow: z.number(),
  utilization: z.number().nullable(),
  projectedUtilization: z.number().nullable(),
  limitStatus: limitStatusSchema,
  activeUsers: z.number(),
  topDepartment: z.string(),
});
export type ToolRow = z.infer<typeof toolRowSchema>;
export const toolsResponseSchema = z.object({ rows: z.array(toolRowSchema) });

export const updateLimitSchema = z.object({ limit: z.number().int().min(0).max(1_000_000).nullable() });
export const updateStatusSchema = z.object({ sanction: sanctionSchema });
