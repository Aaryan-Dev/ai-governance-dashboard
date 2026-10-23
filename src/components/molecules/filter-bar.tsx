"use client";

import { Select } from "@/components/ui/select";
import { useFilters } from "@/hooks/use-filters";
import { CATEGORIES, PERIODS, SANCTIONS } from "@/schemas";

const SANCTION_LABEL = { approved: "Approved", under_review: "Under review", unsanctioned: "Unsanctioned" } as const;

export function FilterBar() {
  const { filters, setFilters } = useFilters();
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
      <label className="sr-only" htmlFor="f-period">Usage window</label>
      <Select id="f-period" value={filters.period} onChange={(e) => setFilters({ period: e.target.value as (typeof PERIODS)[number] })}>
        {PERIODS.map((p) => (
          <option key={p} value={p}>Active in last {p} days</option>
        ))}
      </Select>
      <label className="sr-only" htmlFor="f-category">Category</label>
      <Select id="f-category" value={filters.category} onChange={(e) => setFilters({ category: e.target.value as typeof filters.category })}>
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
      <label className="sr-only" htmlFor="f-sanction">Approval status</label>
      <Select id="f-sanction" value={filters.sanction} onChange={(e) => setFilters({ sanction: e.target.value as typeof filters.sanction })}>
        <option value="all">All approval states</option>
        {SANCTIONS.map((s) => (
          <option key={s} value={s}>{SANCTION_LABEL[s]}</option>
        ))}
      </Select>
    </div>
  );
}
