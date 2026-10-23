"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <TriangleAlert className="text-critical-text size-10" aria-hidden />
      <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-ink-2 text-sm">The dashboard hit an unexpected error. Your data is safe; try again.</p>
      {error.digest && <p className="text-muted text-xs">Reference: {error.digest}</p>}
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
