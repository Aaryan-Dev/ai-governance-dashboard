import { DataSourcesPage } from "@/components/pages/data-sources-page";

export const metadata = { title: "Data sources · AI Governance" };

// Rendered per request so a CDN in front (Firebase Hosting) can never serve HTML that points at stale JS chunks.
export const dynamic = "force-dynamic";

export default function Page() {
  return <DataSourcesPage />;
}
