"use client";

import { Database, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/atoms/logo-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/data-sources", label: "Data sources", icon: Database },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <a
        href="#main"
        className="bg-ink text-surface sr-only z-[70] rounded-md px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside className="border-border bg-surface border-b md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-r md:border-b-0">
        <div className="flex items-center gap-2.5 px-5 py-4">
          <LogoMark />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">AI Governance</p>
            <p className="text-muted text-xs">Usage &amp; spend control</p>
          </div>
        </div>
        <nav aria-label="Primary" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active ? "bg-wash text-ink font-medium" : "text-ink-2 hover:bg-wash hover:text-ink",
                )}
              >
                {active && <span className="bg-series-1 absolute inset-y-1.5 left-0 hidden w-0.5 rounded-full md:block" aria-hidden />}
                <Icon className="size-4" aria-hidden /> {label}
              </Link>
            );
          })}
        </nav>
        <p className="text-muted mt-auto hidden px-5 py-4 text-xs md:block">v0.1 · sample data</p>
      </aside>

      <div className="min-w-0">
        <div className="border-border bg-surface/80 text-ink-2 flex items-center justify-between gap-3 border-b px-4 py-2 text-xs backdrop-blur md:sticky md:top-0 md:z-30 md:px-8">
          <span className="border-border bg-surface inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium">
            <span className="bg-warning size-1.5 rounded-full" aria-hidden /> Demo data
          </span>
          <span className="hidden sm:inline">Seeded sample dataset · edits reset when the server restarts</span>
        </div>
        <main id="main" tabIndex={-1} className="px-4 py-6 outline-none md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
