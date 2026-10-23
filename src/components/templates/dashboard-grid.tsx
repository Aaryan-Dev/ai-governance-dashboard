import type { ReactNode } from "react";

/** 12-column layout used by the overview: two rows of a wide chart beside a narrow one. */
export function DashboardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-12">{children}</div>;
}

export function GridCell({ span, children }: { span: 5 | 7 | 12; children: ReactNode }) {
  const cls = { 5: "lg:col-span-5", 7: "lg:col-span-7", 12: "lg:col-span-12" }[span];
  return <div className={`min-w-0 ${cls}`}>{children}</div>;
}
