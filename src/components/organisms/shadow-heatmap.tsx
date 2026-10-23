"use client";

import { ChartCard } from "@/components/molecules/chart-card";
import { DataTable, type DataColumn } from "@/components/molecules/data-table";
import { useFilters } from "@/hooks/use-filters";
import { CHART_RATIONALE } from "@/lib/chart-rationale";
import { formatPct } from "@/lib/format";
import type { ShadowMatrix } from "@/schemas";

interface Props {
  data?: ShadowMatrix;
  loading: boolean;
  error: Error | null;
}

/** One-hue sequential ramp (shadow = series-2), mixed against the surface so it works in light and dark. */
const shade = (t: number) => `color-mix(in oklab, var(--series-2) ${Math.round(10 + t * 90)}%, var(--surface))`;

export function ShadowHeatmap({ data, loading, error }: Props) {
  const { filters } = useFilters();
  const rows = data?.rows ?? [];
  const tools = data?.tools ?? [];

  // Cell value = share of the department using the tool; scale to the hottest cell so differences stay readable.
  let max = 0;
  let hot: { dept: string; tool: string; rate: number } | null = null;
  for (const r of rows) {
    for (const t of tools) {
      const rate = (r.cells[t.id] ?? 0) / r.headcount;
      if (rate > max) {
        max = rate;
        hot = { dept: r.department, tool: t.name, rate };
      }
    }
  }

  type Row = ShadowMatrix["rows"][number];
  const columns: DataColumn<Row>[] = [
    { key: "dept", header: "Department", cell: (r) => r.department },
    ...tools.map((t) => ({ key: t.id, header: t.name, numeric: true, cell: (r: Row) => String(r.cells[t.id] ?? 0) })),
    {
      key: "any",
      header: "Any unapproved (unique)",
      numeric: true,
      cell: (r: Row) => `${r.shadowUsers} (${formatPct(r.shadowUsers / r.headcount)})`,
    },
    { key: "hc", header: "Headcount", numeric: true, cell: (r: Row) => String(r.headcount) },
  ];

  return (
    <ChartCard
      title="Shadow AI heatmap"
      subtitle={`Users active in the last ${filters.period} days, by department and unapproved tool. Shade is the share of the team; the number is people.`}
      rationale={CHART_RATIONALE.shadow}
      loading={loading}
      error={error}
      empty={tools.length === 0 || rows.length === 0}
      table={
        <DataTable caption="Active users per department and unapproved tool" columns={columns} rows={rows} rowKey={(r) => r.departmentId} />
      }
      legend={
        <div className="text-ink-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          {hot ? (
            <p>
              Hottest spot:{" "}
              <strong className="text-ink font-semibold">
                {hot.dept} × {hot.tool}
              </strong>{" "}
              ({formatPct(hot.rate)} of the team)
            </p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2" aria-hidden>
            <span>0%</span>
            <span className="h-2 w-24 rounded-sm" style={{ background: `linear-gradient(90deg, ${shade(0)}, ${shade(1)})` }} />
            <span>{formatPct(max)} of team</span>
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-separate text-xs" style={{ borderSpacing: 2 }}>
          <caption className="sr-only">Active users per department and unapproved tool</caption>
          <thead>
            <tr>
              <th scope="col" className="w-28" />
              {tools.map((t) => (
                <th key={t.id} scope="col" className="text-ink-2 px-1 pb-1 align-bottom font-medium">
                  <span className="block leading-tight">{t.name}</span>
                  <span className="text-muted block font-normal">{t.users} users</span>
                </th>
              ))}
              <th scope="col" className="text-ink-2 w-20 px-1 pb-1 text-right align-bottom font-medium">
                <span className="block leading-tight">Any tool</span>
                <span className="text-muted block font-normal">unique</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.departmentId}>
                <th scope="row" className="text-ink-2 pr-2 text-left font-normal whitespace-nowrap">
                  {r.department}
                </th>
                {tools.map((t, ci) => {
                  const n = r.cells[t.id] ?? 0;
                  const rate = n / r.headcount;
                  const level = max > 0 ? rate / max : 0;
                  const isHot = hot !== null && hot.dept === r.department && hot.tool === t.name;
                  const edge = ci >= tools.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2";
                  const vertical = ri >= rows.length - 2 ? "bottom-full mb-1" : "top-full mt-1";
                  return (
                    <td key={t.id} className="p-0">
                      <button
                        type="button"
                        aria-label={`${r.department}, ${t.name}: ${n} of ${r.headcount} people (${formatPct(rate)})`}
                        className="group relative flex h-8 w-full cursor-default items-center justify-center rounded-[4px] font-medium tabular-nums"
                        style={{
                          background: n === 0 ? "var(--wash)" : shade(level),
                          color: n === 0 ? "var(--muted)" : "var(--ink)",
                          outline: isHot ? "2px solid var(--ink)" : undefined,
                          outlineOffset: isHot ? 1 : undefined,
                        }}
                      >
                        {n === 0 ? "·" : n}
                        <span
                          role="tooltip"
                          className={`border-border bg-surface text-ink-2 shadow-pop pointer-events-none absolute z-10 hidden w-max min-w-40 rounded-lg border px-3 py-2 text-left font-normal group-hover:block group-focus-visible:block ${edge} ${vertical}`}
                        >
                          <span className="text-ink block font-semibold">
                            {r.department} × {t.name}
                          </span>
                          <span className="block">
                            {n} of {r.headcount} people ({formatPct(rate)})
                          </span>
                        </span>
                      </button>
                    </td>
                  );
                })}
                <td className="px-1 text-right tabular-nums">
                  <span className="text-ink font-semibold">{r.shadowUsers}</span>
                  <span className="text-muted ml-1">{formatPct(r.shadowUsers / r.headcount)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
