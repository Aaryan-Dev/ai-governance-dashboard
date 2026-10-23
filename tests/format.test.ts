import { describe, expect, it } from "vitest";
import { formatPct, formatRelative, formatSigned, formatUsd, formatUsdCompact } from "@/lib/format";

describe("format", () => {
  it("formats currency", () => {
    expect(formatUsd(1234.5)).toBe("$1,235");
    expect(formatUsdCompact(950)).toBe("$950");
    expect(formatUsdCompact(1500)).toBe("$1.5k");
    expect(formatUsdCompact(14913)).toBe("$15k");
    expect(formatUsdCompact(2_300_000)).toBe("$2.3M");
  });

  it("formats percentages with explicit sign for deltas", () => {
    expect(formatPct(0.256)).toBe("26%");
    expect(formatSigned(0.11, 1)).toBe("+11.0%");
    expect(formatSigned(-0.05, 1)).toBe("-5.0%");
  });

  it("formats relative time", () => {
    const now = Date.parse("2026-10-23T12:00:00Z");
    expect(formatRelative("2026-10-23T11:59:30Z", now)).toBe("just now");
    expect(formatRelative("2026-10-23T11:15:00Z", now)).toBe("45 min ago");
    expect(formatRelative("2026-10-23T08:00:00Z", now)).toBe("4 h ago");
    expect(formatRelative("2026-10-20T12:00:00Z", now)).toBe("3 d ago");
  });
});
