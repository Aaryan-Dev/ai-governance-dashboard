import { defineConnector } from "./types";

export const openai = defineConnector({
  id: "openai",
  name: "OpenAI Admin API",
  category: "Vendor usage & cost",
  purpose: "Exact seats, tokens and cost for ChatGPT Enterprise and the API platform, per user and project.",
  endpoints: ["GET /v1/organization/usage/completions", "GET /v1/organization/costs", "GET /v1/organization/users"],
  auth: "Admin API key (Bearer)",
  fields: ["project_id", "user_id", "model", "input_tokens", "output_tokens", "amount.value", "bucket start_time"],
  cadence: "Hourly",
  baseRecords: 18420,
});
