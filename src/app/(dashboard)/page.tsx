import { Suspense } from "react";
import { OverviewPage } from "@/components/pages/overview-page";

// Rendered per request so a CDN in front (Firebase Hosting) can never serve HTML that points at stale JS chunks.
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense>
      <OverviewPage />
    </Suspense>
  );
}
