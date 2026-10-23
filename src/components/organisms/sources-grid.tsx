"use client";

import { AlertTriangle, Check, CheckCircle2, Copy, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/atoms/toaster";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSources, useSyncSource } from "@/hooks/use-sources";
import { formatRelative } from "@/lib/format";
import type { Source } from "@/schemas";

const STATUS = {
  connected: { label: "Connected", icon: CheckCircle2, tone: "text-good-text", spin: false },
  syncing: { label: "Syncing", icon: Loader2, tone: "text-ink-2", spin: true },
  error: { label: "Error", icon: AlertTriangle, tone: "text-critical-text", spin: false },
} as const;

export function SourcesGrid() {
  const { data, isPending, error } = useSources();
  const { mutate, isPending: syncing, variables } = useSyncSource();

  if (error)
    return (
      <p role="alert" className="text-critical-text text-sm">
        Couldn&apos;t load data sources: {error.message}
      </p>
    );
  if (isPending)
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );

  const groups = data.rows.reduce((m, s) => m.set(s.category, [...(m.get(s.category) ?? []), s]), new Map<string, Source[]>());
  return (
    <div className="space-y-8">
      {[...groups].map(([category, sources]) => (
        <section key={category} aria-labelledby={`g-${category}`}>
          <h2 id={`g-${category}`} className="text-ink-2 mb-3 text-xs font-semibold tracking-wide uppercase">
            {category}
          </h2>
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
    <Card className="flex min-w-0 flex-col gap-3 p-5" role="group" aria-label={s.name}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{s.name}</h3>
          <p className="text-ink-2 mt-1 text-xs">{s.purpose}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${status.tone}`}>
          <status.icon className={`size-3.5 ${status.spin ? "animate-spin" : ""}`} aria-hidden /> {status.label}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
        <div className="col-span-2 min-w-0">
          <dt className="text-ink-2 font-medium">Endpoints</dt>
          <dd className="mt-1 space-y-1">
            {s.endpoints.map((e) => (
              <Endpoint key={e} value={e} />
            ))}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-ink-2 font-medium">Auth</dt>
          <dd>{s.auth}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-ink-2 font-medium">Cadence</dt>
          <dd>{s.cadence}</dd>
        </div>
        <div className="col-span-2 min-w-0">
          <dt className="text-ink-2 font-medium">Fields used</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {s.fields.map((f) => (
              <span key={f} className="border-border text-ink-2 rounded border px-1.5 py-0.5 font-mono text-[11px]">
                {f}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <footer className="border-grid text-ink-2 mt-auto flex items-center justify-between border-t pt-3 text-xs">
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

function Endpoint({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard.");
    }
  };
  return (
    <div className="bg-wash flex items-center gap-1 rounded">
      <code className="min-w-0 flex-1 overflow-x-auto px-2 py-1 font-mono text-[11px] whitespace-nowrap">{value}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy endpoint ${value}`}
        className="text-ink-2 hover:bg-wash hover:text-ink mr-1 shrink-0 cursor-pointer rounded p-1"
      >
        {copied ? <Check className="text-good-text size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      </button>
    </div>
  );
}
