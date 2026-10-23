"use client";

import { Database, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/data-sources", label: "Data sources", icon: Database },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[14rem_1fr]">
      <aside className="border-b border-border bg-surface md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-5 py-4 text-sm font-semibold">
          <ShieldCheck className="size-5 text-series-1" aria-hidden /> AI Governance
        </div>
        <nav aria-label="Primary" className="flex gap-1 px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm", active ? "bg-wash font-medium text-ink" : "text-ink-2 hover:bg-wash hover:text-ink")}
              >
                <Icon className="size-4" aria-hidden /> {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
