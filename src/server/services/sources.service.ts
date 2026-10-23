import type { Source } from "@/schemas";
import { CONNECTORS, getConnector } from "../connectors";
import { getStore } from "../store";

export function listSources(): Source[] {
  const { syncs } = getStore();
  return CONNECTORS.map((c) => {
    const s = syncs.get(c.id)!;
    return {
      id: c.id,
      name: c.name,
      category: c.category,
      purpose: c.purpose,
      endpoints: c.endpoints,
      auth: c.auth,
      fields: c.fields,
      cadence: c.cadence,
      status: s.status,
      lastSync: s.lastSync,
      recordsSynced: s.records,
    };
  });
}

export async function syncSource(id: string): Promise<Source | null> {
  const connector = getConnector(id);
  if (!connector) return null;
  const state = getStore().syncs.get(id)!;
  state.status = "syncing";
  try {
    const { records } = await connector.sync();
    state.records = records;
    state.lastSync = new Date().toISOString();
    state.status = "connected";
  } catch {
    state.status = "error";
  }
  return listSources().find((s) => s.id === id) ?? null;
}
