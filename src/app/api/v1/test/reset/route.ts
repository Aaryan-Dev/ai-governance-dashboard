import { fail, ok } from "@/server/http";
import { resetStore } from "@/server/store";

/** Restores the seeded state between e2e tests. Disabled unless ENABLE_TEST_ROUTES=1. */
export function POST() {
  if (process.env.ENABLE_TEST_ROUTES !== "1") return fail("Not found", 404);
  resetStore();
  return ok({ reset: true });
}
