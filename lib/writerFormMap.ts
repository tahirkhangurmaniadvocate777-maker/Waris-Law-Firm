import {
  COURT_DEFAULTS,
  emptyCriminalForm,
  type CriminalAppType,
  type CriminalForm,
  type ParentRole,
} from "@/lib/criminal";

/** Snake_case / mockup aliases → CriminalForm keys. */
const FIELD_ALIASES: Record<string, keyof CriminalForm> = {
  court_tier_name: "courtTitle",
  court_title: "courtTitle",
  court_city: "district",
  district: "district",
  case_title: "caseTitle",
  accused_name: "accusedName",
  fir_number: "firNo",
  fir_no: "firNo",
  fir_date: "firDate",
  police_station: "policeStation",
  police_subdivision: "policeSubdivision",
  sudden_emergency_reason: "suddenEmergencyReason",
  discharge_section: "dischargeSection",
  detenue_name: "detenueName",
  detenu_name: "detenueName",
  detention_place: "detentionPlace",
  electronic_media_desc: "electronicMediaDesc",
  electronic_evidence_section: "electronicEvidenceSection",
  detenu_parentage: "detenuParentage",
  relationship_to_detenu: "relationshipToDetenu",
  abduction_date: "incidentDate",
  abduction_time: "incidentTime",
  detention_duration_hours: "detentionDurationHours",
  extortion_demanded_amount: "extortionDemandedAmount",
  private_respondent_name_or_Police_Officer: "respondent2Name",
  remand_anomalies: "remandAnomalies",
  decay_probability_justification: "decayProbabilityJustification",
  omission_contradiction_details: "omissionContradictionDetails",
  co_accused_name: "coAccusedName",
  conflicting_defense_grounds: "conflictingDefenseGrounds",
  media_type_cctv_audio: "mediaTypeCctvAudio",
  device_source_verification: "deviceSourceVerification",
  witness_tampering_particulars: "witnessTamperingParticulars",
  appellate_court_name: "appellateCourtName",
  appellant_name: "petitionerName",
  appeal_number: "appealNumber",
  occurrence_date: "incidentDate",
  occurrence_time: "incidentTime",
  offense_sections: "offenses",
  offense_description: "offenseDescription",
  offense_law: "offenseLaw",
  approach_date: "visitDate",
  visit_date: "visitDate",
  petitioner_name: "petitionerName",
  petitioner_parentage: "petitionerFather",
  petitioner_father: "petitionerFather",
  petitioner_address: "petitionerAddress",
  petitioner_city: "petitionerCity",
  petitioner_caste: "petitionerCaste",
  parent_role: "parentRole",
  proposed_accused_name: "respondent2Name",
  proposed_accused_parentage: "respondent2Father",
  proposed_accused_address: "respondent2Address",
  complainant_name: "complainantName",
  complainant_father: "complainantFather",
  complainant_parentage: "complainantFather",
  arrest_date: "arrestDate",
  jail_name: "jailName",
  jail_location: "jailLocation",
  witness_name: "witnessName",
  witness_purpose: "witnessPurpose",
  extra_grounds: "extraGrounds",
  respondent2_name: "respondent2Name",
  respondent2_father: "respondent2Father",
  respondent2_caste: "respondent2Caste",
  respondent2_address: "respondent2Address",
  respondent3_name: "respondent3Name",
  respondent3_father: "respondent3Father",
  respondent3_caste: "respondent3Caste",
  respondent3_address: "respondent3Address",
  respondent_name: "respondentName",
  minor_name: "minorName",
  minor_age: "minorAge",
  incident_date: "incidentDate",
  incident_time: "incidentTime",
  lawyer_name: "lawyerName",
  advocate_name: "lawyerName",
  verification_date: "verificationDate",
  property_type: "propertyType",
  property_description: "propertyDescription",
  chassis_number: "chassisNumber",
  engine_number: "engineNumber",
  dispensation_section: "dispensationSection",
  reason_for_absence: "reasonForAbsence",
  charge_framing_date: "chargeFramingDate",
  current_charge_sections: "currentChargeSections",
  faulty_section: "faultySection",
  dispute_brief_context: "disputeBriefContext",
  appeal_statute_section: "appealStatuteSection",
  judgment_date: "judgmentDate",
  trial_judge_title: "trialJudgeTitle",
  sentence_duration: "sentenceDuration",
  conviction_sections: "convictionSections",
  order_date: "orderDate",
  application_nature: "applicationNature",
  accused1_name: "accused1Name",
  accused1_parentage: "accused1Parentage",
  accused2_name: "accused2Name",
  accused2_parentage: "accused2Parentage",
  detailed_crime_acts: "detailedCrimeActs",
  witness1_name: "witness1Name",
  witness1_address: "witness1Address",
  witness2_name: "witness2Name",
  witness2_address: "witness2Address",
  groundless: "groundless",
  no_material: "noMaterial",
  zero_conviction: "zeroConviction",
  further_inquiry: "furtherInquiry",
  pld_citations: "pldCitations",
};

const BOOLEAN_KEYS = new Set<keyof CriminalForm>([
  "groundless",
  "noMaterial",
  "zeroConviction",
  "furtherInquiry",
]);

function parseBool(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Flatten FormData / object / form element into string record. */
export function normalizeWriterFields(
  input: FormData | HTMLFormElement | Record<string, unknown> | object,
): Record<string, string> {
  if (typeof HTMLFormElement !== "undefined" && input instanceof HTMLFormElement) {
    return normalizeWriterFields(new FormData(input));
  }
  if (typeof FormData !== "undefined" && input instanceof FormData) {
    const out: Record<string, string> = {};
    input.forEach((value, key) => {
      if (typeof value === "string") out[key] = value;
    });
    return out;
  }
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (value == null) continue;
    if (typeof value === "boolean") {
      out[key] = value ? "true" : "false";
      continue;
    }
    out[key] = String(value);
  }
  return out;
}

/** Map submitted fields onto a CriminalForm for the given application type. */
export function fieldsToCriminalForm(
  type: CriminalAppType,
  fields: Record<string, string>,
): CriminalForm {
  const form = emptyCriminalForm();
  form.appType = type;
  form.courtTitle = COURT_DEFAULTS[type] ?? form.courtTitle;

  for (const [rawKey, rawValue] of Object.entries(fields)) {
    if (rawKey === "type" || rawKey === "appType" || rawKey === "format") continue;
    const key = (FIELD_ALIASES[rawKey] ??
      (rawKey in form ? (rawKey as keyof CriminalForm) : undefined)) as
      | keyof CriminalForm
      | undefined;
    if (!key) continue;

    if (BOOLEAN_KEYS.has(key)) {
      if (key === "groundless") form.groundless = parseBool(rawValue);
      else if (key === "noMaterial") form.noMaterial = parseBool(rawValue);
      else if (key === "zeroConviction") form.zeroConviction = parseBool(rawValue);
      else if (key === "furtherInquiry") form.furtherInquiry = parseBool(rawValue);
      continue;
    }
    if (key === "parentRole") {
      form.parentRole = (rawValue === "mother" ? "mother" : "father") as ParentRole;
      continue;
    }
    if (typeof form[key] === "string") {
      // Assign string fields only (booleans / parentRole handled above).
      Object.assign(form, { [key]: rawValue });
    }
  }

  return form;
}

/** Serialize CriminalForm into a flat string record for API submit. */
export function criminalFormToFields(form: CriminalForm): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(form)) {
    if (key === "appType") continue;
    if (typeof value === "boolean") {
      out[key] = value ? "true" : "false";
    } else {
      out[key] = String(value ?? "");
    }
  }
  return out;
}

export const DOC_FILENAMES: Record<CriminalAppType, string> = {
  "497": "Bail-497-Post-Arrest.docx",
  "498": "Bail-Directions-498.docx",
  "249A": "Acquittal-249A.docx",
  "265K": "Acquittal-265K.docx",
  "court-witness": "Court-Witness-Summons.docx",
  "491-552": "Minor-Recovery-491-552.docx",
  "22A-22B": "FIR-Direction-22A-22B.docx",
  "516A": "Superdari-516A.docx",
  NBW: "NBW-Absconding-Arrest.docx",
  DISPENSE: "Dispense-Personal-Attendance.docx",
  "216": "Alteration-of-Charges-216.docx",
  NONHARASS: "Non-Harassment-Direction.docx",
  APPEAL: "Criminal-Appeal-Conviction.docx",
  REVISION: "Criminal-Revision-439.docx",
  "200": "Private-Complaint-200.docx",
  SUMMON200: "Summon-Accused-Private-Complaint.docx",
  "WITNESS-SUMMONS": "Witness-Summons-Evidence.docx",
  "MEDICAL-BOARD": "Medical-Board-Reexamination.docx",
  "EXEMPT-ADJOURN": "Exemption-Adjournment.docx",
  "ID-PARADE": "identification_parade.docx",
  "DISCHARGE-63": "accused_discharge_63.docx",
  "HABEAS-491": "habeas_corpus_491.docx",
  "WITNESS-RECALL-540": "witness_recall_540.docx",
  "E-EVIDENCE-164": "electronic_evidence_164.docx",
  "BAIL-CANCEL-497": "bail_cancellation_497.docx",
  "PERISHABLE-516A": "perishable_property_516a.docx",
  "SEVERANCE-239": "trial_severance_239.docx",
  "SUSPEND-426": "sentence_suspension_426.docx",
};
