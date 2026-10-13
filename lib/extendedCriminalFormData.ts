import {
  EXTENDED_CRIMINAL_SYSTEM_REGISTRY,
  type ExtendedCriminalModuleKey,
} from "@/lib/config/automationRegistry";
import type { CriminalForm } from "@/lib/criminal";
import { firm } from "@/lib/firm";
import { formatLongDate } from "@/lib/format";

/** Map CriminalForm → snake_case payload for extended automation modules. */
export function criminalFormToExtendedFormData(
  moduleKey: ExtendedCriminalModuleKey,
  form: CriminalForm,
): Record<string, string> {
  const base: Record<string, string> = {
    court_city: form.district,
    police_station: form.policeStation,
    fir_number: form.firNo,
    fir_date: form.firDate ? formatLongDate(form.firDate) : form.firDate,
    fir_no: form.firNo,
    petitioner_name: form.petitionerName,
    petitioner_parentage: form.petitionerFather,
    petitioner_address: form.petitionerAddress,
    petitioner_city: form.petitionerCity || form.district,
    case_title: form.caseTitle,
    witness_name: form.witnessName,
    accused_name: form.accusedName,
    property_description: form.propertyDescription,
    remand_anomalies: form.remandAnomalies || form.extraGrounds,
    private_respondent_name_or_Police_Officer: form.respondent2Name,
    detenu_name: form.detenueName,
    detenu_parentage: form.detenuParentage,
    relationship_to_detenu: form.relationshipToDetenu,
    abduction_date: form.incidentDate
      ? formatLongDate(form.incidentDate)
      : form.incidentDate,
    abduction_time: form.incidentTime,
    detention_duration_hours: form.detentionDurationHours,
    extortion_demanded_amount: form.extortionDemandedAmount,
    decay_probability_justification: form.decayProbabilityJustification,
    omission_contradiction_details:
      form.omissionContradictionDetails || form.witnessPurpose,
    co_accused_name: form.coAccusedName,
    conflicting_defense_grounds:
      form.conflictingDefenseGrounds || form.extraGrounds,
    media_type_cctv_audio: form.mediaTypeCctvAudio || form.electronicMediaDesc,
    device_source_verification:
      form.deviceSourceVerification || form.offenseDescription,
    witness_tampering_particulars:
      form.witnessTamperingParticulars || form.extraGrounds,
    appellate_court_name: form.appellateCourtName || form.courtTitle,
    appellant_name: form.petitionerName,
    sentence_duration: form.sentenceDuration,
    appeal_number: form.appealNumber,
    court_title: form.courtTitle,
    district: form.district,
  };

  const fields = EXTENDED_CRIMINAL_SYSTEM_REGISTRY[moduleKey].validationFields;
  const out: Record<string, string> = {};
  for (const key of fields) {
    out[key] = base[key] ?? "";
  }
  return out;
}

export function legalCounselFooterText(): string {
  return firm.name;
}

export function documentGenerationDatePk(date = new Date()): string {
  return date.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
