/**
 * Canonical public website copy for Waris Law Firm.
 * Marketing pages and `lib/firm.ts` derive contact / practice data from here.
 */

export type OfficeLocation = {
  /** WGS84 latitude (Quaid-E-Azam Block, District Courts, D.G. Khan). */
  lat: number;
  /** WGS84 longitude. */
  lng: number;
  /** Map zoom level for embeds. */
  zoom: number;
  label: string;
};

export type FirmMetadata = {
  advocateName: string;
  title: string;
  firmName: string;
  officeAddress: string;
  officeLocation: OfficeLocation;
  phones: readonly [string, string, ...string[]];
  emails: readonly [string, string, ...string[]];
};

export type PracticeAreaContent = {
  slug: string;
  title: string;
  summary: string;
  details: string;
};

export const FIRM_METADATA: FirmMetadata = {
  advocateName: "Muhammad Tahir Khan Gurmani",
  title: "Advocate High Court",
  firmName: "Waris Law Firm / Waris Law Office",
  officeAddress:
    "Office No. 40, Ground Floor, Quaid-E-Azam Block, District Courts, Dera Ghazi Khan",
  officeLocation: {
    lat: 30.050473,
    lng: 70.629697,
    zoom: 17,
    label: "Waris Law Office — Quaid-E-Azam Block, District Courts, Dera Ghazi Khan",
  },
  phones: ["0334-7744739", "0300-1652953"],
  emails: [
    "warislawofficedbadgk@gmail.com",
    "muhammadtahirkhangurmaniadvocatedbadgk@outlook.com",
    "tahirkhangurmaniadvocate777@gmail.com",
  ],
};

export const PRACTICE_AREAS_TEXT: readonly PracticeAreaContent[] = [
  {
    slug: "criminal-law",
    title: "Criminal Law & Defence",
    summary:
      "Full-spectrum criminal defence before Magistrate, Sessions, and appellate forums — from FIR and bail stages through trial, acquittal applications, appeals, and revisions under the Cr.P.C. and PPC.",
    details:
      "Waris Law Firm represents accused persons and complainants in cognizable and non-cognizable matters across Dera Ghazi Khan and allied districts. The chambers handle post-arrest bail under section 497 Cr.P.C., anticipatory / pre-arrest directions under section 498, applications for acquittal under sections 249-A and 265-K, summoning of witnesses, property release on Superdari (516-A), private complaints under section 200, appeals against conviction, and criminal revisions. Trial strategy includes careful reading of the FIR and challan, challenge to defective charges, cross-examination planning, and stage-wise applications matched to the prosecution record. Clients also receive guidance through the Criminal Trial Referencer and print-ready criminal application drafts prepared for filing after professional review.",
  },
  {
    slug: "civil-law",
    title: "Civil Litigation (CPC 1908)",
    summary:
      "Order VII plaints and civil remedies under the Code of Civil Procedure, 1908 and the Specific Relief Act, 1877 — declaration, injunction, specific performance, possession, cancellation of documents, damages, and urban partition.",
    details:
      "Civil practice covers suits for declaration under section 42 of the Specific Relief Act, permanent and mandatory injunctions, temporary injunctions under Order XXXIX Rules 1 and 2 CPC, specific performance of contracts, recovery of possession and mesne profits, cancellation of instruments, tortious damages, and partition of urban / built-up property. Pleadings are structured to the mandatory contents of Order VII Rule 1 CPC — parties, cause of action, jurisdiction, valuation, court fee, and prayer — with verification and counsel endorsement for chamber filing. Temporary and permanent injunction modules emphasise property boundaries, prima facie case, irreparable injury, and balance of convenience. Drafts produced through the Civil Suit Writer remain subject to advocate review before presentation in the Civil Courts at Dera Ghazi Khan.",
  },
  {
    slug: "family-law",
    title: "Family & Matrimonial Disputes",
    summary:
      "Family Court litigation for dissolution of marriage / Khula, recovery of dower and maintenance, dowry articles with Annexure-B schedules, custody of minors under the Guardians and Wards Act, and restitution of conjugal rights.",
    details:
      "The firm appears before the Family Court in suits for dissolution of marriage and Khula, recovery of prompt and deferred dower (Mahr), past and future maintenance for the wife and minors, recovery of dowry articles and bridal gifts supported by itemised Annexure-B inventories with category subtotals, custody and guardianship applications under section 25 of the Guardians and Wards Act, 1890, and restitution of conjugal rights. Pleadings address Nikahnama terms, desertion or cruelty narratives, means of the respondent, educational expenses of minors, and territorial jurisdiction based on the wife’s residence. Print-ready family plaints and Annexure-B schedules are available through the Family Suit Writer for review and filing at the District Courts, Dera Ghazi Khan.",
  },
  {
    slug: "revenue-law",
    title: "Land Revenue & Agricultural Partition",
    summary:
      "Land Revenue Act, 1967 practice before Tehsildar, Assistant Commissioner, and Collector — correction of revenue record, demarcation (Hadd Bandi), ejectment / possession, mutation disputes, and partition of agricultural land under section 135.",
    details:
      "Revenue matters include applications for correction of entries under sections 45 and 53 of the Land Revenue Act, 1967, demarcation / Hadd Bandi under section 117, ejectment and possession under sections 85 and 122, mutation (Intiqal) controversies under section 42, and partition of agricultural holdings as Sharik-e-Khata under section 135 culminating in Naksha Alif, Be, and Jeem and the Instrument of Partition under section 145. Proceedings typically rely on Fard Malkiyat / Jamabandi, Khasra Girdawari, and Aksi Shajra, with field verification by Patwari or Kanungo and appellate / revisional remedies under sections 161–164. Where title is genuinely disputed, stay under section 141 and reference to the Civil Court may be required. The Revenue Applications Writer preserves structured drafts for these forums, including agricultural partition forms.",
  },
  {
    slug: "tax-corporate",
    title: "FBR Corporate & Tax Advisory",
    summary:
      "Practical guidance on FBR IRIS income-tax and sales-tax compliance, wealth statements, Active Taxpayer List status, and SECP eZfile corporate formation / return workflows for clients and chambers staff.",
    details:
      "Advisory work covers Income Tax Return filing under section 114 through FBR IRIS 2.0, Wealth Statement obligations under section 116, matching of sales-tax IMS Annex-A and Annex-C, PSID generation and e-Payments, ATL verification for reduced withholding rates, and exemption certificate practice under sections 153 and 159 where applicable. On the corporate side, the chambers guide SECP eZfile steps for company name reservation, incorporation (Private Limited / SMC / Public Limited), MoA and AoA preparation, and ongoing statutory filings. The FBR / SECP Practice Hub on this website consolidates checklists and official portal links; it does not replace authorised e-filing or professional tax computation for complex assessments.",
  },
] as const;

export type PracticeAreaSlug = (typeof PRACTICE_AREAS_TEXT)[number]["slug"];

export function getPracticeAreaBySlug(slug: string): PracticeAreaContent | undefined {
  return PRACTICE_AREAS_TEXT.find((area) => area.slug === slug);
}

/** Digits-only local number for tel: / WhatsApp deep links. */
export function phoneToDigits(display: string): string {
  return display.replace(/\D/g, "");
}

export function phoneToTelHref(display: string): string {
  const digits = phoneToDigits(display);
  return digits.startsWith("92") ? `+${digits}` : `+92${digits.replace(/^0/, "")}`;
}

export function phoneToWhatsApp(display: string): string {
  const digits = phoneToDigits(display);
  return digits.startsWith("92") ? digits : `92${digits.replace(/^0/, "")}`;
}
