export const BLANK = "_______________";

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function textOrBlank(value: string) {
  const trimmed = value.trim();
  return trimmed || BLANK;
}

export function formatLongDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return textOrBlank(iso);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return BLANK;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPkr(raw: string) {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) return BLANK;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount)) return cleaned;
  return amount.toLocaleString("en-PK");
}

export function suitYear(verificationDate: string) {
  const match = /^(\d{4})/.exec(verificationDate.trim());
  return match?.[1] ?? String(new Date().getFullYear());
}

export function parseAmount(raw: string) {
  const amount = Number(raw.replace(/,/g, "").trim());
  return Number.isFinite(amount) ? amount : 0;
}

/** @deprecated Prefer ensureLeadThenLog from @/lib/logToolUsage for print gates. */
export async function logUsage(tool: string, draftType: string) {
  const { ensureLeadThenLog } = await import("@/lib/logToolUsage");
  return ensureLeadThenLog({ toolUsed: tool, draftType });
}
