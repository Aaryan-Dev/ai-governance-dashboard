"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api-client";
import type { Sanction } from "@/schemas";

const anyObject = z.object({}).passthrough();

/** Limits and sanction status feed every widget, so any change invalidates the whole dashboard. */
function useInvalidateDashboard() {
  const qc = useQueryClient();
  return () => Promise.all(["overview", "tools", "trend", "usage"].map((k) => qc.invalidateQueries({ queryKey: [k] })));
}

export function useUpdateLimit() {
  const invalidate = useInvalidateDashboard();
  return useMutation({
    mutationFn: ({ id, limit }: { id: string; limit: number | null }) =>
      api(`/tools/${id}/limit`, anyObject, { method: "PATCH", body: JSON.stringify({ limit }) }),
    onSuccess: invalidate,
  });
}

export function useUpdateSanction() {
  const invalidate = useInvalidateDashboard();
  return useMutation({
    mutationFn: ({ id, sanction }: { id: string; sanction: Sanction }) =>
      api(`/tools/${id}/status`, anyObject, { method: "PATCH", body: JSON.stringify({ sanction }) }),
    onSuccess: invalidate,
  });
}
