/** Field definition for family suit dynamic forms. */
export type FamilyFieldType = "text" | "number" | "date" | "textarea" | "select";

export type FamilyFieldDef = {
  id: string;
  label: string;
  type: FamilyFieldType;
  placeholder?: string;
  options?: string[];
};

/** Schema suit keys used by EXTRA_SUIT_FIELDS (maps to FamilySuitType). */
export type FamilySchemaSuitKey = "khula" | "dower" | "dowry";

export const SHARED_FAMILY_FIELDS: FamilyFieldDef[] = [
  {
    id: "court_location",
    label: "Court Jurisdiction Location",
    type: "text",
    placeholder: "e.g., Dera Ghazi Khan",
  },
  { id: "plaintiff_name", label: "Plaintiff Name (Wife)", type: "text" },
  { id: "plaintiff_address", label: "Plaintiff Address", type: "text" },
  { id: "defendant_name", label: "Defendant Name (Husband)", type: "text" },
  { id: "defendant_address", label: "Defendant Address", type: "text" },
];

export const EXTRA_SUIT_FIELDS: Record<FamilySchemaSuitKey, FamilyFieldDef[]> = {
  khula: [
    { id: "marriage_date", label: "Date of Nikah", type: "date" },
    { id: "children_count", label: "Number of Minors", type: "number" },
    {
      id: "abuse_description",
      label: "Factual Narrative of Maltreatment / Non-Maintenance",
      type: "textarea",
    },
  ],
  dower: [
    { id: "total_dower_amount", label: "Total Dower Fixed (PKR)", type: "number" },
    {
      id: "dower_type_e_g_prompt_or_deferred",
      label: "Dower Type",
      type: "select",
      options: ["Prompt (Mu'ajjal)", "Deferred (Mu'awjjal)"],
    },
    {
      id: "dower_paid_status_e_g_nothing_has_been_paid_or_gold_is_pending",
      label: "Current Payment Status Balance",
      type: "text",
    },
    {
      id: "requested_future_rate",
      label: "Requested Future Maintenance Rate Per Month",
      type: "number",
    },
  ],
  dowry: [
    { id: "marriage_date", label: "Date of Nikah", type: "date" },
    { id: "bari_gold_weight", label: "Bari Description / Weight", type: "text" },
    { id: "abandonment_date", label: "Ouster / Retention Date", type: "date" },
  ],
};

/** Map FamilySuitWriter suit types → schema extra-field keys. */
export function familySchemaKeyForSuit(
  suitType: string,
): FamilySchemaSuitKey | null {
  if (suitType === "khula") return "khula";
  if (suitType === "dower-maintenance" || suitType === "dower") return "dower";
  if (suitType === "dowry") return "dowry";
  return null;
}

/** All fields (shared + suit extras) for a schema suit key. */
export function fieldsForFamilySuit(suitKey: FamilySchemaSuitKey): FamilyFieldDef[] {
  return [...SHARED_FAMILY_FIELDS, ...EXTRA_SUIT_FIELDS[suitKey]];
}

/**
 * Schema field id → FamilyForm camelCase key.
 * Keeps template/sample snake_case ids for form binding while updating FamilyForm.
 */
export const FAMILY_FIELD_ID_TO_FORM_KEY: Record<string, string> = {
  court_location: "courtLocation",
  plaintiff_name: "plaintiffName",
  plaintiff_address: "plaintiffAddress",
  defendant_name: "defendantName",
  defendant_address: "defendantAddress",
  marriage_date: "marriageDate",
  children_count: "childrenCount",
  abuse_description: "abuseDescription",
  total_dower_amount: "totalDowerAmount",
  dower_type_e_g_prompt_or_deferred: "dowerType",
  dower_paid_status_e_g_nothing_has_been_paid_or_gold_is_pending: "dowerPaidStatus",
  requested_future_rate: "futureRate",
  bari_gold_weight: "bariGoldWeight",
  abandonment_date: "abandonmentDate",
};

export function familyFormKeyForFieldId(fieldId: string): string | undefined {
  return FAMILY_FIELD_ID_TO_FORM_KEY[fieldId];
}
