import { updateStatusSchema } from "@/schemas";
import { fail, ok } from "@/server/http";
import { setSanction } from "@/server/services/tools.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = updateStatusSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return fail("Invalid body");
  return setSanction(id, body.data.sanction) ? ok({ id, sanction: body.data.sanction }) : fail("Tool not found", 404);
}
