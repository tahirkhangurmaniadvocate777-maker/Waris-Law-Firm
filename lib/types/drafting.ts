/**
 * Strict shared drafting contracts for Waris Law Firm tools.
 * Department writers may extend these; keep `pld_citations` optional and additive.
 */

import type { CivilSuitType } from "@/lib/civil";
import type { CriminalAppType } from "@/lib/criminal";
import type { FamilySuitType } from "@/lib/family";
import type { RevenueType } from "@/lib/revenue";

/** PLD / reported authority — plain citation string or citation + ratio. */
export type PldCitation =
  | string
  | {
      citation: string;
      ratio?: string;
    };

export type PldCitations = PldCitation[];

export function normalizePldCitations(raw: PldCitations | undefined | null): string[] {
  if (!raw?.length) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const citation = item.citation?.trim() ?? "";
      const ratio = item.ratio?.trim();
      if (!citation) return "";
      return ratio ? `${citation} — ${ratio}` : citation;
    })
    .filter(Boolean);
}

/** Numbered Grounds paragraphs for CourtPleadingPreview / TextPetition. */
export function formatPldGroundsParagraphs(citations: PldCitations | undefined | null): string[] {
  const list = normalizePldCitations(citations);
  return list.map(
    (text, index) =>
      `${index + 1}. That reliance is placed on ${text}, which supports the grounds urged herein.`,
  );
}

/* ─── Criminal Trial Referencer ─── */

export type ReferencerCategory =
  | "trial stage"
  | "CrPC/PPC section"
  | "case law"
  | "checklist"
  | "timeline note"
  | string;

export interface ReferencerEntryDTO {
  id: string;
  category: ReferencerCategory;
  sectionNumber?: string | null;
  title: string;
  keywords: string;
  shortNote: string;
  relatedSections?: string | null;
  checklistJson: string;
  updatedAt?: string;
}

export interface ReferencerSearchFilters {
  query: string;
  category: string;
}

/* ─── Criminal Applications Writer ─── */

export interface CriminalDraftingPayload {
  appType: CriminalAppType;
  courtClass: string;
  district: string;
  petitionerName: string;
  petitionerParentage: string;
  petitionerAddress: string;
  respondentName: string;
  firNumber: string;
  firDate: string;
  policeStation: string;
  sections: string;
  offenseLaw: string;
  custodyStatus: string;
  facts: string;
  grounds: string;
  prayer: string;
  lawyerName: string;
  verificationDate: string;
  /** Optional PLD / authority grounding under Grounds. */
  pld_citations?: PldCitations;
}

export const CRIMINAL_PRIMARY_DROPDOWN: CriminalAppType[] = [
  "497",
  "498",
  "249A",
  "265K",
  "court-witness",
  "WITNESS-SUMMONS",
];

/* ─── Civil Suit Writer (Order VII R.1) ─── */

export interface CivilDraftingPayload {
  suitType: CivilSuitType;
  customTitle: string;
  courtClass: string;
  district: string;
  plaintiffName: string;
  plaintiffParentage: string;
  plaintiffAddress: string;
  defendantName: string;
  defendantParentage: string;
  defendantAddress: string;
  facts: string;
  causeDate: string;
  causeEvent: string;
  suitValue: string;
  courtFee: string;
  propertyDesc: string;
  documentDesc: string;
  contractDesc: string;
  relief: string;
  lawyerName: string;
  verificationDate: string;
  pld_citations?: PldCitations;
}

/** Core Order VII dropdown ids (civil module may expose additional automate types). */
export const CIVIL_SUIT_DROPDOWN: CivilSuitType[] = [
  "declaratory",
  "injunction",
  "specific-performance",
  "possession",
  "cancellation",
  "damages",
  "urban-partition",
  "permanent-injunction-declaratory",
  "temporary-injunction-o39",
];

/* ─── Family Suit Writer ─── */

export interface AnnexureBItem {
  description: string;
  quantity?: string;
  value: string;
}

export interface FamilyDraftingPayload {
  suitType: FamilySuitType;
  courtLocation: string;
  suitNumber: string;
  plaintiffName: string;
  plaintiffRelation: string;
  plaintiffAddress: string;
  plaintiffPhone: string;
  defendantName: string;
  defendantRelation: string;
  defendantAddress: string;
  defendantPhone: string;
  marriageDate: string;
  childrenCount: string;
  childrenDetails: string;
  /** Dowry / Annexure-B line items with subtotals computed by writer. */
  annexureBItems?: AnnexureBItem[];
  lawyerName: string;
  verificationDate: string;
  pld_citations?: PldCitations;
}

export const FAMILY_TEMPLATE_DROPDOWN: FamilySuitType[] = [
  "khula",
  "dower-maintenance",
  "dowry",
  "custody",
  "restitution",
];

/* ─── Revenue Applications Writer ─── */

export interface RevenueDraftingPayload {
  appType: RevenueType;
  forum: string;
  district: string;
  tehsil: string;
  mauza: string;
  applicantName: string;
  applicantParentage: string;
  applicantAddress: string;
  respondents: string;
  khasra: string;
  share: string;
  facts: string;
  relief: string;
  lawyerName: string;
  verificationDate: string;
  pld_citations?: PldCitations;
}

export const REVENUE_APP_DROPDOWN: RevenueType[] = [
  "correction",
  "demarcation",
  "ejectment",
  "mutation",
  "agri-partition",
];

/* ─── Shared pleading preview contract ─── */

export interface CourtPleadingDraft {
  courtLine: string;
  suitLine: string;
  leftParty: string[];
  leftRole: string;
  rightParty: string[];
  rightRole: string;
  causeTitle: string;
  paragraphs: string[];
  prayerIntro: string;
  prayerItems: string[];
  signRole: string;
  lawyerName: string;
  verificationText: string;
  pld_citations?: PldCitations;
}

/* ─── Lead / usage ─── */

export interface LeadCapturePayload {
  fullName: string;
  phone: string;
  email: string;
  city?: string;
  matterType?: string;
  toolUsed?: string;
  draftType?: string;
}

export interface UsageLogPayload {
  leadId: string;
  toolUsed: string;
  draftType?: string;
}
