"use client";

import { useMemo, useState } from "react";
import { PetitionPreview } from "@/components/PetitionPreview";
import { disclaimer, firm } from "@/lib/firm";
import {
  emptyMaintenanceForm,
  formatPkr,
  suggestPastTotal,
  type MaintenanceForm,
} from "@/lib/maintenance";

const inputClass = "w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs leading-5 text-ink/60">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h2 className="font-serif text-lg text-navy">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

export function MaintenanceSuitWriter() {
  const [form, setForm] = useState<MaintenanceForm>(() =>
    emptyMaintenanceForm(firm.advocate, firm.defaultCourt),
  );
  const [totalTouched, setTotalTouched] = useState(false);

  const suggestion = useMemo(
    () => suggestPastTotal(form.pastStart, form.pastEnd, form.pastRate),
    [form.pastStart, form.pastEnd, form.pastRate],
  );

  function update<K extends keyof MaintenanceForm>(key: K, value: MaintenanceForm[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "totalPast") return next;
      if (totalTouched) return next;
      if (key === "pastStart" || key === "pastEnd" || key === "pastRate") {
        const nextSuggestion = suggestPastTotal(
          key === "pastStart" ? String(value) : next.pastStart,
          key === "pastEnd" ? String(value) : next.pastEnd,
          key === "pastRate" ? String(value) : next.pastRate,
        );
        next.totalPast = nextSuggestion ? String(nextSuggestion.total) : "";
      }
      return next;
    });
  }

  async function printPlaint() {
    const { ensureLeadThenLog } = await import("@/lib/logToolUsage");
    const ok = await ensureLeadThenLog({
      toolUsed: "family-suit-writer",
      draftType: "past-future-maintenance",
    });
    if (!ok) return;
    window.print();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="no-print max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Family Suit Writer</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">Past and future maintenance</h1>
        <p className="mt-3 text-sm leading-6 text-ink/80">
          Suit for the plaintiff and the minor children. The draft on the right follows the plaint
          as it will print. Blank lines are particulars still to be filled.
        </p>
        <p className="mt-3 text-sm leading-6 text-ink/70">{disclaimer}</p>
      </div>

      <div className="screen-grid mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="no-print grid gap-4">
          <Section title="Court and counsel">
            <Field label="Family Court at" hint="Printed after “Learned Family Judge”.">
              <input
                className={inputClass}
                value={form.courtLocation}
                onChange={(event) => update("courtLocation", event.target.value)}
              />
            </Field>
            <Field label="Suit number, if already allocated" hint="Leave blank and the draft keeps a blank number.">
              <input
                className={inputClass}
                value={form.suitNumber}
                onChange={(event) => update("suitNumber", event.target.value)}
              />
            </Field>
            <Field label="Advocate">
              <input
                className={inputClass}
                value={form.lawyerName}
                onChange={(event) => update("lawyerName", event.target.value)}
              />
            </Field>
            <Field label="Date of verification">
              <input
                type="date"
                className={inputClass}
                value={form.verificationDate}
                onChange={(event) => update("verificationDate", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Plaintiff">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.plaintiffName}
                onChange={(event) => update("plaintiffName", event.target.value)}
              />
            </Field>
            <Field label="Relation" hint="For example: wife of Ahmad Khan, or daughter of Ghulam Rasul.">
              <input
                className={inputClass}
                value={form.plaintiffRelation}
                onChange={(event) => update("plaintiffRelation", event.target.value)}
              />
            </Field>
            <Field label="Address">
              <textarea
                rows={2}
                className={inputClass}
                value={form.plaintiffAddress}
                onChange={(event) => update("plaintiffAddress", event.target.value)}
              />
            </Field>
            <Field label="Cell number">
              <input
                className={inputClass}
                value={form.plaintiffPhone}
                onChange={(event) => update("plaintiffPhone", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Defendant">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.defendantName}
                onChange={(event) => update("defendantName", event.target.value)}
              />
            </Field>
            <Field label="Relation" hint="For example: son of Ahmad Khan.">
              <input
                className={inputClass}
                value={form.defendantRelation}
                onChange={(event) => update("defendantRelation", event.target.value)}
              />
            </Field>
            <Field label="Address">
              <textarea
                rows={2}
                className={inputClass}
                value={form.defendantAddress}
                onChange={(event) => update("defendantAddress", event.target.value)}
              />
            </Field>
            <Field label="Cell number">
              <input
                className={inputClass}
                value={form.defendantPhone}
                onChange={(event) => update("defendantPhone", event.target.value)}
              />
            </Field>
            <Field label="Business or work" hint="Used in the means paragraph. Leave blank if only salary applies.">
              <input
                className={inputClass}
                value={form.defendantOccupation}
                onChange={(event) => update("defendantOccupation", event.target.value)}
              />
            </Field>
            <Field label="Monthly income (PKR)">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.defendantIncome}
                onChange={(event) => update("defendantIncome", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Marriage, children, and separation">
            <Field label="Date of nikah">
              <input
                type="date"
                className={inputClass}
                value={form.marriageDate}
                onChange={(event) => update("marriageDate", event.target.value)}
              />
            </Field>
            <Field label="Number of children">
              <input
                className={inputClass}
                value={form.childrenCount}
                onChange={(event) => update("childrenCount", event.target.value)}
              />
            </Field>
            <Field label="Children" hint="Names and ages, for example: Ali, aged 7 years, and Ayesha, aged 4 years.">
              <textarea
                rows={2}
                className={inputClass}
                value={form.childrenDetails}
                onChange={(event) => update("childrenDetails", event.target.value)}
              />
            </Field>
            <Field label="Date the plaintiff and minors were turned out">
              <input
                type="date"
                className={inputClass}
                value={form.abandonmentDate}
                onChange={(event) => update("abandonmentDate", event.target.value)}
              />
            </Field>
            <Field label="School">
              <input
                className={inputClass}
                value={form.schoolName}
                onChange={(event) => update("schoolName", event.target.value)}
              />
            </Field>
            <Field label="Monthly school expense (PKR)">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.schoolExpense}
                onChange={(event) => update("schoolExpense", event.target.value)}
              />
            </Field>
          </Section>

          <Section title="Maintenance claimed">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Past maintenance from">
                <input
                  type="date"
                  className={inputClass}
                  value={form.pastStart}
                  onChange={(event) => update("pastStart", event.target.value)}
                />
              </Field>
              <Field label="Past maintenance to">
                <input
                  type="date"
                  className={inputClass}
                  value={form.pastEnd}
                  onChange={(event) => update("pastEnd", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Past rate per month (PKR)" hint="One combined rate for the plaintiff and the minors, as stated in paragraph 6.">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.pastRate}
                onChange={(event) => update("pastRate", event.target.value)}
              />
            </Field>
            <Field label="Future rate per month in the facts (PKR)" hint="The single future rate in paragraph 6, with a 10% annual increase.">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.futureRate}
                onChange={(event) => update("futureRate", event.target.value)}
              />
            </Field>
            <Field
              label="Total past maintenance (PKR)"
              hint={
                suggestion
                  ? `${suggestion.months} inclusive calendar months × the past rate = PKR ${formatPkr(String(suggestion.total))}.`
                  : "Filled automatically from the past dates and monthly rate. You can type a different total."
              }
            >
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.totalPast}
                onChange={(event) => {
                  setTotalTouched(true);
                  update("totalPast", event.target.value);
                }}
              />
            </Field>
            {suggestion ? (
              <button
                type="button"
                className="justify-self-start text-sm font-medium text-navy-2 underline"
                onClick={() => {
                  setTotalTouched(false);
                  setForm((current) => ({ ...current, totalPast: String(suggestion.total) }));
                }}
              >
                Use the calculated total
              </button>
            ) : null}
            <Field label="Future maintenance for the plaintiff (PKR / month)">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.wifeFutureRate}
                onChange={(event) => update("wifeFutureRate", event.target.value)}
              />
            </Field>
            <Field label="Future maintenance for each minor (PKR / month)">
              <input
                inputMode="decimal"
                className={inputClass}
                value={form.childFutureRate}
                onChange={(event) => update("childFutureRate", event.target.value)}
              />
            </Field>
            <Field label="Date financial support stopped">
              <input
                type="date"
                className={inputClass}
                value={form.causeDate}
                onChange={(event) => update("causeDate", event.target.value)}
              />
            </Field>
          </Section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={printPlaint}
              className="rounded bg-navy px-4 py-2.5 text-sm font-semibold text-white"
            >
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setTotalTouched(false);
                setForm(emptyMaintenanceForm(firm.advocate, firm.defaultCourt));
              }}
              className="rounded border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy"
            >
              Clear draft
            </button>
          </div>
        </div>

        <div className="print-stage lg:sticky lg:top-6">
          <PetitionPreview form={form} />
        </div>
      </div>
    </main>
  );
}
