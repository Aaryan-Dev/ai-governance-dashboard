"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/components/atoms/toaster";
import { api } from "@/lib/api-client";
import { formatUsd } from "@/lib/format";
import type { Sanction } from "@/schemas";

const anyObject = z.object({}).passthrough();

/** Limits and sanction status feed every widget, so any change invalidates the whole dashboard. */
function useInvalidateDashboard() {
  const qc = useQueryClient();
  return () => Promise.all(["overview", "tools", "trend", "usage"].map((k) => qc.invalidateQueries({ queryKey: [k] })));
}

export function useUpdateLimit() {
  const invalidate = useInvalidateDashboard();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, limit }: { id: string; name: string; limit: number | null }) =>
      api(`/tools/${id}/limit`, anyObject, { method: "PATCH", body: JSON.stringify({ limit }) }),
    onSuccess: (_d, v) => {
      toast.success(v.limit === null ? `Removed the limit for ${v.name}.` : `${v.name} limit set to ${formatUsd(v.limit)}/month.`);
      return invalidate();
    },
    onError: (e, v) => toast.error(`Couldn't update ${v.name}: ${e.message}`),
  });
}

const SANCTION_VERB: Record<Sanction, string> = { approved: "approved", under_review: "moved to review", unsanctioned: "blocked" };

export function useUpdateSanction() {
  const invalidate = useInvalidateDashboard();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, sanction }: { id: string; name: string; sanction: Sanction }) =>
      api(`/tools/${id}/status`, anyObject, { method: "PATCH", body: JSON.stringify({ sanction }) }),
    onSuccess: (_d, v) => {
      toast.success(`${v.name} ${SANCTION_VERB[v.sanction]}.`);
      return invalidate();
    },
    onError: (e, v) => toast.error(`Couldn't update ${v.name}: ${e.message}`),
  });
}
