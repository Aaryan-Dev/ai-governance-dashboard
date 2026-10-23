import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <SearchX className="text-muted size-10" aria-hidden />
      <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-ink-2 text-sm">That page doesn&apos;t exist or has moved.</p>
      <Link href="/" className="bg-ink text-surface inline-flex h-9 items-center rounded-md px-3.5 text-sm font-medium hover:opacity-90">
        Back to overview
      </Link>
    </main>
  );
}
