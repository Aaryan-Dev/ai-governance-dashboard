"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { sourceSchema, sourcesResponseSchema } from "@/schemas";

export const useSources = () => useQuery({ queryKey: ["sources"], queryFn: () => api("/sources", sourcesResponseSchema) });

export function useSyncSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/sources/${id}/sync`, sourceSchema, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sources"] }),
  });
}
