const DAY = 86_400_000;

export const toIso = (d: Date) => d.toISOString().slice(0, 10);
export const parseIso = (s: string) => new Date(`${s}T00:00:00Z`);
export const addDays = (s: string, n: number) => toIso(new Date(parseIso(s).getTime() + n * DAY));
export const monthKey = (s: string) => s.slice(0, 7);
export const daysInMonth = (s: string) => {
  const d = parseIso(s);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
};
export const dayOfMonth = (s: string) => Number(s.slice(8, 10));
export const prevMonthKey = (key: string, back = 1) => {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 - back, 1));
  return toIso(d).slice(0, 7);
};
export const monthLabel = (key: string) =>
  parseIso(`${key}-01`).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
export const today = () => toIso(new Date());
