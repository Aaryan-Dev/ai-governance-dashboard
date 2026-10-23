import type { Source } from "@/schemas";

/**
 * A connector pulls raw records from one external system and normalizes them
 * into UsageEvent / Adoption rows. The mock implementations only describe the
 * contract (endpoints, auth, fields); `sync` is where a real client plugs in.
 */
export interface Connector {
  id: string;
  name: string;
  category: Source["category"];
  purpose: string;
  endpoints: string[];
  auth: string;
  fields: string[];
  cadence: string;
  /** Returns the number of records ingested. Mocked: derives a stable count. */
  sync(): Promise<{ records: number }>;
}

export const defineConnector = (c: Omit<Connector, "sync"> & { baseRecords: number }): Connector => ({
  ...c,
  async sync() {
    await new Promise((r) => setTimeout(r, 400));
    return { records: c.baseRecords + Math.floor(Math.random() * 40) };
  },
});
