"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourtPleadingPreview from "@/components/CourtPleadingPreview";
import { LanguageSelect } from "@/components/LanguageSelect";
import { RevenuePartitionForm } from "@/components/RevenuePartitionForm";
import { TextPetition } from "@/components/TextPetition";
import { downloadBlob } from "@/lib/criminal-docx";
import { disclaimer, firm } from "@/lib/firm";
import type { DraftLanguage } from "@/lib/language";
import { ensureLeadThenLog } from "@/lib/logToolUsage";
import {
  buildRevenueDraft,
  buildRevenuePartitionDraft,
  emptyPartitionAppData,
  emptyRevenueForm,
  partitionIsValid,
  revenueOptions,
  validatePartitionAppData,
  type PartitionAppData,
  type PartitionValidationErrors,
  type RevenueForm,
  type RevenueType,
} from "@/lib/revenue";
import { Field, Section, ToolIntro, inputClass } from "@/lib/ui";
import { revenueDraftInLanguage } from "@/lib/urduDraft";

const VALID_REVENUE_TYPES = new Set<string>(revenueOptions.map((o) => o.id));

async function downloadPartitionDocx(text: string) {
  const { AlignmentType, Document, Packer, Paragraph, TextRun } = await import("docx");
  const children = text.split("\n").map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: line.trim() ? 80 : 40 },
        children: [
          new TextRun({
            text: line || " ",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
  );
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children,
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, "Sec-135-Agricultural-Partition.docx");
}

function RevenueApplicationsWriterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type");

  const [form, setForm] = useState<RevenueForm>(() => {
    const initial = emptyRevenueForm();
    if (typeParam && VALID_REVENUE_TYPES.has(typeParam)) {
      return { ...initial, appType: typeParam as RevenueType };
    }
    return initial;
  });

  const [partition, setPartition] = useState<PartitionAppData>(() => emptyPartitionAppData());
  const [partitionErrors, setPartitionErrors] = useState<PartitionValidationErrors>({});
  const [language, setLanguage] = useState<DraftLanguage>("en");

  const draft = useMemo(
    () => revenueDraftInLanguage(buildRevenueDraft(form), form, language),
    [form, language],
  );
  const partitionDraft = useMemo(
    () => buildRevenuePartitionDraft(partition),
    [partition],
  );

  useEffect(() => {
    if (!typeParam || !VALID_REVENUE_TYPES.has(typeParam)) return;
    const next = typeParam as RevenueType;
    setForm((current) => (current.appType === next ? current : { ...current, appType: next }));
  }, [typeParam]);

  function update<K extends keyof RevenueForm>(key: K, value: RevenueForm[K]) {
    setForm((c) => ({ ...c, [key]: value }));
    if (key === "appType") {
      router.replace(
        `/tools/revenue-applications-writer?type=${encodeURIComponent(String(value))}`,
        { scroll: false },
      );
    }
  }

  const isPartition = form.appType === "agri-partition";

  function handlePartitionChange(next: PartitionAppData) {
    setPartition(next);
    if (Object.keys(partitionErrors).length > 0) {
      setPartitionErrors(validatePartitionAppData(next));
    }
  }

  function assertPartitionValid(): boolean {
    if (!isPartition) return true;
    const errors = validatePartitionAppData(partition);
    setPartitionErrors(errors);
    return partitionIsValid(partition);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <ToolIntro eyebrow="Revenue Applications Writer" title="Land Revenue Act applications">
        <p>
          Applications under the Land Revenue Act, 1967 — not CPC plaints. Attach Fard Malkiyat /
          Jamabandi, Khasra Girdawari, and Aksi Shajra when filing.
        </p>
        {isPartition ? (
          <p>
            Sec. 135 agricultural partition (Takseem) uses a dedicated petition sheet with Naksha
            Alif / Be / Jeem prayer and selectable LRA authorities (PLD 2019 SC 318, 2022 SCMR 1143,
            PLD 2015 Lahore 412). Counsel defaults to {firm.advocate}.
          </p>
        ) : null}
        <p className="text-ink/70">{disclaimer}</p>
      </ToolIntro>

      <div className="screen-grid mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="no-print grid gap-4">
          <Section title="Kind of proceeding">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dropdown">
                <select
                  className={inputClass}
                  value={form.appType}
                  onChange={(e) => update("appType", e.target.value as RevenueForm["appType"])}
                >
                  {revenueOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <LanguageSelect value={language} onChange={setLanguage} />
            </div>
          </Section>

          {isPartition ? (
            <RevenuePartitionForm
              data={partition}
              onChange={handlePartitionChange}
              errors={partitionErrors}
            />
          ) : (
            <>
              <Section title="Forum and parties">
                <Field label="Forum">
                  <input
                    className={inputClass}
                    value={form.forum}
                    onChange={(e) => update("forum", e.target.value)}
                  />
                </Field>
                <Field label="District">
                  <input
                    className={inputClass}
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                  />
                </Field>
                <Field label="Tehsil">
                  <input
                    className={inputClass}
                    value={form.tehsil}
                    onChange={(e) => update("tehsil", e.target.value)}
                  />
                </Field>
                <Field label="Mauza / estate">
                  <input
                    className={inputClass}
                    value={form.mauza}
                    onChange={(e) => update("mauza", e.target.value)}
                  />
                </Field>
                <Field label="Applicant name">
                  <input
                    className={inputClass}
                    value={form.applicantName}
                    onChange={(e) => update("applicantName", e.target.value)}
                  />
                </Field>
                <Field label="Parentage">
                  <input
                    className={inputClass}
                    value={form.applicantParentage}
                    onChange={(e) => update("applicantParentage", e.target.value)}
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.applicantAddress}
                    onChange={(e) => update("applicantAddress", e.target.value)}
                  />
                </Field>
                <Field label="Respondents / co-sharers">
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.respondents}
                    onChange={(e) => update("respondents", e.target.value)}
                  />
                </Field>
                <Field label="Khasra number(s)">
                  <input
                    className={inputClass}
                    value={form.khasra}
                    onChange={(e) => update("khasra", e.target.value)}
                  />
                </Field>
                <Field label="Share claimed">
                  <input
                    className={inputClass}
                    value={form.share}
                    onChange={(e) => update("share", e.target.value)}
                  />
                </Field>
                <Field label="Material facts">
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={form.facts}
                    onChange={(e) => update("facts", e.target.value)}
                  />
                </Field>
                <Field label="Specific relief">
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.relief}
                    onChange={(e) => update("relief", e.target.value)}
                  />
                </Field>
                <Field label="Advocate">
                  <input
                    className={inputClass}
                    value={form.lawyerName}
                    onChange={(e) => update("lawyerName", e.target.value)}
                  />
                </Field>
                <Field label="Verification date">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.verificationDate}
                    onChange={(e) => update("verificationDate", e.target.value)}
                  />
                </Field>
              </Section>

              <div className="rounded-lg border border-dashed border-line bg-white p-4 text-sm leading-6 text-ink/75">
                <p className="font-semibold text-navy">Attachments checklist</p>
                <ul className="mt-2 list-disc pl-5">
                  <li>Fard Malkiyat / Jamabandi</li>
                  <li>Khasra Girdawari</li>
                  <li>Aksi Shajra (map)</li>
                </ul>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                if (!assertPartitionValid()) return;
                const ok = await ensureLeadThenLog({
                  toolUsed: "revenue-applications-writer",
                  draftType: isPartition ? "agri-partition" : form.appType,
                });
                if (!ok) return;
                window.print();
              }}
              className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white"
            >
              Print / Save as PDF
            </button>
            {isPartition ? (
              <button
                type="button"
                onClick={async () => {
                  if (!assertPartitionValid()) return;
                  await ensureLeadThenLog({
                    toolUsed: "revenue-applications-writer",
                    draftType: "agri-partition-docx",
                  });
                  await downloadPartitionDocx(partitionDraft);
                }}
                className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
              >
                Download .docx
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (isPartition) {
                  setPartition(emptyPartitionAppData());
                  setPartitionErrors({});
                } else {
                  setForm(emptyRevenueForm());
                }
              }}
              className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
            >
              Clear draft
            </button>
          </div>
        </div>

        <div className="print-stage lg:sticky lg:top-6">
          {isPartition ? (
            <div className="space-y-3">
              <div className="no-print flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-navy">Court draft preview</h3>
                <button
                  type="button"
                  onClick={async () => {
                    if (!assertPartitionValid()) return;
                    const ok = await ensureLeadThenLog({
                      toolUsed: "revenue-applications-writer",
                      draftType: "agri-partition",
                    });
                    if (!ok) return;
                    window.print();
                  }}
                  className="rounded bg-navy px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Print / Save PDF
                </button>
              </div>
              <CourtPleadingPreview
                title={
                  language === "ur"
                    ? "لینڈ ریونیو ایکٹ کی دفعہ ۱۳۵ کے تحت زرعی تقسیم کی درخواست"
                    : "Application for Partition of Agricultural Land under Section 135 LRA"
                }
                content={partitionDraft}
                lawyerName={firm.advocate}
                firmAddress={firm.officeAddress}
                language={language}
              />
            </div>
          ) : (
            <TextPetition {...draft} language={language} />
          )}
        </div>
      </div>
    </main>
  );
}

export function RevenueApplicationsWriter() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-ink/70">Loading revenue writer…</p>
        </main>
      }
    >
      <RevenueApplicationsWriterInner />
    </Suspense>
  );
}
