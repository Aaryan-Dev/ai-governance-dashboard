"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressMeter } from "@/components/atoms/progress-meter";
import { SanctionBadge } from "@/components/atoms/sanction-badge";
import { StatusBadge } from "@/components/atoms/status-badge";
import { RowActions } from "@/components/molecules/row-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilters } from "@/hooks/use-filters";
import { useUpdateSanction } from "@/hooks/use-tool-mutations";
import { formatPct, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ToolRow } from "@/schemas";

const col = createColumnHelper<ToolRow>();

interface ColMeta {
  numeric?: boolean;
  className?: string;
}

interface Props {
  rows?: ToolRow[];
  loading: boolean;
  error: Error | null;
  onEdit: (tool: ToolRow) => void;
}

export function ToolsTable({ rows = [], loading, error, onEdit }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "spendMtd", desc: true }]);
  const [search, setSearch] = useState("");
  const { mutate: setSanction, isPending, variables } = useUpdateSanction();
  const { filters } = useFilters();

  const columns = useMemo(
    () => [
      col.accessor("name", {
        header: "Tool",
        cell: (c) => (
          <div className="min-w-[11rem] whitespace-nowrap">
            <p className="font-medium">{c.getValue()}</p>
            <p className="text-ink-2 text-xs">
              {c.row.original.vendor} · {c.row.original.category}
            </p>
          </div>
        ),
      }),
      col.accessor("sanction", { header: "Approval", cell: (c) => <SanctionBadge sanction={c.getValue()} /> }),
      col.accessor("activeUsers", { header: "Users", meta: { numeric: true }, cell: (c) => c.getValue().toLocaleString() }),
      col.accessor("topDepartment", { header: "Top dept.", meta: { className: "hidden 2xl:table-cell" } }),
      col.accessor("spendWindow", {
        header: `Spend, ${filters.period}d`,
        meta: { numeric: true, className: "hidden xl:table-cell" },
        cell: (c) => formatUsd(c.getValue()),
      }),
      col.accessor("spendMtd", { header: "Spend MTD", meta: { numeric: true }, cell: (c) => formatUsd(c.getValue()) }),
      col.accessor("projected", {
        header: "Forecast",
        meta: { numeric: true, className: "hidden 2xl:table-cell" },
        cell: (c) => formatUsd(c.getValue()),
      }),
      col.accessor("limit", {
        header: "Limit",
        meta: { numeric: true },
        sortUndefined: "last",
        cell: (c) => (c.getValue() === null ? <span className="text-muted">None</span> : formatUsd(c.getValue()!)),
      }),
      col.accessor((r) => r.utilization ?? -1, {
        id: "utilization",
        header: "Utilization",
        cell: (c) => {
          const r = c.row.original;
          if (r.utilization === null) return <span className="text-muted">—</span>;
          const tone = r.limitStatus === "over" ? "bad" : r.limitStatus === "at_risk" ? "warn" : "ok";
          return (
            <div className="w-28">
              <ProgressMeter value={r.utilization} tone={tone} label={`${r.name} utilization`} />
              <p className="text-ink-2 mt-1 text-xs tabular-nums">{formatPct(r.utilization)} used</p>
            </div>
          );
        },
      }),
      col.accessor("limitStatus", { header: "Status", cell: (c) => <StatusBadge status={c.getValue()} /> }),
      col.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: (c) => {
          const r = c.row.original;
          const busy = isPending && variables?.id === r.id;
          return (
            <RowActions
              tool={r}
              busy={busy}
              onEdit={() => onEdit(r)}
              onApprove={() => setSanction({ id: r.id, name: r.name, sanction: "approved" })}
              onBlock={() => setSanction({ id: r.id, name: r.name, sanction: "unsanctioned" })}
            />
          );
        },
      }),
    ],
    [isPending, variables, onEdit, setSanction, filters.period],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    globalFilterFn: (row, _id, value: string) =>
      `${row.original.name} ${row.original.vendor} ${row.original.category}`.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="p-5" role="region" aria-labelledby="tools-heading">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="tools-heading" className="text-[15px] leading-snug font-semibold tracking-tight">
            All AI tools
          </h2>
          <p className="text-ink-2 mt-0.5 text-xs">Approve or block a tool and every chart above updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="tool-search" className="sr-only">
            Search tools
          </label>
          <Input id="tool-search" placeholder="Search tools…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-52" />
          <Button
            onClick={() =>
              downloadCsv(
                table.getRowModel().rows.map((r) => r.original),
                filters.period,
              )
            }
            disabled={rows.length === 0}
          >
            <Download className="size-4" aria-hidden /> Export CSV
          </Button>
        </div>
      </header>

      <div className="border-grid mt-4 max-h-[36rem] overflow-auto rounded-md border">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : error ? (
          <p role="alert" className="text-critical-text py-10 text-center text-sm">
            Couldn&apos;t load tools: {error.message}
          </p>
        ) : (
          <table className="w-full min-w-[56rem] text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="text-ink-2 text-left text-xs">
                  {hg.headers.map((h) => {
                    const meta = h.column.columnDef.meta as ColMeta | undefined;
                    const sorted = h.column.getIsSorted();
                    const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
                    return (
                      <th
                        key={h.id}
                        className={cn(
                          "border-grid bg-surface sticky top-0 z-10 border-b px-3 py-2.5 font-medium",
                          meta?.numeric && "text-right",
                          meta?.className,
                        )}
                        aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : "none"}
                      >
                        {h.column.getCanSort() ? (
                          <button
                            type="button"
                            onClick={h.column.getToggleSortingHandler()}
                            className="hover:text-ink inline-flex cursor-pointer items-center gap-1"
                          >
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            <Icon className={`size-3 ${sorted ? "text-ink" : "text-muted"}`} aria-hidden />
                          </button>
                        ) : (
                          flexRender(h.column.columnDef.header, h.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-grid hover:bg-wash border-b last:border-0">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as ColMeta | undefined;
                    return (
                      <td
                        key={cell.id}
                        className={cn("px-3 py-2.5 align-middle", meta?.numeric && "text-right tabular-nums", meta?.className)}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-muted py-10 text-center text-sm">
                    No tools match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}

function downloadCsv(rows: ToolRow[], period: string) {
  const head = [
    "Tool",
    "Vendor",
    "Category",
    "Approval",
    "Active users",
    `Spend last ${period}d`,
    "Spend MTD",
    "Forecast",
    "Limit",
    "Status",
  ];
  const lines = rows.map((r) =>
    [
      r.name,
      r.vendor,
      r.category,
      r.sanction,
      r.activeUsers,
      r.spendWindow.toFixed(2),
      r.spendMtd.toFixed(2),
      r.projected.toFixed(2),
      r.limit ?? "",
      r.limitStatus,
    ]
      .map((v) => `"${String(v).replaceAll('"', '""')}"`)
      .join(","),
  );
  const url = URL.createObjectURL(new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "ai-tools.csv" });
  a.click();
  URL.revokeObjectURL(url);
}
