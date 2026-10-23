import { fail, ok, parseFilters } from "@/server/http";
import { getToolRows } from "@/server/services/tools.service";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const filters = parseFilters(req);
  return filters ? ok({ rows: getToolRows(filters) }) : fail("Invalid filters");
}
