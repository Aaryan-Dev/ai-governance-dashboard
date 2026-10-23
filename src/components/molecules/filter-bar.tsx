"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFilters } from "@/hooks/use-filters";
import { CATEGORIES, PERIODS, SANCTIONS } from "@/schemas";
import { cn } from "@/lib/utils";

const SANCTION_LABEL = { approved: "Approved", under_review: "Under review", unsanctioned: "Unsanctioned" } as const;

export function FilterBar() {
  const { filters, setFilters } = useFilters();
  const [open, setOpen] = useState(false);
  const active = (filters.category !== "all" ? 1 : 0) + (filters.sanction !== "all" ? 1 : 0) + (filters.period !== "30" ? 1 : 0);

  return (
    <div className="w-full sm:w-auto">
      <Button
        className="w-full justify-between sm:hidden"
        aria-expanded={open}
        aria-controls="filter-fields"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="inline-flex items-center gap-1.5">
          <ListFilter className="size-4" aria-hidden /> Filters
        </span>
        {active > 0 && <span className="bg-ink text-surface rounded-full px-1.5 text-xs">{active}</span>}
      </Button>
      <div
        id="filter-fields"
        role="group"
        aria-label="Filters"
        className={cn("mt-2 flex-col gap-2 sm:mt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-center", open ? "flex" : "hidden")}
      >
        <label className="sr-only" htmlFor="f-period">
          Time range
        </label>
        <Select id="f-period" value={filters.period} onChange={(e) => setFilters({ period: e.target.value as (typeof PERIODS)[number] })}>
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              Last {p} days
            </option>
          ))}
        </Select>
        <label className="sr-only" htmlFor="f-category">
          Category
        </label>
        <Select
          id="f-category"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as typeof filters.category })}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <label className="sr-only" htmlFor="f-sanction">
          Approval status
        </label>
        <Select
          id="f-sanction"
          value={filters.sanction}
          onChange={(e) => setFilters({ sanction: e.target.value as typeof filters.sanction })}
        >
          <option value="all">All approval states</option>
          {SANCTIONS.map((s) => (
            <option key={s} value={s}>
              {SANCTION_LABEL[s]}
            </option>
          ))}
        </Select>
        {active > 0 && (
          <Button variant="ghost" onClick={() => setFilters({ period: "30", category: "all", sanction: "all" })}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
