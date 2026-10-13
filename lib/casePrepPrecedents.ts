/**
 * Case-prep precedent store for heuristic discrepancy → authority matching.
 * Keep the three user-supplied criminal citations as given.
 * For all other categories: firm rulebook / pending paste — do not invent PLD/SCMR strings.
 */

export type CasePrepPrecedent = {
  citation: string;
  court: string;
  targetFlaw: string;
  ratioDecidendi: string;
  /** Origin tag for UI / audit. */
  source?: "user_supplied" | "workspace_citation" | "firm_local_rulebook";
};

export const CASE_PREP_FLAW_KEYS = [
  "witness_contradiction",
  "recovery_memo_anomaly",
  "medical_conflict",
  "further_inquiry_497_2",
  "illegal_detention_491",
  "title_defect_sra42",
  "injunction_balance_o39",
  "boundary_conflict",
  "dower_nonpayment",
  "custody_welfare",
  "dowry_inventory_gap",
  "khasra_khewat_mismatch",
  "partition_refusal_135",
  "section_122_177_notice",
  "wealth_statement_116_gap",
] as const;

export type CasePrepFlawKey = (typeof CASE_PREP_FLAW_KEYS)[number];

export const LAW_PUBLISHER_PRECEDENTS: CasePrepPrecedent[] = [
  // —— CRIMINAL (user-supplied; keep verbatim) ——
  {
    citation: "2024 SCMR 152",
    court: "Supreme Court of Pakistan",
    targetFlaw: "witness_contradiction",
    ratioDecidendi:
      "Material contradictions between Section 161 statements and the initial FIR text regarding the mode of injury strip the prosecution of its prima facie reliability, routing benefits of doubt to the accused at the bail stage.",
    source: "user_supplied",
  },
  {
    citation: "PLD 2023 Lahore 45",
    court: "Lahore High Court",
    targetFlaw: "recovery_memo_anomaly",
    ratioDecidendi:
      "Recovery conducted in a populated area without joining independent public witnesses violates the mandatory requirements of Section 103 CrPC, rendering the recovery highly suspect and supporting further inquiry under Section 497(2) CrPC.",
    source: "user_supplied",
  },
  {
    citation: "2025 YLR 789",
    court: "Lahore High Court (Multan Bench)",
    targetFlaw: "medical_conflict",
    ratioDecidendi:
      "Where the ocular account in the FIR is directly contradicted by the dimensional measurements in the Medico-Legal Certificate (MLC), the prosecution's motive is deemed engineered, justifying intermediate discharge or acquittal.",
    source: "user_supplied",
  },
  {
    citation: "Pending PLD paste — s.497(2) further inquiry",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "further_inquiry_497_2",
    ratioDecidendi:
      "Heuristic: prolonged investigation, pending challan, or prohibitory-clause framing without a completed case diary supports arguing that the matter calls for further inquiry under Section 497(2) Cr.P.C. Paste authentic PLD/SCMR into templates/criminal/precedents/further_inquiry_497_2.md before pleading use.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Pending PLD paste — habeas / Art. 10",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "illegal_detention_491",
    ratioDecidendi:
      "Heuristic: signals of detention without lawful remand, incommunicado custody, or Article 10 / s.491 language support habeas corpus / illegal-detention framing. Paste authentic judgment into templates/criminal/precedents/habeas_corpus_pld.md before pleading use.",
    source: "firm_local_rulebook",
  },

  // —— CIVIL ——
  {
    citation: "Pending PLD paste — SRA s.42 declaratory title",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "title_defect_sra42",
    ratioDecidendi:
      "Heuristic: a declaratory / s.42 plaint that omits a coherent ownership chain (mutation, title deed, khata / proprietary link) is structurally weak. Paste authentic LHC authority into templates/civil/precedents/sra_42_declaratory_lhc.md before pleading use.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Firm Rulebook — Order 39 interim injunction balance",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "injunction_balance_o39",
    ratioDecidendi:
      "Heuristic: temporary-injunction drafts that omit prima facie case or irreparable-loss / balance-of-convenience language fail the classic Order XXXIX triad. Strengthen the application before filing.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Firm Rulebook — Boundary / khasra orientation consistency",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "boundary_conflict",
    ratioDecidendi:
      "Heuristic: conflicting north/south/east/west descriptions or khasra identifiers across plaint and revenue extract undermine identification of the suit property and invite boundary objections.",
    source: "firm_local_rulebook",
  },

  // —— FAMILY ——
  {
    citation: "Firm Rulebook — Dower / haq mehr non-payment",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "dower_nonpayment",
    ratioDecidendi:
      "Heuristic: petition text alleging unpaid dower / haq mehr without stating deferred vs prompt share, amount, or nikah-nama reference weakens the recovery prayer. Align facts with Family Courts Act pleadings.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Firm Rulebook — Custody welfare of minor",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "custody_welfare",
    ratioDecidendi:
      "Heuristic: custody pleadings that omit best-interests / welfare-of-minor analysis (age, schooling, care capacity) are incomplete for guardianship / custody relief.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Firm Rulebook — Dowry Annexure-B valuation",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "dowry_inventory_gap",
    ratioDecidendi:
      "Heuristic: Annexure-B / jahez schedules without item valuation, quantity, or description create an inventory gap that courts may treat as non-specific for recovery decrees.",
    source: "firm_local_rulebook",
  },

  // —— REVENUE ——
  {
    citation: "Firm Rulebook — Revenue Measurement Consistency",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "khasra_khewat_mismatch",
    ratioDecidendi:
      "Heuristic: khasra / khewat / khatooni / mauza / kanal-marla figures that diverge between fard and application text indicate a measurement or identity mismatch requiring reconciliation before partition or mutation relief.",
    source: "firm_local_rulebook",
  },
  {
    citation: "PLD 2019 Supreme Court 318",
    court: "Supreme Court of Pakistan",
    targetFlaw: "partition_refusal_135",
    ratioDecidendi:
      "Held: When a bona fide question of title arises in partition proceedings, the Revenue Court must hold its hands and stay proceedings until a competent Civil Court determines ownership rights. (Workspace: lib/revenueCitations.ts)",
    source: "workspace_citation",
  },

  // —— FBR / TAX ——
  {
    citation: "Firm Rulebook — FBR s.122 / s.177 notice reply",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "section_122_177_notice",
    ratioDecidendi:
      "Heuristic: Iris / withholding / s.122 or s.177 notice language without a structured reply timeline, basis of selection, or document schedule flags an incomplete FBR response file.",
    source: "firm_local_rulebook",
  },
  {
    citation: "Firm Rulebook — Wealth statement s.116 reconciliation",
    court: "SOURCE: firm_local_rulebook",
    targetFlaw: "wealth_statement_116_gap",
    ratioDecidendi:
      "Heuristic: s.116 wealth / asset statements that mention assets without reconciliation to declared income, prior year wealth, or bank/property schedules present a reconciliation gap for advisory follow-up.",
    source: "firm_local_rulebook",
  },
];

export function precedentsForFlaws(flaws: string[]): CasePrepPrecedent[] {
  const out: CasePrepPrecedent[] = [];
  for (const flaw of flaws) {
    const match = LAW_PUBLISHER_PRECEDENTS.find((p) => p.targetFlaw === flaw);
    if (match) out.push(match);
  }
  return out;
}
