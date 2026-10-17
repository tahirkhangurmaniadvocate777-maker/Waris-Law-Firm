"use client";

import { useMemo, useState } from "react";
import CourtPleadingPreview from "@/components/CourtPleadingPreview";
import { firm, FIRM_METADATA } from "@/lib/firm";
import type { DraftLanguage } from "@/lib/language";
import { ensureLeadThenLog } from "@/lib/logToolUsage";
import { Field, Section, inputClass } from "@/lib/ui";

export type TemporaryInjunctionFormData = {
  court_city: string;
  plaintiff_name: string;
  plaintiff_parentage: string;
  defendant_name: string;
  property_description: string;
  khasra_number: string;
  khewat_number: string;
  threat_description: string;
  cause_date: string;
};

/** Strict required fields before print / generate. */
export const TEMP_INJUNCTION_REQUIRED_FIELDS = [
  "khasra_number",
  "khewat_number",
  "plaintiff_name",
  "defendant_name",
] as const;

export type TempInjunctionRequiredField =
  (typeof TEMP_INJUNCTION_REQUIRED_FIELDS)[number];

export const TEMP_INJUNCTION_FIELD_LABELS: Record<
  TempInjunctionRequiredField,
  string
> = {
  khasra_number: "Khasra number",
  khewat_number: "Khewat number",
  plaintiff_name: "Plaintiff name",
  defendant_name: "Defendant name",
};

export function emptyTemporaryInjunctionForm(): TemporaryInjunctionFormData {
  return {
    court_city: firm.defaultCourt,
    plaintiff_name: "",
    plaintiff_parentage: "",
    defendant_name: "",
    property_description: "",
    khasra_number: "",
    khewat_number: "",
    threat_description:
      "unlawfully disposses the plaintiff and alter the status quo of the property",
    cause_date: "",
  };
}

export function validateTemporaryInjunctionForm(
  data: TemporaryInjunctionFormData,
): { ok: true } | { ok: false; missingFields: TempInjunctionRequiredField[] } {
  const missingFields = TEMP_INJUNCTION_REQUIRED_FIELDS.filter(
    (field) => !String(data[field] ?? "").trim(),
  );
  if (missingFields.length) return { ok: false, missingFields };
  return { ok: true };
}

/** Formal Order 39 Rules 1 & 2 compiled pleading (user master text). */
export function compileTemporaryInjunctionPleading(
  formData: TemporaryInjunctionFormData,
  language: DraftLanguage = "en",
): string {
  const currentYear = new Date().getFullYear();

  if (language === "ur") {
    const causeDateLine = formData.cause_date.trim()
      ? ` سببِ دعویٰ مورخہ ${formData.cause_date.trim()} کو پیدا ہوا۔`
      : "";
    const propertyExtra = formData.property_description.trim()
      ? ` جائیداد کی مزید تفصیل: ${formData.property_description.trim()}۔`
      : "";
    return `
عدالت جناب سینئر سول جج صاحب، ${formData.court_city}

دیوانی متفرق درخواست نمبر _________ / ${currentYear}
ضمن دیوانی مقدمہ نمبر _________ / ${currentYear}

${formData.plaintiff_name || "_______________"} ولد ${formData.plaintiff_parentage || "_______________"}
                                                                    ...درخواست گزار
                                    بنام
${formData.defendant_name || "_______________"}
                                                                    ...مسئول علیہ

درخواست زیر آرڈر ۳۹ قواعد ۱ و ۲ بمع دفعہ ۱۵۱ ضابطہ دیوانی ۱۹۰۸ برائے عارضی حکم امتناعی

مستدعی دست بستہ حسبِ ذیل ہے:

۱۔ یہ کہ درخواست گزار نے مسئول علیہ کے خلاف مستقل حکم امتناعی کا مقدمہ دائر کیا ہے جس کے مندرجات اس درخواست کا حصہ سمجھے جائیں۔

۲۔ یہ کہ درخواست گزار خسرہ نمبر ${formData.khasra_number || "_______________"}، کھوات نمبر ${formData.khewat_number || "_______________"}، موضع ${formData.court_city || "_______________"} کی جائیداد کا قانونی مالک و قابض ہے۔${propertyExtra}

۳۔ یہ کہ مسئول علیہ ${formData.threat_description || "_______________"} کی کوشش کر رہا ہے جو درخواست گزار کے حقوق کی خلاف ورزی ہے۔${causeDateLine}

۴۔ یہ کہ درخواست گزار کا قوی بادی النظر مقدمہ ہے اور سہولت کا پلڑا اس کے حق میں ہے۔

۵۔ یہ کہ اگر مسئول علیہ کو روکا نہ گیا تو درخواست گزار کو ناقابل تلافی نقصان ہوگا۔

استدعا:
لہٰذا استدعا ہے کہ عارضی حکم امتناعی صادر کر کے مسئول علیہ کو متنازعہ جائیداد میں مداخلت سے روکا جائے۔

درخواست گزار بذریعہ وکیل:
${FIRM_METADATA.advocateName}
${FIRM_METADATA.title}
${FIRM_METADATA.firmName.split("/")[0]?.trim() || FIRM_METADATA.firmName}, ${formData.court_city || firm.defaultCourt}
`.trim();
  }

  const causeDateLine = formData.cause_date.trim()
    ? ` The cause of action accrued on ${formData.cause_date.trim()}.`
    : "";
  const propertyExtra = formData.property_description.trim()
    ? ` The suit property is further described as: ${formData.property_description.trim()}.`
    : "";

  return `
IN THE COURT OF THE HONORABLE SENIOR CIVIL JUDGE, ${formData.court_city.toUpperCase()}

Civil Miscellaneous Application No. _________ / ${currentYear}
In Civil Suit No. _________ / ${currentYear}

${formData.plaintiff_name || "_______________"} son of ${formData.plaintiff_parentage || "_______________"}
                                                                    ... APPLICANT
                                    VERSUS
${formData.defendant_name || "_______________"}
                                                                    ... RESPONDENT

APPLICATION UNDER ORDER 39, RULES 1 & 2 READ WITH SECTION 151 OF THE CODE OF CIVIL PROCEDURE, 1908 FOR THE GRANT OF A TEMPORARY INJUNCTION.

Respectfully Sheweth:

1. That the Applicant has filed the accompanying Suit for Permanent Injunction against the Respondent, the contents of which may kindly be read as an integral part of this application.

2. That the Applicant is the absolute lawful owner in physical possession of the suit property, specifically identified under Khasra No. ${formData.khasra_number || "_______________"}, Khewat No. ${formData.khewat_number || "_______________"}, situated at Mauza ${formData.court_city || "_______________"}.${propertyExtra}

3. That the Respondent is adamantly attempting to ${formData.threat_description || "_______________"}, without any lawful entitlement or decree of a competent court, which constitutes a clear violation of the Applicant's proprietary rights.${causeDateLine}

4. That the Applicant has a strong Prima Facie case in their favor, and the Balance of Convenience lies entirely on the side of the Applicant.

5. That if the Respondent is not restrained from altering the status quo of the suit property during the pendency of the main trial, the Applicant will suffer an Irreparable Loss that cannot be compensated in monetary terms.

PRAYER:
It is, therefore, most respectfully prayed that this application may be accepted and a Temporary Injunction may graciously be granted in favor of the Applicant, restraining the Respondent from interfering, altering, or executing any unlawful acts on the suit property until the final adjudication of the main suit.

Applicant Through Counsel:
${FIRM_METADATA.advocateName}
${FIRM_METADATA.title}
${FIRM_METADATA.firmName.split("/")[0]?.trim() || FIRM_METADATA.firmName}, ${formData.court_city || firm.defaultCourt}
  `.trim();
}

type Props = {
  /** When true, omit outer page chrome (used inside CivilSuitWriter). */
  embedded?: boolean;
  language?: DraftLanguage;
};

export function TemporaryInjunctionForm({
  embedded = false,
  language = "en",
}: Props) {
  const [formData, setFormData] = useState<TemporaryInjunctionFormData>(() =>
    emptyTemporaryInjunctionForm(),
  );
  const [error, setError] = useState("");

  const compiledApplicationText = useMemo(
    () => compileTemporaryInjunctionPleading(formData, language),
    [formData, language],
  );

  function update<K extends keyof TemporaryInjunctionFormData>(
    key: K,
    value: TemporaryInjunctionFormData[K],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handlePrint() {
    const check = validateTemporaryInjunctionForm(formData);
    if (!check.ok) {
      setError(
        `Required before print: ${check.missingFields
          .map((f) => TEMP_INJUNCTION_FIELD_LABELS[f])
          .join(", ")}`,
      );
      return;
    }
    const ok = await ensureLeadThenLog({
      toolUsed: "civil-suit-writer",
      draftType: "temporary-injunction-o39",
    });
    if (!ok) return;
    window.print();
  }

  function handleClear() {
    setFormData(emptyTemporaryInjunctionForm());
    setError("");
  }

  const formPanel = (
    <div className="no-print grid gap-4">
      <Section title="Temporary Injunction — Order 39 Rules 1 & 2 CPC">
        <p className="text-xs leading-5 text-ink/70">
          Interim stay application with land identifiers (Khasra / Khewat). Live
          preview updates on the right.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Court city">
            <input
              className={inputClass}
              value={formData.court_city}
              onChange={(e) => update("court_city", e.target.value)}
            />
          </Field>
          <Field label="Plaintiff name *">
            <input
              className={inputClass}
              value={formData.plaintiff_name}
              onChange={(e) => update("plaintiff_name", e.target.value)}
            />
          </Field>
          <Field label="Plaintiff parentage">
            <input
              className={inputClass}
              value={formData.plaintiff_parentage}
              onChange={(e) => update("plaintiff_parentage", e.target.value)}
              placeholder="son/daughter of …"
            />
          </Field>
          <Field label="Defendant name *">
            <input
              className={inputClass}
              value={formData.defendant_name}
              onChange={(e) => update("defendant_name", e.target.value)}
            />
          </Field>
          <Field label="Khasra number *">
            <input
              className={inputClass}
              value={formData.khasra_number}
              onChange={(e) => update("khasra_number", e.target.value)}
            />
          </Field>
          <Field label="Khewat number *">
            <input
              className={inputClass}
              value={formData.khewat_number}
              onChange={(e) => update("khewat_number", e.target.value)}
            />
          </Field>
          <Field label="Cause of action date">
            <input
              type="date"
              className={inputClass}
              value={formData.cause_date}
              onChange={(e) => update("cause_date", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Property description">
          <textarea
            rows={2}
            className={inputClass}
            value={formData.property_description}
            onChange={(e) => update("property_description", e.target.value)}
            placeholder="Situation, boundaries, area, or other identifying particulars"
          />
        </Field>
        <Field label="Aggressive actions / threat particulars">
          <textarea
            rows={3}
            className={inputClass}
            value={formData.threat_description}
            onChange={(e) => update("threat_description", e.target.value)}
          />
        </Field>
      </Section>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handlePrint()}
          className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
        >
          Clear draft
        </button>
      </div>
    </div>
  );

  const previewPanel = (
    <div className="print-stage lg:sticky lg:top-6">
      <CourtPleadingPreview
        title={
          language === "ur"
            ? "آرڈر ۳۹ قواعد ۱ و ۲ کے تحت عارضی حکم امتناعی کی درخواست"
            : "Application for Temporary Injunction under Order 39 Rules 1 & 2 CPC"
        }
        content={compiledApplicationText}
        lawyerName={FIRM_METADATA.advocateName}
        firmAddress={FIRM_METADATA.officeAddress}
        language={language}
      />
    </div>
  );

  if (embedded) {
    return (
      <div className="screen-grid grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {formPanel}
        {previewPanel}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="screen-grid grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {formPanel}
        {previewPanel}
      </div>
    </div>
  );
}

export default TemporaryInjunctionForm;
