"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, filtersToQuery } from "@/lib/api-client";
import { shadowMatrixSchema, overviewSchema, toolsResponseSchema, trendResponseSchema, type Filters } from "@/schemas";

const opts = { placeholderData: keepPreviousData, staleTime: 15_000 } as const;

export const useOverview = (f: Filters) =>
  useQuery({ queryKey: ["overview", f], queryFn: () => api(`/overview${filtersToQuery(f)}`, overviewSchema), ...opts });

export const useTools = (f: Filters) =>
  useQuery({ queryKey: ["tools", f], queryFn: () => api(`/tools${filtersToQuery(f)}`, toolsResponseSchema), ...opts });

export const useSpendTrend = (f: Filters) =>
  useQuery({ queryKey: ["trend", f], queryFn: () => api(`/spend/trend${filtersToQuery(f)}`, trendResponseSchema), ...opts });

export const useShadowMatrix = (f: Filters) =>
  useQuery({ queryKey: ["usage", f], queryFn: () => api(`/usage/shadow-matrix${filtersToQuery(f)}`, shadowMatrixSchema), ...opts });
