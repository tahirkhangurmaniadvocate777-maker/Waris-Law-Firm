/**
 * Shared payload shape for injectable case-law citations.
 * Used by civil automate (and the same shape is prepared for criminal).
 */
export type CaseLawCitationsPayload = {
  /** Optional citations injected into grounds / prayer of templates. */
  case_law_citations?: string[];
};

/** Normalize raw JSON / textarea input into a clean citation list. */
export function normalizeCaseLawCitations(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/\r?\n|;/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

/** Pleading-ready GROUNDS block; empty string when no citations. */
export function formatCaseLawGroundsBlock(citations: string[]): string {
  if (!citations.length) return "";
  return citations
    .map(
      (citation, index) =>
        `${index + 1}. That as held in ${citation}, the plaintiff / applicant is entitled to the relief claimed.`,
    )
    .join("\n");
}

/** Short prayer-side reliance clause; empty when no citations. */
export function formatCaseLawPrayerBlock(citations: string[]): string {
  if (!citations.length) return "";
  return `Reliance is also placed on the following authorities: ${citations.join("; ")}.`;
}
