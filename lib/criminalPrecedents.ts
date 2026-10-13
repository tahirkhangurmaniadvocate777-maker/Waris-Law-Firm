/**
 * Static judicial precedents injected into criminal petition GROUNDS sections.
 * Do not invent PLD / SCMR citations — paste real judgment text into the stubs under
 * templates/criminal/precedents/ and fill citation + ratio below.
 *
 * Paste slots:
 * - templates/criminal/precedents/habeas_corpus_pld.md
 * - templates/criminal/precedents/further_inquiry_497_2.md
 */

export type CriminalPrecedent = {
  id: string;
  /** Full law report citation, e.g. "PLD 20XX SC XXX". Empty until pasted. */
  citation: string;
  /** Ratio decidendi / holding in pleading-ready English. Empty until pasted. */
  ratio: string;
  /** Extended registry module keys / writer type ids this precedent applies to. */
  appliesTo: readonly string[];
};

/**
 * Slot for the binding PLD (or SCMR) habeas / illegal-detention ruling.
 * Fill `citation` and `ratio` after pasting the judgment into
 * `templates/criminal/precedents/habeas_corpus_pld.md`.
 */
export const HABEAS_CORPUS_PLD_PRECEDENT: CriminalPrecedent = {
  id: "habeas-corpus-pld-pending",
  citation: "",
  ratio: "",
  appliesTo: ["criminal_habeas_corpus", "HABEAS-491"],
};

/**
 * Landmark PLD/SCMR on further inquiry under Section 497(2) Cr.P.C.
 * Paste authentic text into `templates/criminal/precedents/further_inquiry_497_2.md`,
 * then fill `citation` + `ratio` here. Leave empty — do not invent citations.
 */
export const FURTHER_INQUIRY_PRECEDENT: CriminalPrecedent = {
  id: "further-inquiry-497-2-pending",
  citation: "",
  ratio: "",
  appliesTo: ["497", "498", "further_inquiry"],
};

export const CRIMINAL_PRECEDENTS: CriminalPrecedent[] = [
  HABEAS_CORPUS_PLD_PRECEDENT,
  FURTHER_INQUIRY_PRECEDENT,
];

export function isPrecedentReady(p: CriminalPrecedent): boolean {
  return Boolean(p.citation.trim() && p.ratio.trim());
}

export function precedentsForModule(moduleKey: string): CriminalPrecedent[] {
  return CRIMINAL_PRECEDENTS.filter(
    (p) => p.appliesTo.includes(moduleKey) && isPrecedentReady(p),
  );
}

/** Pleading paragraph(s) for the GROUNDS block; empty string if no pasted judgment yet. */
export function formatPrecedentGroundsBlock(moduleKey: string): string {
  const ready = precedentsForModule(moduleKey);
  if (!ready.length) return "";
  const lines = ready.map(
    (p) =>
      `That as held in ${p.citation}, ${p.ratio.trim().replace(/^\s*Held:\s*/i, "")}`,
  );
  return ["GROUNDS:", ...lines.map((line, i) => `${i + 1}. ${line}`)].join("\n");
}

/**
 * Lines appended to bail petition GROUNDS when "Further Inquiry" is checked.
 * Uses locked citation/ratio when filled; otherwise a statute-only line (no fake case).
 */
export function furtherInquiryGroundLines(): string[] {
  if (isPrecedentReady(FURTHER_INQUIRY_PRECEDENT)) {
    const ratio = FURTHER_INQUIRY_PRECEDENT.ratio
      .trim()
      .replace(/^\s*Held:\s*/i, "");
    return [
      `That the case of the applicant calls for further inquiry within the meaning of Section 497(2) Cr.P.C.`,
      `That as held in ${FURTHER_INQUIRY_PRECEDENT.citation}, ${ratio}`,
    ];
  }
  // Statute-only until authentic citation is pasted — never invent a case name.
  return [
    "That the case of the applicant calls for further inquiry within the meaning of Section 497(2) Cr.P.C.",
  ];
}

/** Multi-line GROUNDS block for print / preview when further inquiry is selected. */
export function formatFurtherInquiryGroundsBlock(): string {
  const lines = furtherInquiryGroundLines();
  return ["GROUNDS — FURTHER INQUIRY (s.497(2) Cr.P.C.):", ...lines.map((l, i) => `${i + 1}. ${l}`)].join(
    "\n",
  );
}

/** Single injectable string for docx-templates `{grounds_precedent}` / `{pld_citations}` (may be blank). */
export function groundsPrecedentForDocx(moduleKey: string): string {
  return formatPrecedentGroundsBlock(moduleKey);
}

export function furtherInquiryPrecedentForDocx(): string {
  if (!isPrecedentReady(FURTHER_INQUIRY_PRECEDENT)) return "";
  return formatFurtherInquiryGroundsBlock();
}

export function isHabeasPrecedentReady(): boolean {
  return isPrecedentReady(HABEAS_CORPUS_PLD_PRECEDENT);
}

export function isFurtherInquiryPrecedentReady(): boolean {
  return isPrecedentReady(FURTHER_INQUIRY_PRECEDENT);
}
