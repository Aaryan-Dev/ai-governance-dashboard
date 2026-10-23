import { beforeEach, describe, expect, it } from "vitest";
import { filtersSchema } from "@/schemas";
import { resetStore } from "@/server/store";
import { getOverview } from "@/server/services/overview.service";
import { getTrend } from "@/server/services/spend.service";
import { getToolRows, setLimit, setSanction } from "@/server/services/tools.service";
import { getShadowMatrix } from "@/server/services/usage.service";

const filters = filtersSchema.parse({});

beforeEach(() => resetStore());

describe("services", () => {
  it("overview spend equals the sum of tool spend", () => {
    const rows = getToolRows(filters);
    const sum = rows.reduce((s, r) => s + r.spendMtd, 0);
    expect(Math.abs(getOverview(filters).spendMtd - sum)).toBeLessThan(1);
  });

  it("current trend month matches month-to-date spend", () => {
    const current = getTrend(filters).at(-1)!;
    expect(current.partial).toBe(true);
    expect(Math.abs(current.total - getOverview(filters).spendMtd)).toBeLessThan(2);
  });

  it("seed tells a story: some tools over/at risk and some unapproved", () => {
    const rows = getToolRows(filters);
    expect(rows.some((r) => r.limitStatus === "over")).toBe(true);
    expect(rows.some((r) => r.limitStatus === "at_risk")).toBe(true);
    expect(rows.some((r) => r.sanction === "unsanctioned")).toBe(true);
  });

  it("raising a limit clears the over status", () => {
    const over = getToolRows(filters).find((r) => r.limitStatus === "over")!;
    setLimit(over.id, Math.ceil(over.projected * 2));
    expect(getToolRows(filters).find((r) => r.id === over.id)!.limitStatus).toBe("ok");
  });

  it("approving a shadow tool gives it a limit and shrinks shadow users", () => {
    const shadowBefore = getShadowMatrix(filters).rows.reduce((s, d) => s + d.shadowUsers, 0);
    for (const t of getToolRows(filters).filter((r) => r.sanction === "unsanctioned")) setSanction(t.id, "approved");
    const rows = getToolRows(filters);
    expect(rows.every((r) => r.limit !== null)).toBe(true);
    const after = getShadowMatrix(filters);
    expect(after.tools.map((t) => t.sanction)).not.toContain("unsanctioned");
    expect(after.rows.reduce((s, d) => s + d.shadowUsers, 0)).toBeLessThan(shadowBefore);
  });

  it("heatmap cells never exceed headcount and unique users fit within the cell sums", () => {
    for (const d of getShadowMatrix(filters).rows) {
      const cells = Object.values(d.cells);
      expect(Math.max(0, ...cells)).toBeLessThanOrEqual(d.headcount);
      expect(d.shadowUsers).toBeLessThanOrEqual(Math.min(d.headcount, cells.reduce((s, n) => s + n, 0)));
      expect(d.shadowUsers).toBeGreaterThanOrEqual(Math.max(0, ...cells));
    }
  });
});
