import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  const res = await request.post("/api/v1/test/reset");
  expect(res.ok()).toBe(true);
});

const kpis = (page: Page) => page.getByRole("region", { name: "Key metrics" }).or(page.locator('section[aria-label="Key metrics"]'));

async function openOverview(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "All AI tools" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shadow AI heatmap" })).toBeVisible();
}

test("overview shows KPIs and the three charts", async ({ page }) => {
  await openOverview(page);
  for (const name of ["Spend vs. approved limit", "Monthly spend vs. budget", "Shadow AI heatmap"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await expect(kpis(page).getByText("AI spend, last 30 days")).toBeVisible();
  await expect(kpis(page).getByText(/^\d+ over$/)).toBeVisible();
  await expect(page.locator(".recharts-responsive-container svg").first()).toBeVisible();
});

test("editing a limit from the chart updates KPIs and confirms with a toast", async ({ page }) => {
  await openOverview(page);
  await expect(kpis(page).getByText("2 over", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /OpenAI API Platform: .*Edit limit/ }).click();
  await page.getByLabel("Approved monthly limit (USD)").fill("30000");
  await page.getByRole("button", { name: "Save limit" }).click();
  await expect(page.getByRole("status").filter({ hasText: "OpenAI API Platform limit set to $30,000/month." })).toBeVisible();
  await expect(kpis(page).getByText("1 over", { exact: true })).toBeVisible();
});

test("approving an unapproved tool removes it from the heatmap", async ({ page }) => {
  await openOverview(page);
  const heatmap = page.locator("table", { has: page.getByText("Active users per department and unapproved tool") });
  await expect(heatmap.getByRole("columnheader", { name: /Midjourney/ })).toBeVisible();
  await page.getByRole("button", { name: "Approve Midjourney" }).click();
  await expect(heatmap.getByRole("columnheader", { name: /Midjourney/ })).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: "Midjourney approved." })).toBeVisible();
});

test("filters live in the URL and survive a reload", async ({ page }) => {
  await openOverview(page);
  await page.getByLabel("Category").selectOption("Coding");
  await expect(page).toHaveURL(/category=Coding/);
  await page.reload();
  await expect(page.getByLabel("Category")).toHaveValue("Coding");
  await expect(page.getByRole("region", { name: "All AI tools" }).locator("tbody tr")).toHaveCount(2);
});

test("the time range drives spend, trend span and usage", async ({ page }) => {
  await openOverview(page);
  const kpiSpend = kpis(page).getByText(/^AI spend, last \d+ days$/);
  const trend = page.getByRole("region", { name: "Monthly spend vs. budget" });
  const trendColumns = trend.locator(".recharts-xAxis .recharts-cartesian-axis-tick");
  const spendValue = () =>
    kpis(page)
      .locator("p", { hasText: /^\$[\d,]+$/ })
      .first()
      .innerText();

  await expect(kpiSpend).toHaveText("AI spend, last 30 days");
  await expect(trendColumns).toHaveCount(3);
  const spend30 = await spendValue();

  await page.getByLabel("Time range").selectOption("90");
  await expect(page).toHaveURL(/period=90/);
  await expect(kpis(page).getByText("AI spend, last 90 days")).toBeVisible();
  await expect(trendColumns).toHaveCount(4);
  await expect.poll(spendValue).not.toBe(spend30);

  await page.getByLabel("Time range").selectOption("180");
  await expect(kpis(page).getByText("AI spend, last 180 days")).toBeVisible();
  await expect(kpis(page).getByText("No earlier period to compare")).toBeVisible();
  await expect(trendColumns).toHaveCount(6);
  await expect(page.getByRole("heading", { name: "Shadow AI heatmap" })).toBeVisible();
  await expect(page.getByText("Users active in the last 180 days")).toBeVisible();
});

test("every chart has an accessible table view", async ({ page }) => {
  await openOverview(page);
  const card = page.getByRole("region", { name: "Monthly spend vs. budget" });
  await card.getByRole("button", { name: "Table", exact: true }).click();
  await expect(card.getByRole("table", { name: "Monthly AI spend by approval status against budget" })).toBeVisible();
  await card.getByRole("button", { name: "Chart", exact: true }).click();
  await expect(card.locator(".recharts-responsive-container")).toBeVisible();
});

test("data sources page lists connectors and can sync one", async ({ page }) => {
  await page.goto("/data-sources");
  await expect(page.getByRole("heading", { name: "Okta System Log" })).toBeVisible();
  await page.getByRole("group", { name: "Okta System Log" }).getByRole("button", { name: "Sync now" }).click();
  await expect(page.getByRole("group", { name: "Okta System Log" }).getByText(/records/)).toBeVisible();
});

test("unknown routes render the not-found page", async ({ page }) => {
  await page.goto("/nope");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("always renders the light theme, even under OS dark mode", async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: "dark", baseURL: "http://localhost:3100" });
  const page = await ctx.newPage();
  await page.goto("/");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(249, 249, 247)");
  await ctx.close();
});

for (const path of ["/", "/data-sources"]) {
  test(`no horizontal page scroll on a phone: ${path}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, baseURL: "http://localhost:3100" });
    const page = await ctx.newPage();
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await ctx.close();
  });

  test(`no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}
