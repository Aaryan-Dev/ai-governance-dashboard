"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateLimit } from "@/hooks/use-tool-mutations";
import { formatUsd } from "@/lib/format";
import type { ToolRow } from "@/schemas";

interface Props {
  tool: ToolRow | null;
  onClose: () => void;
}

export function LimitEditDialog({ tool, onClose }: Props) {
  return (
    <Dialog open={tool !== null} onOpenChange={(open) => !open && onClose()}>
      {tool && <LimitForm key={tool.id} tool={tool} onClose={onClose} />}
    </Dialog>
  );
}

function LimitForm({ tool, onClose }: { tool: ToolRow; onClose: () => void }) {
  const suggested = Math.max(100, Math.round((tool.projected * 1.1) / 100) * 100);
  const [value, setValue] = useState(String(tool.limit ?? suggested));
  const { mutate, isPending, error } = useUpdateLimit();
  const parsed = Number(value);
  const valid = Number.isInteger(parsed) && parsed >= 0;

  const save = (limit: number | null) => mutate({ id: tool.id, limit }, { onSuccess: onClose });

  return (
    <DialogContent
      title={`Monthly limit: ${tool.name}`}
      description={`Spent ${formatUsd(tool.spendMtd)} so far; forecast ${formatUsd(tool.projected)} by month end.`}
    >
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) save(parsed);
        }}
      >
        <div>
          <label htmlFor="limit" className="text-xs font-medium text-ink-2">Approved monthly limit (USD)</label>
          <Input id="limit" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1" autoFocus />
          <button type="button" onClick={() => setValue(String(suggested))} className="mt-1.5 text-xs text-series-1 hover:underline cursor-pointer">
            Suggest {formatUsd(suggested)} (forecast + 10%)
          </button>
        </div>
        {error && <p role="alert" className="text-xs text-critical-text">{error.message}</p>}
        <div className="flex justify-between gap-2">
          <Button variant="ghost" disabled={isPending || tool.limit === null} onClick={() => save(null)}>Remove limit</Button>
          <div className="flex gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!valid || isPending}>{isPending ? "Saving…" : "Save limit"}</Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}
