import { defineConnector } from "./types";

export const workday = defineConnector({
  id: "workday",
  name: "Workday HRIS",
  category: "HRIS",
  purpose: "Maps every user to department, cost center, manager and employment status for attribution and offboarding.",
  endpoints: ["GET /ccx/api/v1/{tenant}/workers", "GET /ccx/api/v1/{tenant}/organizations"],
  auth: "ISU with OAuth refresh token",
  fields: ["workerId", "primaryWorkEmail", "supervisoryOrganization", "costCenter", "terminationDate"],
  cadence: "Daily",
  baseRecords: 415,
});
