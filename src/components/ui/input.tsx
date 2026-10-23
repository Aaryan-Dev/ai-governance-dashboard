import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("border-border bg-surface text-ink placeholder:text-muted h-9 w-full rounded-md border px-3 text-sm", className)}
      {...props}
    />
  );
}
