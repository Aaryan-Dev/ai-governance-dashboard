import { defineConnector } from "./types";

export const okta = defineConnector({
  id: "okta",
  name: "Okta System Log",
  category: "Identity / SSO",
  purpose: "Who signs in to which AI application with a corporate identity; the source of truth for active users.",
  endpoints: ["GET /api/v1/logs?filter=eventType eq \"user.authentication.sso\"", "GET /api/v1/apps"],
  auth: "API token (okta.logs.read)",
  fields: ["actor.alternateId", "target.displayName (app)", "published", "client.ipAddress", "outcome.result"],
  cadence: "Every 15 min",
  baseRecords: 41200,
});
