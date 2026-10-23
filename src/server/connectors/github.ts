import { defineConnector } from "./types";

export const github = defineConnector({
  id: "github",
  name: "GitHub Copilot",
  category: "Vendor usage & cost",
  purpose: "Copilot seat assignment, last activity date and acceptance metrics by team.",
  endpoints: ["GET /orgs/{org}/copilot/billing/seats", "GET /orgs/{org}/copilot/metrics"],
  auth: "GitHub App / PAT (manage_billing:copilot)",
  fields: ["assignee.login", "last_activity_at", "last_activity_editor", "plan_type", "total_active_users"],
  cadence: "Daily",
  baseRecords: 2150,
});
