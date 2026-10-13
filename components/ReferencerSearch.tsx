"use client";

import { useMemo, useState } from "react";

type Entry = {
  id: string;
  title: string;
  category: string;
  sectionNumber: string | null;
  keywords: string;
  shortNote: string;
  relatedSections: string | null;
  checklistJson: string;
};

function parseChecklist(raw: string): string[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
  } catch {
    /* pipe-delimited fallback */
  }
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ReferencerSearch({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(entries.map((e) => e.category))).sort()],
    [entries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (!q) return true;
      const hay = [
        entry.title,
        entry.sectionNumber ?? "",
        entry.keywords,
        entry.shortNote,
        entry.relatedSections ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [entries, query, category]);

  const active = filtered.find((e) => e.id === activeId) ?? filtered[0] ?? null;
  const checklist = active ? parseChecklist(active.checklistJson) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="rounded-lg border border-line bg-white p-4">
        <label className="block text-sm font-medium text-navy">
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Section, keyword, stage…"
            className="mt-1.5 w-full rounded border border-line px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-navy">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded border border-line px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </label>
        <ul className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto">
          {filtered.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setActiveId(entry.id)}
                className={`w-full rounded border px-3 py-2 text-left text-sm ${
                  active?.id === entry.id
                    ? "border-gold bg-paper"
                    : "border-line bg-white hover:border-gold/60"
                }`}
              >
                <span className="block font-medium text-navy">{entry.title}</span>
                <span className="mt-0.5 block text-xs text-ink/60">
                  {entry.category}
                  {entry.sectionNumber ? ` · ${entry.sectionNumber}` : ""}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 ? <li className="text-sm text-ink/60">No matching entries.</li> : null}
        </ul>
      </div>

      {active ? (
        <article className="rounded-lg border border-line bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">{active.category}</p>
          <h2 className="mt-2 font-serif text-2xl text-navy">{active.title}</h2>
          {active.sectionNumber ? (
            <p className="mt-1 text-sm font-medium text-navy-2">{active.sectionNumber}</p>
          ) : null}
          <p className="mt-4 text-sm leading-7 text-ink/85">{active.shortNote}</p>
          {checklist.length ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-navy">Checklist</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                {checklist.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {active.relatedSections ? (
            <p className="mt-4 text-sm text-ink/70">
              <span className="font-semibold text-navy">Related: </span>
              {active.relatedSections}
            </p>
          ) : null}
        </article>
      ) : null}
    </div>
  );
}
