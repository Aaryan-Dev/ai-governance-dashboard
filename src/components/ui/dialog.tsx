"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, title, description, ...props }: ComponentProps<typeof DialogPrimitive.Content> & { title: string; description?: ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40" />
      <DialogPrimitive.Content
        className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-6 shadow-xl", className)}
        {...props}
      >
        <DialogPrimitive.Title className="text-base font-semibold">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="mt-1 text-sm text-ink-2">{description}</DialogPrimitive.Description>
        {children}
        <DialogPrimitive.Close aria-label="Close" className="absolute right-4 top-4 rounded p-1 text-muted hover:bg-wash hover:text-ink cursor-pointer">
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
