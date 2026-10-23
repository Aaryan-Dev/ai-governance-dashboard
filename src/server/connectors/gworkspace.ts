import { defineConnector } from "./types";

export const gworkspace = defineConnector({
  id: "gworkspace",
  name: "Google Workspace Admin SDK",
  category: "Shadow AI discovery",
  purpose: 'OAuth grants employees gave to third-party AI apps ("Sign in with Google"), the strongest shadow-AI signal.',
  endpoints: ["GET /admin/directory/v1/users/{userKey}/tokens", "GET /admin/reports/v1/activity/users/all/applications/token"],
  auth: "Domain-wide delegation service account",
  fields: ["clientId", "displayText (app name)", "scopes", "userKey", "event.name = authorize"],
  cadence: "Hourly",
  baseRecords: 6120,
});
