import { NextResponse } from "next/server";
import { filtersSchema, type Filters } from "@/schemas";

const NO_STORE = { "Cache-Control": "no-store" };

export const ok = <T>(data: T) => NextResponse.json(data, { headers: NO_STORE });
export const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status, headers: NO_STORE });

export function parseFilters(req: Request): Filters | null {
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = filtersSchema.safeParse(params);
  return parsed.success ? parsed.data : null;
}
