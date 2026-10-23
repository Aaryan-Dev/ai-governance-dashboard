import { z } from "zod";

export const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["Vendor usage & cost", "Identity / SSO", "Shadow AI discovery", "Finance", "HRIS"]),
  purpose: z.string(),
  endpoints: z.array(z.string()),
  auth: z.string(),
  fields: z.array(z.string()),
  cadence: z.string(),
  status: z.enum(["connected", "syncing", "error"]),
  lastSync: z.string(),
  recordsSynced: z.number(),
});
export type Source = z.infer<typeof sourceSchema>;
export const sourcesResponseSchema = z.object({ rows: z.array(sourceSchema) });
