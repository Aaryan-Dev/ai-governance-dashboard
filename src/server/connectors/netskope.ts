import { defineConnector } from "./types";

export const netskope = defineConnector({
  id: "netskope",
  name: "Netskope CASB / SWG",
  category: "Shadow AI discovery",
  purpose: "Web traffic to AI domains (including unauthenticated and personal-account use) with the app's risk score.",
  endpoints: ["GET /api/v2/events/data/page", "GET /api/v2/events/data/application"],
  auth: "REST API v2 token",
  fields: ["user", "app", "category (Generative AI)", "cci (confidence index)", "bytes_uploaded", "timestamp"],
  cadence: "Hourly",
  baseRecords: 88400,
});
