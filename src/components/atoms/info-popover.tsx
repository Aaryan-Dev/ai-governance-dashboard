"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function InfoPopover({ question, why }: { question: string; why: string }) {
  return (
    <Popover>
      <PopoverTrigger aria-label="Why this chart?" className="rounded p-1 text-muted hover:bg-wash hover:text-ink cursor-pointer">
        <Info className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Why this chart</p>
        <p className="mt-1 font-medium">{question}</p>
        <p className="mt-2 text-ink-2">{why}</p>
      </PopoverContent>
    </Popover>
  );
}
