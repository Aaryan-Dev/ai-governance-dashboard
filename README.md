# AI Governance Dashboard

A working prototype of an **AI governance dashboard**: which AI tools are used, by whom, what they cost,
and whether spend stays inside approved limits (the "Shadow AI" problem).

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # unit tests (vitest): services + formatters
pnpm test:e2e     # Playwright: user flows, a11y (axe), mobile overflow, light theme
pnpm check        # typecheck + lint + unit tests
pnpm format       # prettier (CI runs format:check)
```

Data is a deterministic seeded mock (14 tools, 9 departments, 415 employees, 180 days) held in memory, so edits
(limits, approve/block) persist until the server restarts. It sits behind connector interfaces so real APIs can be swapped in.

## Part 1: The screen

`/` shows, top to bottom: KPI tiles (spend vs. budget, forecast, active users, unapproved tools, limit breaches),
the three charts, a "Needs attention" alert list, and a sortable/searchable tools table with Approve / Block / Limit actions.
Everything is wired: editing a limit or approving a tool updates every chart, KPI and alert. Filters (usage window,
category, approval status) live in the URL. `/data-sources` is Part 2 in-app.

## Part 2: API & data-source plan

No single system has the full picture, so the dashboard joins five kinds of source into one normalized usage-event model
(`date, tool, department, active users, cost`):

| Need                   | Source                                                                                    | Key endpoints / signals                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Exact cost & seats     | Vendor admin APIs: OpenAI Admin, Anthropic Admin, GitHub Copilot, MS Graph (M365 Copilot) | `/v1/organization/costs`, `/usage/completions`; `cost_report`, `usage_report/messages`; `/copilot/billing/seats`; Graph Copilot usage reports |
| Who actually uses what | Identity: Okta System Log / Entra sign-ins                                                | SSO events per app and user                                                                                                                   |
| What nobody approved   | Google Workspace Admin SDK token grants, CASB/SWG (Netskope, Zscaler)                     | OAuth grants to AI apps; traffic to Generative-AI domains                                                                                     |
| What was expensed      | Finance: Ramp / Brex / Concur                                                             | Merchant + amount per card holder (catches personal subscriptions)                                                                            |
| Who to attribute it to | HRIS: Workday / BambooHR                                                                  | User → department, cost center, termination date                                                                                              |

Policy (approved status, limits, budget) is the one dataset owned by this product. Trade-offs: vendor APIs are exact but only
cover approved tools; discovery sources cover unapproved tools but are noisy (a visit is not a purchase). Joining on
user identity from HRIS is what lets us attribute spend by department. See `src/server/connectors/` for the per-source contract.

## Part 3: The three charts

1. **Spend vs. approved limit** (bullet rows, 100% marker): answers _"are we within what we approved?"_ Scaling each row to its own
   limit makes breaches and near-misses visible without reading numbers; this is the CFO's first question.
2. **Monthly spend vs. budget** (stacked columns + budget line + forecast): answers _"where are we heading?"_ Shows growth, the
   ungoverned (unapproved) share, and when we cross budget. Columns rather than an area because the current month is partial.
3. **Shadow AI heatmap** (stacked bars): answers _"who is using AI we haven't approved?"_ The IT/security lead can target
   enablement or controls by team.

Together: _are we within limits → where is spend going → who is outside policy._ Each chart has a "Why this chart" popover.

## Structure

```
src/app            routes + API route handlers (/api/v1/*)
src/components     ui (primitives) → atoms → molecules → organisms → templates → pages
src/hooks          data fetching (TanStack Query), URL filter state (nuqs), mutations
src/schemas        zod schemas shared by API and client
src/server         connectors, seed data, in-memory store, services (business logic)
tests              service-layer tests
```

## Quality bar

- **Light theme only** by design (`color-scheme: light`; verified to ignore OS dark mode).
- **Accessibility:** WCAG 2.1 AA contrast on all text tokens, skip link, labelled regions, every chart has a Chart / Table toggle,
  status is always icon + label, toasts use live regions. axe scans (serious/critical) run in e2e for both pages.
- **Responsive:** no horizontal page scroll at 360px; filters collapse into a disclosure, row actions into a menu.
- **States:** loading skeletons, per-widget error and empty states, route-level error/not-found pages.
- **CI:** `.github/workflows/ci.yml` runs format, typecheck, lint, unit and e2e tests. E2E uses `POST /api/v1/test/reset`,
  which only works when `ENABLE_TEST_ROUTES=1`.

## Known gaps (next pass)

Real connectors + persistence (limits are in memory), auth/RBAC, multi-tenant data, Docker/deploy config.
Sanction status is applied retroactively to history.
