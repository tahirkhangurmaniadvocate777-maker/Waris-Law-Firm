import {
  formatPrecedentGroundsBlock,
  furtherInquiryGroundLines,
} from "@/lib/criminalPrecedents";
import { firm } from "@/lib/firm";
import { legalCounselFooter } from "@/lib/firmCounsel";
import { BLANK, formatLongDate, suitYear, textOrBlank, todayIso } from "@/lib/format";

export type CriminalAppType =
  | "497"
  | "498"
  | "249A"
  | "265K"
  | "court-witness"
  | "491-552"
  | "22A-22B"
  | "516A"
  | "NBW"
  | "DISPENSE"
  | "216"
  | "NONHARASS"
  | "APPEAL"
  | "REVISION"
  | "200"
  | "SUMMON200"
  | "WITNESS-SUMMONS"
  | "MEDICAL-BOARD"
  | "EXEMPT-ADJOURN"
  | "ID-PARADE"
  | "DISCHARGE-63"
  | "HABEAS-491"
  | "WITNESS-RECALL-540"
  | "E-EVIDENCE-164"
  | "BAIL-CANCEL-497"
  | "PERISHABLE-516A"
  | "SEVERANCE-239"
  | "SUSPEND-426";

export const criminalAppOptions: { id: CriminalAppType; label: string }[] = [
  { id: "497", label: "Bail application u/s 497 Cr.P.C. (post-arrest)" },
  { id: "498", label: "Application u/s 498 Cr.P.C." },
  { id: "249A", label: "Application u/s 249-A Cr.P.C." },
  { id: "265K", label: "Application u/s 265-K Cr.P.C." },
  { id: "court-witness", label: "Summoning of witness as Court Witness" },
  {
    id: "491-552",
    label: "Application u/s 491 r/w 552 Cr.P.C. (recovery of minor detenue)",
  },
  {
    id: "22A-22B",
    label: "Application u/s 22-A & 22-B Cr.P.C. (direction to register FIR)",
  },
  { id: "516A", label: "Application u/s 516-A Cr.P.C. (release on Superdari)" },
  {
    id: "NBW",
    label: "Application for Non-Bailable Arrest Warrants (absconding accused)",
  },
  {
    id: "DISPENSE",
    label: "Application to dispense with personal attendance of accused",
  },
  { id: "216", label: "Application u/s 216 Cr.P.C. (alteration of charges)" },
  {
    id: "NONHARASS",
    label: "Application for direction not to harass / deter petitioner (Saiel)",
  },
  { id: "APPEAL", label: "Criminal Appeal against conviction" },
  { id: "REVISION", label: "Criminal Revision u/s 439 / 439-A Cr.P.C." },
  { id: "200", label: "Private Complaint u/s 200 Cr.P.C." },
  {
    id: "SUMMON200",
    label: "Application to summon accused (private complaint u/s 200)",
  },
  {
    id: "WITNESS-SUMMONS",
    label: "Application for summoning witnesses to record evidence",
  },
  {
    id: "MEDICAL-BOARD",
    label: "Application for constitution of Medical Board (re-examination)",
  },
  {
    id: "EXEMPT-ADJOURN",
    label: "Application for exemption from appearance and adjournment",
  },
  {
    id: "ID-PARADE",
    label: "Application for identification parade",
  },
  {
    id: "DISCHARGE-63",
    label: "Application for discharge of accused (s.63 / editable)",
  },
  {
    id: "HABEAS-491",
    label: "Habeas corpus / production of person u/s 491 Cr.P.C.",
  },
  {
    id: "WITNESS-RECALL-540",
    label: "Application for recall of witness u/s 540 Cr.P.C.",
  },
  {
    id: "E-EVIDENCE-164",
    label: "Application for recording / production of electronic evidence",
  },
  {
    id: "BAIL-CANCEL-497",
    label: "Application for cancellation of bail u/s 497(5) Cr.P.C.",
  },
  {
    id: "PERISHABLE-516A",
    label: "Perishable seized property auction (s.516-A proviso)",
  },
  {
    id: "SEVERANCE-239",
    label: "Separation of trials / severance of charges (s.239)",
  },
  {
    id: "SUSPEND-426",
    label: "Suspension of sentence pending appeal (s.426)",
  },
];

export const offenseLaws = ["PPC", "EMO", "AMLA", "CNSA", "Other"] as const;

export type ParentRole = "father" | "mother";

export const COURT_DEFAULTS: Partial<Record<CriminalAppType, string>> = {
  "497": "LEARNED SESSIONS JUDGE",
  "498": "LEARNED SESSIONS JUDGE",
  "249A": "LEARNED SESSIONS JUDGE",
  "265K": "LEARNED SESSIONS JUDGE",
  "court-witness": "LEARNED SESSIONS JUDGE",
  "491-552": "LEARNED SESSIONS JUDGE / JUSTICE OF PEACE",
  "22A-22B": "HONORABLE SESSIONS JUDGE / EX-OFFICIO JUSTICE OF PEACE",
  "516A": "HONORABLE ILLAQA MAGISTRATE",
  NBW: "HONORABLE ILLAQA MAGISTRATE / SESSIONS JUDGE",
  DISPENSE: "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "216": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  NONHARASS: "HONORABLE SESSIONS JUDGE / JUSTICE OF PEACE",
  APPEAL: "SESSIONS JUDGE / APPELLATE COURT",
  REVISION: "SESSIONS COURT / HIGH COURT",
  "200": "HONORABLE ILLAQA MAGISTRATE",
  SUMMON200: "ILLAQA MAGISTRATE",
  "WITNESS-SUMMONS": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "MEDICAL-BOARD": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "EXEMPT-ADJOURN": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "ID-PARADE": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "DISCHARGE-63": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "HABEAS-491": "HONORABLE SESSIONS JUDGE / EX-OFFICIO JUSTICE OF THE PEACE",
  "WITNESS-RECALL-540": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "E-EVIDENCE-164": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "BAIL-CANCEL-497": "LEARNED SESSIONS JUDGE",
  "PERISHABLE-516A": "HONORABLE ILLAQA MAGISTRATE",
  "SEVERANCE-239": "ILLAQA MAGISTRATE / SESSIONS JUDGE",
  "SUSPEND-426": "SESSIONS JUDGE / APPELLATE COURT",
};

export type CriminalForm = {
  appType: CriminalAppType;
  courtTitle: string;
  district: string;
  petitionerName: string;
  petitionerFather: string;
  petitionerAddress: string;
  petitionerCaste: string;
  parentRole: ParentRole;
  complainantName: string;
  complainantFather: string;
  firNo: string;
  firDate: string;
  policeStation: string;
  /** Circle / subdivision under which the police station falls (22-A/B). */
  policeSubdivision: string;
  offenses: string;
  offenseLaw: string;
  arrestDate: string;
  jailName: string;
  accusedName: string;
  witnessName: string;
  witnessPurpose: string;
  groundless: boolean;
  noMaterial: boolean;
  zeroConviction: boolean;
  /** Inject s.497(2) further-inquiry GROUNDS (+ PLD/SCMR when pasted). */
  furtherInquiry: boolean;
  extraGrounds: string;
  /** Optional free-text PLD/SCMR lines (printed when further inquiry is checked). */
  pldCitations: string;
  respondent2Name: string;
  respondent2Father: string;
  respondent2Caste: string;
  respondent2Address: string;
  respondent3Name: string;
  respondent3Father: string;
  respondent3Caste: string;
  respondent3Address: string;
  minorName: string;
  minorAge: string;
  incidentDate: string;
  incidentTime: string;
  visitDate: string;
  lawyerName: string;
  verificationDate: string;
  petitionerCity: string;
  offenseDescription: string;
  propertyType: string;
  propertyDescription: string;
  chassisNumber: string;
  engineNumber: string;
  dispensationSection: string;
  reasonForAbsence: string;
  chargeFramingDate: string;
  currentChargeSections: string;
  faultySection: string;
  disputeBriefContext: string;
  appealStatuteSection: string;
  judgmentDate: string;
  trialJudgeTitle: string;
  sentenceDuration: string;
  convictionSections: string;
  jailLocation: string;
  orderDate: string;
  applicationNature: string;
  respondentName: string;
  accused1Name: string;
  accused1Parentage: string;
  accused2Name: string;
  accused2Parentage: string;
  detailedCrimeActs: string;
  witness1Name: string;
  witness1Address: string;
  witness2Name: string;
  witness2Address: string;
  suddenEmergencyReason: string;
  /** Optional case caption override (e.g. "State VERSUS Ali"). */
  caseTitle: string;
  /** Discharge statute (e.g. 249-A, 265-K, 63). */
  dischargeSection: string;
  /** Person illegally detained (habeas / 491 general). */
  detenueName: string;
  detentionPlace: string;
  /** Electronic media / device description. */
  electronicMediaDesc: string;
  /** Editable statutory citation for electronic evidence apps. */
  electronicEvidenceSection: string;
  /** Habeas 491 locked sample fields. */
  detenuParentage: string;
  relationshipToDetenu: string;
  detentionDurationHours: string;
  extortionDemandedAmount: string;
  /** Extended-module fields. */
  remandAnomalies: string;
  decayProbabilityJustification: string;
  omissionContradictionDetails: string;
  coAccusedName: string;
  conflictingDefenseGrounds: string;
  mediaTypeCctvAudio: string;
  deviceSourceVerification: string;
  witnessTamperingParticulars: string;
  appellateCourtName: string;
  appealNumber: string;
};

export type CriminalAffidavit = {
  courtLine: string;
  suitLine: string;
  matterLeft: string;
  matterRight: string;
  causeTitle: string;
  introText: string;
  paragraphs: string[];
  deponentRole: string;
  verificationText: string;
};

export type CriminalDraft = {
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
  affidavit: CriminalAffidavit | null;
};

function firmCounsel(form: CriminalForm) {
  return {
    lawyerName: textOrBlank(form.lawyerName),
    lawyerLines: [`${firm.designation},`, "District Courts, Dera Ghazi Khan."],
  };
}

export function emptyCriminalForm(): CriminalForm {
  return {
    appType: "497",
    courtTitle: "LEARNED SESSIONS JUDGE",
    district: firm.defaultCourt,
    petitionerName: "",
    petitionerFather: "",
    petitionerAddress: "",
    petitionerCaste: "",
    parentRole: "father",
    complainantName: "",
    complainantFather: "",
    firNo: "",
    firDate: "",
    policeStation: "",
    policeSubdivision: "",
    offenses: "",
    offenseLaw: "PPC",
    arrestDate: "",
    jailName: "",
    accusedName: "",
    witnessName: "",
    witnessPurpose: "",
    groundless: true,
    noMaterial: true,
    zeroConviction: true,
    furtherInquiry: false,
    extraGrounds: "",
    pldCitations: "",
    respondent2Name: "",
    respondent2Father: "",
    respondent2Caste: "",
    respondent2Address: "",
    respondent3Name: "",
    respondent3Father: "",
    respondent3Caste: "",
    respondent3Address: "",
    minorName: "",
    minorAge: "",
    incidentDate: "",
    incidentTime: "",
    visitDate: "",
    lawyerName: firm.advocate,
    verificationDate: todayIso(),
    petitionerCity: firm.defaultCourt,
    offenseDescription: "",
    propertyType: "",
    propertyDescription: "",
    chassisNumber: "",
    engineNumber: "",
    dispensationSection: "205",
    reasonForAbsence: "",
    chargeFramingDate: "",
    currentChargeSections: "",
    faultySection: "",
    disputeBriefContext: "",
    appealStatuteSection: "410",
    judgmentDate: "",
    trialJudgeTitle: "",
    sentenceDuration: "",
    convictionSections: "",
    jailLocation: firm.defaultCourt,
    orderDate: "",
    applicationNature: "",
    respondentName: "",
    accused1Name: "",
    accused1Parentage: "",
    accused2Name: "",
    accused2Parentage: "",
    detailedCrimeActs: "",
    witness1Name: "",
    witness1Address: "",
    witness2Name: "",
    witness2Address: "",
    suddenEmergencyReason: "",
    caseTitle: "",
    dischargeSection: "63",
    detenueName: "",
    detentionPlace: "",
    electronicMediaDesc: "",
    electronicEvidenceSection: "Art. 164 QSO, 1984",
    detenuParentage: "",
    relationshipToDetenu: "",
    detentionDurationHours: "",
    extortionDemandedAmount: "",
    remandAnomalies: "",
    decayProbabilityJustification: "",
    omissionContradictionDetails: "",
    coAccusedName: "",
    conflictingDefenseGrounds: "",
    mediaTypeCctvAudio: "",
    deviceSourceVerification: "",
    witnessTamperingParticulars: "",
    appellateCourtName: "",
    appealNumber: "",
  };
}

function petitionerRelationPhrase(role: ParentRole, fatherName: string) {
  const name = textOrBlank(fatherName);
  return role === "mother" ? `D/O, W/O ${name}` : `S/O ${name}`;
}

function ordinalDay(day: number) {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function verificationParts(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) {
    const fallback = textOrBlank(iso);
    return { day: fallback, month: fallback, year: fallback, long: fallback };
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) {
    return { day: "___", month: "_______", year: "____", long: textOrBlank(iso) };
  }
  const dayNum = date.getDate();
  return {
    day: ordinalDay(dayNum),
    month: date.toLocaleDateString("en-GB", { month: "long" }),
    year: String(date.getFullYear()),
    long: formatLongDate(iso),
  };
}

function formatTimeOrBlank(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return textOrBlank(trimmed);
  return trimmed;
}

function draftShell(
  partial: Omit<CriminalDraft, "affidavit"> & { affidavit?: CriminalAffidavit | null },
): CriminalDraft {
  return { ...partial, affidavit: partial.affidavit ?? null };
}

function defaultVerify(form: CriminalForm) {
  return `Verified on Oath at ${textOrBlank(form.district)} on this ${formatLongDate(form.verificationDate)}, that the contents of this application are true and correct to the best of my knowledge and belief.`;
}

export function buildCriminalDraft(form: CriminalForm): CriminalDraft {
  const year = suitYear(form.verificationDate);
  const courtLine = `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${textOrBlank(form.district)}`;
  const firLine = `FIR No. ${textOrBlank(form.firNo)} dated ${formatLongDate(form.firDate)} under section ${textOrBlank(form.offenses)} ${textOrBlank(form.offenseLaw)}, P.S. ${textOrBlank(form.policeStation)}, ${textOrBlank(form.district)}`;
  const counsel = firmCounsel(form);
  const city = textOrBlank(form.district);

  if (form.appType === "22A-22B") {
    const timePart = form.incidentTime.trim()
      ? ` at about ${formatTimeOrBlank(form.incidentTime)}`
      : "";
    const sectionsPart = form.offenses.trim()
      ? ` under section(s) ${textOrBlank(form.offenses)} ${textOrBlank(form.offenseLaw || "PPC")}`
      : "";
    const subdivisionPart = form.policeSubdivision.trim()
      ? `, Circle / Subdivision ${textOrBlank(form.policeSubdivision)}`
      : "";
    const shoLine = `Police Station ${textOrBlank(form.policeStation)}${subdivisionPart}`;

    return draftShell({
      courtLine: `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Criminal Misc. Application No. _________ / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)} son of ${textOrBlank(form.petitionerFather)},`,
        `Resident of ${textOrBlank(form.petitionerAddress)}.`,
      ],
      leftRole: "PETITIONER",
      rightParty: [
        `1. The Station House Officer (SHO), ${shoLine}.`,
        `2. ${textOrBlank(form.respondent2Name)} son of ${textOrBlank(form.respondent2Father)},`,
        `   Resident of ${textOrBlank(form.respondent2Address)}.`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle:
        "APPLICATION UNDER SECTIONS 22-A & 22-B OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR DIRECTION TO THE RESPONDENT NO. 1 TO REGISTER A FORMAL CRIMINAL CASE (FIR) AGAINST RESPONDENT NO. 2.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the Petitioner is a peaceful and law-abiding citizen of Pakistan and a permanent resident of ${textOrBlank(form.petitionerCity || form.district)}.`,
        `2. That on ${formatLongDate(form.incidentDate)}${timePart}, Respondent No. 2, with unknown accomplices, committed ${textOrBlank(form.offenseDescription)} against the Petitioner${sectionsPart}.`,
        "3. That the said act constitutes a cognizable offense under the Pakistan Penal Code (PPC) and attracts registration of a formal First Information Report.",
        `4. That the Petitioner approached the Station House Officer, ${shoLine}, on ${formatLongDate(form.visitDate)} through a written application seeking registration of an FIR; however, the police refused to register the case and thereby failed in their duty under Section 154 of the Code of Criminal Procedure, 1898.`,
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Accept the instant application.",
        "Direct Respondent No. 1 to register a formal criminal case (FIR) under Section 154 Cr.P.C. against Respondent No. 2.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "PETITIONER",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "516A") {
    return draftShell({
      courtLine: `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `In the matter of: State VS ${textOrBlank(form.accusedName)}\nCase FIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)} son of ${textOrBlank(form.petitionerFather)},`,
        `Resident of ${textOrBlank(form.petitionerAddress)}.`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: `APPLICATION UNDER SECTION 516-A OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE RELEASE OF ${textOrBlank(form.propertyType)} ON SUPARDARI TO THE APPLICANT.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the police of Police Station ${textOrBlank(form.policeStation)} took custody of the Applicant's property namely ${textOrBlank(form.propertyDescription)} (Chassis No: ${textOrBlank(form.chassisNumber)}, Engine No: ${textOrBlank(form.engineNumber)}) in the above-mentioned case.`,
        "2. That the Applicant is the absolute and lawful owner of the said property and requires the same for daily livelihood.",
        "3. That if the said property remains parked in the open compound of the Police Station, it is liable to be destroyed by weather and other natural elements, causing irreparable loss to the Applicant.",
        "4. That the Applicant undertakes to produce the said property before this Honorable Court or any competent authority whenever so required.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Release the above-mentioned property on Superdari in favour of the Applicant against reliable surety bonds.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "NBW") {
    return draftShell({
      courtLine: `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Application in FIR No. ${textOrBlank(form.firNo)} / ${year}`,
      leftParty: [textOrBlank(form.complainantName || form.petitionerName)],
      leftRole: "COMPLAINANT",
      rightParty: [textOrBlank(form.accusedName)],
      rightRole: "ACCUSED",
      causeTitle:
        "APPLICATION FOR ISSUANCE OF NON-BAILABLE ARREST WARRANTS AND INTERVENTION FOR THE ARREST OF THE ABSCONDING ACCUSED.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the above-titled criminal trial case is pending adjudication before this Honorable Court.",
        `2. That despite clear nominations and descriptions inside FIR No. ${textOrBlank(form.firNo)}, the accused is deliberately hiding, evading process, and absconding from the law.`,
        "3. That the local police are neglecting their duty to arrest the culprit, causing immense prejudice to the prosecution's case.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Issue Non-Bailable Warrants (NBW) and direct the concerned hierarchy to cause the immediate arrest of the accused.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "COMPLAINANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "DISPENSE") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Case Title: State VS ${textOrBlank(form.accusedName)}\nFIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        `${textOrBlank(form.petitionerName || form.accusedName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT / ACCUSED",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: `APPLICATION UNDER SECTION ${textOrBlank(form.dispensationSection)} OF THE CODE OF CRIMINAL PROCEDURE, 1898 TO DISPENSE WITH PERSONAL ATTENDANCE OF THE ACCUSED TODAY.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the applicant / accused has been regular in attending this Honorable Court on each and every date of hearing.",
        `2. That today the applicant / accused is incapable of remaining present due to ${textOrBlank(form.reasonForAbsence)}.`,
        "3. That the applicant / accused is properly represented by counsel and no delay in the proceedings shall be occasioned by the present request.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Dispense with the personal attendance of the accused for today.",
        "Permit the pleader / counsel to represent the accused in the proceedings.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "ACCUSED",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "216") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `State VERSUS ${textOrBlank(form.accusedName)}\nFIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        `${textOrBlank(form.petitionerName || form.accusedName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION UNDER SECTION 216 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR ALTERATION / MODIFICATION OF CHARGES.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That this Honorable Court framed charges on ${formatLongDate(form.chargeFramingDate)} under section ${textOrBlank(form.currentChargeSections)}.`,
        `2. That the charge of section ${textOrBlank(form.faultySection)} is redundant; no evidence, recovery, or medical material matches that offense in the police report.`,
        "3. That the charge sheet requires structural modification so as to match the statutory elements available on the record.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Accept the instant application and alter / modify the charges in the interest of justice.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "NONHARASS") {
    return draftShell({
      courtLine: `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Criminal Misc. Application No. _________ / ${year}`,
      leftParty: [textOrBlank(form.petitionerName)],
      leftRole: "PETITIONER / SAIEL",
      rightParty: [
        `1. The SHO, Police Station ${textOrBlank(form.policeStation)}.`,
        `2. ${textOrBlank(form.respondent2Name || form.respondentName)}.`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle:
        "APPLICATION SEEKING EXPLICIT DIRECTION TO THE RESPONDENT NO. 1 NOT TO DETER, HARASS, OR COERCE THE PETITIONER / SAIEL ILLEGALLY.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the Petitioner is a peaceful law-abiding citizen and holds an independent professional identity.",
        `2. That due to underlying rivalries regarding ${textOrBlank(form.disputeBriefContext)}, Respondent No. 2 is using political connections to influence Respondent No. 1.`,
        "3. That the local police are conducting illegal raids, tracking the Petitioner, and causing immense humiliation without any lawful cause or registered FIR.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Direct Respondent No. 1 not to harass, deter, or create unlawful pressure on the Petitioner or his family.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "PETITIONER",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "APPEAL") {
    return draftShell({
      courtLine: `IN THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Criminal Appeal No. _________ / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)} son of ${textOrBlank(form.petitionerFather)},`,
        `Currently confined in Central Jail ${textOrBlank(form.jailLocation || form.jailName)}.`,
      ],
      leftRole: "APPELLANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: `CRIMINAL APPEAL UNDER SECTION ${textOrBlank(form.appealStatuteSection)} OF THE CODE OF CRIMINAL PROCEDURE, 1898 AGAINST JUDGMENT OF CONVICTION DATED ${formatLongDate(form.judgmentDate)} IN FIR NO. ${textOrBlank(form.firNo)}.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the Appellant was tried by ${textOrBlank(form.trialJudgeTitle)} and was erroneously convicted and sentenced to ${textOrBlank(form.sentenceDuration)} under ${textOrBlank(form.convictionSections)}.`,
        "2. That the impugned judgment is against the law, the weight of evidence, and the settled principles of justice.",
        "3. That the prosecution failed to produce independent eyewitnesses, and the alleged recovery was engineered.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Accept the instant appeal.",
        "Set aside the conviction and sentence recorded against the Appellant.",
        "Acquit the Appellant of the charge.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPELLANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "REVISION") {
    return draftShell({
      courtLine: `IN THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Criminal Revision No. _________ / ${year}`,
      leftParty: [textOrBlank(form.petitionerName)],
      leftRole: "PETITIONER",
      rightParty: ["1. The State", `2. ${textOrBlank(form.respondentName || form.respondent2Name)}`],
      rightRole: "RESPONDENTS",
      causeTitle: `CRIMINAL REVISION PETITION UNDER SECTION 439 / 439-A OF THE CODE OF CRIMINAL PROCEDURE, 1898 AGAINST THE ILLEGAL ORDER DATED ${formatLongDate(form.orderDate)} PASSED BY THE LOWER COURT.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the lower court on ${formatLongDate(form.orderDate)} arbitrarily dismissed the application for ${textOrBlank(form.applicationNature)}.`,
        "2. That the impugned order suffers from patent illegality, procedural irregularity, and the lower court exceeded its jurisdiction.",
        "3. That the order has resulted in a severe miscarriage of justice.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Allow the instant revision petition.",
        "Summon the records of the lower court.",
        "Declare the impugned order null and void.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "PETITIONER",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "200") {
    return draftShell({
      courtLine: `IN THE COURT OF THE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Private Complaint No. _________ / ${year}`,
      leftParty: [
        `${textOrBlank(form.complainantName || form.petitionerName)} son of ${textOrBlank(form.complainantFather || form.petitionerFather)},`,
        `Resident of ${textOrBlank(form.petitionerAddress)}.`,
      ],
      leftRole: "COMPLAINANT",
      rightParty: [
        `1. ${textOrBlank(form.accused1Name)} son of ${textOrBlank(form.accused1Parentage)}.`,
        `2. ${textOrBlank(form.accused2Name)} son of ${textOrBlank(form.accused2Parentage)}.`,
      ],
      rightRole: "ACCUSED PERSONS",
      causeTitle: `PRIVATE COMPLAINT UNDER SECTION 200 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE TRIAL OF THE ACCUSED PERSONS UNDER SECTIONS ${textOrBlank(form.offenses || form.offenseDescription)} OF THE PAKISTAN PENAL CODE (PPC).`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the facts giving rise to this complaint are that on ${formatLongDate(form.incidentDate)}, the accused persons pre-planned and committed the offense of ${textOrBlank(form.detailedCrimeActs)}.`,
        "2. That the complainant approached the local police station to file an FIR, but due to the high political status of the accused, the police refused to lodge the case.",
        `3. That the complainant has reliable eyewitnesses, namely ${textOrBlank(form.witness1Name)} and ${textOrBlank(form.witness2Name)}, to prove the guilt of the accused.`,
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Summon the accused persons to face trial and punish them in accordance with the law.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "COMPLAINANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "SUMMON200") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `${textOrBlank(form.complainantName || form.petitionerName)} VERSUS ${textOrBlank(form.accusedName)}\nPrivate Complaint under Section 200 CrPC`,
      leftParty: [textOrBlank(form.complainantName || form.petitionerName)],
      leftRole: "COMPLAINANT",
      rightParty: [textOrBlank(form.accusedName)],
      rightRole: "ACCUSED",
      causeTitle:
        "APPLICATION SEEKING THE SUMMONING OF THE ACCUSED TO FACE TRIAL CASE PROCEEDINGS.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the complainant has recorded his initial preliminary statement under Section 200 CrPC before this Honorable Court.",
        "2. That the preliminary evidence and eye-witness accounts establish a solid prima-facie case against the named accused.",
        "3. That sufficient grounds exist to proceed with a formal trial path.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Issue formal summons / warrants to compel the attendance of the accused.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "COMPLAINANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "WITNESS-SUMMONS") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Case Title: State VERSUS ${textOrBlank(form.accusedName)}\nFIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: "APPLICATION FOR SUMMONING OF RELEVANT WITNESSES TO RECORD EVIDENCE.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the above-titled trial case is fixed before this Honorable Court for recording of evidence.",
        `2. That the testimony of the following witnesses is vital for just decision of the case:\n   a. ${textOrBlank(form.witness1Name)}, Resident of ${textOrBlank(form.witness1Address)}\n   b. ${textOrBlank(form.witness2Name)}, Resident of ${textOrBlank(form.witness2Address)}`,
        "3. That without the intervention of this Honorable Court, the said witnesses cannot appear independently to record their evidence.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Issue formal witness summons for attendance of the above-named witnesses on the next date of hearing.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "MEDICAL-BOARD") {
    const firCaption =
      form.firNo.trim() || form.policeStation.trim()
        ? `FIR No. ${textOrBlank(form.firNo)}${form.policeStation.trim() ? `, Police Station: ${textOrBlank(form.policeStation)}` : ""}`
        : "";
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `State VERSUS ${textOrBlank(form.accusedName)}${firCaption ? `\n${firCaption}` : ""}`,
      leftParty: [
        `${textOrBlank(form.petitionerName || form.accusedName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION SEEKING THE CONSTITUTION OF A STANDING MEDICAL BOARD FOR THE RE-EXAMINATION OF THE ALLEGED INJURIES OF THE COMPLAINANT.",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the initial Medico-Legal Certificate (MLC) is fabricated / biased and does not align with the actual physical impacts.",
        "2. That the complainant has exaggerated minor scratches into severe fractures in order to attract prohibitory clauses.",
        "3. That an independent Medical Board assessment is critical for just decision of the case.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Direct the Health Department / Medical Superintendent, District Hospital, to constitute a Standing Medical Board to re-examine the complainant.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "EXEMPT-ADJOURN") {
    const caption = form.caseTitle.trim()
      ? textOrBlank(form.caseTitle)
      : `State VERSUS ${textOrBlank(form.accusedName)}`;
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `${caption}\nFIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        `${textOrBlank(form.petitionerName || form.accusedName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR EXEMPTION FROM PERSONAL APPEARANCE AND ADJOURNMENT OF THE CASE",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        "1. That the above-titled trial case is fixed for hearing before this Honorable Court today.",
        `2. That the applicant / accused is unable to appear due to ${textOrBlank(form.suddenEmergencyReason)}.`,
        "3. That the absence is unintentional and the applicant undertakes that the same shall not delay the proceedings.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Exempt the personal appearance of the applicant / accused for today.",
        "Mark the presence of the applicant through counsel.",
        "Adjourn the case to a future date convenient to this Honorable Court.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "491-552") {
    const verify = verificationParts(form.verificationDate);
    const parentRoleLabel = form.parentRole === "mother" ? "Mother" : "Father";
    const petRel = petitionerRelationPhrase(form.parentRole, form.petitionerFather);
    const minor = textOrBlank(form.minorName);
    const age = textOrBlank(form.minorAge);
    const incident = formatLongDate(form.incidentDate);
    const time = formatTimeOrBlank(form.incidentTime);
    const visit = formatLongDate(form.visitDate);
    const ps = textOrBlank(form.policeStation);
    const caste = textOrBlank(form.petitionerCaste);
    const address = textOrBlank(form.petitionerAddress);
    const district = textOrBlank(form.district);
    const petitionerName = textOrBlank(form.petitionerName);
    const courtTitle = textOrBlank(form.courtTitle);
    const respondentsAddress = form.respondent2Address.trim()
      ? textOrBlank(form.respondent2Address)
      : form.respondent3Address.trim()
        ? textOrBlank(form.respondent3Address)
        : BLANK;
    const suitLine = `Criminal Misc. Application No. _________ / ${year}`;
    const courtLine491 = `IN THE COURT OF ${courtTitle}, ${district}`;
    const affidavitCourtLine = `BEFORE THE ${courtTitle}, ${district}`;
    const extra = form.extraGrounds.trim();
    const lastParaNo = extra ? 9 : 8;

    return draftShell({
      courtLine: courtLine491,
      suitLine,
      leftParty: [
        `1.  ${petitionerName}`,
        `${petRel}, ${caste} by caste,`,
        `R/O ${address}, Tehsil & District ${district}.`,
      ],
      leftRole: "Petitioner",
      rightParty: [
        `1.  The State`,
        `Through Station House Officer (SHO), Police Station ${ps}, ${district}.`,
        `2.  ${textOrBlank(form.respondent2Name)}`,
        `S/O ${textOrBlank(form.respondent2Father)}, ${textOrBlank(form.respondent2Caste)} by caste.`,
        `3.  ${textOrBlank(form.respondent3Name)}`,
        `S/O ${textOrBlank(form.respondent3Father)}, ${textOrBlank(form.respondent3Caste)} by caste.`,
        `Both R/O ${respondentsAddress}, Tehsil & District ${district}.`,
      ],
      rightRole: "Respondents",
      causeTitle: `APPLICATION UNDER SECTION 491 READ WITH SECTION 552 OF THE CODE OF CRIMINAL PROCEDURE, 1898 (CrPC) FOR THE IMMEDIATE RECOVERY AND RESTORATION OF THE MINOR DETENUE NAMELY: ${minor} FROM THE ILLEGAL, FORCEFUL, AND UNLAWFUL DETENTION OF THE RESPONDENTS NO. 2 & 3.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1.  That the Petitioner is a law-abiding citizen of Pakistan, residing at the address mentioned above, and is the natural, legal, and biological parent (${parentRoleLabel}) of the minor detenue namely ${minor}, aged about ${age} years.`,
        "2.  That the minor detenue was residing comfortably, peacefully, and under the absolute loving care, financial guardianship, and direct supervision of the Petitioner at their lawful residence, where the minor's educational, emotional, and physical needs were being fully met.",
        `3.  That on ${incident} at about ${time}, the Respondents No. 2 and 3, driven by ulterior motives and high-handedness, unlawfully formed a group, trespassed into the Petitioner's house, and through sheer physical intimidation, threats, and dynamic coercion, executed a sudden and forceful removal of the minor child, abruptly snatching the minor away from the lawful custody of the Petitioner.`,
        `4.  That following this aggressive displacement, the Petitioner along with respectable elders of the locality and family mediators went to the residential house of the Respondents No. 2 and 3 on ${visit} to inquire about the minor's well-being and exercise parental rights. However, the Respondents flagrantly demonstrated a strict and vehement refusal to let the parent visit, locking the minor inside a room and turning the Petitioner away with severe threats of physical violence and dire consequences should the Petitioner ever return to see the minor.`,
        "5.  That the continuous and absolute denial of parental access, paired with the hostile domestic atmosphere maintained by the Respondents, constitutes an ongoing act of illegal, unauthorized, and punitive confinement of the minor child, severely alienating them from their natural guardian.",
        "6.  That the minor detenue is of tender age and entirely dependent upon the Petitioner for emotional security, nutrition, and daily care; the psychological trauma of this abrupt isolation has gravely endangered the minor's mental and physical health, putting their overall welfare in imminent danger.",
        "7.  That the Respondents possess absolutely no legal right, title, decree, or superior guardian status under any law to forcibly retain the minor child away from their living biological parent.",
        "8.  That the matter dictates extreme urgency as the child's life, safety, and psychological equilibrium are at stake, making the slower, technical remedies of the Family or Guardian Courts completely inadequate for immediate relief.",
        extra ? `9.  ${extra}` : "",
      ].filter(Boolean),
      prayerIntro:
        "Under the circumstances respectfully detailed above, it is most humbly prayed that this Honorable Court may graciously display immediate intervention in the interest of justice and direct Respondent No. 1 (SHO) to:",
      prayerItems: [
        `Locate and recover the minor detenue namely ${minor} immediately from the unlawful, forceful clutches and custody of Respondents No. 2 & 3.`,
        "Produce the minor detenue safely before this Honorable Court.",
        "Restore and hand over the absolute custody of the minor detenue to the Petitioner, ensuring their safety and the preservation of their legal welfare.",
      ],
      prayerOutro:
        "Any other relief that this Honorable Court deems fit and proper under the facts of the case may also be generously awarded.",
      signRole: "PETITIONER",
      lawyerName: textOrBlank(form.lawyerName),
      lawyerLines: ["Advocate High Court,", "District Courts, Dera Ghazi Khan."],
      verificationText: "",
      affidavit: {
        courtLine: affidavitCourtLine,
        suitLine,
        matterLeft: petitionerName,
        matterRight: "SHO & Others",
        causeTitle: "AFFIDAVIT",
        introText: `I, ${petitionerName} ${petRel}, ${caste} by caste, R/O ${address}, Tehsil & District ${district}, do hereby solemnly affirm and declare on oath as under:`,
        paragraphs: [
          "1.  That the deponent is the Petitioner in the accompanying main application and is thoroughly conversant with all the underlying facts and circumstances narrated therein.",
          `2.  That the contents of paragraphs No. 1 to ${lastParaNo} of the accompanying application are true and correct to the best of my personal knowledge, information, and belief, and nothing material has been concealed, suppressed, or distorted therein.`,
        ],
        deponentRole: "DEPONENT",
        verificationText: `Verified on Oath at ${district} on this ${verify.day} day of ${verify.month} ${verify.year}, that all the assertions made in the above affidavit are absolutely true and correct to the best of my knowledge, and no part of it is false.`,
      },
    });
  }

  if (form.appType === "497") {
    const groundBodies: string[] = [
      "That the allegation in the FIR is false, baseless, and fabricated due to prior enmity.",
    ];
    if (form.furtherInquiry) {
      groundBodies.push(...furtherInquiryGroundLines());
      if (form.pldCitations.trim()) {
        groundBodies.push(form.pldCitations.trim());
      }
    }
    groundBodies.push(
      "That no recovery has been effected from the applicant, nor was the applicant named in the prompt FIR.",
      "That the applicant is a peaceful citizen with no prior criminal record and is ready to furnish reliable surety.",
    );
    if (form.extraGrounds.trim()) groundBodies.push(form.extraGrounds.trim());
    const grounds = groundBodies.map(
      (line, i) => `${String.fromCharCode(97 + i)}) ${line}`,
    );

    return draftShell({
      courtLine,
      suitLine: `Bail Application No. _____ / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}, R/o ${textOrBlank(form.petitionerAddress)}`,
      ],
      leftRole: "PETITIONER",
      rightParty: [
        "1. The State",
        `2. ${textOrBlank(form.complainantName)} S/o ${textOrBlank(form.complainantFather)}`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle: "APPLICATION UNDER SECTION 497 Cr.P.C. FOR GRANT OF POST-ARREST BAIL",
      paragraphs: [
        `1. That the applicant was falsely implicated in the above-titled FIR and was arrested on ${formatLongDate(form.arrestDate)}.`,
        `2. That the applicant is currently in judicial custody at ${textOrBlank(form.jailName)}.`,
        `3. ${firLine}.`,
        "GROUNDS:",
        ...grounds,
      ],
      prayerIntro:
        "In light of the above, it is respectfully prayed that post-arrest bail may kindly be granted to the applicant during the pendency of the trial.",
      prayerItems: [
        "Post-arrest bail may kindly be granted to the applicant on furnishing reliable surety.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      signRole: "PETITIONER",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: defaultVerify(form),
    });
  }

  if (form.appType === "498") {
    const paragraphs: string[] = [
      `1. That the petitioner apprehends arrest / seeks bail directions in FIR No. ${textOrBlank(form.firNo)} dated ${formatLongDate(form.firDate)} under section ${textOrBlank(form.offenses)} ${textOrBlank(form.offenseLaw)}, P.S. ${textOrBlank(form.policeStation)}.`,
      "2. That the petitioner has been falsely implicated due to mala fide intention and prior enmity.",
      "3. That the petitioner undertakes to join the investigation and abide by all conditions imposed by this Honorable Court.",
    ];
    let next = 4;
    if (form.furtherInquiry) {
      paragraphs.push("GROUNDS — FURTHER INQUIRY (s.497(2) Cr.P.C.):");
      for (const line of furtherInquiryGroundLines()) {
        paragraphs.push(`${next}. ${line}`);
        next += 1;
      }
      if (form.pldCitations.trim()) {
        paragraphs.push(`${next}. ${form.pldCitations.trim()}`);
        next += 1;
      }
    }
    paragraphs.push(
      form.extraGrounds.trim()
        ? `${next}. ${form.extraGrounds.trim()}`
        : `${next}. That the ends of justice require grant of the relief prayed for.`,
    );

    return draftShell({
      courtLine,
      suitLine: `Application No. _____ / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}, R/o ${textOrBlank(form.petitionerAddress)}`,
      ],
      leftRole: "PETITIONER",
      rightParty: ["The State", `through P.S. ${textOrBlank(form.policeStation)}`],
      rightRole: "RESPONDENT",
      causeTitle: "APPLICATION UNDER SECTION 498 Cr.P.C.",
      paragraphs,
      prayerIntro: "It is, therefore, respectfully prayed that:",
      prayerItems: [
        "Appropriate directions under section 498 Cr.P.C. may kindly be issued in favour of the petitioner.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      signRole: "PETITIONER",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: defaultVerify(form),
    });
  }

  if (form.appType === "249A" || form.appType === "265K") {
    const section = form.appType === "249A" ? "249-A" : "265-K";
    const grounds: string[] = [];
    if (form.groundless) {
      grounds.push(
        "a) That the charge against the applicant is groundless and can be found so at any stage of the trial.",
      );
    }
    if (form.noMaterial) {
      grounds.push(
        "b) That there is no incriminating material available on the record against the applicant.",
      );
    }
    if (form.zeroConviction) {
      grounds.push(
        "c) That there is zero probability of ultimate conviction of the applicant; continuation of the trial amounts to an exercise in futility.",
      );
    }
    if (form.extraGrounds.trim()) {
      grounds.push(`${String.fromCharCode(97 + grounds.length)}) ${form.extraGrounds.trim()}`);
    }

    return draftShell({
      courtLine,
      suitLine: `The State ðŸ†š ${textOrBlank(form.accusedName || form.petitionerName)}`,
      leftParty: [`${textOrBlank(form.petitionerName)}`, `S/o ${textOrBlank(form.petitionerFather)}`],
      leftRole: "APPLICANT / ACCUSED",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: `APPLICATION UNDER SECTION ${section} Cr.P.C. FOR ACQUITTAL OF APPLICANT/ACCUSED`,
      paragraphs: [
        `1. That the above mentioned case (${firLine}) is pending adjudication before this Honorable Court and fixed for today.`,
        "2. That the allegations leveled against the applicant are false, frivolous and ill founded.",
        "3. That the applicant has not committed any offence mentioned in the FIR.",
        "4. That the petitioner is not nominated in the FIR rather he was nominated in supplementary statement. Furthermore, no Identification Parade was conducted.",
        "5. That no material exists on basis of which the applicant could be convicted. Continuation of the trial against the applicant is exercise in futility and amount to waste the precious time of this Honourable court.",
        "GROUNDS:",
        ...grounds,
      ],
      prayerIntro:
        "It is therefore respectfully prayed that the instant petition may kindly be accepted and the accused be acquitted from the charge.",
      prayerItems: [
        `Acquittal under section ${section} Cr.P.C. may graciously be ordered.`,
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      signRole: "APPLICANT",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: defaultVerify(form),
    });
  }

  if (form.appType === "ID-PARADE") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `State VERSUS ${textOrBlank(form.accusedName)}\nFIR No. ${textOrBlank(form.firNo)}, Police Station: ${textOrBlank(form.policeStation)}`,
      leftParty: [
        textOrBlank(form.petitionerName || form.complainantName),
        `S/o ${textOrBlank(form.petitionerFather || form.complainantFather)}`,
      ],
      leftRole: "APPLICANT / COMPLAINANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR HOLDING OF IDENTIFICATION PARADE OF THE ACCUSED PERSON(S)",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the above-titled case (${firLine}) is pending investigation / trial before the competent forum.`,
        `2. That the accused ${textOrBlank(form.accusedName)} was not previously known to the eye-witnesses, and a fair identification parade is necessary for just decision of the case.`,
        `3. That the proposed parade particulars are as under: ${textOrBlank(form.offenseDescription || form.witnessPurpose)}.`,
        "4. That the ends of justice require that an identification parade be conducted in accordance with law and settled practice.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Direct that an identification parade of the accused be held under proper judicial / magisterial supervision.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "DISCHARGE-63") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `FIR No. ${textOrBlank(form.firNo)} dated ${formatLongDate(form.firDate)}\nPolice Station: ${textOrBlank(form.policeStation)}, ${city}`,
      leftParty: [
        textOrBlank(form.petitionerName),
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT / ACCUSED",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR DISCHARGE OF ACCUSED FROM POLICE CUSTODY UNDER SECTIONS 63 & 167 OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the applicant stands nominated / detained in FIR No. ${textOrBlank(form.firNo)} dated ${formatLongDate(form.firDate)}, Police Station ${textOrBlank(form.policeStation)}, ${city}.`,
        "2. That the applicant has been kept in police custody beyond the contemplation of sections 63 and 167 Cr.P.C., and the remand is liable to be declined / recalled.",
        `3. That the remand anomalies and irregularities are as under: ${textOrBlank(form.remandAnomalies || form.extraGrounds)}.`,
        "4. That continued detention without lawful remand is unconstitutional and an abuse of process.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Discharge / release the applicant from police custody under sections 63 and 167 Cr.P.C.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "HABEAS-491") {
    const detenu = textOrBlank(form.detenueName);
    const petCity = textOrBlank(form.petitionerCity || form.district);
    const privateResp = textOrBlank(form.respondent2Name);
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE SESSIONS JUDGE / EX-OFFICIO JUSTICE OF THE PEACE, ${city}`,
      suitLine: `Criminal Miscellaneous (Habeas Corpus) Application No. _________ / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)} son of ${textOrBlank(form.petitionerFather)},`,
        `Resident of ${textOrBlank(form.petitionerAddress)}, ${petCity}.`,
      ],
      leftRole: "PETITIONER",
      rightParty: [
        `1. The Station House Officer (SHO),`,
        `   Police Station ${textOrBlank(form.policeStation)}, District ${city}.`,
        `2. ${privateResp}`,
        `   [Designation/Rank if applicable], Police Station ${textOrBlank(form.policeStation)}.`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle: `APPLICATION UNDER SECTION 491 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE ISSUANCE OF A WRIT OF HABEAS CORPUS FOR THE IMMEDIATE RECOVERY AND RELEASE OF THE DETENU NAMELY ${detenu}, WHO HAS BEEN ILLEGALLY CONFINED IN AN UNAUTHORIZED LOCKUP BY THE RESPONDENTS.`,
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER:",
      paragraphs: [
        `1. That the petitioner is a law-abiding citizen, a permanent resident of ${petCity}, and is the ${textOrBlank(form.relationshipToDetenu)} of the detenu, namely ${detenu} son of ${textOrBlank(form.detenuParentage)}.`,
        `2. That on dated ${formatLongDate(form.incidentDate)} at approximately ${formatTimeOrBlank(form.incidentTime)}, Respondent No. 2 along with secondary police officials unlawfully raided the house of the detenu and took him into physical custody without any lawful authority, judicial warrant, or registered First Information Report (FIR).`,
        `3. That the detenu has been kept in an unauthorized, secret, and unregistered cell at Police Station ${textOrBlank(form.policeStation)} for the past ${textOrBlank(form.detentionDurationHours)} hours without being produced before any judicial magistrate, which is a flagrant violation of Article 10 of the Constitution of Pakistan, 1973.`,
        `4. That the petitioner visited the police station and discovered that the respondents are subjecting the detenu to severe physical torture and mental coercion to extort illegal gratification and bribe money amounting to PKR ${textOrBlank(form.extortionDemandedAmount)}/-.`,
        "5. That the life, physical safety, and fundamental liberty of the detenu are in imminent, grave danger at the hands of the respondents. The confinement is entirely mala-fide, unlawful, and an abuse of official police powers.",
        ...(formatPrecedentGroundsBlock("HABEAS-491")
          ? formatPrecedentGroundsBlock("HABEAS-491").split("\n")
          : []),
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this emergency application may be accepted and this Honorable Court may graciously be pleased to:",
      prayerItems: [
        `a. Appoint a Court Bailiff with explicit directions to conduct an immediate, surprise raid at Police Station ${textOrBlank(form.policeStation)} (including all hidden quarters and private rooms) to locate, recover, and produce the detenu before this Honorable Court.`,
        "b. Direct the immediate release of the detenu from the unlawful, unauthorized custody of the respondents, in the interest of absolute justice and human liberty.",
      ],
      signRole: "Petitioner",
      lawyerName: textOrBlank(form.lawyerName) || legalCounselFooter() || firm.name,
      lawyerLines: [
        "Advocates & Legal Consultants",
        `Office: ${firm.name}, Dera Ghazi Khan`,
      ],
      verificationText: "",
    });
  }

  if (form.appType === "WITNESS-RECALL-540") {
    const caseCaption =
      form.caseTitle.trim() ||
      `State VERSUS ${textOrBlank(form.accusedName)}`;
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: caseCaption,
      leftParty: [
        textOrBlank(form.petitionerName),
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR RECALLING AND RE-EXAMINATION OF PROSECUTION WITNESS UNDER SECTION 540 OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the above-titled matter (${caseCaption}) is pending adjudication before this Honorable Court at ${city}.`,
        `2. That prosecution witness namely ${textOrBlank(form.witnessName)} has already been examined / partly examined.`,
        `3. That material omissions and contradictions requiring recall and re-examination are as under: ${textOrBlank(form.omissionContradictionDetails || form.witnessPurpose)}.`,
        "4. That section 540 Cr.P.C. empowers this Honorable Court to recall any witness at any stage if his evidence appears essential to the just decision of the case.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        `Recall and re-examine witness ${textOrBlank(form.witnessName)} under section 540 Cr.P.C.`,
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "E-EVIDENCE-164") {
    const caseCaption =
      form.caseTitle.trim() ||
      `State VERSUS ${textOrBlank(form.accusedName)}`;
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: caseCaption,
      leftParty: [
        textOrBlank(form.petitionerName || form.complainantName),
        `S/o ${textOrBlank(form.petitionerFather || form.complainantFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR PRODUCTION AND ADMISSIBILITY OF SECONDARY ELECTRONIC EVIDENCE UNDER ARTICLE 164 OF THE QANUN-E-SHAHADAT ORDER, 1984",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the above-titled case (${caseCaption}) is pending before this Honorable Court at ${city}.`,
        `2. That the secondary electronic evidence sought to be produced is of the nature: ${textOrBlank(form.mediaTypeCctvAudio || form.electronicMediaDesc)}.`,
        `3. That the device / source verification particulars are: ${textOrBlank(form.deviceSourceVerification || form.offenseDescription)}.`,
        "4. That Article 164 of the Qanun-e-Shahadat Order, 1984, permits the Court to allow production of evidence generated by modern devices.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Permit production and mark the secondary electronic evidence on the judicial record.",
        "Issue such directions for custody, cloning, or forensic examination as may be necessary.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "BAIL-CANCEL-497") {
    return draftShell({
      courtLine,
      suitLine: `Bail Cancellation Application No. _____ / ${year}`,
      leftParty: [
        textOrBlank(form.complainantName || form.petitionerName),
        `S/o ${textOrBlank(form.complainantFather || form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT / COMPLAINANT",
      rightParty: [
        "1. The State",
        `2. ${textOrBlank(form.accusedName)} (accused enlarged on bail)`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle:
        "APPLICATION FOR THE CANCELLATION AND REVOCATION OF GRANTED BAIL UNDER SECTION 497(5) OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the accused namely ${textOrBlank(form.accusedName)} was enlarged on bail in FIR No. ${textOrBlank(form.firNo)}, Police Station ${textOrBlank(form.policeStation)}, ${city}.`,
        "2. That after grant of bail, the accused has misused the concession and the order is liable to be recalled under section 497(5) Cr.P.C.",
        `3. That the particulars of witness tampering / misuse of bail are: ${textOrBlank(form.witnessTamperingParticulars || form.extraGrounds)}.`,
        "4. That in the interest of justice, the bail order is liable to be cancelled and the accused remanded to custody.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Cancel and revoke the bail granted to the accused and remand him to custody.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: defaultVerify(form),
    });
  }

  if (form.appType === "PERISHABLE-516A") {
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: `Misc. Application under Section 516-A Cr.P.C. / ${year}`,
      leftParty: [
        textOrBlank(form.petitionerName),
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: [
        "1. The State",
        `2. Station House Officer, Police Station ${textOrBlank(form.policeStation)}`,
      ],
      rightRole: "RESPONDENTS",
      causeTitle:
        "APPLICATION FOR DISPOSAL AND IMMEDIATE AUCTION OF PERISHABLE SEIZED PROPERTY UNDER THE PROVISO TO SECTION 516-A OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That certain property has been seized in connection with a case registered at Police Station ${textOrBlank(form.policeStation)}, ${city}.`,
        `2. That the seized property is described as: ${textOrBlank(form.propertyDescription)}.`,
        `3. That the property is perishable and there exists a high probability of decay / diminution of value: ${textOrBlank(form.decayProbabilityJustification)}.`,
        "4. That the proviso to section 516-A Cr.P.C. empowers this Honorable Court to order immediate sale / auction of perishable property pending final orders.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Direct immediate disposal / auction of the perishable seized property under the proviso to section 516-A Cr.P.C.",
        "Direct that the sale proceeds be deposited in accordance with law pending final adjudication.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "SEVERANCE-239") {
    const caseCaption =
      form.caseTitle.trim() ||
      `State VERSUS ${textOrBlank(form.accusedName || form.petitionerName)}`;
    return draftShell({
      courtLine: `IN THE COURT OF THE HONORABLE ${textOrBlank(form.courtTitle)}, ${city}`,
      suitLine: caseCaption,
      leftParty: [
        textOrBlank(form.petitionerName),
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPLICANT / ACCUSED",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR SEPARATION OF TRIALS AND SEVERANCE OF CHARGES UNDER SECTION 239 OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the above-titled case (${caseCaption}) is pending before this Honorable Court at ${city}.`,
        `2. That co-accused namely ${textOrBlank(form.coAccusedName)} is being tried jointly with the applicant.`,
        `3. That a joint trial would cause serious prejudice because of the following conflicting defence grounds: ${textOrBlank(form.conflictingDefenseGrounds || form.extraGrounds)}.`,
        "4. That section 239 Cr.P.C. and the ends of justice require separation of trials / severance of charges.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Order separation of trials and severance of charges as against the applicant.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPLICANT",
      ...counsel,
      verificationText: "",
    });
  }

  if (form.appType === "SUSPEND-426") {
    const appellate =
      textOrBlank(form.appellateCourtName || form.courtTitle) ||
      "APPELLATE COURT";
    return draftShell({
      courtLine: `IN THE COURT OF THE ${appellate}, ${city}`,
      suitLine: `Criminal Appeal No. ${textOrBlank(form.appealNumber)} / ${year}`,
      leftParty: [
        textOrBlank(form.petitionerName),
        `S/o ${textOrBlank(form.petitionerFather)}`,
      ],
      leftRole: "APPELLANT / APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle:
        "APPLICATION FOR SUSPENSION OF SENTENCE PENDING ADJUDICATION OF CRIMINAL APPEAL UNDER SECTION 426 OF THE CODE OF CRIMINAL PROCEDURE, 1898",
      shewethLabel: "Respectfully Sheweth:",
      prayerHeading: "PRAYER",
      paragraphs: [
        `1. That the appellant namely ${textOrBlank(form.petitionerName)} has preferred Criminal Appeal No. ${textOrBlank(form.appealNumber)} before this Honorable Court at ${city}.`,
        `2. That the appellant has been sentenced to undergo imprisonment for ${textOrBlank(form.sentenceDuration)}.`,
        "3. That the appeal raises substantial questions of law and fact and is likely to succeed.",
        "4. That section 426 Cr.P.C. empowers this Honorable Court to suspend the sentence pending adjudication of the appeal.",
      ],
      prayerIntro:
        "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
      prayerItems: [
        "Suspend the sentence awarded to the appellant pending final adjudication of the criminal appeal.",
        "Release the appellant on bail / bonds to the satisfaction of this Honorable Court.",
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "APPELLANT",
      ...counsel,
      verificationText: defaultVerify(form),
    });
  }

  if (form.appType === "court-witness") {
    return draftShell({
      courtLine,
      suitLine: `Application in FIR No. ${textOrBlank(form.firNo)} / ${year}`,
      leftParty: [
        `${textOrBlank(form.petitionerName)}`,
        `S/o ${textOrBlank(form.petitionerFather)}, R/o ${textOrBlank(form.petitionerAddress)}`,
      ],
      leftRole: "APPLICANT",
      rightParty: ["The State"],
      rightRole: "RESPONDENT",
      causeTitle: "APPLICATION FOR SUMMONING OF WITNESS AS COURT WITNESS",
      paragraphs: [
        `1. That the above titled case (${firLine}) is pending before this Honorable Court.`,
        `2. That the evidence of ${textOrBlank(form.witnessName)} is essential for just decision of the case.`,
        `3. That the said witness is required as Court Witness for the purpose that ${textOrBlank(form.witnessPurpose)}.`,
        "4. That summoning of the said witness shall advance the cause of justice and cause no prejudice to either side.",
      ],
      prayerIntro: "It is, therefore, respectfully prayed that:",
      prayerItems: [
        `This Honorable Court may graciously summon ${textOrBlank(form.witnessName)} as Court Witness.`,
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      signRole: "APPLICANT",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: defaultVerify(form),
    });
  }

  const _exhaustive: never = form.appType;
  throw new Error(`Unhandled criminal application type: ${String(_exhaustive)}`);
}
