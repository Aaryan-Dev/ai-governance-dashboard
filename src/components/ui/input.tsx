import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted", className)}
      {...props}
    />
  );
}
