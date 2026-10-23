import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataColumn<T> {
  key: string;
  header: string;
  numeric?: boolean;
  cell: (row: T) => ReactNode;
}

/** Plain semantic table used as the accessible "view as table" alternative for every chart. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string;
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}) {
  return (
    <div className="border-grid max-h-96 overflow-auto rounded-md border">
      <table className="w-full text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-ink-2 text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "border-grid bg-surface sticky top-0 border-b px-3 py-2 font-medium whitespace-nowrap",
                  c.numeric && "text-right",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)} className="border-grid border-b last:border-0">
              {columns.map((c, i) => {
                const Cell = i === 0 ? "th" : "td";
                return (
                  <Cell
                    key={c.key}
                    {...(i === 0 ? { scope: "row" } : {})}
                    className={cn("px-3 py-2 font-normal whitespace-nowrap", c.numeric && "text-right tabular-nums")}
                  >
                    {c.cell(r)}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
