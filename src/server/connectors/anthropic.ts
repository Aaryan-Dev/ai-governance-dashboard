import { defineConnector } from "./types";

export const anthropic = defineConnector({
  id: "anthropic",
  name: "Anthropic Admin API",
  category: "Vendor usage & cost",
  purpose: "Claude seat assignments plus token usage and cost by workspace and API key.",
  endpoints: ["GET /v1/organizations/usage_report/messages", "GET /v1/organizations/cost_report", "GET /v1/organizations/users"],
  auth: "Admin API key (x-api-key)",
  fields: ["workspace_id", "api_key_id", "model", "uncached_input_tokens", "output_tokens", "cost", "starting_at"],
  cadence: "Hourly",
  baseRecords: 9310,
});
