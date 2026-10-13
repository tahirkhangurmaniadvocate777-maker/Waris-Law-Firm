import type { CriminalAppType, CriminalForm } from "@/lib/criminal";
import { offenseLaws } from "@/lib/criminal";

export type FieldKind = "text" | "textarea" | "date" | "time" | "select" | "checkbox";

export type ModuleFieldDef = {
  key: keyof CriminalForm;
  label: string;
  kind?: FieldKind;
  placeholder?: string;
  /** Grid span hint: 1–4 columns in a 4-col row. */
  span?: 1 | 2 | 3 | 4;
  options?: { value: string; label: string }[];
};

export type ModuleMeta = {
  badge: string;
  tone: "indigo" | "amber" | "emerald" | "rose";
  title: string;
  description: string;
  submitLabel: string;
  fields: ModuleFieldDef[];
};

const counselFields: ModuleFieldDef[] = [
  { key: "lawyerName", label: "Advocate", span: 2 },
  { key: "verificationDate", label: "Verification date", kind: "date", span: 2 },
];

const courtCityPs: ModuleFieldDef[] = [
  { key: "courtTitle", label: "Court title / tier", span: 2 },
  { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
  { key: "policeStation", label: "Police station", span: 2 },
];

const firBlock: ModuleFieldDef[] = [
  { key: "firNo", label: "FIR number", span: 2 },
  { key: "firDate", label: "FIR date", kind: "date", span: 2 },
  { key: "offenses", label: "Offense sections", span: 2, placeholder: "e.g. 302, 34 PPC" },
  {
    key: "offenseLaw",
    label: "Offense law",
    kind: "select",
    span: 2,
    options: offenseLaws.map((l) => ({ value: l, label: l })),
  },
];

const petitionerCore: ModuleFieldDef[] = [
  { key: "petitionerName", label: "Petitioner / applicant name", span: 2 },
  { key: "petitionerFather", label: "Father's / parentage name", span: 2 },
  { key: "petitionerAddress", label: "Address", kind: "textarea", span: 4 },
];

export const criminalModuleMeta: Record<CriminalAppType, ModuleMeta> = {
  "22A-22B": {
    badge: "Criminal Procedure Code",
    tone: "indigo",
    title: "Application for Direction to Register an FIR (Sec. 22-A/B)",
    description:
      "Fill the particulars below. Preview updates live; generate downloads a .docx petition.",
    submitLabel: "Generate FIR Direction Document",
    fields: [
      { key: "district", label: "Court city", span: 1, placeholder: "Dera Ghazi Khan" },
      { key: "policeStation", label: "Police station", span: 1 },
      { key: "policeSubdivision", label: "Police subdivision / circle", span: 1 },
      { key: "petitionerName", label: "Petitioner name", span: 2 },
      { key: "petitionerFather", label: "Petitioner parentage", span: 2 },
      { key: "petitionerAddress", label: "Petitioner address", kind: "textarea", span: 2 },
      { key: "petitionerCity", label: "Petitioner city", span: 2 },
      { key: "respondent2Name", label: "Proposed accused name", span: 2 },
      { key: "respondent2Father", label: "Proposed accused parentage", span: 2 },
      { key: "respondent2Address", label: "Proposed accused address", kind: "textarea", span: 4 },
      { key: "incidentDate", label: "Occurrence date", kind: "date", span: 1 },
      { key: "incidentTime", label: "Occurrence time", kind: "time", span: 1 },
      { key: "offenses", label: "Offense sections", span: 1, placeholder: "e.g. 379, 411 PPC" },
      { key: "visitDate", label: "Approach date (to SHO)", kind: "date", span: 1 },
      {
        key: "offenseDescription",
        label: "Offense description",
        kind: "textarea",
        span: 4,
        placeholder: "Brief narrative of the cognizable offense…",
      },
      { key: "courtTitle", label: "Court title", span: 2 },
      ...counselFields,
    ],
  },

  "EXEMPT-ADJOURN": {
    badge: "Procedural Motion",
    tone: "amber",
    title: "Application for Exemption from Personal Appearance",
    description:
      "Exemption from appearance and adjournment of the trial case. Preview updates live.",
    submitLabel: "Generate Exemption Document",
    fields: [
      { key: "courtTitle", label: "Court tier name", span: 2, placeholder: "ILLAQA MAGISTRATE" },
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      {
        key: "caseTitle",
        label: "Case title",
        span: 4,
        placeholder: "State VERSUS [Accused Name]",
      },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "policeStation", label: "Police station", span: 2 },
      {
        key: "suddenEmergencyReason",
        label: "Sudden emergency reason",
        kind: "textarea",
        span: 4,
        placeholder: "e.g. sudden illness / family emergency…",
      },
      { key: "petitionerName", label: "Applicant name (if different)", span: 2 },
      { key: "petitionerFather", label: "Applicant parentage", span: 2 },
      ...counselFields,
    ],
  },

  "516A": {
    badge: "Property Custody",
    tone: "emerald",
    title: "Application for Release on Superdari (Sec. 516-A)",
    description: "Release of seized property on Superdari against surety.",
    submitLabel: "Generate Superdari Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "accusedName", label: "Accused / State case name", span: 2 },
      ...petitionerCore,
      { key: "propertyType", label: "Property type", span: 2, placeholder: "motorcycle / vehicle" },
      { key: "propertyDescription", label: "Property description", kind: "textarea", span: 2 },
      { key: "chassisNumber", label: "Chassis number", span: 2 },
      { key: "engineNumber", label: "Engine number", span: 2 },
      ...counselFields,
    ],
  },

  NBW: {
    badge: "Arrest Process",
    tone: "rose",
    title: "Application for Non-Bailable Arrest Warrants",
    description: "NBW for absconding accused nominated in the FIR.",
    submitLabel: "Generate NBW Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "complainantName", label: "Complainant name", span: 2 },
      { key: "accusedName", label: "Absconding accused name", span: 4 },
      ...counselFields,
    ],
  },

  "497": {
    badge: "Bail",
    tone: "indigo",
    title: "Bail Application u/s 497 Cr.P.C. (Post-Arrest)",
    description:
      "Post-arrest bail petition. Tick Further Inquiry to inject the s.497(2) GROUNDS block (and PLD/SCMR once pasted).",
    submitLabel: "Generate Bail Document",
    fields: [
      ...courtCityPs,
      ...firBlock,
      ...petitionerCore,
      { key: "complainantName", label: "Complainant name", span: 2 },
      { key: "complainantFather", label: "Complainant father's name", span: 2 },
      { key: "arrestDate", label: "Arrest date", kind: "date", span: 2 },
      { key: "jailName", label: "Jail name", span: 2 },
      {
        key: "furtherInquiry",
        label: "Further Inquiry (s.497(2) Cr.P.C.) — inject precedent GROUNDS",
        kind: "checkbox",
        span: 4,
      },
      {
        key: "pldCitations",
        label: "PLD / SCMR citations (optional free text)",
        kind: "textarea",
        span: 4,
        placeholder: "Printed only when Further Inquiry is checked…",
      },
      { key: "extraGrounds", label: "Additional ground (optional)", kind: "textarea", span: 4 },
      ...counselFields,
    ],
  },

  "498": {
    badge: "Bail Directions",
    tone: "indigo",
    title: "Application u/s 498 Cr.P.C.",
    description:
      "Bail directions under section 498. Optional Further Inquiry GROUNDS under s.497(2) principle.",
    submitLabel: "Generate 498 Document",
    fields: [
      ...courtCityPs,
      ...firBlock,
      ...petitionerCore,
      { key: "complainantName", label: "Complainant name", span: 2 },
      { key: "complainantFather", label: "Complainant father's name", span: 2 },
      {
        key: "furtherInquiry",
        label: "Further Inquiry (s.497(2) Cr.P.C.) — inject precedent GROUNDS",
        kind: "checkbox",
        span: 4,
      },
      {
        key: "pldCitations",
        label: "PLD / SCMR citations (optional free text)",
        kind: "textarea",
        span: 4,
        placeholder: "Printed only when Further Inquiry is checked…",
      },
      { key: "extraGrounds", label: "Additional ground (optional)", kind: "textarea", span: 4 },
      ...counselFields,
    ],
  },

  "249A": {
    badge: "Acquittal",
    tone: "emerald",
    title: "Application u/s 249-A Cr.P.C. for Acquittal",
    description: "Acquittal before Magistrate where charge is groundless.",
    submitLabel: "Generate 249-A Document",
    fields: [
      ...courtCityPs,
      ...firBlock,
      { key: "petitionerName", label: "Applicant / accused name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "accusedName", label: "Case accused caption name", span: 4 },
      { key: "groundless", label: "Groundless charge", kind: "checkbox", span: 2 },
      { key: "noMaterial", label: "No incriminating material", kind: "checkbox", span: 2 },
      { key: "zeroConviction", label: "Zero probability of conviction", kind: "checkbox", span: 2 },
      { key: "extraGrounds", label: "Additional ground", kind: "textarea", span: 4 },
      ...counselFields,
    ],
  },

  "265K": {
    badge: "Acquittal",
    tone: "emerald",
    title: "Application u/s 265-K Cr.P.C. for Acquittal",
    description: "Acquittal before Sessions Court where charge is groundless.",
    submitLabel: "Generate 265-K Document",
    fields: [
      ...courtCityPs,
      ...firBlock,
      { key: "petitionerName", label: "Applicant / accused name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "accusedName", label: "Case accused caption name", span: 4 },
      { key: "groundless", label: "Groundless charge", kind: "checkbox", span: 2 },
      { key: "noMaterial", label: "No incriminating material", kind: "checkbox", span: 2 },
      { key: "zeroConviction", label: "Zero probability of conviction", kind: "checkbox", span: 2 },
      { key: "extraGrounds", label: "Additional ground", kind: "textarea", span: 4 },
      ...counselFields,
    ],
  },

  "491-552": {
    badge: "Habeas Corpus Style",
    tone: "rose",
    title: "Recovery of Minor Detenue (Sec. 491 r/w 552)",
    description: "Immediate recovery and restoration of a minor from illegal detention.",
    submitLabel: "Generate 491/552 Document",
    fields: [
      { key: "courtTitle", label: "Court title", span: 2 },
      { key: "district", label: "District / court city", span: 2 },
      { key: "policeStation", label: "Police station", span: 4 },
      { key: "petitionerName", label: "Petitioner name (parent)", span: 2 },
      {
        key: "parentRole",
        label: "Petitioner is",
        kind: "select",
        span: 2,
        options: [
          { value: "father", label: "Father of the minor" },
          { value: "mother", label: "Mother of the minor" },
        ],
      },
      { key: "petitionerFather", label: "Father's / husband's name", span: 2 },
      { key: "petitionerCaste", label: "Caste", span: 2 },
      { key: "petitionerAddress", label: "Address", kind: "textarea", span: 4 },
      { key: "minorName", label: "Minor's name", span: 2 },
      { key: "minorAge", label: "Age (years)", span: 2 },
      { key: "incidentDate", label: "Incident date", kind: "date", span: 2 },
      { key: "incidentTime", label: "Incident time", span: 2, placeholder: "e.g. 04:00 P.M." },
      { key: "visitDate", label: "Visit / demand date", kind: "date", span: 4 },
      { key: "respondent2Name", label: "Respondent No. 2 name", span: 2 },
      { key: "respondent2Father", label: "Respondent No. 2 father", span: 2 },
      { key: "respondent2Caste", label: "Respondent No. 2 caste", span: 2 },
      { key: "respondent2Address", label: "Respondents' address", kind: "textarea", span: 2 },
      { key: "respondent3Name", label: "Respondent No. 3 name", span: 2 },
      { key: "respondent3Father", label: "Respondent No. 3 father", span: 2 },
      { key: "respondent3Caste", label: "Respondent No. 3 caste", span: 2 },
      { key: "extraGrounds", label: "Extra paragraph (optional)", kind: "textarea", span: 4 },
      ...counselFields,
    ],
  },

  "200": {
    badge: "Private Complaint",
    tone: "amber",
    title: "Private Complaint u/s 200 Cr.P.C.",
    description: "Complaint for trial where police refused to register an FIR.",
    submitLabel: "Generate Private Complaint",
    fields: [
      { key: "courtTitle", label: "Court title", span: 2 },
      { key: "district", label: "Court city", span: 2 },
      { key: "complainantName", label: "Complainant name", span: 2 },
      { key: "complainantFather", label: "Complainant parentage", span: 2 },
      { key: "petitionerAddress", label: "Address", kind: "textarea", span: 4 },
      { key: "offenses", label: "Offense sections (PPC)", span: 4 },
      { key: "incidentDate", label: "Occurrence date", kind: "date", span: 2 },
      { key: "detailedCrimeActs", label: "Detailed crime acts", kind: "textarea", span: 2 },
      { key: "accused1Name", label: "Accused 1 name", span: 2 },
      { key: "accused1Parentage", label: "Accused 1 parentage", span: 2 },
      { key: "accused2Name", label: "Accused 2 name", span: 2 },
      { key: "accused2Parentage", label: "Accused 2 parentage", span: 2 },
      { key: "witness1Name", label: "Witness 1", span: 2 },
      { key: "witness2Name", label: "Witness 2", span: 2 },
      ...counselFields,
    ],
  },

  APPEAL: {
    badge: "Appellate",
    tone: "indigo",
    title: "Criminal Appeal against Conviction",
    description: "Appeal petition against conviction and sentence.",
    submitLabel: "Generate Appeal Document",
    fields: [
      { key: "courtTitle", label: "Appellate court title", span: 2 },
      { key: "district", label: "Court city", span: 2 },
      { key: "appealStatuteSection", label: "Appeal statute section", span: 2, placeholder: "410" },
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "policeStation", label: "Police station", span: 2 },
      { key: "petitionerName", label: "Appellant name", span: 2 },
      { key: "petitionerFather", label: "Appellant parentage", span: 2 },
      { key: "judgmentDate", label: "Judgment date", kind: "date", span: 2 },
      { key: "trialJudgeTitle", label: "Trial judge title", span: 2 },
      { key: "sentenceDuration", label: "Sentence duration", span: 2 },
      { key: "convictionSections", label: "Conviction sections", span: 2 },
      { key: "jailLocation", label: "Jail location", span: 2 },
      { key: "jailName", label: "Jail name", span: 2 },
      ...counselFields,
    ],
  },

  REVISION: {
    badge: "Revision",
    tone: "amber",
    title: "Criminal Revision u/s 439 / 439-A Cr.P.C.",
    description: "Revision against an illegal or irregular lower-court order.",
    submitLabel: "Generate Revision Document",
    fields: [
      { key: "courtTitle", label: "Court / High Court title", span: 2 },
      { key: "district", label: "Court city", span: 2 },
      { key: "petitionerName", label: "Petitioner name", span: 2 },
      { key: "respondentName", label: "Respondent name", span: 2 },
      { key: "orderDate", label: "Impugned order date", kind: "date", span: 2 },
      { key: "applicationNature", label: "Nature of dismissed application", span: 2 },
      ...counselFields,
    ],
  },

  "MEDICAL-BOARD": {
    badge: "Medical Evidence",
    tone: "emerald",
    title: "Constitution of Medical Board (Re-examination)",
    description: "Standing Medical Board for re-examination of alleged injuries.",
    submitLabel: "Generate Medical Board Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number (optional)", span: 2 },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      ...counselFields,
    ],
  },

  "WITNESS-SUMMONS": {
    badge: "Evidence",
    tone: "indigo",
    title: "Application for Summoning Witnesses to Record Evidence",
    description: "Issue witness summons for the next date of hearing.",
    submitLabel: "Generate Witness Summons Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "witness1Name", label: "Witness 1 name", span: 2 },
      { key: "witness1Address", label: "Witness 1 address", kind: "textarea", span: 2 },
      { key: "witness2Name", label: "Witness 2 name", span: 2 },
      { key: "witness2Address", label: "Witness 2 address", kind: "textarea", span: 2 },
      ...counselFields,
    ],
  },

  DISPENSE: {
    badge: "Procedural Motion",
    tone: "amber",
    title: "Dispense with Personal Attendance of Accused",
    description: "Section 205-style request to appear through counsel today.",
    submitLabel: "Generate Dispense Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "dispensationSection", label: "Dispensation section", span: 2, placeholder: "205" },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 4 },
      {
        key: "reasonForAbsence",
        label: "Reason for absence (medical / travel)",
        kind: "textarea",
        span: 4,
      },
      ...counselFields,
    ],
  },

  "216": {
    badge: "Charge Sheet",
    tone: "rose",
    title: "Alteration / Modification of Charges (Sec. 216)",
    description: "Alter charges that do not match the police report material.",
    submitLabel: "Generate 216 Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "chargeFramingDate", label: "Charge framing date", kind: "date", span: 2 },
      { key: "currentChargeSections", label: "Current charge sections", span: 2 },
      { key: "faultySection", label: "Faulty / redundant section", span: 4 },
      ...counselFields,
    ],
  },

  NONHARASS: {
    badge: "Protection",
    tone: "emerald",
    title: "Direction Not to Harass / Deter Petitioner (Saiel)",
    description: "Protective directions against illegal police pressure.",
    submitLabel: "Generate Non-Harassment Document",
    fields: [
      { key: "courtTitle", label: "Court title", span: 2 },
      { key: "district", label: "Court city", span: 2 },
      { key: "policeStation", label: "Police station", span: 2 },
      { key: "petitionerName", label: "Petitioner / Saiel name", span: 2 },
      { key: "respondent2Name", label: "Private respondent name", span: 4 },
      {
        key: "disputeBriefContext",
        label: "Dispute brief context",
        kind: "textarea",
        span: 4,
      },
      ...counselFields,
    ],
  },

  SUMMON200: {
    badge: "Process",
    tone: "amber",
    title: "Summon Accused (Private Complaint u/s 200)",
    description: "Issue summons / warrants after preliminary evidence under s.200.",
    submitLabel: "Generate Summon Document",
    fields: [
      { key: "courtTitle", label: "Court title", span: 2 },
      { key: "district", label: "Court city", span: 2 },
      { key: "complainantName", label: "Complainant name", span: 2 },
      { key: "accusedName", label: "Accused name", span: 2 },
      ...counselFields,
    ],
  },

  "court-witness": {
    badge: "Evidence",
    tone: "indigo",
    title: "Summoning of Witness as Court Witness",
    description: "Request the Court to summon a witness as Court Witness.",
    submitLabel: "Generate Court-Witness Document",
    fields: [
      ...courtCityPs,
      ...firBlock,
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "petitionerAddress", label: "Address", kind: "textarea", span: 4 },
      { key: "witnessName", label: "Witness name", span: 2 },
      { key: "witnessPurpose", label: "Purpose of summoning", kind: "textarea", span: 2 },
      ...counselFields,
    ],
  },

  "ID-PARADE": {
    badge: "Investigation",
    tone: "indigo",
    title: "Application for Identification Parade",
    description: "Request a judicially supervised identification parade of the accused.",
    submitLabel: "Generate Identification Parade Document",
    fields: [
      ...courtCityPs,
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "accusedName", label: "Accused name", span: 2 },
      { key: "petitionerName", label: "Applicant / complainant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      {
        key: "offenseDescription",
        label: "Parade particulars / narrative",
        kind: "textarea",
        span: 4,
      },
      ...counselFields,
    ],
  },

  "DISCHARGE-63": {
    badge: "Discharge",
    tone: "amber",
    title: "Discharge of Accused from Police Custody (s.63 & 167)",
    description: "Discharge / release where remand is irregular or custody is unlawful.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "policeStation", label: "Police station", span: 2 },
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "firDate", label: "FIR date", kind: "date", span: 2 },
      { key: "petitionerName", label: "Petitioner / accused name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      {
        key: "remandAnomalies",
        label: "Remand anomalies",
        kind: "textarea",
        span: 4,
        placeholder: "Irregular remand / custody beyond 24 hours…",
      },
      { key: "courtTitle", label: "Court title", span: 2 },
      ...counselFields,
    ],
  },

  "HABEAS-491": {
    badge: "Habeas Corpus",
    tone: "rose",
    title: "Writ of Habeas Corpus u/s 491 Cr.P.C.",
    description:
      "Locked court sample for illegal police lockup detention (distinct from 491 r/w 552 minor recovery).",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "policeStation", label: "Police station", span: 2 },
      { key: "petitionerName", label: "Petitioner name", span: 2 },
      { key: "petitionerFather", label: "Petitioner parentage", span: 2 },
      { key: "petitionerAddress", label: "Petitioner address", kind: "textarea", span: 2 },
      { key: "petitionerCity", label: "Petitioner city", span: 2 },
      {
        key: "respondent2Name",
        label: "Private respondent / Police Officer",
        span: 4,
        placeholder: "Name and rank if known",
      },
      { key: "detenueName", label: "Detenu name", span: 2 },
      { key: "detenuParentage", label: "Detenu parentage", span: 2 },
      {
        key: "relationshipToDetenu",
        label: "Relationship to detenu",
        span: 2,
        placeholder: "e.g. father / brother / wife",
      },
      { key: "incidentDate", label: "Abduction date", kind: "date", span: 1 },
      { key: "incidentTime", label: "Abduction time", kind: "time", span: 1 },
      {
        key: "detentionDurationHours",
        label: "Detention duration (hours)",
        span: 2,
        placeholder: "e.g. 36",
      },
      {
        key: "extortionDemandedAmount",
        label: "Extortion demanded amount (PKR)",
        span: 2,
        placeholder: "e.g. 500,000",
      },
      ...counselFields,
    ],
  },

  "WITNESS-RECALL-540": {
    badge: "Evidence",
    tone: "indigo",
    title: "Recall & Re-examination of Witness u/s 540 Cr.P.C.",
    description: "Recall a prosecution witness for omissions / contradictions.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "courtTitle", label: "Court title", span: 2 },
      {
        key: "caseTitle",
        label: "Case title",
        span: 4,
        placeholder: "State VERSUS [Accused]",
      },
      { key: "witnessName", label: "Witness name", span: 2 },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      {
        key: "omissionContradictionDetails",
        label: "Omission / contradiction details",
        kind: "textarea",
        span: 4,
      },
      ...counselFields,
    ],
  },

  "E-EVIDENCE-164": {
    badge: "Electronic Evidence",
    tone: "emerald",
    title: "Secondary Electronic Evidence (Art. 164 QSO)",
    description: "Production and admissibility of CCTV / audio / digital secondary evidence.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "courtTitle", label: "Court title", span: 2 },
      {
        key: "caseTitle",
        label: "Case title",
        span: 4,
        placeholder: "State VERSUS [Accused]",
      },
      {
        key: "mediaTypeCctvAudio",
        label: "Media type (CCTV / audio / etc.)",
        span: 2,
      },
      {
        key: "deviceSourceVerification",
        label: "Device / source verification",
        kind: "textarea",
        span: 2,
      },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      ...counselFields,
    ],
  },

  "BAIL-CANCEL-497": {
    badge: "Bail Cancellation",
    tone: "rose",
    title: "Cancellation of Bail u/s 497(5) Cr.P.C.",
    description: "Cancel and revoke granted bail for witness tampering or misuse.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "policeStation", label: "Police station", span: 2 },
      { key: "firNo", label: "FIR number", span: 2 },
      { key: "accusedName", label: "Accused on bail", span: 2 },
      { key: "petitionerName", label: "Applicant / complainant name", span: 2 },
      { key: "petitionerFather", label: "Applicant parentage", span: 2 },
      {
        key: "witnessTamperingParticulars",
        label: "Witness tampering particulars",
        kind: "textarea",
        span: 4,
      },
      { key: "courtTitle", label: "Court title", span: 2 },
      ...counselFields,
    ],
  },

  "PERISHABLE-516A": {
    badge: "Perishable Property",
    tone: "emerald",
    title: "Auction of Perishable Seized Property (s.516-A proviso)",
    description: "Immediate disposal / auction where seized property is likely to decay.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "policeStation", label: "Police station", span: 2 },
      {
        key: "propertyDescription",
        label: "Property description",
        kind: "textarea",
        span: 4,
      },
      {
        key: "decayProbabilityJustification",
        label: "Decay probability justification",
        kind: "textarea",
        span: 4,
      },
      { key: "petitionerName", label: "Applicant name", span: 2 },
      { key: "petitionerFather", label: "Parentage", span: 2 },
      { key: "courtTitle", label: "Court title", span: 2 },
      ...counselFields,
    ],
  },

  "SEVERANCE-239": {
    badge: "Trial Severance",
    tone: "amber",
    title: "Separation of Trials / Severance of Charges (s.239)",
    description: "Sever joint trial where co-accused defences conflict.",
    submitLabel: "Download .docx",
    fields: [
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "courtTitle", label: "Court title", span: 2 },
      {
        key: "caseTitle",
        label: "Case title",
        span: 4,
        placeholder: "State VERSUS [Accused]",
      },
      { key: "coAccusedName", label: "Co-accused name", span: 2 },
      { key: "petitionerName", label: "Applicant / accused name", span: 2 },
      {
        key: "conflictingDefenseGrounds",
        label: "Conflicting defence grounds",
        kind: "textarea",
        span: 4,
      },
      ...counselFields,
    ],
  },

  "SUSPEND-426": {
    badge: "Sentence Suspension",
    tone: "indigo",
    title: "Suspension of Sentence Pending Appeal (s.426)",
    description: "Suspend sentence while the criminal appeal is pending.",
    submitLabel: "Download .docx",
    fields: [
      {
        key: "appellateCourtName",
        label: "Appellate court name",
        span: 2,
        placeholder: "SESSIONS JUDGE / HIGH COURT",
      },
      { key: "district", label: "Court city", span: 2, placeholder: "Dera Ghazi Khan" },
      { key: "petitionerName", label: "Appellant name", span: 2 },
      { key: "petitionerFather", label: "Appellant parentage", span: 2 },
      { key: "sentenceDuration", label: "Sentence duration", span: 2 },
      { key: "appealNumber", label: "Appeal number", span: 2 },
      ...counselFields,
    ],
  },
};
