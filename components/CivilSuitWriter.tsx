"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourtPleadingPreview from "@/components/CourtPleadingPreview";
import { TemporaryInjunctionForm } from "@/components/TemporaryInjunctionForm";
import {
  buildCivilPlaintDraft,
  emptyCivilPlaintData,
  type CivilPlaintData,
} from "@/lib/civil";
import {
  CIVIL_SUIT_OPTIONS,
  CIVIL_TEMP_INJUNCTION_MODE,
  type CivilWriterMode,
} from "@/lib/civilOptions";
import { declaratoryDefaultAuthorityStatus } from "@/lib/civilPrecedents";
import { disclaimer, firm } from "@/lib/firm";
import { ensureLeadThenLog } from "@/lib/logToolUsage";
import { Field, Section, ToolIntro, inputClass } from "@/lib/ui";

const PLAINT_IDS = new Set(CIVIL_SUIT_OPTIONS.map((o) => o.id));

function isTempMode(id: string): boolean {
  return id === CIVIL_TEMP_INJUNCTION_MODE;
}

function CivilSuitWriterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type");

  const [suitTypeId, setSuitTypeId] = useState<CivilWriterMode>(() => {
    if (typeParam && (PLAINT_IDS.has(typeParam) || isTempMode(typeParam))) {
      return typeParam as CivilWriterMode;
    }
    return "declaratory";
  });

  const [courtForum, setCourtForum] = useState("Civil Judge Class I");
  const [district, setDistrict] = useState<string>(firm.defaultCourt);
  const [plaintiffName, setPlaintiffName] = useState("");
  const [plaintiffCnic, setPlaintiffCnic] = useState("");
  const [plaintiffAddress, setPlaintiffAddress] = useState("");
  const [plaintiffPhone, setPlaintiffPhone] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const [defendantAddress, setDefendantAddress] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [causeOfActionDate, setCauseOfActionDate] = useState("");
  const [suitValuation, setSuitValuation] = useState("15,000");
  const [courtFeePaid, setCourtFeePaid] = useState("15");
  const [factsParagraphs, setFactsParagraphs] = useState<string[]>([]);
  const [newPara, setNewPara] = useState("");

  useEffect(() => {
    if (!typeParam) return;
    if (PLAINT_IDS.has(typeParam) || isTempMode(typeParam)) {
      setSuitTypeId(typeParam as CivilWriterMode);
    }
  }, [typeParam]);

  function changeSuitType(next: CivilWriterMode) {
    setSuitTypeId(next);
    router.replace(
      `/tools/civil-suit-writer?type=${encodeURIComponent(next)}`,
      { scroll: false },
    );
  }

  const plaintData: CivilPlaintData = useMemo(
    () => ({
      suit_type_id: suitTypeId,
      court_forum: courtForum,
      district,
      plaintiff_name: plaintiffName || "[Plaintiff Name]",
      plaintiff_cnic: plaintiffCnic || "xxxxx-xxxxxxx-x",
      plaintiff_address: plaintiffAddress || "[Complete Postal Address]",
      plaintiff_phone: plaintiffPhone || "03xx-xxxxxxx",
      defendant_name: defendantName || "[Defendant Name]",
      defendant_address: defendantAddress || "[Defendant Address]",
      property_description: propertyDescription || "[Property Boundaries]",
      facts_paragraphs: factsParagraphs,
      cause_of_action_date: causeOfActionDate || "[Cause Date]",
      suit_valuation: suitValuation,
      court_fee_paid: courtFeePaid,
    }),
    [
      suitTypeId,
      courtForum,
      district,
      plaintiffName,
      plaintiffCnic,
      plaintiffAddress,
      plaintiffPhone,
      defendantName,
      defendantAddress,
      propertyDescription,
      factsParagraphs,
      causeOfActionDate,
      suitValuation,
      courtFeePaid,
    ],
  );

  const liveDraftText = useMemo(
    () => buildCivilPlaintDraft(plaintData),
    [plaintData],
  );

  async function handlePrintPlaint(e: React.FormEvent) {
    e.preventDefault();
    const ok = await ensureLeadThenLog({
      toolUsed: "civil-suit-writer",
      draftType: suitTypeId,
    });
    if (!ok) return;
    window.print();
  }

  function clearPlaint() {
    const empty = emptyCivilPlaintData();
    setCourtForum(empty.court_forum);
    setDistrict(empty.district);
    setPlaintiffName("");
    setPlaintiffCnic("");
    setPlaintiffAddress("");
    setPlaintiffPhone("");
    setDefendantName("");
    setDefendantAddress("");
    setPropertyDescription("");
    setCauseOfActionDate("");
    setSuitValuation(empty.suit_valuation);
    setCourtFeePaid(empty.court_fee_paid);
    setFactsParagraphs([]);
    setNewPara("");
  }

  const selectedLabel =
    CIVIL_SUIT_OPTIONS.find((o) => o.id === suitTypeId)?.label ??
    "Temporary Injunction";

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <ToolIntro eyebrow="Civil Suit Writer" title="Order VII plaint drafts">
        <p>
          Live split canvas for declaration, permanent injunction, specific
          performance, possession &amp; mesne profits, cancellation, damages,
          urban partition, and custom suits — plus Temporary Injunction under
          Order 39 Rules 1 &amp; 2 CPC. Print / Save as PDF.
        </p>
        <p className="text-ink/70">{disclaimer}</p>
      </ToolIntro>

      <div className="no-print mt-6">
        <Section title="Document type">
          <Field label="Select suit / application">
            <select
              value={suitTypeId}
              onChange={(e) => changeSuitType(e.target.value as CivilWriterMode)}
              className={inputClass}
            >
              {CIVIL_SUIT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
              <option value={CIVIL_TEMP_INJUNCTION_MODE}>
                Application — Temporary Injunction (Order 39 Rules 1 &amp; 2 CPC)
              </option>
            </select>
          </Field>
          {suitTypeId === "declaratory" ? (
            <p className="rounded border border-line bg-paper/50 px-3 py-2 text-xs leading-5 text-ink/70">
              {declaratoryDefaultAuthorityStatus()}. Sec. 42 default grounds are
              auto-appended under Grounds when the LHC paste slot is filled.
            </p>
          ) : null}
        </Section>
      </div>

      {isTempMode(suitTypeId) ? (
        <div className="mt-6">
          <TemporaryInjunctionForm embedded />
        </div>
      ) : (
        <div className="screen-grid mt-6 flex max-h-[90vh] flex-col gap-6 overflow-hidden lg:flex-row">
          <div className="no-print w-full space-y-4 overflow-y-auto pr-1 lg:w-1/2">
            <h2 className="font-serif text-xl text-navy">Civil Plaint Configurator</h2>
            <p className="text-xs text-ink/60">{selectedLabel}</p>

            <form onSubmit={(e) => void handlePrintPlaint(e)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Court forum">
                  <input
                    className={inputClass}
                    value={courtForum}
                    onChange={(e) => setCourtForum(e.target.value)}
                  />
                </Field>
                <Field label="District">
                  <input
                    className={inputClass}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Plaintiff name">
                  <input
                    className={inputClass}
                    value={plaintiffName}
                    onChange={(e) => setPlaintiffName(e.target.value)}
                  />
                </Field>
                <Field label="CNIC number">
                  <input
                    className={inputClass}
                    value={plaintiffCnic}
                    onChange={(e) => setPlaintiffCnic(e.target.value)}
                    placeholder="xxxxx-xxxxxxx-x"
                  />
                </Field>
              </div>

              <Field label="Plaintiff address">
                <textarea
                  rows={2}
                  className={inputClass}
                  value={plaintiffAddress}
                  onChange={(e) => setPlaintiffAddress(e.target.value)}
                />
              </Field>
              <Field label="Plaintiff phone">
                <input
                  className={inputClass}
                  value={plaintiffPhone}
                  onChange={(e) => setPlaintiffPhone(e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Defendant name">
                  <input
                    className={inputClass}
                    value={defendantName}
                    onChange={(e) => setDefendantName(e.target.value)}
                  />
                </Field>
                <Field label="Defendant address">
                  <input
                    className={inputClass}
                    value={defendantAddress}
                    onChange={(e) => setDefendantAddress(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Property description">
                <textarea
                  rows={2}
                  className={inputClass}
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Cause of action date">
                  <input
                    type="date"
                    className={inputClass}
                    value={causeOfActionDate}
                    onChange={(e) => setCauseOfActionDate(e.target.value)}
                  />
                </Field>
                <Field label="Suit valuation (Rs.)">
                  <input
                    className={inputClass}
                    value={suitValuation}
                    onChange={(e) => setSuitValuation(e.target.value)}
                  />
                </Field>
                <Field label="Court fee paid (Rs.)">
                  <input
                    className={inputClass}
                    value={courtFeePaid}
                    onChange={(e) => setCourtFeePaid(e.target.value)}
                  />
                </Field>
              </div>

              <div className="rounded-lg border border-line bg-paper/40 p-3">
                <p className="text-xs font-semibold tracking-wide text-navy uppercase">
                  Custom fact assertions
                </p>
                <div className="mt-2 space-y-2">
                  {factsParagraphs.map((p, idx) => (
                    <div
                      key={`${idx}-${p.slice(0, 12)}`}
                      className="flex items-start justify-between gap-2 rounded border border-line bg-white p-2 text-xs"
                    >
                      <p className="text-ink/85">
                        Para {idx + 3}: {p}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFactsParagraphs(
                            factsParagraphs.filter((_, i) => i !== idx),
                          )
                        }
                        className="shrink-0 font-bold text-red-600"
                        aria-label="Remove paragraph"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newPara}
                    onChange={(e) => setNewPara(e.target.value)}
                    placeholder="Add another numbered clause…"
                    className={`flex-1 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPara.trim()) return;
                      setFactsParagraphs([...factsParagraphs, newPara.trim()]);
                      setNewPara("");
                    }}
                    className="rounded bg-navy px-3 py-2 text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Open Browser Print Screen / Save PDF
                </button>
                <button
                  type="button"
                  onClick={clearPlaint}
                  className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
                >
                  Clear draft
                </button>
              </div>
            </form>
          </div>

          <div className="print-stage w-full overflow-y-auto lg:w-1/2 lg:max-h-[85vh]">
            <p className="no-print mb-3 text-xs font-bold tracking-widest text-stone-400 uppercase">
              Live Court Document Preview
            </p>
            <CourtPleadingPreview
              title={
                CIVIL_SUIT_OPTIONS.find((o) => o.id === suitTypeId)?.label.toUpperCase() ??
                "CIVIL PLAINT"
              }
              content={liveDraftText}
              lawyerName={firm.advocate}
              firmAddress={firm.officeAddress}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export function CivilSuitWriter() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-ink/60">Loading civil suit writer…</p>
        </main>
      }
    >
      <CivilSuitWriterInner />
    </Suspense>
  );
}

export default CivilSuitWriter;
