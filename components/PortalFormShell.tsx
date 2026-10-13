"use client";

import type { ReactNode } from "react";

export const portalInputClass =
  "w-full rounded-md border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40";

const toneBadge: Record<string, string> = {
  indigo: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/25",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25",
  rose: "bg-rose-500/15 text-rose-300 ring-rose-400/25",
};

const toneSubmit: Record<string, string> = {
  indigo: "bg-indigo-500 hover:bg-indigo-400",
  amber: "bg-amber-500 hover:bg-amber-400 text-slate-950",
  emerald: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
  rose: "bg-rose-500 hover:bg-rose-400",
};

export function PortalField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium tracking-wide text-slate-400">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

type PortalFormShellProps = {
  badge: string;
  tone?: keyof typeof toneBadge;
  title: string;
  description?: string;
  children: ReactNode;
  submitLabel: string;
  onSubmit: () => void | Promise<void>;
  onPrint?: () => void | Promise<void>;
  onClear?: () => void;
  submitting?: boolean;
  error?: string;
};

export function PortalFormShell({
  badge,
  tone = "indigo",
  title,
  description,
  children,
  submitLabel,
  onSubmit,
  onPrint,
  onClear,
  submitting,
  error,
}: PortalFormShellProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl shadow-slate-900/20">
      <div className="border-b border-slate-700 px-5 py-5 md:px-6">
        <span
          className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase ring-1 ${toneBadge[tone] ?? toneBadge.indigo}`}
        >
          {badge}
        </span>
        <h2 className="mt-3 font-serif text-xl leading-snug text-white md:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 px-5 py-5 md:px-6">
        {children}

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-col gap-3 border-t border-slate-700 pt-5 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void onSubmit()}
            className={`rounded-md px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${toneSubmit[tone] ?? toneSubmit.indigo}`}
          >
            {submitting ? "Generating…" : submitLabel}
          </button>
          {onPrint ? (
            <button
              type="button"
              onClick={() => void onPrint()}
              className="rounded-md border border-slate-500 bg-slate-700/50 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700"
            >
              Print / Save as PDF
            </button>
          ) : null}
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Clear draft
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function spanClass(span: 1 | 2 | 3 | 4 = 2) {
  switch (span) {
    case 1:
      return "sm:col-span-1";
    case 3:
      return "sm:col-span-3";
    case 4:
      return "sm:col-span-4";
    default:
      return "sm:col-span-2";
  }
}
