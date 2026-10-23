"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ToolRow } from "@/schemas";

interface Props {
  tool: ToolRow;
  busy: boolean;
  onEdit: () => void;
  onApprove: () => void;
  onBlock: () => void;
}

/** Inline buttons on wide screens; a single menu button below `lg` so the row never overflows. */
export function RowActions({ tool, busy, onEdit, onApprove, onBlock }: Props) {
  const canApprove = tool.sanction !== "approved";
  const canBlock = tool.sanction !== "unsanctioned";
  return (
    <>
      <div className="hidden justify-end gap-1.5 lg:flex">
        <Button size="sm" onClick={onEdit} aria-label={`Edit limit for ${tool.name}`}>
          Limit
        </Button>
        {canApprove && (
          <Button size="sm" variant="primary" disabled={busy} onClick={onApprove} aria-label={`Approve ${tool.name}`}>
            Approve
          </Button>
        )}
        {canBlock && (
          <Button size="sm" variant="danger" disabled={busy} onClick={onBlock} aria-label={`Block ${tool.name}`}>
            Block
          </Button>
        )}
      </div>
      <div className="flex justify-end lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" aria-label={`Actions for ${tool.name}`} disabled={busy}>
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>Edit limit…</DropdownMenuItem>
            {canApprove && <DropdownMenuItem onSelect={onApprove}>Approve</DropdownMenuItem>}
            {canBlock && (
              <DropdownMenuItem onSelect={onBlock} className="text-critical-text">
                Block
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
