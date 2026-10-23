import { SourcesGrid } from "@/components/organisms/sources-grid";

export function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">Data sources</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-2">
          No single system knows who uses which AI tool and what it costs. The dashboard joins vendor billing and usage APIs
          (exact cost), identity logs (who signs in), discovery signals (what nobody approved), finance (what was expensed) and HRIS
          (which team to attribute it to). Each source below is a connector that normalizes into one usage-event model.
        </p>
      </header>
      <SourcesGrid />
    </div>
  );
}
