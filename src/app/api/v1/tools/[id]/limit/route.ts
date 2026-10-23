import { updateLimitSchema } from "@/schemas";
import { fail, ok } from "@/server/http";
import { setLimit } from "@/server/services/tools.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = updateLimitSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return fail("Invalid body");
  return setLimit(id, body.data.limit) ? ok({ id, limit: body.data.limit }) : fail("Tool not found", 404);
}
