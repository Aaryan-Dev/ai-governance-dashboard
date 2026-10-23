import { z } from "zod";

export const SANCTIONS = ["approved", "under_review", "unsanctioned"] as const;
export const sanctionSchema = z.enum(SANCTIONS);
export type Sanction = z.infer<typeof sanctionSchema>;

export const CATEGORIES = [
  "Assistant",
  "Platform / API",
  "Coding",
  "Productivity",
  "Writing",
  "Image & Media",
  "Meetings",
] as const;
export const categorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof categorySchema>;

export const PERIODS = ["30", "90", "180"] as const;
export const periodSchema = z.enum(PERIODS);

export const filtersSchema = z.object({
  period: periodSchema.default("30"),
  category: z.union([z.literal("all"), categorySchema]).default("all"),
  sanction: z.union([z.literal("all"), sanctionSchema]).default("all"),
});
export type Filters = z.infer<typeof filtersSchema>;

export const limitStatusSchema = z.enum(["ok", "at_risk", "over", "no_limit"]);
export type LimitStatus = z.infer<typeof limitStatusSchema>;
