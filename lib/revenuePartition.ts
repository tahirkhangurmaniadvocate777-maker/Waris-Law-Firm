import { firm } from "@/lib/firm";

export type PartitionRespondent = {
  name: string;
  address: string;
  cnic?: string;
};

/** Revenue Court forums for Sec. 135 agricultural partition (Takseem). */
export const PARTITION_COURT_OPTIONS = [
  "Court of Tehsildar / Assistant Collector 1st Grade",
  "Court of Collector / Deputy Commissioner",
] as const;

/** Land classification options for joint Khata particulars. */
export const PARTITION_LAND_TYPE_OPTIONS = [
  "Chahi / Nehri (Irrigated)",
  "Barani (Rainfed)",
  "Banjar (Uncultivated)",
] as const;

export interface PartitionAppData {
  court_name: string;
  district: string;
  tehsil: string;
  mauza_village: string;
  applicant_name: string;
  applicant_parentage: string;
  applicant_cnic: string;
  applicant_phone: string;
  applicant_share: string;
  applicant_address: string;
  respondents: PartitionRespondent[];
  /** Comma-separated co-sharer names (synced with `respondents`). */
  respondent_names: string;
  khata_number: string;
  khatauni_number: string;
  khasra_numbers: string;
  total_area: string;
  land_type: string;
  revenue_assessment?: string;
  partition_reason: string;
}

export function emptyPartitionAppData(): PartitionAppData {
  return {
    court_name: PARTITION_COURT_OPTIONS[0],
    district: firm.defaultCourt,
    tehsil: firm.defaultCourt,
    mauza_village: "",
    applicant_name: "",
    applicant_parentage: "",
    applicant_cnic: "",
    applicant_phone: "",
    applicant_share: "",
    applicant_address: "",
    respondents: [{ name: "", address: "", cnic: "" }],
    respondent_names: "",
    khata_number: "",
    khatauni_number: "",
    khasra_numbers: "",
    total_area: "",
    land_type: PARTITION_LAND_TYPE_OPTIONS[0],
    revenue_assessment: "",
    partition_reason: "",
  };
}

/** Fixed numbering for comma-separated respondent names (never literal `i + 1. {name}`). */
export function formatRespondentNamesList(csv: string): string {
  return csv
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, i) => `${i + 1}. ${name.trim()}`)
    .join("\n");
}

export function respondentsFromNamesCsv(csv: string): PartitionRespondent[] {
  const names = csv
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  if (names.length === 0) return [{ name: "", address: "", cnic: "" }];
  return names.map((name) => ({ name, address: "", cnic: "" }));
}

export function respondentsToNamesCsv(respondents: PartitionRespondent[]): string {
  return respondents
    .map((row) => row.name.trim())
    .filter(Boolean)
    .join(", ");
}

export type PartitionRequiredField =
  | "khata_number"
  | "khatauni_number"
  | "mauza_village"
  | "applicant_name";

export const PARTITION_REQUIRED_LABELS: Record<PartitionRequiredField, string> = {
  khata_number: "Khewat number",
  khatauni_number: "Khatooni number",
  mauza_village: "Mauza / village",
  applicant_name: "Applicant name",
};

export type PartitionValidationErrors = Partial<
  Record<PartitionRequiredField, string>
>;

/** Strict gate before preview / print — khewat, khatooni, mauza, applicant name. */
export function validatePartitionAppData(
  data: PartitionAppData,
): PartitionValidationErrors {
  const errors: PartitionValidationErrors = {};
  if (!data.khata_number.trim()) {
    errors.khata_number = `${PARTITION_REQUIRED_LABELS.khata_number} is required.`;
  }
  if (!data.khatauni_number.trim()) {
    errors.khatauni_number = `${PARTITION_REQUIRED_LABELS.khatauni_number} is required.`;
  }
  if (!data.mauza_village.trim()) {
    errors.mauza_village = `${PARTITION_REQUIRED_LABELS.mauza_village} is required.`;
  }
  if (!data.applicant_name.trim()) {
    errors.applicant_name = `${PARTITION_REQUIRED_LABELS.applicant_name} is required.`;
  }
  return errors;
}

export function missingPartitionFields(
  data: PartitionAppData,
): PartitionRequiredField[] {
  return Object.keys(validatePartitionAppData(data)) as PartitionRequiredField[];
}

export function partitionIsValid(data: PartitionAppData): boolean {
  return missingPartitionFields(data).length === 0;
}

/**
 * Compiles the raw input state data into a standardized, court-style
 * text template with formal headers, title blocks, and prayers.
 * Preserves Naksha Alif / Be / Jeem formal English for Sec. 135.
 */
export function buildRevenuePartitionDraft(data: PartitionAppData): string {
  const namedRespondents = data.respondents.filter((r) => r.name.trim());
  const fromCsv = formatRespondentNamesList(data.respondent_names);
  const respondentBlock =
    namedRespondents.length > 0
      ? namedRespondents
          .map((resp, i) => {
            const cnicStr = resp.cnic?.trim() ? ` (CNIC: ${resp.cnic.trim()})` : "";
            const name = resp.name.trim();
            const address = resp.address.trim();
            return address
              ? `${i + 1}. ${name.trim()}${cnicStr}, r/o ${address}`
              : `${i + 1}. ${name.trim()}${cnicStr}`;
          })
          .join("\n")
      : fromCsv || "1. ________________";

  const assessmentClause = data.revenue_assessment?.trim()
    ? ` with an annual land revenue assessment calculated at Rs. ${data.revenue_assessment}/-`
    : "";

  const reasonBlock = (data.partition_reason.trim() || "________________").replace(
    /\n/g,
    "\n   ",
  );

  const parentage = data.applicant_parentage.trim();
  const applicantLine = parentage
    ? `${(data.applicant_name || "________________").toUpperCase()} son/daughter of ${parentage.toUpperCase()}`
    : (data.applicant_name || "________________").toUpperCase();

  const verifyDate = new Date().toLocaleDateString("en-GB");
  const area = data.total_area.trim() || "________________";

  return `
BEFORE THE HONOURABLE COURT OF ${data.court_name.toUpperCase()},
AT ${data.tehsil.toUpperCase() || data.district.toUpperCase()}

In the matter of:

${applicantLine}
CNIC: ${data.applicant_cnic.trim() || "________________"}
Resident of: Mauza ${data.mauza_village.trim() || "________________"}, Tehsil ${data.tehsil.trim() || "________________"}, District ${data.district.trim() || "________________"}
${data.applicant_address.trim() ? `Address: ${data.applicant_address.trim()}` : ""}
Cell: ${data.applicant_phone.trim() || "________________"}
                                                        ...PETITIONER / APPLICANT / SAEL

                                     VERSUS

${respondentBlock}
                                                        ...RESPONDENTS / MAZKOOR-ALAIH

APPLICATION FOR PARTITION (TAKSEEM) OF AGRICULTURAL LAND UNDER SECTION 135 OF THE WEST PAKISTAN LAND REVENUE ACT, 1967

Respectfully Sheweth:

1. That the Petitioner along with the Respondents are joint owners (Co-sharers / Khatedars) in possession of agricultural land measuring ${area}, bearing Khewat/Khata No. ${data.khata_number.trim() || "________________"}, Khatooni/Khatauni No. ${data.khatauni_number.trim() || "________________"}, comprised in Khasra No(s). ${data.khasra_numbers.trim() || "________________"}, situated at Mauza/Estate ${data.mauza_village.trim() || "________________"}, Tehsil ${data.tehsil.trim() || "________________"}, District ${data.district.trim() || "________________"}, as per the current Fard Malkiyat / Jamabandi.

2. That the nature of the joint land holding is categorized under revenue classifications as ${(data.land_type || "________________").toUpperCase()}${assessmentClause}. The joint holding is currently un-partitioned, and due to joint ownership the Petitioner faces practical hardship in cultivating, improving, and managing their legitimate agricultural share.

3. That the joint holding has become highly adversarial and counterproductive due to conflicting configurations of personal cultivation, split baseline possession disputes, and general management differences. Consequently, continuing a peaceful joint holding is no longer feasible.

4. That the Petitioner has repeatedly requested the Respondents to consensus-partition the joint Khata privately via mutual allocation, but the Respondents have explicitly refused to cooperate. Hence, this statutory legal route under Section 135 of the Land Revenue Act, 1967 is necessitated.

5. Legal Grounding & Arguments:
   ${reasonBlock}

6. That there is no intricate or active question of legal title or ownership challenge pending adjudication before any competent Civil Court under Section 141 of the Land Revenue Act, 1967. The revenue records strictly substantiate the current titles.

7. That the necessary legal documents, including the latest Register Haqdaran-Zamin (Fard Malkiyat), Khasra Girdawari, and the structural Aks Shajra map, have been enclosed herewith as scheduling indices.

PRAYER:

It is most respectfully prayed that this Honourable Court may graciously be pleased to accept this application and pass an order for the partition (Takseem) of the suit land separating the proposed share (${data.applicant_share.trim() || "________________"}) of the Petitioner from the joint holding.

It is further prayed that Naksha Alif may kindly be summoned, the Mode of Partition (Tareeqa-e-Takseem / Naksha Be) be formulated, and an Instrument of Partition (Sanad-e-Takseem / Naksha Jeem) be passed under Section 145 LRA to separate the Petitioner's share under the statutory timeline of this Revenue Court.

Any other relief that this Court deems fit and proper under equity may also be granted.

PETITIONER / APPLICANT
Through:

${firm.advocate}
${firm.designation}
${firm.firmName}, ${firm.defaultCourt}

VERIFICATION:
Verified on oath at ${data.district.trim() || "________________"} on this ${verifyDate} that the contents of paragraphs 1 to 7 are true and correct to the best of my personal knowledge and belief, and nothing has been concealed.

PETITIONER / APPLICANT
  `.trim();
}
