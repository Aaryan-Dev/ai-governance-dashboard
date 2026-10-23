"use client";

import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { CATEGORIES, PERIODS, SANCTIONS, type Filters } from "@/schemas";

const parsers = {
  period: parseAsStringLiteral(PERIODS).withDefault("30"),
  category: parseAsStringLiteral(["all", ...CATEGORIES] as const).withDefault("all"),
  sanction: parseAsStringLiteral(["all", ...SANCTIONS] as const).withDefault("all"),
};

/** Filter state lives in the URL so views are shareable and survive refresh. */
export function useFilters() {
  const [filters, setFilters] = useQueryStates(parsers);
  return { filters: filters as Filters, setFilters };
}
