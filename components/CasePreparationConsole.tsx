"use client";

import React, { useState } from "react";

type Department = "all" | "criminal" | "civil" | "family" | "revenue" | "fbr";

type Inputs = {
  caseId: string;
  firText: string;
  recoveryMemoText: string;
  section161Statements: string;
  medicalReportText: string;
  bailApplicationText: string;
  detentionRecordText: string;
  plaintText: string;
  injunctionApplicationText: string;
  familyPetitionText: string;
  dowryAnnexureText: string;
  revenueRecordText: string;
  fardText: string;
  noticeText: string;
  wealthStatementText: string;
};

const emptyInputs: Inputs = {
  caseId: "",
  firText: "",
  recoveryMemoText: "",
  section161Statements: "",
  medicalReportText: "",
  bailApplicationText: "",
  detentionRecordText: "",
  plaintText: "",
  injunctionApplicationText: "",
  familyPetitionText: "",
  dowryAnnexureText: "",
  revenueRecordText: "",
  fardText: "",
  noticeText: "",
  wealthStatementText: "",
};

const DEPARTMENTS: { id: Department; label: string }[] = [
  { id: "all", label: "All" },
  { id: "criminal", label: "Criminal" },
  { id: "civil", label: "Civil" },
  { id: "family", label: "Family" },
  { id: "revenue", label: "Revenue" },
  { id: "fbr", label: "FBR / Tax" },
];

const ta =
  "w-full bg-slate-900 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-amber-500";

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block font-semibold text-slate-400">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={ta}
      />
    </div>
  );
}

export default function CasePreparationConsole() {
  const [department, setDepartment] = useState<Department>("criminal");
  const [inputs, setInputs] = useState<Inputs>(emptyInputs);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Inputs) => (v: string) => setInputs((prev) => ({ ...prev, [key]: v }));

  const showCriminal = department === "all" || department === "criminal";
  const showCivil = department === "all" || department === "civil";
  const showFamily = department === "all" || department === "family";
  const showRevenue = department === "all" || department === "revenue";
  const showFbr = department === "all" || department === "fbr";

  const handleRunAnalysis = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch("/api/case-prep/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputs,
          caseId: inputs.caseId || undefined,
          department,
        }),
      });
      const result = await res.json();
      if (result.success) setReport(result.analysisReport);
      else alert(result.error || "Analysis processing error.");
    } catch {
      alert("Analysis processing error.");
    } finally {
      setLoading(false);
    }
  };

  const copySynopsis = async () => {
    const text = report?.winningArgumentsSynopsis || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy to clipboard.");
    }
  };

  const discrepancies: string[] = report?.detectedDiscrepancies || [];

  return (
    <div className="space-y-6 rounded-xl border border-slate-900 bg-slate-950 p-6 text-slate-100 shadow-xl">
      <div className="border-b border-slate-900 pb-3">
        <h2 className="font-serif text-lg font-medium text-white">
          Automated Case Preparation Console
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Cross-examines evidence matrices and applies binding PLD/PLJ high court precedents.
        </p>
        <p className="mt-2 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] leading-5 text-amber-200/80">
          Disclaimer: heuristic advisory tool only — not legal advice. Firm-rulebook entries are
          structural notes, not substitute for authenticated law-report citations.
        </p>
      </div>

      {!report ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDepartment(d.id)}
                className={`rounded px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition ${
                  department === d.id
                    ? "bg-amber-500 text-slate-950"
                    : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-400">
              Optional case ID
            </label>
            <input
              type="text"
              value={inputs.caseId}
              onChange={(e) => set("caseId")(e.target.value)}
              placeholder="e.g. FIR-2024-112 / Suit-88"
              className="w-full rounded border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-amber-500 focus:outline-none md:max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
            {showCriminal ? (
              <>
                <Field
                  label="1. First Information Report (FIR) Text Content"
                  value={inputs.firText}
                  onChange={set("firText")}
                  placeholder="Paste FIR body paragraphs..."
                />
                <Field
                  label="2. Recovery Memo (Fard-e-Maqboolgi) Text"
                  value={inputs.recoveryMemoText}
                  onChange={set("recoveryMemoText")}
                  placeholder="Paste recovery records..."
                />
                <Field
                  label="3. Statements Under Section 161 CrPC"
                  value={inputs.section161Statements}
                  onChange={set("section161Statements")}
                  placeholder="Paste witness statements..."
                />
                <Field
                  label="4. Medico-Legal Injury Certificate (MLC)"
                  value={inputs.medicalReportText}
                  onChange={set("medicalReportText")}
                  placeholder="Paste medical physical observation summaries..."
                />
                <Field
                  label="5. Bail / further-inquiry notes (optional)"
                  value={inputs.bailApplicationText}
                  onChange={set("bailApplicationText")}
                  placeholder="Prohibitory clause, pending challan, bail delay..."
                />
                <Field
                  label="6. Detention / habeas record (optional)"
                  value={inputs.detentionRecordText}
                  onChange={set("detentionRecordText")}
                  placeholder="Illegal detention, remand, Article 10 signals..."
                />
              </>
            ) : null}

            {showCivil ? (
              <>
                <Field
                  label="Civil plaint / declaratory text"
                  value={inputs.plaintText}
                  onChange={set("plaintText")}
                  placeholder="Paste plaint — ownership chain, boundaries..."
                />
                <Field
                  label="Injunction application (O.39)"
                  value={inputs.injunctionApplicationText}
                  onChange={set("injunctionApplicationText")}
                  placeholder="Prima facie / irreparable loss language..."
                />
              </>
            ) : null}

            {showFamily ? (
              <>
                <Field
                  label="Family petition (dower / custody)"
                  value={inputs.familyPetitionText}
                  onChange={set("familyPetitionText")}
                  placeholder="Haq mehr, custody welfare facts..."
                />
                <Field
                  label="Dowry Annexure-B / jahez schedule"
                  value={inputs.dowryAnnexureText}
                  onChange={set("dowryAnnexureText")}
                  placeholder="Inventory with valuations..."
                />
              </>
            ) : null}

            {showRevenue ? (
              <>
                <Field
                  label="Revenue record / application text"
                  value={inputs.revenueRecordText}
                  onChange={set("revenueRecordText")}
                  placeholder="Partition, joint holding, refusal notes..."
                />
                <Field
                  label="Fard / khasra–khewat extract"
                  value={inputs.fardText}
                  onChange={set("fardText")}
                  placeholder="Khasra, khewat, khatooni, mauza, kanal/marla..."
                />
              </>
            ) : null}

            {showFbr ? (
              <>
                <Field
                  label="FBR notice text (s.122 / s.177 / Iris)"
                  value={inputs.noticeText}
                  onChange={set("noticeText")}
                  placeholder="Paste notice / Iris correspondence..."
                />
                <Field
                  label="Wealth statement (s.116) draft"
                  value={inputs.wealthStatementText}
                  onChange={set("wealthStatementText")}
                  placeholder="Assets, reconciliation notes..."
                />
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full rounded bg-amber-500 py-3 text-sm font-semibold tracking-wider text-slate-950 uppercase transition hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Cross-Examining Evidence Layouts..." : "Run Precedent Matching Extraction"}
          </button>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-slate-900 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-bold text-amber-400">
              Favorable Case Argument Strategy Map
              {report.caseId ? (
                <span className="ml-2 font-sans font-normal text-slate-500">({report.caseId})</span>
              ) : null}
            </span>
            <button
              type="button"
              onClick={() => setReport(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-300"
            >
              ← Run New Evaluation
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="mb-1 block font-bold tracking-wider text-slate-500 uppercase">
                Identified Strategic Anomalies:
              </span>
              {discrepancies.length === 0 ? (
                <p className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-400">
                  No discrepancies detected for the pasted bundle under the selected department.
                  Try additional keywords, another tab, or broader text extracts.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {discrepancies.map((disc: string, i: number) => (
                    <span
                      key={i}
                      className="rounded border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 font-mono font-medium text-rose-400"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <span className="mb-1.5 block font-bold tracking-wider text-slate-500 uppercase">
                Binding Grounding Precedents (PLD/PLJ Network):
              </span>
              {report.groundedPrecedents?.length ? (
                <div className="space-y-2">
                  {report.groundedPrecedents.map((p: any, i: number) => (
                    <div key={i} className="rounded border border-slate-800 bg-slate-950 p-3 font-serif">
                      <span className="font-bold tracking-wide text-amber-400">{p.citation}</span>{" "}
                      —{" "}
                      <span className="font-sans text-[11px] italic text-slate-400">{p.court}</span>
                      <p className="mt-1.5 text-justify font-sans text-xs leading-relaxed text-slate-300">
                        {p.ratioDecidendi}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded border border-slate-800 bg-slate-950 px-3 py-2 text-slate-400">
                  No grounded precedents matched.
                </p>
              )}
            </div>

            <div className="border-t border-slate-800 pt-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="block font-bold tracking-wider text-slate-500 uppercase">
                  Generated Strategic Defense Synopsis:
                </span>
                <button
                  type="button"
                  onClick={copySynopsis}
                  className="shrink-0 rounded border border-slate-700 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-400 uppercase hover:border-amber-500/40 hover:bg-amber-500/10"
                >
                  {copied ? "Copied" : "Copy synopsis"}
                </button>
              </div>
              <p className="whitespace-pre-line rounded border border-slate-800 bg-slate-950 p-4 font-serif text-sm leading-relaxed text-justify text-slate-300">
                {report.winningArgumentsSynopsis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
