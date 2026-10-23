import { defineConnector } from "./types";

export const ramp = defineConnector({
  id: "ramp",
  name: "Ramp (Spend & Expenses)",
  category: "Finance",
  purpose: "Card and expense transactions that reveal paid AI subscriptions bought outside procurement.",
  endpoints: ["GET /developer/v1/transactions", "GET /developer/v1/cards", "GET /developer/v1/users"],
  auth: "OAuth 2.0 client credentials (transactions:read)",
  fields: ["merchant_name", "amount", "card_holder.user_id", "user_transaction_time", "accounting_field_selections"],
  cadence: "Daily",
  baseRecords: 1480,
});
