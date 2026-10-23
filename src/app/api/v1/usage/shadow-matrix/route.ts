import { fail, ok, parseFilters } from "@/server/http";
import { getShadowMatrix } from "@/server/services/usage.service";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const filters = parseFilters(req);
  return filters ? ok(getShadowMatrix(filters)) : fail("Invalid filters");
}
