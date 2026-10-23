import type { Sanction } from "@/schemas";
import { CONNECTORS } from "../connectors";
import { TOOLS } from "../seed/catalog";
import { generateDataset, type Dataset } from "../seed/generate";

interface SyncState {
  status: "connected" | "syncing" | "error";
  lastSync: string;
  records: number;
}

interface Store {
  dataset: Dataset;
  sanctions: Map<string, Sanction>;
  limits: Map<string, number | null>;
  syncs: Map<string, SyncState>;
  budget: number;
}

const g = globalThis as unknown as { __aiGovStore?: Store };

function init(): Store {
  const dataset = generateDataset();
  const now = Date.now();
  return {
    dataset,
    sanctions: new Map(TOOLS.map((t) => [t.id, t.sanction])),
    limits: new Map(Object.entries(dataset.initialLimits)),
    budget: dataset.initialBudget,
    syncs: new Map(
      CONNECTORS.map((c, i) => [
        c.id,
        { status: "connected", lastSync: new Date(now - (i + 1) * 17 * 60_000).toISOString(), records: 0 },
      ]),
    ),
  };
}

/** Held on globalThis so dev HMR and separate route bundles share one in-memory store. */
export const getStore = (): Store => (g.__aiGovStore ??= init());
export const resetStore = () => {
  g.__aiGovStore = init();
};
