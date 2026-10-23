import { ok } from "@/server/http";
import { listSources } from "@/server/services/sources.service";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({ rows: listSources() });
}
