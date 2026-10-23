import type { Category, Sanction } from "@/schemas";

export interface Department {
  id: string;
  name: string;
  headcount: number;
}

export const DEPARTMENTS: Department[] = [
  { id: "eng", name: "Engineering", headcount: 140 },
  { id: "sales", name: "Sales", headcount: 70 },
  { id: "cs", name: "Customer Success", headcount: 45 },
  { id: "mkt", name: "Marketing", headcount: 40 },
  { id: "ops", name: "Operations", headcount: 30 },
  { id: "prod", name: "Product", headcount: 30 },
  { id: "fin", name: "Finance", headcount: 25 },
  { id: "hr", name: "People", headcount: 20 },
  { id: "legal", name: "Legal", headcount: 15 },
];

export interface ToolSeed {
  id: string;
  name: string;
  vendor: string;
  category: Category;
  sanction: Sanction;
  pricing: "seat" | "usage";
  /** Seat price per user-month, or mean usage spend per active user-month. */
  unitMonthly: number;
  /** Share of employees (before department affinity) who adopt the tool. */
  adoption: number;
  /** <1 = adopted early, >1 = adopted recently. */
  recency: number;
  /** Extra spend growth across the 180-day window (usage tools mostly). */
  growth: number;
  affinity: Partial<Record<string, number>>;
  sourceIds: string[];
  /** Monthly limit as a multiple of recent run-rate. null = no approved limit. */
  limitFactor: number | null;
}

export const TOOLS: ToolSeed[] = [
  { id: "chatgpt", name: "ChatGPT Enterprise", vendor: "OpenAI", category: "Assistant", sanction: "approved", pricing: "seat", unitMonthly: 60, adoption: 0.5, recency: 0.7, growth: 0.1, affinity: { eng: 0.9, sales: 1.2, mkt: 1.3 }, sourceIds: ["openai", "okta"], limitFactor: 1.3 },
  { id: "claude", name: "Claude Team", vendor: "Anthropic", category: "Assistant", sanction: "approved", pricing: "seat", unitMonthly: 30, adoption: 0.32, recency: 1.4, growth: 0.15, affinity: { eng: 1.5, prod: 1.3, legal: 1.2 }, sourceIds: ["anthropic", "okta"], limitFactor: 1.2 },
  { id: "copilot", name: "GitHub Copilot", vendor: "GitHub", category: "Coding", sanction: "approved", pricing: "seat", unitMonthly: 19, adoption: 0.9, recency: 0.8, growth: 0, affinity: { eng: 1.1, sales: 0, cs: 0, mkt: 0, ops: 0, fin: 0, hr: 0, legal: 0, prod: 0.25 }, sourceIds: ["github"], limitFactor: 1.15 },
  { id: "m365", name: "Microsoft 365 Copilot", vendor: "Microsoft", category: "Productivity", sanction: "approved", pricing: "seat", unitMonthly: 30, adoption: 0.28, recency: 1.1, growth: 0, affinity: { fin: 1.6, hr: 1.5, legal: 1.4, ops: 1.5, eng: 0.3 }, sourceIds: ["m365", "okta"], limitFactor: 1.08 },
  { id: "openai-api", name: "OpenAI API Platform", vendor: "OpenAI", category: "Platform / API", sanction: "approved", pricing: "usage", unitMonthly: 140, adoption: 0.2, recency: 1.0, growth: 0.9, affinity: { eng: 2.2, prod: 1.5, sales: 0.1, cs: 0.1, mkt: 0, ops: 0, fin: 0, hr: 0, legal: 0 }, sourceIds: ["openai"], limitFactor: 0.72 },
  { id: "notion", name: "Notion AI", vendor: "Notion", category: "Productivity", sanction: "approved", pricing: "seat", unitMonthly: 10, adoption: 0.45, recency: 1.0, growth: 0, affinity: { prod: 1.6, mkt: 1.3, ops: 1.2 }, sourceIds: ["okta", "ramp"], limitFactor: 1.4 },
  { id: "grammarly", name: "Grammarly Business", vendor: "Grammarly", category: "Writing", sanction: "approved", pricing: "seat", unitMonthly: 15, adoption: 0.3, recency: 0.7, growth: 0, affinity: { mkt: 1.8, cs: 1.6, sales: 1.4, hr: 1.4, eng: 0.3 }, sourceIds: ["okta", "ramp"], limitFactor: 1.35 },
  { id: "jasper", name: "Jasper", vendor: "Jasper", category: "Writing", sanction: "approved", pricing: "seat", unitMonthly: 49, adoption: 0.5, recency: 1.0, growth: 0, affinity: { mkt: 2.2, sales: 0.4, eng: 0, cs: 0, ops: 0, fin: 0, hr: 0, legal: 0, prod: 0.2 }, sourceIds: ["okta", "ramp"], limitFactor: 0.82 },
  { id: "cursor", name: "Cursor", vendor: "Anysphere", category: "Coding", sanction: "under_review", pricing: "seat", unitMonthly: 40, adoption: 0.3, recency: 2.4, growth: 0.1, affinity: { eng: 1.1, prod: 0.15, sales: 0, cs: 0, mkt: 0, ops: 0, fin: 0, hr: 0, legal: 0 }, sourceIds: ["okta", "ramp", "netskope"], limitFactor: 1.05 },
  { id: "gemini", name: "Google Gemini", vendor: "Google", category: "Assistant", sanction: "under_review", pricing: "seat", unitMonthly: 20, adoption: 0.2, recency: 1.7, growth: 0, affinity: { sales: 1.4, mkt: 1.4, ops: 1.2 }, sourceIds: ["gworkspace", "okta"], limitFactor: 1.3 },
  { id: "perplexity", name: "Perplexity Pro", vendor: "Perplexity", category: "Assistant", sanction: "unsanctioned", pricing: "seat", unitMonthly: 20, adoption: 0.12, recency: 1.5, growth: 0.1, affinity: { sales: 1.6, mkt: 1.5, fin: 1.2, legal: 1.2 }, sourceIds: ["ramp", "netskope", "gworkspace"], limitFactor: null },
  { id: "midjourney", name: "Midjourney", vendor: "Midjourney", category: "Image & Media", sanction: "unsanctioned", pricing: "usage", unitMonthly: 35, adoption: 0.3, recency: 1.2, growth: 0.3, affinity: { mkt: 1.7, prod: 0.8, eng: 0.05, sales: 0.1, cs: 0, ops: 0, fin: 0, hr: 0, legal: 0 }, sourceIds: ["ramp", "netskope"], limitFactor: null },
  { id: "otter", name: "Otter.ai", vendor: "Otter", category: "Meetings", sanction: "unsanctioned", pricing: "seat", unitMonthly: 17, adoption: 0.14, recency: 1.0, growth: 0, affinity: { sales: 1.8, cs: 1.8, hr: 1.2, eng: 0.4 }, sourceIds: ["gworkspace", "ramp", "netskope"], limitFactor: null },
  { id: "elevenlabs", name: "ElevenLabs", vendor: "ElevenLabs", category: "Image & Media", sanction: "unsanctioned", pricing: "usage", unitMonthly: 45, adoption: 0.12, recency: 2.0, growth: 0.6, affinity: { mkt: 2.5, prod: 1.3, eng: 0.3, sales: 0, cs: 0, ops: 0, fin: 0, hr: 0, legal: 0 }, sourceIds: ["ramp", "netskope"], limitFactor: null },
];
