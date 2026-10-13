"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnnexureBPreview } from "@/components/AnnexureBPreview";
import CourtPleadingPreview from "@/components/CourtPleadingPreview";
import FamilyAnnexureBLoop, {
  type DowryItem,
} from "@/components/FamilyAnnexureBLoop";
import { FamilyDynamicForm } from "@/components/FamilyDynamicForm";
import { MaintenanceSuitWriter } from "@/components/MaintenanceSuitWriter";
import { TextPetition } from "@/components/TextPetition";
import { familySchemaKeyForSuit } from "@/lib/config/familyFormSchema";
import {
  buildFamilyDraft,
  emptyFamilyForm,
  familySuitOptions,
  type FamilyAnnexureItems,
  type FamilyForm,
  type FamilySuitType,
} from "@/lib/family";
import {
  annexureToPleadingContent,
  downloadFamilyDocx,
  familyDocxFilename,
  familyDraftToPleadingContent,
} from "@/lib/familyPleading";
import { disclaimer } from "@/lib/firm";
import { ensureLeadThenLog } from "@/lib/logToolUsage";
import { Field, Section, ToolIntro, inputClass } from "@/lib/ui";

const VALID_FAMILY_TYPES = new Set<string>(familySuitOptions.map((o) => o.id));

function FamilySuitWriterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type");

  const [form, setForm] = useState<FamilyForm>(() => {
    const initial = emptyFamilyForm();
    if (typeParam && VALID_FAMILY_TYPES.has(typeParam)) {
      return { ...initial, suitType: typeParam as FamilySuitType };
    }
    return initial;
  });
  const [docxBusy, setDocxBusy] = useState(false);
  const [docxError, setDocxError] = useState("");
  const [caseLawCitations, setCaseLawCitations] = useState("");
  const [annexureItems, setAnnexureItems] = useState<FamilyAnnexureItems | null>(
    null,
  );

  const draft = useMemo(
    () =>
      buildFamilyDraft(
        form,
        form.suitType === "dowry" && annexureItems
          ? { annexureItems }
          : undefined,
      ),
    [form, annexureItems],
  );
  const schemaKey = familySchemaKeyForSuit(form.suitType);
  const useSchemaForm = schemaKey !== null;

  useEffect(() => {
    if (!typeParam || !VALID_FAMILY_TYPES.has(typeParam)) return;
    const next = typeParam as FamilySuitType;
    setForm((current) => (current.suitType === next ? current : { ...current, suitType: next }));
  }, [typeParam]);

  function update<K extends keyof FamilyForm>(key: K, value: FamilyForm[K]) {
    setForm((c) => ({ ...c, [key]: value }));
    if (key === "suitType") {
      router.replace(
        `/tools/family-suit-writer?type=${encodeURIComponent(String(value))}`,
        { scroll: false },
      );
    }
  }

  function updateDynamic(formKey: string, value: string) {
    setForm((c) => ({ ...c, [formKey]: value }));
  }

  const handleAnnexureTotals = useCallback((grandTotal: number) => {
    setForm((c) => {
      const next = String(grandTotal);
      return c.totalDowryValue === next ? c : { ...c, totalDowryValue: next };
    });
  }, []);

  const handleAnnexureItems = useCallback((jahez: DowryItem[], bari: DowryItem[]) => {
    setAnnexureItems({ jahez, bari });
  }, []);

  async function generateDocx() {
    setDocxError("");
    setDocxBusy(true);
    try {
      const citations = caseLawCitations
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      let content = familyDraftToPleadingContent(draft);
      if (draft.annexure) {
        content = `${content}\n\n${annexureToPleadingContent(draft.annexure)}`;
      }
      await ensureLeadThenLog({
        toolUsed: "family-suit-writer",
        draftType: `${form.suitType}:docx`,
      });
      await downloadFamilyDocx(
        draft.causeTitle,
        content,
        familyDocxFilename(form.suitType),
        citations.length ? citations : undefined,
      );
    } catch (err) {
      setDocxError(err instanceof Error ? err.message : "Could not generate .docx");
    } finally {
      setDocxBusy(false);
    }
  }

  if (form.suitType === "maintenance-only") {
    return (
      <div>
        <div className="no-print mx-auto max-w-6xl px-5 pt-8">
          <Field label="Kind of family suit">
            <select
              className={inputClass}
              value={form.suitType}
              onChange={(e) => update("suitType", e.target.value as FamilyForm["suitType"])}
            >
              {familySuitOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <MaintenanceSuitWriter />
      </div>
    );
  }

  const pleadingContent = useMemo(() => {
    if (!useSchemaForm) return "";
    let body = familyDraftToPleadingContent(draft);
    if (form.suitType === "dowry" && draft.annexure) {
      body = `${body}\n\n${annexureToPleadingContent(draft.annexure)}`;
    }
    return body;
  }, [useSchemaForm, draft, form.suitType]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <ToolIntro eyebrow="Family Suit Writer" title="Family Court pleadings">
        <p>Khula, dower & maintenance, dowry with Annexure-B, custody, and restitution — print ready.</p>
        <p className="text-ink/70">{disclaimer}</p>
      </ToolIntro>

      <div className="screen-grid mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="no-print grid gap-4">
          <Section title="Kind of suit">
            <Field label="Dropdown">
              <select
                className={inputClass}
                value={form.suitType}
                onChange={(e) => update("suitType", e.target.value as FamilyForm["suitType"])}
              >
                {familySuitOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {!useSchemaForm ? (
              <>
                <Field label="Court location">
                  <input
                    className={inputClass}
                    value={form.courtLocation}
                    onChange={(e) => update("courtLocation", e.target.value)}
                  />
                </Field>
                <Field label="Suit / petition number (optional)">
                  <input
                    className={inputClass}
                    value={form.suitNumber}
                    onChange={(e) => update("suitNumber", e.target.value)}
                  />
                </Field>
              </>
            ) : (
              <Field label="Suit / petition number (optional)">
                <input
                  className={inputClass}
                  value={form.suitNumber}
                  onChange={(e) => update("suitNumber", e.target.value)}
                />
              </Field>
            )}
          </Section>

          {useSchemaForm && schemaKey ? (
            <Section title="Parties & suit particulars">
              <FamilyDynamicForm
                suitKey={schemaKey}
                values={form as unknown as Record<string, string>}
                onChange={updateDynamic}
              />
            </Section>
          ) : (
            <>
              <Section title="Plaintiff / Petitioner">
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={form.plaintiffName}
                    onChange={(e) => update("plaintiffName", e.target.value)}
                  />
                </Field>
                <Field label="Relation">
                  <input
                    className={inputClass}
                    value={form.plaintiffRelation}
                    onChange={(e) => update("plaintiffRelation", e.target.value)}
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.plaintiffAddress}
                    onChange={(e) => update("plaintiffAddress", e.target.value)}
                  />
                </Field>
                <Field label="Cell">
                  <input
                    className={inputClass}
                    value={form.plaintiffPhone}
                    onChange={(e) => update("plaintiffPhone", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Defendant / Respondent">
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={form.defendantName}
                    onChange={(e) => update("defendantName", e.target.value)}
                  />
                </Field>
                <Field label="Relation">
                  <input
                    className={inputClass}
                    value={form.defendantRelation}
                    onChange={(e) => update("defendantRelation", e.target.value)}
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    rows={2}
                    className={inputClass}
                    value={form.defendantAddress}
                    onChange={(e) => update("defendantAddress", e.target.value)}
                  />
                </Field>
                <Field label="Cell">
                  <input
                    className={inputClass}
                    value={form.defendantPhone}
                    onChange={(e) => update("defendantPhone", e.target.value)}
                  />
                </Field>
              </Section>
            </>
          )}

          <Section title="Case particulars">
            {useSchemaForm ? (
              <>
                {form.suitType === "khula" || form.suitType === "dower-maintenance" ? (
                  <Field label="Children details">
                    <textarea
                      rows={2}
                      className={inputClass}
                      value={form.childrenDetails}
                      onChange={(e) => update("childrenDetails", e.target.value)}
                    />
                  </Field>
                ) : null}
                {form.suitType === "khula" ? (
                  <Field label="Non-maintenance since">
                    <input
                      type="date"
                      className={inputClass}
                      value={form.abandonmentDate}
                      onChange={(e) => update("abandonmentDate", e.target.value)}
                    />
                  </Field>
                ) : null}
                {form.suitType === "dower-maintenance" ? (
                  <>
                    <Field label="Ouster date">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.abandonmentDate}
                        onChange={(e) => update("abandonmentDate", e.target.value)}
                      />
                    </Field>
                    <Field label="Maintenance stopped since">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.maintenanceStoppedDate}
                        onChange={(e) => update("maintenanceStoppedDate", e.target.value)}
                      />
                    </Field>
                    <Field label="Defendant occupation">
                      <input
                        className={inputClass}
                        value={form.defendantOccupation}
                        onChange={(e) => update("defendantOccupation", e.target.value)}
                      />
                    </Field>
                    <Field label="Defendant income (PKR)">
                      <input
                        className={inputClass}
                        value={form.defendantIncome}
                        onChange={(e) => update("defendantIncome", e.target.value)}
                      />
                    </Field>
                    <Field label="School">
                      <input
                        className={inputClass}
                        value={form.schoolName}
                        onChange={(e) => update("schoolName", e.target.value)}
                      />
                    </Field>
                    <Field label="School expense (PKR)">
                      <input
                        className={inputClass}
                        value={form.schoolExpense}
                        onChange={(e) => update("schoolExpense", e.target.value)}
                      />
                    </Field>
                    <Field label="Past maintenance from">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.pastStart}
                        onChange={(e) => update("pastStart", e.target.value)}
                      />
                    </Field>
                    <Field label="Past maintenance to">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.pastEnd}
                        onChange={(e) => update("pastEnd", e.target.value)}
                      />
                    </Field>
                    <Field label="Past rate / month">
                      <input
                        className={inputClass}
                        value={form.pastRate}
                        onChange={(e) => update("pastRate", e.target.value)}
                      />
                    </Field>
                    <Field label="Total past amount">
                      <input
                        className={inputClass}
                        value={form.totalPast}
                        onChange={(e) => update("totalPast", e.target.value)}
                      />
                    </Field>
                    <Field label="Wife future rate">
                      <input
                        className={inputClass}
                        value={form.wifeFutureRate}
                        onChange={(e) => update("wifeFutureRate", e.target.value)}
                      />
                    </Field>
                    <Field label="Child future rate">
                      <input
                        className={inputClass}
                        value={form.childFutureRate}
                        onChange={(e) => update("childFutureRate", e.target.value)}
                      />
                    </Field>
                    <Field label="Dower description in prayer">
                      <input
                        className={inputClass}
                        value={form.dowerDescription}
                        onChange={(e) => update("dowerDescription", e.target.value)}
                      />
                    </Field>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Field label="Marriage date">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.marriageDate}
                    onChange={(e) => update("marriageDate", e.target.value)}
                  />
                </Field>
                {(form.suitType === "custody") && (
                  <>
                    <Field label="Children count">
                      <input
                        className={inputClass}
                        value={form.childrenCount}
                        onChange={(e) => update("childrenCount", e.target.value)}
                      />
                    </Field>
                    <Field label="Children details">
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={form.childrenDetails}
                        onChange={(e) => update("childrenDetails", e.target.value)}
                      />
                    </Field>
                  </>
                )}
                {form.suitType === "custody" ? (
                  <Field label="Custody lost since">
                    <input
                      type="date"
                      className={inputClass}
                      value={form.custodyLossDate}
                      onChange={(e) => update("custodyLossDate", e.target.value)}
                    />
                  </Field>
                ) : null}
                {form.suitType === "restitution" ? (
                  <>
                    <Field label="Departure date">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.departureDate}
                        onChange={(e) => update("departureDate", e.target.value)}
                      />
                    </Field>
                    <Field label="Panchayat date">
                      <input
                        type="date"
                        className={inputClass}
                        value={form.panchayatDate}
                        onChange={(e) => update("panchayatDate", e.target.value)}
                      />
                    </Field>
                  </>
                ) : null}
              </>
            )}
            <Field label="Cause of action date">
              <input
                type="date"
                className={inputClass}
                value={form.causeDate}
                onChange={(e) => update("causeDate", e.target.value)}
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
            {useSchemaForm ? (
              <Field
                label="Case law citations (optional)"
                hint="One citation per line; included in .docx payload when present"
              >
                <textarea
                  rows={3}
                  className={inputClass}
                  value={caseLawCitations}
                  onChange={(e) => setCaseLawCitations(e.target.value)}
                  placeholder="e.g., PLD 20XX SC xxx"
                />
              </Field>
            ) : null}
          </Section>

          {form.suitType === "dowry" ? (
            <FamilyAnnexureBLoop
              onTotalsChange={handleAnnexureTotals}
              onItemsChange={handleAnnexureItems}
            />
          ) : null}

          {docxError ? <p className="text-sm text-red-700">{docxError}</p> : null}

          <div className="flex flex-wrap gap-3">
            {useSchemaForm || form.suitType === "dowry" ? (
              <button
                type="button"
                disabled={docxBusy}
                onClick={() => void generateDocx()}
                className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {docxBusy ? "Generating…" : "Generate .docx"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={async () => {
                const { ensureLeadThenLog } = await import("@/lib/logToolUsage");
                const ok = await ensureLeadThenLog({
                  toolUsed: "family-suit-writer",
                  draftType: form.suitType,
                });
                if (!ok) return;
                window.print();
              }}
              className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white"
            >
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(emptyFamilyForm());
                setCaseLawCitations("");
                setAnnexureItems(null);
              }}
              className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
            >
              Clear draft
            </button>
          </div>
        </div>

        <div className="print-stage lg:sticky lg:top-6">
          {useSchemaForm ? (
            <CourtPleadingPreview
              title={draft.causeTitle}
              content={pleadingContent}
              lawyerName={draft.lawyerName}
              pld_citations={caseLawCitations
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)}
            />
          ) : (
            <TextPetition
              courtLine={draft.courtLine}
              suitLine={draft.suitLine}
              leftParty={draft.leftParty}
              leftRole={draft.leftRole}
              rightParty={draft.rightParty}
              rightRole={draft.rightRole}
              causeTitle={draft.causeTitle}
              paragraphs={draft.paragraphs}
              prayerIntro={draft.prayerIntro}
              prayerItems={draft.prayerItems}
              signRole={draft.signRole}
              lawyerName={draft.lawyerName}
              verificationText={draft.verificationText}
            />
          )}
          {draft.annexure ? <AnnexureBPreview annexure={draft.annexure} /> : null}
        </div>
      </div>
    </main>
  );
}

export function FamilySuitWriter() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-ink/60">Loading family suit writer…</p>
        </main>
      }
    >
      <FamilySuitWriterInner />
    </Suspense>
  );
}
