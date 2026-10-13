/**
 * Extended criminal automation modules — disk templates + validation for
 * POST /api/v1/automate/extended-criminal and Criminal Applications Writer.
 */

export type ExtendedCriminalModule = {
  statutorySection: string;
  englishHeader: string;
  diskTemplatePath: string;
  validationFields: readonly string[];
  /** Criminal Applications Writer type id (dropdown / ?type=). */
  writerTypeId: string;
};

export const EXTENDED_CRIMINAL_SYSTEM_REGISTRY = {
  criminal_accused_discharge: {
    statutorySection: "Section 63 & 167 CrPC",
    englishHeader: "APPLICATION FOR DISCHARGE OF ACCUSED FROM POLICE CUSTODY",
    diskTemplatePath: "templates/criminal/accused_discharge_63.docx",
    validationFields: [
      "court_city",
      "police_station",
      "fir_number",
      "fir_date",
      "petitioner_name",
      "remand_anomalies",
    ],
    writerTypeId: "DISCHARGE-63",
  },
  criminal_habeas_corpus: {
    statutorySection: "Section 491 CrPC",
    englishHeader:
      "APPLICATION FOR ISSUANCE OF WRIT OF HABEAS CORPUS FOR RECOVERY OF DETENU",
    diskTemplatePath: "templates/criminal/habeas_corpus_491.docx",
    validationFields: [
      "court_city",
      "petitioner_name",
      "petitioner_parentage",
      "petitioner_address",
      "petitioner_city",
      "police_station",
      "private_respondent_name_or_Police_Officer",
      "detenu_name",
      "detenu_parentage",
      "relationship_to_detenu",
      "abduction_date",
      "abduction_time",
      "detention_duration_hours",
      "extortion_demanded_amount",
    ],
    writerTypeId: "HABEAS-491",
  },
  criminal_perishable_property: {
    statutorySection: "Section 516-A Proviso CrPC",
    englishHeader:
      "APPLICATION FOR DISPOSAL AND IMMEDIATE AUCTION OF PERISHABLE SEIZED PROPERTY",
    diskTemplatePath: "templates/criminal/perishable_property_516a.docx",
    validationFields: [
      "court_city",
      "police_station",
      "property_description",
      "decay_probability_justification",
    ],
    writerTypeId: "PERISHABLE-516A",
  },
  criminal_witness_recall: {
    statutorySection: "Section 540 CrPC",
    englishHeader:
      "APPLICATION FOR RECALLING AND RE-EXAMINATION OF PROSECUTION WITNESS",
    diskTemplatePath: "templates/criminal/witness_recall_540.docx",
    validationFields: [
      "court_city",
      "case_title",
      "witness_name",
      "omission_contradiction_details",
    ],
    writerTypeId: "WITNESS-RECALL-540",
  },
  criminal_trial_severance: {
    statutorySection: "Section 239 CrPC",
    englishHeader: "APPLICATION FOR SEPARATION OF TRIALS AND SEVERANCE OF CHARGES",
    diskTemplatePath: "templates/criminal/trial_severance_239.docx",
    validationFields: [
      "court_city",
      "case_title",
      "co_accused_name",
      "conflicting_defense_grounds",
    ],
    writerTypeId: "SEVERANCE-239",
  },
  criminal_electronic_evidence: {
    statutorySection: "Article 164 QSO 1984",
    englishHeader:
      "APPLICATION FOR PRODUCTION AND ADMISSIBILITY OF SECONDARY ELECTRONIC EVIDENCE",
    diskTemplatePath: "templates/criminal/electronic_evidence_164.docx",
    validationFields: [
      "court_city",
      "case_title",
      "media_type_cctv_audio",
      "device_source_verification",
    ],
    writerTypeId: "E-EVIDENCE-164",
  },
  criminal_bail_cancellation: {
    statutorySection: "Section 497(5) CrPC",
    englishHeader:
      "APPLICATION FOR THE CANCELLATION AND REVOCATION OF GRANTED BAIL",
    diskTemplatePath: "templates/criminal/bail_cancellation_497.docx",
    validationFields: [
      "court_city",
      "police_station",
      "fir_number",
      "accused_name",
      "witness_tampering_particulars",
    ],
    writerTypeId: "BAIL-CANCEL-497",
  },
  criminal_sentence_suspension: {
    statutorySection: "Section 426 CrPC",
    englishHeader:
      "APPLICATION FOR SUSPENSION OF SENTENCE PENDING ADJUDICATION OF CRIMINAL APPEAL",
    diskTemplatePath: "templates/criminal/sentence_suspension_426.docx",
    validationFields: [
      "appellate_court_name",
      "court_city",
      "appellant_name",
      "sentence_duration",
      "appeal_number",
    ],
    writerTypeId: "SUSPEND-426",
  },
} as const satisfies Record<string, ExtendedCriminalModule>;

export type ExtendedCriminalModuleKey =
  keyof typeof EXTENDED_CRIMINAL_SYSTEM_REGISTRY;

export function isExtendedCriminalModuleKey(
  key: string,
): key is ExtendedCriminalModuleKey {
  return Object.prototype.hasOwnProperty.call(
    EXTENDED_CRIMINAL_SYSTEM_REGISTRY,
    key,
  );
}

/** Writer type id → extended registry module key (for Download .docx routing). */
export const WRITER_TYPE_TO_EXTENDED_MODULE: Partial<
  Record<string, ExtendedCriminalModuleKey>
> = Object.fromEntries(
  (
    Object.entries(EXTENDED_CRIMINAL_SYSTEM_REGISTRY) as [
      ExtendedCriminalModuleKey,
      ExtendedCriminalModule,
    ][]
  ).map(([moduleKey, mod]) => [mod.writerTypeId, moduleKey]),
);

export function getExtendedModuleByWriterType(
  writerTypeId: string,
): ExtendedCriminalModuleKey | undefined {
  return WRITER_TYPE_TO_EXTENDED_MODULE[writerTypeId];
}
