"use client";

import { useState } from "react";
import CourtPleadingPreview from "@/components/CourtPleadingPreview";
import {
  REVENUE_CITATIONS,
  appendCitationToGrounds,
} from "@/lib/revenueCitations";
import { firm } from "@/lib/firm";
import {
  buildRevenuePartitionDraft,
  partitionIsValid,
  respondentsFromNamesCsv,
  respondentsToNamesCsv,
  validatePartitionAppData,
  type PartitionAppData,
  type PartitionRespondent,
  type PartitionValidationErrors,
} from "@/lib/revenuePartition";
import { Field, Section, inputClass } from "@/lib/ui";

type Props = {
  data: PartitionAppData;
  onChange: (next: PartitionAppData) => void;
  /** Pre-compiled draft from parent (live preview). Falls back to builder. */
  draftText?: string;
};

export function RevenuePartitionCanvasForm({ data, onChange, draftText }: Props) {
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<PartitionValidationErrors>({});

  function update<K extends keyof PartitionAppData>(key: K, value: PartitionAppData[K]) {
    onChange({ ...data, [key]: value });
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof PartitionValidationErrors];
        return next;
      });
    }
  }

  function updateRespondent(index: number, patch: Partial<PartitionRespondent>) {
    const respondents = data.respondents.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    onChange({
      ...data,
      respondents,
      respondent_names: respondentsToNamesCsv(respondents),
    });
  }

  function addRespondent() {
    const respondents = [...data.respondents, { name: "", address: "", cnic: "" }];
    onChange({
      ...data,
      respondents,
      respondent_names: respondentsToNamesCsv(respondents),
    });
  }

  function removeRespondent(index: number) {
    const respondents =
      data.respondents.length <= 1
        ? [{ name: "", address: "", cnic: "" }]
        : data.respondents.filter((_, i) => i !== index);
    onChange({
      ...data,
      respondents,
      respondent_names: respondentsToNamesCsv(respondents),
    });
  }

  function handleRespondentNamesCsv(csv: string) {
    onChange({
      ...data,
      respondent_names: csv,
      respondents: respondentsFromNamesCsv(csv),
    });
  }

  function handleCitationSelect(citationId: string) {
    if (!citationId) return;
    update("partition_reason", appendCitationToGrounds(data.partition_reason, citationId));
  }

  function openPreview() {
    const nextErrors = validatePartitionAppData(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setPreviewMode(true);
  }

  const content = draftText ?? buildRevenuePartitionDraft(data);

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
          <span className="text-xs text-ink/65">
            Pleading canvas ready for browser print / PDF.
          </span>
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className="rounded border border-line bg-paper px-3 py-1.5 text-xs font-medium text-navy"
          >
            ← Return to inputs
          </button>
        </div>
        <CourtPleadingPreview
          title="Application for Partition of Agricultural Land under Section 135 LRA"
          content={content}
          lawyerName={firm.advocate}
          firmAddress={firm.officeAddress}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
          Section 135 LRA 1967
        </p>
        <h3 className="mt-1 font-serif text-lg text-navy">
          Agricultural land partition application
        </h3>
        <p className="mt-1 text-sm text-ink/65">
          Draft formal land division applications using revenue register variables. Counsel
          defaults to {firm.advocate}.
        </p>
      </div>

      {Object.keys(errors).length > 0 ? (
        <div
          className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          Complete required fields before compiling the canvas:{" "}
          {[
            errors.applicant_name,
            errors.mauza_village,
            errors.khata_number,
            errors.khatauni_number,
          ]
            .filter(Boolean)
            .join(" ")}
        </div>
      ) : null}

      <Section title="Forum and estate">
        <Field label="Revenue officer / forum">
          <input
            className={inputClass}
            value={data.court_name}
            onChange={(e) => update("court_name", e.target.value)}
          />
        </Field>
        <Field label="District">
          <input
            className={inputClass}
            value={data.district}
            onChange={(e) => update("district", e.target.value)}
          />
        </Field>
        <Field label="Tehsil">
          <input
            className={inputClass}
            value={data.tehsil}
            onChange={(e) => update("tehsil", e.target.value)}
          />
        </Field>
        <Field
          label="Mauza / village"
          hint={errors.mauza_village ? errors.mauza_village : undefined}
        >
          <input
            className={inputClass}
            value={data.mauza_village}
            onChange={(e) => update("mauza_village", e.target.value)}
            aria-invalid={Boolean(errors.mauza_village)}
            required
          />
        </Field>
      </Section>

      <Section title="Petitioner / applicant">
        <Field
          label="Applicant name"
          hint={errors.applicant_name ? errors.applicant_name : undefined}
        >
          <input
            className={inputClass}
            value={data.applicant_name}
            onChange={(e) => update("applicant_name", e.target.value)}
            aria-invalid={Boolean(errors.applicant_name)}
            required
          />
        </Field>
        <Field label="Parentage (son/daughter of)">
          <input
            className={inputClass}
            value={data.applicant_parentage}
            onChange={(e) => update("applicant_parentage", e.target.value)}
            placeholder="Father / parent name"
          />
        </Field>
        <Field label="CNIC">
          <input
            className={inputClass}
            value={data.applicant_cnic}
            onChange={(e) => update("applicant_cnic", e.target.value)}
            placeholder="xxxxx-xxxxxxx-x"
          />
        </Field>
        <Field label="Phone">
          <input
            className={inputClass}
            value={data.applicant_phone}
            onChange={(e) => update("applicant_phone", e.target.value)}
          />
        </Field>
        <Field label="Share claimed">
          <input
            className={inputClass}
            value={data.applicant_share}
            onChange={(e) => update("applicant_share", e.target.value)}
            placeholder="e.g. 1/4 share"
          />
        </Field>
        <Field label="Address">
          <textarea
            rows={2}
            className={inputClass}
            value={data.applicant_address}
            onChange={(e) => update("applicant_address", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Respondents / co-sharers">
        <Field
          label="Co-sharers / respondents (comma-separated)"
          hint="Quick entry syncs the numbered respondent list below. Example: Ahmad Khan, Muhammad Ali"
        >
          <input
            className={inputClass}
            value={data.respondent_names}
            placeholder="e.g., Ahmad Khan, Muhammad Ali"
            onChange={(e) => handleRespondentNamesCsv(e.target.value)}
          />
        </Field>
        {data.respondents.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 rounded border border-line bg-paper/40 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-navy">Respondent {index + 1}</p>
              <button
                type="button"
                onClick={() => removeRespondent(index)}
                className="text-xs font-medium text-navy/70 underline"
              >
                Remove
              </button>
            </div>
            <Field label="Name">
              <input
                className={inputClass}
                value={row.name}
                onChange={(e) => updateRespondent(index, { name: e.target.value })}
              />
            </Field>
            <Field label="Address">
              <input
                className={inputClass}
                value={row.address}
                onChange={(e) => updateRespondent(index, { address: e.target.value })}
              />
            </Field>
            <Field label="CNIC (optional)">
              <input
                className={inputClass}
                value={row.cnic ?? ""}
                onChange={(e) => updateRespondent(index, { cnic: e.target.value })}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={addRespondent}
          className="rounded border border-line bg-white px-3 py-2 text-sm font-medium text-navy"
        >
          Add respondent
        </button>
      </Section>

      <Section title="Land particulars">
        <Field
          label="Khewat / Khata No."
          hint={errors.khata_number ? errors.khata_number : undefined}
        >
          <input
            className={inputClass}
            value={data.khata_number}
            onChange={(e) => update("khata_number", e.target.value)}
            aria-invalid={Boolean(errors.khata_number)}
            required
          />
        </Field>
        <Field
          label="Khatooni / Khatauni No."
          hint={errors.khatauni_number ? errors.khatauni_number : undefined}
        >
          <input
            className={inputClass}
            value={data.khatauni_number}
            onChange={(e) => update("khatauni_number", e.target.value)}
            aria-invalid={Boolean(errors.khatauni_number)}
            required
          />
        </Field>
        <Field label="Khasra No(s).">
          <input
            className={inputClass}
            value={data.khasra_numbers}
            onChange={(e) => update("khasra_numbers", e.target.value)}
          />
        </Field>
        <Field label="Total area (kanals / marlas)">
          <input
            className={inputClass}
            value={data.total_area}
            onChange={(e) => update("total_area", e.target.value)}
            placeholder="e.g. 24 kanals 10 marlas"
          />
        </Field>
        <Field label="Land type / classification">
          <input
            className={inputClass}
            value={data.land_type}
            onChange={(e) => update("land_type", e.target.value)}
          />
        </Field>
        <Field
          label="Annual revenue assessment (optional)"
          hint="Appears in paragraph 2 when filled."
        >
          <input
            className={inputClass}
            value={data.revenue_assessment ?? ""}
            onChange={(e) => update("revenue_assessment", e.target.value)}
            placeholder="Amount in rupees"
          />
        </Field>
      </Section>

      <Section title="Judicial precedents and legal grounding">
        <Field
          label="Select supporting case law"
          hint="Selection appends the ruling into the grounds below."
        >
          <select
            className={inputClass}
            defaultValue=""
            onChange={(e) => {
              handleCitationSelect(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">— Select authority —</option>
            {REVENUE_CITATIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.citation} — {item.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Grounds for partition and legal arguments">
          <textarea
            rows={6}
            className={`${inputClass} font-mono text-[13px]`}
            value={data.partition_reason}
            onChange={(e) => update("partition_reason", e.target.value)}
            placeholder="Describe grounds for private partition. Selected case law appends here automatically."
          />
        </Field>
      </Section>

      <div className="rounded-lg border border-dashed border-line bg-white p-4 text-sm leading-6 text-ink/75">
        <p className="font-semibold text-navy">Mandatory pleading attachments</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Fard Malkiyat / Jamabandi (Register Haqdaran-Zamin)</li>
          <li>Khasra Girdawari</li>
          <li>Aksi Shajra (map)</li>
        </ul>
        <p className="mt-3">
          Partition flow: Naksha Alif → Naksha Be (Tareeqa-e-Takseem) → Naksha Jeem
          (Sanad-e-Takseem) → Instrument of Partition (Sec. 145). Title dispute: stay under
          Sec. 141 and refer to Civil Court.
        </p>
      </div>

      <button
        type="button"
        onClick={openPreview}
        className="rounded bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-500"
      >
        Compile revenue application canvas
      </button>
      {!partitionIsValid(data) ? (
        <p className="text-xs text-ink/55">
          Required before canvas: applicant name, mauza, khewat number, and khatooni number.
        </p>
      ) : null}
    </div>
  );
}
