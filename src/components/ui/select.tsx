import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("border-border bg-surface text-ink h-9 cursor-pointer rounded-md border px-2.5 text-sm", className)} {...props} />
  );
}
