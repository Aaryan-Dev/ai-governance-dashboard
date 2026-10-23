import { fail, ok, parseFilters } from "@/server/http";
import { getOverview } from "@/server/services/overview.service";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const filters = parseFilters(req);
  return filters ? ok(getOverview(filters)) : fail("Invalid filters");
}
