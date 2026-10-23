"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources, useSyncSource } from "@/hooks/use-sources";
import { formatRelative } from "@/lib/format";
import type { Source } from "@/schemas";

const STATUS = {
  connected: { label: "Connected", dot: "bg-good" },
  syncing: { label: "Syncing", dot: "bg-warning" },
  error: { label: "Error", dot: "bg-critical" },
} as const;

export function SourcesGrid() {
  const { data, isPending, error } = useSources();
  const { mutate, isPending: syncing, variables } = useSyncSource();

  if (error) return <p role="alert" className="text-sm text-critical-text">Couldn&apos;t load data sources: {error.message}</p>;
  if (isPending) return <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-64" />)}</div>;

  const groups = Map.groupBy(data.rows, (s) => s.category);
  return (
    <div className="space-y-8">
      {[...groups].map(([category, sources]) => (
        <section key={category} aria-labelledby={`g-${category}`}>
          <h2 id={`g-${category}`} className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-2">{category}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {sources.map((s) => (
              <SourceCard key={s.id} source={s} syncing={syncing && variables === s.id} onSync={() => mutate(s.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SourceCard({ source: s, syncing, onSync }: { source: Source; syncing: boolean; onSync: () => void }) {
  const status = STATUS[syncing ? "syncing" : s.status];
  return (
    <Card className="flex flex-col gap-3 p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{s.name}</h3>
          <p className="mt-1 text-xs text-ink-2">{s.purpose}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-ink-2">
          <span className={`size-2 rounded-full ${status.dot}`} aria-hidden /> {status.label}
        </span>
      </header>

      <dl className="space-y-2 text-xs">
        <div>
          <dt className="font-medium text-ink-2">Endpoints</dt>
          <dd className="mt-1 space-y-1">
            {s.endpoints.map((e) => (
              <code key={e} className="block overflow-x-auto rounded bg-wash px-2 py-1 font-mono text-[11px] whitespace-nowrap">{e}</code>
            ))}
          </dd>
        </div>
        <div className="flex gap-6">
          <div><dt className="font-medium text-ink-2">Auth</dt><dd>{s.auth}</dd></div>
          <div><dt className="font-medium text-ink-2">Cadence</dt><dd>{s.cadence}</dd></div>
        </div>
        <div>
          <dt className="font-medium text-ink-2">Fields used</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {s.fields.map((f) => (
              <span key={f} className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-ink-2">{f}</span>
            ))}
          </dd>
        </div>
      </dl>

      <footer className="mt-auto flex items-center justify-between border-t border-grid pt-3 text-xs text-ink-2">
        <span>
          Last sync {formatRelative(s.lastSync)}
          {s.recordsSynced > 0 && ` · ${s.recordsSynced.toLocaleString()} records`}
        </span>
        <Button size="sm" onClick={onSync} disabled={syncing}>
          {syncing ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <RefreshCw className="size-3.5" aria-hidden />}
          Sync now
        </Button>
      </footer>
    </Card>
  );
}
