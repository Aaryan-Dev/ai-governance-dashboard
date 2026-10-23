import { defineConnector } from "./types";

export const m365 = defineConnector({
  id: "m365",
  name: "Microsoft Graph (M365 Copilot)",
  category: "Vendor usage & cost",
  purpose: "Copilot license assignment and per-user app activity across Teams, Word, Excel and Outlook.",
  endpoints: ["GET /beta/reports/getMicrosoft365CopilotUsageUserDetail(period='D30')", "GET /v1.0/users?$select=assignedLicenses"],
  auth: "OAuth app registration (Reports.Read.All)",
  fields: ["userPrincipalName", "lastActivityDate", "copilotChatLastActivityDate", "assignedLicenses.skuId"],
  cadence: "Daily",
  baseRecords: 3870,
});
