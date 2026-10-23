"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function InfoPopover({ question, why }: { question: string; why: string }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Why this chart?"
        className="border-border text-ink-2 hover:bg-wash hover:text-ink inline-flex size-7 cursor-pointer items-center justify-center rounded-md border"
      >
        <Info className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-muted text-xs font-medium tracking-wide uppercase">Why this chart</p>
        <p className="mt-1 font-medium">{question}</p>
        <p className="text-ink-2 mt-2">{why}</p>
      </PopoverContent>
    </Popover>
  );
}
