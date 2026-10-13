/**
 * Default grounding authorities for Civil Suit Writer.
 * Do not invent PLD / YLR / SCMR / LHC citations — paste authentic text into
 * templates/civil/precedents/sra_42_declaratory_lhc.md and fill citation + ratio below.
 */

import {
  formatCaseLawGroundsBlock,
  normalizeCaseLawCitations,
} from "@/lib/caseLawCitations";

export type CivilPrecedent = {
  id: string;
  /** Full law report citation, e.g. "PLD 20XX Lahore XXX". Empty until pasted. */
  citation: string;
  /** Ratio decidendi / holding in pleading-ready English. Empty until pasted. */
  ratio: string;
  /** Markdown paste slot on disk. */
  sourcePath: string;
  /** Suit / automate types that auto-inject this precedent under Grounds. */
  appliesTo: readonly string[];
};

/**
 * Slot for the binding Lahore High Court Sec. 42 Specific Relief Act ruling
 * (declaratory suits). Fill after pasting the judgment into
 * `templates/civil/precedents/sra_42_declaratory_lhc.md`.
 */
export const DECLARATORY_SRA42_LHC_PRECEDENT: CivilPrecedent = {
  id: "sra-42-declaratory-lhc-pending",
  citation: "",
  ratio: "",
  sourcePath: "templates/civil/precedents/sra_42_declaratory_lhc.md",
  appliesTo: ["declaratory", "permanent-injunction-declaratory"],
};

export const CIVIL_PRECEDENTS: CivilPrecedent[] = [DECLARATORY_SRA42_LHC_PRECEDENT];

export function isDeclaratoryLhcPrecedentReady(): boolean {
  return Boolean(
    DECLARATORY_SRA42_LHC_PRECEDENT.citation.trim() &&
      DECLARATORY_SRA42_LHC_PRECEDENT.ratio.trim(),
  );
}

/** Ready precedents for a suit / automate type (citation + ratio both filled). */
export function civilPrecedentsForType(suitType: string): CivilPrecedent[] {
  return CIVIL_PRECEDENTS.filter(
    (p) =>
      p.appliesTo.includes(suitType) && p.citation.trim() && p.ratio.trim(),
  );
}

/**
 * Default GROUNDS block for Sec. 42 declaratory drafts.
 * Returns empty string until the LHC paste slot is filled — never fabricates case names.
 */
export function formatDeclaratoryDefaultGroundsBlock(): string {
  const ready = civilPrecedentsForType("declaratory");
  if (!ready.length) return "";
  const lines = ready.map(
    (p) =>
      `That as held by the Hon'ble Lahore High Court in ${p.citation}, ${p.ratio.trim().replace(/^\s*Held:\s*/i, "")}`,
  );
  return lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
}

/**
 * Full Grounds section for declaratory / permanent-injunction-declaratory drafts:
 * statute anchor + default LHC block (when ready) + optional form citations.
 */
export function buildDeclaratoryGroundsSection(options?: {
  extraCitations?: string[] | string;
  includeStatuteAnchor?: boolean;
}): string {
  const includeStatute = options?.includeStatuteAnchor !== false;
  const parts: string[] = [];

  if (includeStatute) {
    parts.push(
      "That the plaintiff is entitled to a declaration under Section 42 of the Specific Relief Act, 1877, the legal character and/or right to property asserted herein being denied or clouded by the defendant.",
    );
  }

  const defaultBlock = formatDeclaratoryDefaultGroundsBlock();
  if (defaultBlock) {
    parts.push(defaultBlock);
  }

  const extras = normalizeCaseLawCitations(options?.extraCitations ?? []);
  const extraBlock = formatCaseLawGroundsBlock(extras);
  if (extraBlock) {
    parts.push(extraBlock);
  }

  if (!parts.length) return "";
  return ["GROUNDS:", ...parts].join("\n");
}

/** Status line for the Civil Suit Writer UI (never invents a citation string). */
export function declaratoryDefaultAuthorityStatus(): string {
  if (isDeclaratoryLhcPrecedentReady()) {
    return `Default LHC Sec. 42 authority: ${DECLARATORY_SRA42_LHC_PRECEDENT.citation}`;
  }
  return `Default LHC Sec. 42 authority: pending paste → ${DECLARATORY_SRA42_LHC_PRECEDENT.sourcePath}`;
}
