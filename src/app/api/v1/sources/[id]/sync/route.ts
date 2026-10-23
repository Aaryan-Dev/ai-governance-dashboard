import { fail, ok } from "@/server/http";
import { syncSource } from "@/server/services/sources.service";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = await syncSource(id);
  return source ? ok(source) : fail("Source not found", 404);
}
