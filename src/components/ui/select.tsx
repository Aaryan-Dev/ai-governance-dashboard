import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-9 rounded-md border border-border bg-surface px-2.5 text-sm text-ink cursor-pointer", className)} {...props} />;
}
