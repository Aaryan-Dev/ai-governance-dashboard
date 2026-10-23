import { fail, ok, parseFilters } from "@/server/http";
import { getTrend } from "@/server/services/spend.service";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const filters = parseFilters(req);
  return filters ? ok({ points: getTrend(filters) }) : fail("Invalid filters");
}
