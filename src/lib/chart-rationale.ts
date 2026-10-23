/** "Why this chart" copy, surfaced in each chart's info popover (assignment Part 3). */
export const CHART_RATIONALE = {
  limits: {
    question: "Are we within what we approved, and where aren't we?",
    why: "Each bar is month-to-date spend as a share of that tool's approved limit, with a lighter extension for the month-end forecast. Scaling every row to its own limit puts a single 100% line on the chart, so a CFO can see breaches and near-misses in seconds without reading numbers. Tools without an approved limit are listed separately because they have nothing to measure against.",
  },
  trend: {
    question: "Where are we heading, and is it accelerating?",
    why: "Spend is only meaningful against the budget and its trajectory. Six months of stacked approved vs. unapproved spend show growth and how much of it is ungoverned; the budget line and dashed forecast show when we cross it.",
  },
  shadow: {
    question: "Which teams are using which tools we haven't approved?",
    why: "Shadow AI is not evenly spread: it clusters where a team has a need no approved tool meets. A department-by-tool heatmap pinpoints the exact pairs (for example Marketing and an image generator), so IT/security can approve a replacement, add a control, or run targeted enablement instead of a blanket ban. Shade shows the share of the team using the tool; the number is the head count.",
  },
} as const;
