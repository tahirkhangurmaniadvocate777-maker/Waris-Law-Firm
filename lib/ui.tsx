"use client";

import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs leading-5 text-ink/60">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h2 className="font-serif text-lg text-navy">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

export function ToolIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="no-print max-w-3xl">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl text-navy">{title}</h1>
      <div className="mt-3 space-y-3 text-sm leading-6 text-ink/80">{children}</div>
    </div>
  );
}
