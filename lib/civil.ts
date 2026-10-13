import {
  formatCaseLawGroundsBlock,
  formatCaseLawPrayerBlock,
  normalizeCaseLawCitations,
} from "@/lib/caseLawCitations";
import { CIVIL_SUIT_OPTIONS } from "@/lib/civilOptions";
import {
  buildDeclaratoryGroundsSection,
  declaratoryDefaultAuthorityStatus,
  formatDeclaratoryDefaultGroundsBlock,
  isDeclaratoryLhcPrecedentReady,
} from "@/lib/civilPrecedents";
import { firm, FIRM_METADATA } from "@/lib/firm";
import {
  documentGenerationDate,
  legalCounselFooter,
} from "@/lib/firmCounsel";
import {
  formatLongDate,
  formatPkr,
  suitYear,
  textOrBlank,
  todayIso,
} from "@/lib/format";

export type CivilSuitType =
  | "declaratory"
  | "permanent-injunction-declaratory"
  | "temporary-injunction-o39"
  | "injunction"
  | "specific-performance"
  | "possession"
  | "cancellation"
  | "damages"
  | "urban-partition"
  | "other";

/** Automate modules that POST to `/api/v1/automate/civil`. */
export type CivilAutomateType =
  | "permanent-injunction-declaratory"
  | "temporary-injunction-o39";

export const CIVIL_AUTOMATE_TYPES: CivilAutomateType[] = [
  "permanent-injunction-declaratory",
  "temporary-injunction-o39",
];

export function isCivilAutomateType(value: string): value is CivilAutomateType {
  return (CIVIL_AUTOMATE_TYPES as string[]).includes(value);
}

export const civilSuitOptions: { id: CivilSuitType; label: string }[] = [
  {
    id: "permanent-injunction-declaratory",
    label:
      "Plaint — Permanent Injunction & Declaratory Suit (Specific Relief Act)",
  },
  {
    id: "temporary-injunction-o39",
    label:
      "Application — Temporary Injunction (Order 39 Rules 1 & 2 CPC)",
  },
  { id: "declaratory", label: "Declaratory suit (Sec. 42 SRA 1877)" },
  {
    id: "injunction",
    label: "Permanent / mandatory injunction (Sec. 53–55 SRA)",
  },
  {
    id: "specific-performance",
    label: "Specific performance of contract (Sec. 12 SRA)",
  },
  { id: "possession", label: "Possession & mesne profits (Sec. 8/9 SRA)" },
  { id: "cancellation", label: "Cancellation of documents (Sec. 39 SRA)" },
  { id: "damages", label: "Suit for damages / torts" },
  {
    id: "urban-partition",
    label: "Urban / built-up partition (Partition Act 1893)",
  },
  { id: "other", label: "Other / custom suit title" },
];

/** Strict land/property boundary fields — non-blank before .docx generate. */
export const PROPERTY_BOUNDARY_REQUIRED_FIELDS = [
  "property_address",
  "boundary_north",
  "boundary_south",
  "boundary_east",
  "boundary_west",
  "khasra_khewat",
  "area_measurement",
  "ownership_basis",
] as const;

export type PropertyBoundaryField =
  (typeof PROPERTY_BOUNDARY_REQUIRED_FIELDS)[number];

export const PROPERTY_BOUNDARY_LABELS: Record<PropertyBoundaryField, string> = {
  property_address: "Property address / situation",
  boundary_north: "Boundary — North",
  boundary_south: "Boundary — South",
  boundary_east: "Boundary — East",
  boundary_west: "Boundary — West",
  khasra_khewat: "Khasra / Khewat / Khata (or N/A)",
  area_measurement: "Area / measurement",
  ownership_basis: "Ownership / title basis",
};

export type CivilForm = {
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
  /** Land / property description (required for injunction automate). */
  property_address: string;
  boundary_north: string;
  boundary_south: string;
  boundary_east: string;
  boundary_west: string;
  khasra_khewat: string;
  area_measurement: string;
  ownership_basis: string;
  /** Optional extra authorities (one per line); same shape prepared for criminal. */
  case_law_citations: string[];
  /** Multiline textarea mirror for optional PLD / YLR extras. */
  pld_citations_text: string;
  /** Pending suit reference (temporary injunction). */
  pendingSuitNumber: string;
  pendingSuitTitle: string;
  threatenedAct: string;
  primaFacieCase: string;
  irreparableInjury: string;
  balanceOfConvenience: string;
};

export function emptyCivilForm(): CivilForm {
  return {
    suitType: "permanent-injunction-declaratory",
    customTitle: "",
    courtClass: "Civil Judge Class-I",
    district: firm.defaultCourt,
    plaintiffName: "",
    plaintiffParentage: "",
    plaintiffAddress: "",
    defendantName: "",
    defendantParentage: "",
    defendantAddress: "",
    facts: "",
    causeDate: "",
    causeEvent: "",
    suitValue: "",
    courtFee: "",
    propertyDesc: "",
    documentDesc: "",
    contractDesc: "",
    relief: "",
    lawyerName: firm.advocate,
    verificationDate: todayIso(),
    property_address: "",
    boundary_north: "",
    boundary_south: "",
    boundary_east: "",
    boundary_west: "",
    khasra_khewat: "",
    area_measurement: "",
    ownership_basis: "",
    case_law_citations: [],
    pld_citations_text: "",
    pendingSuitNumber: "",
    pendingSuitTitle: "",
    threatenedAct: "",
    primaFacieCase: "",
    irreparableInjury: "",
    balanceOfConvenience: "",
  };
}

export function needsPropertyBoundaryValidation(suitType: CivilSuitType): boolean {
  return (
    suitType === "permanent-injunction-declaratory" ||
    suitType === "temporary-injunction-o39"
  );
}

export function usesDeclaratoryDefaultGrounds(suitType: CivilSuitType): boolean {
  return (
    suitType === "declaratory" ||
    suitType === "permanent-injunction-declaratory"
  );
}

export function resolvedCaseLawCitations(form: CivilForm): string[] {
  const fromArray = normalizeCaseLawCitations(form.case_law_citations);
  const fromText = normalizeCaseLawCitations(form.pld_citations_text);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of [...fromArray, ...fromText]) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

export function validatePropertyBoundaries(
  form: Pick<CivilForm, PropertyBoundaryField>,
): { ok: true } | { ok: false; missingFields: PropertyBoundaryField[] } {
  const missingFields = PROPERTY_BOUNDARY_REQUIRED_FIELDS.filter(
    (field) => !String(form[field] ?? "").trim(),
  );
  if (missingFields.length) {
    return { ok: false, missingFields };
  }
  return { ok: true };
}

function suitTitle(form: CivilForm) {
  switch (form.suitType) {
    case "permanent-injunction-declaratory":
      return "SUIT FOR DECLARATION AND PERMANENT INJUNCTION UNDER THE SPECIFIC RELIEF ACT, 1877";
    case "temporary-injunction-o39":
      return "APPLICATION FOR TEMPORARY INJUNCTION UNDER ORDER XXXIX RULES 1 AND 2 OF THE CODE OF CIVIL PROCEDURE, 1908";
    case "declaratory":
      return "SUIT FOR DECLARATION UNDER SECTION 42 OF THE SPECIFIC RELIEF ACT, 1877";
    case "injunction":
      return "SUIT FOR PERMANENT / MANDATORY INJUNCTION";
    case "specific-performance":
      return "SUIT FOR SPECIFIC PERFORMANCE OF CONTRACT";
    case "possession":
      return "SUIT FOR POSSESSION AND MESNE PROFITS";
    case "cancellation":
      return "SUIT FOR CANCELLATION OF DOCUMENTS";
    case "damages":
      return "SUIT FOR DAMAGES";
    case "urban-partition":
      return "SUIT FOR PARTITION OF URBAN / BUILT-UP PROPERTY";
    default:
      return textOrBlank(form.customTitle || "SUIT FOR _______________");
  }
}

function propertyScheduleParagraph(form: CivilForm): string {
  const address =
    form.property_address.trim() || form.propertyDesc.trim() || textOrBlank("");
  return (
    `That the suit / subject property is situated at ${textOrBlank(address)}, ` +
    `measuring ${textOrBlank(form.area_measurement)}, comprised in Khasra/Khewat/Khata ` +
    `${textOrBlank(form.khasra_khewat)}, bounded as under: North — ${textOrBlank(form.boundary_north)}; ` +
    `South — ${textOrBlank(form.boundary_south)}; East — ${textOrBlank(form.boundary_east)}; ` +
    `West — ${textOrBlank(form.boundary_west)}. The plaintiff's ownership / title is based on ` +
    `${textOrBlank(form.ownership_basis)}.`
  );
}

function groundsParagraphs(form: CivilForm): string[] {
  const extras = resolvedCaseLawCitations(form);
  const out: string[] = [];

  if (usesDeclaratoryDefaultGrounds(form.suitType)) {
    const section = buildDeclaratoryGroundsSection({
      extraCitations: extras,
      includeStatuteAnchor: true,
    });
    if (section) {
      for (const line of section.split("\n")) {
        if (line.trim()) out.push(line.trim());
      }
    }
    return out;
  }

  if (extras.length) {
    out.push("GROUNDS:");
    const block = formatCaseLawGroundsBlock(extras);
    for (const line of block.split("\n")) {
      if (line.trim()) out.push(line.trim());
    }
  }
  return out;
}

export type CivilDraft = {
  courtLine: string;
  suitLine: string;
  leftParty: string[];
  leftRole: string;
  rightParty: string[];
  rightRole: string;
  causeTitle: string;
  shewethLabel?: string;
  paragraphs: string[];
  prayerHeading?: string;
  prayerIntro: string;
  prayerItems: string[];
  prayerOutro?: string;
  signRole: string;
  lawyerName: string;
  lawyerLines?: string[];
  verificationText: string;
  /** Flat body for CourtPleadingPreview. */
  previewContent: string;
  /** UI status for Sec. 42 default authority. */
  defaultAuthorityStatus: string;
};

function buildPermanentInjunctionDeclaratoryDraft(form: CivilForm): CivilDraft {
  const year = suitYear(form.verificationDate);
  const title = suitTitle(form);
  const paragraphs = [
    `1. That the plaintiff is ${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}, resident of ${textOrBlank(form.plaintiffAddress)}, and the defendant is ${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}, resident of ${textOrBlank(form.defendantAddress)}.`,
    `2. That the material facts giving rise to this suit are that ${textOrBlank(form.facts)}.`,
    `3. ${propertyScheduleParagraph(form)}`,
    `4. That the defendant has denied or clouded the plaintiff's legal character / right to the said property and threatens acts of interference, alienation, and/or dispossession.`,
    `5. That the cause of action accrued on ${formatLongDate(form.causeDate)} when ${textOrBlank(form.causeEvent)}, and continues within the territorial jurisdiction of this Honorable Court.`,
    `6. That this Honorable Court has territorial and pecuniary jurisdiction to try the present suit.`,
    `7. That the suit is valued at PKR ${formatPkr(form.suitValue)} for the purposes of jurisdiction and court fee, and proper court fee of PKR ${formatPkr(form.courtFee)} has been affixed.`,
    "8. That the plaintiff has not filed any other suit regarding the same cause of action.",
  ];

  paragraphs.push(...groundsParagraphs(form));

  const extras = resolvedCaseLawCitations(form);
  const prayerCitation = formatCaseLawPrayerBlock(extras);
  const prayerDefault =
    form.relief.trim() ||
    "A decree of declaration of the plaintiff's title / legal character in respect of the suit property, and a decree of permanent injunction restraining the defendant, agents, and servants from interfering with the plaintiff's possession, alienating, or otherwise dealing with the suit property.";

  const prayerItems = [
    prayerDefault,
    "Costs of the suit may also be awarded.",
    "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
  ];
  if (prayerCitation) prayerItems.splice(1, 0, prayerCitation);

  const draftBase = {
    courtLine: `IN THE COURT OF ${textOrBlank(form.courtClass)}, ${textOrBlank(form.district)}`,
    suitLine: `Civil Suit No. ___________ / ${year}`,
    leftParty: [
      `${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}`,
      `Resident of: ${textOrBlank(form.plaintiffAddress)}`,
    ],
    leftRole: "PLAINTIFF",
    rightParty: [
      `${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}`,
      `Resident of: ${textOrBlank(form.defendantAddress)}`,
    ],
    rightRole: "DEFENDANT",
    causeTitle: title,
    paragraphs,
    prayerIntro:
      "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favour of the plaintiff against the defendant for:",
    prayerItems,
    signRole: "PLAINTIFF",
    lawyerName: textOrBlank(form.lawyerName),
    verificationText: `Verified on Oath at ${textOrBlank(form.district)} on this ${formatLongDate(form.verificationDate)}, that the contents of the foregoing paragraphs are true and correct to the best of my knowledge and belief, and the rest are based on information received. List of Documents and Address Form shall be filed as required.`,
    defaultAuthorityStatus: declaratoryDefaultAuthorityStatus(),
  };

  return {
    ...draftBase,
    previewContent: flattenCivilDraft(draftBase),
  };
}

function buildTemporaryInjunctionDraft(form: CivilForm): CivilDraft {
  const year = suitYear(form.verificationDate);
  const title = suitTitle(form);
  const suitRef =
    form.pendingSuitNumber.trim() ||
    `Civil Suit No. ___________ / ${year}`;
  const suitTitleLine =
    form.pendingSuitTitle.trim() ||
    "Suit for Declaration and Permanent Injunction";

  const paragraphs = [
    `1. That the applicant / plaintiff is ${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}, resident of ${textOrBlank(form.plaintiffAddress)}, and the respondent / defendant is ${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}, resident of ${textOrBlank(form.defendantAddress)}.`,
    `2. That the applicant has filed / is prosecuting ${textOrBlank(suitRef)} titled ${textOrBlank(suitTitleLine)} before this Honorable Court.`,
    `3. ${propertyScheduleParagraph(form)}`,
    `4. That the respondent threatens to ${textOrBlank(form.threatenedAct || form.causeEvent)}.`,
    `5. That the applicant has a strong prima facie case in as much as ${textOrBlank(form.primaFacieCase || form.facts)}.`,
    `6. That if the temporary injunction is not granted, the applicant shall suffer irreparable injury, namely ${textOrBlank(form.irreparableInjury)}.`,
    `7. That the balance of convenience lies in favour of the applicant because ${textOrBlank(form.balanceOfConvenience)}.`,
    `8. That the cause of action accrued on ${formatLongDate(form.causeDate)} when ${textOrBlank(form.causeEvent)}, and continues.`,
    "9. That this application is made bona fide and in the interest of justice under Order XXXIX Rules 1 and 2 of the Code of Civil Procedure, 1908.",
  ];

  const extras = resolvedCaseLawCitations(form);
  if (extras.length) {
    paragraphs.push("GROUNDS:");
    for (const line of formatCaseLawGroundsBlock(extras).split("\n")) {
      if (line.trim()) paragraphs.push(line.trim());
    }
  }

  const prayerDefault =
    form.relief.trim() ||
    "Restrain the respondent, agents, and servants, by way of temporary injunction under Order XXXIX Rules 1 and 2 CPC, from interfering with the applicant's possession, alienating, transferring, charging, or changing the nature of the suit property pending disposal of the main suit.";

  const prayerItems = [
    prayerDefault,
    "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
  ];
  const prayerCitation = formatCaseLawPrayerBlock(extras);
  if (prayerCitation) prayerItems.splice(1, 0, prayerCitation);

  const draftBase = {
    courtLine: `IN THE COURT OF ${textOrBlank(form.courtClass)}, ${textOrBlank(form.district)}`,
    suitLine: `${textOrBlank(suitRef)}\n(In re: ${textOrBlank(suitTitleLine)})`,
    leftParty: [
      `${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}`,
      `Resident of: ${textOrBlank(form.plaintiffAddress)}`,
    ],
    leftRole: "APPLICANT / PLAINTIFF",
    rightParty: [
      `${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}`,
      `Resident of: ${textOrBlank(form.defendantAddress)}`,
    ],
    rightRole: "RESPONDENT / DEFENDANT",
    causeTitle: title,
    shewethLabel: "Respectfully Sheweth:",
    paragraphs,
    prayerHeading: "PRAYER",
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems,
    signRole: "APPLICANT",
    lawyerName: textOrBlank(form.lawyerName),
    verificationText: `Verified on Oath at ${textOrBlank(form.district)} on this ${formatLongDate(form.verificationDate)}, that the contents of this application are true and correct to the best of my knowledge and belief.`,
    defaultAuthorityStatus: "",
  };

  return {
    ...draftBase,
    previewContent: flattenCivilDraft(draftBase),
  };
}

function flattenCivilDraft(draft: Omit<CivilDraft, "previewContent" | "defaultAuthorityStatus"> & {
  defaultAuthorityStatus?: string;
}): string {
  const lines = [
    draft.courtLine,
    "",
    draft.suitLine,
    "",
    ...draft.leftParty,
    `… ${draft.leftRole}`,
    "",
    "VERSUS",
    "",
    ...draft.rightParty,
    `… ${draft.rightRole}`,
    "",
    draft.causeTitle,
    "",
    draft.shewethLabel ?? "RESPECTFULLY SHEWETH:",
    "",
    ...draft.paragraphs,
    "",
    draft.prayerHeading ?? "PRAYER:",
    draft.prayerIntro,
    ...draft.prayerItems.map((item) => `• ${item}`),
    "",
    draft.signRole,
    "Through:",
    draft.lawyerName,
    "",
    "VERIFICATION",
    draft.verificationText,
  ];
  return lines.join("\n");
}

export function buildCivilDraft(form: CivilForm): CivilDraft {
  if (form.suitType === "permanent-injunction-declaratory") {
    return buildPermanentInjunctionDeclaratoryDraft(form);
  }
  if (form.suitType === "temporary-injunction-o39") {
    return buildTemporaryInjunctionDraft(form);
  }

  const year = suitYear(form.verificationDate);
  const title = suitTitle(form);
  const paragraphs = [
    `1. That the plaintiff is ${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}, resident of ${textOrBlank(form.plaintiffAddress)}, and the defendant is ${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}, resident of ${textOrBlank(form.defendantAddress)}.`,
    `2. That the material facts giving rise to this suit are that ${textOrBlank(form.facts)}.`,
  ];

  if (form.suitType === "specific-performance") {
    paragraphs.push(
      `3. That the parties entered into an agreement whereby ${textOrBlank(form.contractDesc)}.`,
    );
  } else if (form.suitType === "cancellation") {
    paragraphs.push(
      `3. That the impugned document/instrument is ${textOrBlank(form.documentDesc)}, which is liable to be cancelled.`,
    );
  } else if (
    form.suitType === "possession" ||
    form.suitType === "urban-partition" ||
    form.suitType === "declaratory" ||
    form.suitType === "injunction"
  ) {
    paragraphs.push(
      `3. That the suit property is ${textOrBlank(form.propertyDesc || form.property_address)}.`,
    );
  } else {
    paragraphs.push(
      `3. That the dispute between the parties relates to ${textOrBlank(form.propertyDesc || form.contractDesc || form.documentDesc || "the subject matter stated above")}.`,
    );
  }

  paragraphs.push(
    `4. That the cause of action accrued on ${formatLongDate(form.causeDate)} when ${textOrBlank(form.causeEvent)}, and continues within the territorial jurisdiction of this Honorable Court.`,
    `5. That this Honorable Court has territorial and pecuniary jurisdiction to try the present suit.`,
    `6. That the suit is valued at PKR ${formatPkr(form.suitValue)} for the purposes of jurisdiction and court fee, and proper court fee of PKR ${formatPkr(form.courtFee)} has been affixed.`,
    "7. That the plaintiff has not filed any other suit regarding the same cause of action.",
  );

  paragraphs.push(...groundsParagraphs(form));

  const extras = resolvedCaseLawCitations(form);
  const prayerDefault =
    form.relief.trim() ||
    (form.suitType === "urban-partition"
      ? "A preliminary decree defining shares, appointment of Local Commission if required, and a final decree for partition / sale proceeds."
      : "The relief claimed in the cause title may graciously be granted.");

  const prayerItems = [
    prayerDefault,
    "Costs of the suit may also be awarded.",
    "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
  ];
  const prayerCitation = formatCaseLawPrayerBlock(extras);
  if (prayerCitation) prayerItems.splice(1, 0, prayerCitation);

  const draftBase = {
    courtLine: `IN THE COURT OF ${textOrBlank(form.courtClass)}, ${textOrBlank(form.district)}`,
    suitLine: `Civil Suit No. ___________ / ${year}`,
    leftParty: [
      `${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffParentage)}`,
      `Resident of: ${textOrBlank(form.plaintiffAddress)}`,
    ],
    leftRole: "PLAINTIFF",
    rightParty: [
      `${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantParentage)}`,
      `Resident of: ${textOrBlank(form.defendantAddress)}`,
    ],
    rightRole: "DEFENDANT",
    causeTitle: title,
    paragraphs,
    prayerIntro:
      "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favour of the plaintiff against the defendant for:",
    prayerItems,
    signRole: "PLAINTIFF",
    lawyerName: textOrBlank(form.lawyerName),
    verificationText: `Verified on Oath at ${textOrBlank(form.district)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 7 are true and correct to the best of my knowledge and belief, and the rest are based on information received. List of Documents and Address Form shall be filed as required.`,
    defaultAuthorityStatus: usesDeclaratoryDefaultGrounds(form.suitType)
      ? declaratoryDefaultAuthorityStatus()
      : "",
  };

  return {
    ...draftBase,
    previewContent: flattenCivilDraft(draftBase),
  };
}

/** Snake_case payload for docx-templates createReport. */
export function civilFormToTemplateData(form: CivilForm): Record<string, string> {
  const extras = resolvedCaseLawCitations(form);
  const defaultGrounds = formatDeclaratoryDefaultGroundsBlock();
  const groundsSection = buildDeclaratoryGroundsSection({
    extraCitations: extras,
    includeStatuteAnchor: true,
  });
  const caseLawGrounds = formatCaseLawGroundsBlock(extras);
  const caseLawPrayer = formatCaseLawPrayerBlock(extras);

  return {
    court_class: form.courtClass,
    district: form.district,
    plaintiff_name: form.plaintiffName,
    plaintiff_parentage: form.plaintiffParentage,
    plaintiff_address: form.plaintiffAddress,
    defendant_name: form.defendantName,
    defendant_parentage: form.defendantParentage,
    defendant_address: form.defendantAddress,
    facts: form.facts,
    cause_date: form.causeDate ? formatLongDate(form.causeDate) : form.causeDate,
    cause_event: form.causeEvent,
    suit_value: form.suitValue,
    court_fee: form.courtFee,
    relief: form.relief,
    lawyer_name: form.lawyerName || firm.advocate,
    verification_date: form.verificationDate
      ? formatLongDate(form.verificationDate)
      : form.verificationDate,
    property_address: form.property_address,
    boundary_north: form.boundary_north,
    boundary_south: form.boundary_south,
    boundary_east: form.boundary_east,
    boundary_west: form.boundary_west,
    khasra_khewat: form.khasra_khewat,
    area_measurement: form.area_measurement,
    ownership_basis: form.ownership_basis,
    pending_suit_number: form.pendingSuitNumber,
    pending_suit_title: form.pendingSuitTitle,
    threatened_act: form.threatenedAct,
    prima_facie_case: form.primaFacieCase,
    irreparable_injury: form.irreparableInjury,
    balance_of_convenience: form.balanceOfConvenience,
    case_law_grounds: caseLawGrounds,
    case_law_prayer: caseLawPrayer,
    declaratory_default_grounds: defaultGrounds,
    grounds_section: groundsSection,
    pld_citations_joined: extras.join("; "),
    legal_counsel_footer: legalCounselFooter(),
    document_generation_date: documentGenerationDate(),
    suit_year: suitYear(form.verificationDate),
    lhc_precedent_ready: isDeclaratoryLhcPrecedentReady() ? "yes" : "no",
  };
}

export const CIVIL_DOCX_FILENAMES: Record<CivilAutomateType, string> = {
  "permanent-injunction-declaratory":
    "Plaint-Permanent-Injunction-Declaratory-Suit.docx",
  "temporary-injunction-o39":
    "Application-Temporary-Injunction-Order39-Rules1-2.docx",
};

export const CIVIL_TEMPLATE_PATHS: Record<CivilAutomateType, string> = {
  "permanent-injunction-declaratory":
    "templates/civil/permanent_injunction_declaratory.docx",
  "temporary-injunction-o39":
    "templates/civil/temporary_injunction_o39_r1_r2.docx",
};

/* ─── Order VII plaint builder (print canvas — no .docx required) ─── */

export type CivilPlaintData = {
  suit_type_id: string;
  court_forum: string;
  district: string;
  plaintiff_name: string;
  plaintiff_cnic: string;
  plaintiff_address: string;
  plaintiff_phone: string;
  defendant_name: string;
  defendant_address: string;
  property_description: string;
  facts_paragraphs: string[];
  cause_of_action_date: string;
  suit_valuation: string;
  court_fee_paid: string;
};

export function emptyCivilPlaintData(): CivilPlaintData {
  return {
    suit_type_id: "declaratory",
    court_forum: "Civil Judge Class I",
    district: firm.defaultCourt,
    plaintiff_name: "",
    plaintiff_cnic: "",
    plaintiff_address: "",
    plaintiff_phone: "",
    defendant_name: "",
    defendant_address: "",
    property_description: "",
    facts_paragraphs: [],
    cause_of_action_date: "",
    suit_valuation: "15,000",
    court_fee_paid: "15",
  };
}

export function buildCivilPlaintDraft(data: CivilPlaintData): string {
  const selectedSuit = CIVIL_SUIT_OPTIONS.find((s) => s.id === data.suit_type_id);
  const statuteName = selectedSuit
    ? selectedSuit.statute
    : "Code of Civil Procedure, 1908";
  const titleOfSuit = selectedSuit
    ? selectedSuit.label.toUpperCase()
    : "SUIT FOR CIVIL RELIEF";

  const customFacts = data.facts_paragraphs
    .map((para) => para.trim())
    .filter(Boolean);
  const customFactsBlock = customFacts
    .map((para, index) => `${index + 3}. ${para}`)
    .join("\n\n");

  const causeIdx = customFacts.length + 3;
  const jurisdictionIdx = customFacts.length + 4;
  const valuationIdx = customFacts.length + 5;

  const groundsSection =
    data.suit_type_id === "declaratory"
      ? buildDeclaratoryGroundsSection({ includeStatuteAnchor: true })
      : "";

  const groundsBlock = groundsSection
    ? `\n\n${groundsSection}\n`
    : "\n";

  const verifyDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const counselName = FIRM_METADATA.advocateName;
  const counselTitle = FIRM_METADATA.title;
  const counselFirm =
    FIRM_METADATA.firmName.split("/")[0]?.trim() || FIRM_METADATA.firmName;

  return `
IN THE COURT OF THE HONOURABLE ${data.court_forum.toUpperCase()}, 
AT ${data.district.toUpperCase()}

Civil Suit No. ___________ of ${new Date().getFullYear()}

1. ${(data.plaintiff_name || "_______________").toUpperCase()}, CNIC: ${data.plaintiff_cnic || "xxxxx-xxxxxxx-x"}, r/o ${data.plaintiff_address || "_______________"}. Cell: ${data.plaintiff_phone || "_______________"}
                                                        ...PLAINTIFF

                                    VERSUS

1. ${(data.defendant_name || "_______________").toUpperCase()}, r/o ${data.defendant_address || "_______________"}.
                                                        ...DEFENDANT

${titleOfSuit} UNDER ${statuteName.toUpperCase()}

Respectfully Sheweth:

1. That the subject matter of the present suit is the immovable property described as: ${data.property_description || "_______________"}.

2. ${selectedSuit?.defaultFacts ?? "That the material facts giving rise to this suit are as under."}

${customFactsBlock ? `${customFactsBlock}\n` : ""}${groundsBlock}
${causeIdx}. Cause of Action: That the cause of action accrued in favor of the Plaintiff against the Defendant on ${data.cause_of_action_date || "_______________"}, when the Defendant explicitly refused to accept the legitimate requests of the Plaintiff, necessitating this suit.

${jurisdictionIdx}. Jurisdiction Clause: That the subject property is situated at ${data.district || "_______________"}, and all transactions and assertions took place within the territorial boundaries of this Honourable Court. Hence, this Court has the absolute jurisdiction to adjudicate this suit.

${valuationIdx}. Valuation & Court Fee: That the value of the suit for the purposes of court fee and pecuniary jurisdiction is fixed at Rs. ${data.suit_valuation || "_______________"}/-, upon which a court fee of Rs. ${data.court_fee_paid || "_______________"}/- has been affixed/processed in accordance with the Court Fees Act 1870.

PRAYER:

It is most respectfully prayed that this Honourable Court may graciously be pleased to pass a decree in favor of the Plaintiff against the Defendant for:

a) ${selectedSuit?.defaultPrayer ?? "The relief claimed in the cause title may graciously be granted."}

b) Any other consequential or alternative reliefs which this Honourable Court deems fit, equitable, and proper may also be granted to meet the ends of absolute justice.

PLAINTIFF
Through:

${counselName}
${counselTitle}
${counselFirm}, District Courts, ${data.district || firm.defaultCourt}

VERIFICATION:
Verified on oath at ${data.district || firm.defaultCourt} on this ${verifyDate}, that the contents of paragraphs 1 to ${causeIdx} are true to the best of my personal knowledge, and the content of paragraphs ${jurisdictionIdx} to ${valuationIdx} are believed correct based on legal advice.

PLAINTIFF
  `.trim();
}
