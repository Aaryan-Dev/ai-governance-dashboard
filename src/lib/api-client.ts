import type { z } from "zod";
import type { Filters } from "@/schemas";

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

/** Fetch + validate against the shared zod schema so FE and BE cannot drift silently. */
export async function api<S extends z.ZodType>(path: string, schema: S, init?: RequestInit): Promise<z.infer<S>> {
  const res = await fetch(`/api/v1${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError((body as { error?: string } | null)?.error ?? res.statusText, res.status);
  return schema.parse(body);
}

export const filtersToQuery = (f: Filters) => `?${new URLSearchParams(f).toString()}`;
