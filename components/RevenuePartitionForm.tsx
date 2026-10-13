"use client";

import {
  REVENUE_CITATIONS,
  appendCitationToGrounds,
} from "@/lib/revenueCitations";
import type {
  PartitionAppData,
  PartitionRespondent,
  PartitionValidationErrors,
} from "@/lib/revenuePartition";
import {
  PARTITION_COURT_OPTIONS,
  PARTITION_LAND_TYPE_OPTIONS,
  respondentsFromNamesCsv,
  respondentsToNamesCsv,
} from "@/lib/revenuePartition";
import { Field, Section, inputClass } from "@/lib/ui";

type Props = {
  data: PartitionAppData;
  onChange: (next: PartitionAppData) => void;
  errors?: PartitionValidationErrors;
};

function fieldClass(hasError?: string) {
  return hasError ? `${inputClass} border-red-500` : inputClass;
}

export function RevenuePartitionForm({ data, onChange, errors = {} }: Props) {
  function commit(next: PartitionAppData) {
    onChange({
      ...next,
      respondent_names: respondentsToNamesCsv(next.respondents),
    });
  }

  function update<K extends keyof PartitionAppData>(key: K, value: PartitionAppData[K]) {
    commit({ ...data, [key]: value });
  }

  function updateRespondent(index: number, patch: Partial<PartitionRespondent>) {
    const respondents = data.respondents.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    commit({ ...data, respondents });
  }

  function addRespondent() {
    commit({
      ...data,
      respondents: [...data.respondents, { name: "", address: "", cnic: "" }],
    });
  }

  function removeRespondent(index: number) {
    if (data.respondents.length <= 1) {
      commit({ ...data, respondents: [{ name: "", address: "", cnic: "" }] });
      return;
    }
    commit({
      ...data,
      respondents: data.respondents.filter((_, i) => i !== index),
    });
  }

  function handleCitationSelect(citationId: string) {
    if (!citationId) return;
    update("partition_reason", appendCitationToGrounds(data.partition_reason, citationId));
  }

  return (
    <div className="grid gap-4">
      <Section title="1. Court & case jurisdiction">
        <Field label="Revenue Court name">
          <select
            className={inputClass}
            value={data.court_name}
            onChange={(e) => update("court_name", e.target.value)}
          >
            {!PARTITION_COURT_OPTIONS.includes(
              data.court_name as (typeof PARTITION_COURT_OPTIONS)[number],
            ) && data.court_name.trim() ? (
              <option value={data.court_name}>{data.court_name}</option>
            ) : null}
            {PARTITION_COURT_OPTIONS.map((court) => (
              <option key={court} value={court}>
                {court}
              </option>
            ))}
          </select>
        </Field>
        <Field label="District">
          <input
            className={inputClass}
            value={data.district}
            onChange={(e) => update("district", e.target.value)}
            placeholder="e.g., Dera Ghazi Khan"
          />
        </Field>
        <Field label="Tehsil / sub-division">
          <input
            className={inputClass}
            value={data.tehsil}
            onChange={(e) => update("tehsil", e.target.value)}
          />
        </Field>
        <Field label="Mauza / village" hint={errors.mauza_village}>
          <input
            className={fieldClass(errors.mauza_village)}
            value={data.mauza_village}
            onChange={(e) => update("mauza_village", e.target.value)}
            aria-invalid={Boolean(errors.mauza_village)}
          />
        </Field>
      </Section>

      <Section title="2. Applicant (petitioner) information">
        <Field label="Full name" hint={errors.applicant_name}>
          <input
            className={fieldClass(errors.applicant_name)}
            value={data.applicant_name}
            onChange={(e) => update("applicant_name", e.target.value)}
            aria-invalid={Boolean(errors.applicant_name)}
          />
        </Field>
        <Field label="Parentage">
          <input
            className={inputClass}
            value={data.applicant_parentage}
            onChange={(e) => update("applicant_parentage", e.target.value)}
            placeholder="s/o / d/o / w/o …"
          />
        </Field>
        <Field label="CNIC / identity number">
          <input
            className={inputClass}
            value={data.applicant_cnic}
            onChange={(e) => update("applicant_cnic", e.target.value)}
            placeholder="xxxxx-xxxxxxx-x"
          />
        </Field>
        <Field label="Mobile number">
          <input
            className={inputClass}
            value={data.applicant_phone}
            onChange={(e) => update("applicant_phone", e.target.value)}
          />
        </Field>
        <Field label="Proposed share (e.g., 1/4 or Kanals)">
          <input
            className={inputClass}
            value={data.applicant_share}
            onChange={(e) => update("applicant_share", e.target.value)}
            placeholder="e.g. 1/4 share"
          />
        </Field>
        <Field label="Postal address">
          <textarea
            rows={2}
            className={inputClass}
            value={data.applicant_address}
            onChange={(e) => update("applicant_address", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="3. Respondents (other co-sharers / Khatauni holders)">
        <Field
          label="Co-sharers / respondents (comma-separated)"
          hint="Quick entry syncs the numbered list below. Add rows for CNIC and summons address."
        >
          <input
            className={inputClass}
            value={data.respondent_names}
            placeholder="e.g., Ahmad Khan, Muhammad Ali"
            onChange={(e) => {
              const csv = e.target.value;
              onChange({
                ...data,
                respondent_names: csv,
                respondents: respondentsFromNamesCsv(csv),
              });
            }}
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
            <Field label="Address (for court summons)">
              <input
                className={inputClass}
                value={row.address}
                onChange={(e) => updateRespondent(index, { address: e.target.value })}
                placeholder="For court summons issuance"
              />
            </Field>
            <Field label="CNIC (if known)">
              <input
                className={inputClass}
                value={row.cnic ?? ""}
                onChange={(e) => updateRespondent(index, { cnic: e.target.value })}
                placeholder="xxxxx-xxxxxxx-x"
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

      <Section title="4. Land record & revenue details">
        <Field label="Khewat / Khata number" hint={errors.khata_number}>
          <input
            className={fieldClass(errors.khata_number)}
            value={data.khata_number}
            onChange={(e) => update("khata_number", e.target.value)}
            placeholder="e.g., 142"
            aria-invalid={Boolean(errors.khata_number)}
          />
        </Field>
        <Field label="Khatauni number" hint={errors.khatauni_number}>
          <input
            className={fieldClass(errors.khatauni_number)}
            value={data.khatauni_number}
            onChange={(e) => update("khatauni_number", e.target.value)}
            placeholder="e.g., 250"
            aria-invalid={Boolean(errors.khatauni_number)}
          />
        </Field>
        <Field label="Khasra number(s)">
          <input
            className={inputClass}
            value={data.khasra_numbers}
            onChange={(e) => update("khasra_numbers", e.target.value)}
            placeholder="e.g., 12, 13/1, 14"
          />
        </Field>
        <Field label="Total area of joint Khata">
          <input
            className={inputClass}
            value={data.total_area}
            onChange={(e) => update("total_area", e.target.value)}
            placeholder="e.g., 40 Kanal 10 Marla"
          />
        </Field>
        <Field label="Type of land">
          <select
            className={inputClass}
            value={data.land_type}
            onChange={(e) => update("land_type", e.target.value)}
          >
            {!PARTITION_LAND_TYPE_OPTIONS.includes(
              data.land_type as (typeof PARTITION_LAND_TYPE_OPTIONS)[number],
            ) && data.land_type.trim() ? (
              <option value={data.land_type}>{data.land_type}</option>
            ) : null}
            {PARTITION_LAND_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Annual land revenue (Lagan/Maliana)"
          hint="Appears in paragraph 2 when filled as Rs. {amount}/-."
        >
          <input
            className={inputClass}
            type="number"
            step="0.01"
            value={data.revenue_assessment ?? ""}
            onChange={(e) => update("revenue_assessment", e.target.value)}
            placeholder="Rs."
          />
        </Field>
      </Section>

      <Section title="5. Grounds for partition & documentation">
        <Field
          label="Select supporting case law"
          hint="PLD 2019 SC 318 · 2022 SCMR 1143 · PLD 2015 Lahore 412 — selection appends into grounds."
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
        <Field label="Grounds / reason for seeking private partition">
          <textarea
            rows={6}
            className={`${inputClass} font-mono text-[13px]`}
            value={data.partition_reason}
            onChange={(e) => update("partition_reason", e.target.value)}
            placeholder="Describe why joint holding is no longer feasible (e.g., dispute over cultivation, separate possession baseline)…"
          />
        </Field>
      </Section>

      <div className="rounded-lg border border-dashed border-line bg-white p-4 text-sm leading-6 text-ink/75">
        <p className="font-semibold text-navy">Required documentation checklist</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Latest Register Haqdaran-Zamin (Fard Malkiyat / Jamabandi)</li>
          <li>Khasra Girdawari</li>
          <li>Map of Khasra (Aks Shajra)</li>
        </ul>
        <p className="mt-3">
          Attach copies when filing in court. This writer generates the pleading for print /
          .docx — it does not upload files to the Revenue Court.
        </p>
        <p className="mt-2">
          Partition flow: Naksha Alif → Naksha Be (Tareeqa-e-Takseem) → Naksha Jeem
          (Sanad-e-Takseem) → Instrument of Partition (Sec. 145). Title dispute: stay under
          Sec. 141 and refer to Civil Court.
        </p>
      </div>
    </div>
  );
}
