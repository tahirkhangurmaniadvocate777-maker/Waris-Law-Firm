"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CriminalAffidavitPreview } from "@/components/CriminalAffidavitPreview";
import { CriminalModuleForm } from "@/components/CriminalModuleForm";
import { LanguageSelect } from "@/components/LanguageSelect";
import { TextPetition } from "@/components/TextPetition";
import {
  COURT_DEFAULTS,
  buildCriminalDraft,
  criminalAppOptions,
  emptyCriminalForm,
  type CriminalAppType,
  type CriminalForm,
} from "@/lib/criminal";
import { disclaimer } from "@/lib/firm";
import type { DraftLanguage } from "@/lib/language";
import { Field, inputClass } from "@/lib/ui";
import { criminalDraftInLanguage } from "@/lib/urduDraft";
import { getExtendedModuleByWriterType } from "@/lib/config/automationRegistry";
import { criminalFormToExtendedFormData } from "@/lib/extendedCriminalFormData";
import { criminalFormToFields } from "@/lib/writerFormMap";
import {
  submitExtendedCriminalDocx,
  submitWriterForm,
} from "@/lib/writerClient";

const VALID_TYPES = new Set<string>(criminalAppOptions.map((o) => o.id));

function CriminalApplicationsWriterInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get("type");

  const [form, setForm] = useState<CriminalForm>(() => {
    const initial = emptyCriminalForm();
    if (typeParam && VALID_TYPES.has(typeParam)) {
      const next = typeParam as CriminalAppType;
      return {
        ...initial,
        appType: next,
        courtTitle: COURT_DEFAULTS[next] ?? initial.courtTitle,
      };
    }
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<DraftLanguage>("en");

  const draft = useMemo(
    () => criminalDraftInLanguage(buildCriminalDraft(form), form, language),
    [form, language],
  );
  const { affidavit, ...petition } = draft;

  useEffect(() => {
    if (!typeParam || !VALID_TYPES.has(typeParam)) return;
    const next = typeParam as CriminalAppType;
    setForm((current) => {
      if (current.appType === next) return current;
      return {
        ...current,
        appType: next,
        courtTitle: COURT_DEFAULTS[next] ?? current.courtTitle,
      };
    });
  }, [typeParam]);

  function update<K extends keyof CriminalForm>(key: K, value: CriminalForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setAppType(next: CriminalForm["appType"]) {
    setError("");
    setForm((current) => ({
      ...current,
      appType: next,
      courtTitle: COURT_DEFAULTS[next] ?? current.courtTitle,
    }));
    router.replace(`/tools/criminal-applications-writer?type=${encodeURIComponent(next)}`, {
      scroll: false,
    });
  }

  async function printDraft() {
    const { ensureLeadThenLog } = await import("@/lib/logToolUsage");
    const ok = await ensureLeadThenLog({
      toolUsed: "criminal-applications-writer",
      draftType: form.appType,
    });
    if (!ok) return;
    window.print();
  }

  async function generateDocx() {
    setSubmitting(true);
    setError("");
    try {
      const extendedKey = getExtendedModuleByWriterType(form.appType);
      if (extendedKey) {
        await submitExtendedCriminalDocx(
          extendedKey,
          criminalFormToExtendedFormData(extendedKey, form),
        );
      } else {
        await submitWriterForm(form.appType, criminalFormToFields(form), "docx");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate document.");
    } finally {
      setSubmitting(false);
    }
  }

  function clearDraft() {
    const cleared = emptyCriminalForm();
    const keepType = form.appType;
    setForm({
      ...cleared,
      appType: keepType,
      courtTitle: COURT_DEFAULTS[keepType] ?? cleared.courtTitle,
    });
    setError("");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
          <Field label="Application type">
            <select
              className={inputClass}
              value={form.appType}
              onChange={(e) => setAppType(e.target.value as CriminalForm["appType"])}
            >
              {criminalAppOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <LanguageSelect value={language} onChange={setLanguage} />
        </div>
        <p className="max-w-md text-xs text-slate-500 sm:text-right">{disclaimer}</p>
      </div>

      <div className="screen-grid grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="no-print">
          <CriminalModuleForm
            appType={form.appType}
            form={form}
            update={update}
            onGenerate={generateDocx}
            onPrint={printDraft}
            onClear={clearDraft}
            submitting={submitting}
            error={error}
          />
        </div>
        <div className="print-stage lg:sticky lg:top-6">
          <TextPetition {...petition} language={language} />
          {affidavit ? <CriminalAffidavitPreview affidavit={affidavit} /> : null}
        </div>
      </div>
    </main>
  );
}

export function CriminalApplicationsWriter() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-sm text-ink/60">Loading criminal applications writer…</p>
        </main>
      }
    >
      <CriminalApplicationsWriterInner />
    </Suspense>
  );
}
