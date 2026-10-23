import { NextResponse } from "next/server";
import { filtersSchema, type Filters } from "@/schemas";

export const ok = <T>(data: T) => NextResponse.json(data);
export const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export function parseFilters(req: Request): Filters | null {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = filtersSchema.safeParse(params);
  return parsed.success ? parsed.data : null;
}
