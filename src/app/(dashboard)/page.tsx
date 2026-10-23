import { Suspense } from "react";
import { OverviewPage } from "@/components/pages/overview-page";

export default function Page() {
  return (
    <Suspense>
      <OverviewPage />
    </Suspense>
  );
}
