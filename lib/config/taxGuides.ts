/**
 * FBR / SECP Practice Hub — REGULATORY_REGISTRY is the source of truth.
 * Educational procedural guides only; not a substitute for filing advice.
 */

export type TaskItem = {
  name: string;
  desc: string;
};

export type GuideSchema = {
  id: string;
  title: string;
  portalName: string;
  portalUrl: string;
  lawContext: string;
  checklist: TaskItem[];
  /** Short label for tab switchers */
  tabLabel: string;
};

export type RegulatoryRegistryId = "fbr_iris" | "secp_ezfile" | "partnership_aop";

export const REGULATORY_REGISTRY: Record<RegulatoryRegistryId, GuideSchema> = {
  fbr_iris: {
    id: "fbr_iris",
    title: "FBR Iris 2.0 Income Tax Filing Suite",
    portalName: "IRIS 2.0 Official Portal",
    portalUrl: "https://iris.fbr.gov.pk",
    lawContext: "Income Tax Ordinance, 2001 (Section 114 / Section 116 Wealth Statement)",
    tabLabel: "FBR Tax",
    checklist: [
      {
        name: "Bank Transaction Summary",
        desc: "Acquire certified annual bank statements spanning July 1st to June 30th.",
      },
      {
        name: "Withholding Tax Certificates",
        desc: "Gather tax deduction slips for utility bills, mobile phone cards, and vehicle registrations.",
      },
      {
        name: "Salary / Revenue Evidence",
        desc: "Collect corporate salary certificates (Form 149) or commercial business supply invoices.",
      },
      {
        name: "Wealth Reconciliation Data",
        desc: "List all local real estate assets, gold holdings in tolas, and active cash balances to reconcile balance sheets to zero.",
      },
    ],
  },
  secp_ezfile: {
    id: "secp_ezfile",
    title: "SECP eZfile Private Limited Incorporation",
    portalName: "SECP eZfile / eServices",
    portalUrl: "https://eservices.secp.gov.pk",
    lawContext: "Companies Act, 2017 & Subordinate Regulations",
    tabLabel: "SECP Corporate",
    checklist: [
      {
        name: "Name Reservation Request",
        desc: "Propose three distinctive alternative corporate titles for official name reservation clearance.",
      },
      {
        name: "Constitutional Drafting",
        desc: "Compile the formal Memorandum of Association (MoA) and Articles of Association (AoA) tracking company objectives.",
      },
      {
        name: "Statutory Forms Filing",
        desc: "Complete and authorize Form 1 (Incorporation), Form 21 (Registered Office Address), and Form 29 (Director Particulars).",
      },
      {
        name: "Identity Authentication",
        desc: "Upload scanned copies of high-resolution CNICs for all designated initial corporate directors.",
      },
    ],
  },
  partnership_aop: {
    id: "partnership_aop",
    title: "Partnership Firm / Association of Persons (AOP)",
    portalName: "District Registrar Office / FBR Registry",
    portalUrl: "https://fbr.gov.pk",
    lawContext: "Partnership Act, 1932 & Income Tax Rules",
    tabLabel: "AOP Firms",
    checklist: [
      {
        name: "Partnership Deed Drafting",
        desc: "Execute a partnership agreement on non-judicial stamp paper detailing profit/loss ratios.",
      },
      {
        name: "Registrar Registration",
        desc: "Submit Form A, Form B, and Form C to the local District Registrar of Firms to obtain the registration certificate.",
      },
      {
        name: "AOP NTN Creation",
        desc: "Log onto FBR Iris as a principal representative to voluntarily register the new AOP partnership entity.",
      },
    ],
  },
};

/** @deprecated Prefer REGULATORY_REGISTRY.fbr_iris — kept for older imports. */
export const FBR_IRIS_CHECKLIST = {
  title: "FBR Income Tax Return Filing Checklist (Sec. 114)",
  portalLink: REGULATORY_REGISTRY.fbr_iris.portalUrl,
  requiredDocuments: REGULATORY_REGISTRY.fbr_iris.checklist.map((t) => `${t.name}: ${t.desc}`),
} as const;

/** @deprecated Prefer REGULATORY_REGISTRY.secp_ezfile — kept for older imports. */
export const SECP_INCORPORATION_CHECKLIST = {
  title: "SECP Private Limited Company Registration",
  portalLink: REGULATORY_REGISTRY.secp_ezfile.portalUrl,
  proceduralSteps: REGULATORY_REGISTRY.secp_ezfile.checklist.map((t, i) => ({
    step: i + 1,
    name: t.name,
    description: t.desc,
  })),
} as const;

export type FbrIrisChecklist = typeof FBR_IRIS_CHECKLIST;
export type SecpIncorporationChecklist = typeof SECP_INCORPORATION_CHECKLIST;
export type SecpProceduralStep = SecpIncorporationChecklist["proceduralSteps"][number];
export type TaxGuidePortalLink = string;

/** Official research portals (plan §11.D) — open in new tabs; no login from this site. */
export const RESEARCH_PORTAL_LINKS = [
  { label: "Income Tax / SROs", href: "https://www.fbr.gov.pk" },
  { label: "Sales Tax / STGOs", href: "https://www.fbr.gov.pk" },
  { label: "IRIS manuals / SOPs", href: "https://e.fbr.gov.pk" },
  { label: "Companies Act / Regulations", href: "https://www.secp.gov.pk" },
  { label: "Official Gazette", href: "https://www.pcp.gov.pk" },
] as const;

/** Hub route used by practice-area CTAs and the drafting portal sidebar. */
export const FBR_SECP_HUB_PATH = "/tools/fbr-secp-practice" as const;

export const TAX_GUIDES_DISCLAIMER =
  "Procedural guidance only. These checklists and portal links are not a substitute for filing advice, tax computation, or authorised e-filing on IRIS / eZfile.";

export const REGULATORY_SECURITY_DISCLAIMER =
  "This workspace portal functions explicitly as an advisory checklist and tracking utility. To preserve financial safety, this website does not retain private portal passwords, authentication PIN keys, or transaction logs. All filings must be executed independently on the root FBR / SECP institutional server setups.";
