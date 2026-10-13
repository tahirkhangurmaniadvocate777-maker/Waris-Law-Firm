"use client";

import { useEffect, useMemo, useState } from "react";

export type ReferencerEntryView = {
  id?: string;
  category: string;
  sectionNumber: string;
  title: string;
  keywords: string;
  shortNote: string;
  relatedSections: string;
  checklist: string[];
};

/** Baseline statutory index from product seed (154 FIR, 497 bail, 249-A acquittal). */
export const SEED_DATA_SET: ReferencerEntryView[] = [
  {
    id: "seed-ui-154",
    category: "investigation",
    sectionNumber: "154",
    title: "Recording of First Information Report (FIR)",
    keywords: "fir 154 police cognizable information crime",
    shortNote:
      "Mandatory statutory duty of the Officer in Charge of a Police Station to record information regarding a cognizable offense.",
    relatedSections: "22-A, 22-B, 156 CrPC",
    checklist: [
      "Verify if the facts disclose a distinct cognizable offense under the PPC.",
      "Obtain a certified copy of the recorded statement instantly.",
      "If police refuse, prepare to file an application before the Justice of the Peace.",
    ],
  },
  {
    id: "seed-ui-497",
    category: "trial stage",
    sectionNumber: "497",
    title: "Post-Arrest Bail Application Framework",
    keywords: "bail 497 post arrest life imprisonment prohibitory clause",
    shortNote:
      "Statutory parameters governing release after arrest. Offenses carrying death, imprisonment for life, or 10 years do not qualify as a matter of right.",
    relatedSections: "498, 497(2) CrPC",
    checklist: [
      "Analyze whether the case falls under the exception criteria of 'Further Inquiry' u/s 497(2).",
      "Check statutory delay limits if the trial has extended beyond 1-2 years without conviction.",
      "Review if the applicant qualifies for special relief clauses (minor, female, sick, or infirm).",
    ],
  },
  {
    id: "seed-ui-249-A",
    category: "acquittal",
    sectionNumber: "249-A",
    title: "Acquittal Application by Magistrate",
    keywords: "acquittal 249-a magistrate groundless conviction trial",
    shortNote:
      "Empowers a Magistrate to acquit an accused person at any stage of the case if the charge is groundless and there is no probability of conviction.",
    relatedSections: "265-K, 173 CrPC",
    checklist: [
      "Review the police report (Challan) for structural lacunae or lack of independent witnesses.",
      "Argue the groundless nature of the charge based on initial statements recorded.",
      "Move the motion at an early stage of the case to save the client from prolonged trial abuse.",
    ],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  investigation: "Investigation",
  "trial stage": "Trial Stage",
  acquittal: "Acquittal",
  evidence: "Evidence",
};

type ApiEntry = {
  id: string;
  category: string;
  sectionNumber: string | null;
  title: string;
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

function normalizeSectionKey(section: string | null | undefined): string {
  return (section ?? "").trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}

function categoryLabel(category: string): string {
  const key = normalizeCategory(category);
  return CATEGORY_LABELS[key] ?? category;
}

/** Seed wins on sectionNumber collision; DB rows with new sections are appended. */
export function mergeReferencerEntries(
  seed: ReferencerEntryView[],
  db: ApiEntry[],
): ReferencerEntryView[] {
  const bySection = new Map<string, ReferencerEntryView>();
  const withoutSection: ReferencerEntryView[] = [];

  for (const entry of seed) {
    const key = normalizeSectionKey(entry.sectionNumber);
    if (key) bySection.set(key, { ...entry, category: normalizeCategory(entry.category) });
    else withoutSection.push({ ...entry, category: normalizeCategory(entry.category) });
  }

  for (const row of db) {
    const key = normalizeSectionKey(row.sectionNumber);
    const mapped: ReferencerEntryView = {
      id: row.id,
      category: normalizeCategory(row.category),
      sectionNumber: (row.sectionNumber ?? "").trim(),
      title: row.title,
      keywords: row.keywords,
      shortNote: row.shortNote,
      relatedSections: row.relatedSections ?? "",
      checklist: parseChecklist(row.checklistJson),
    };
    if (!key) {
      withoutSection.push(mapped);
      continue;
    }
    if (!bySection.has(key)) bySection.set(key, mapped);
  }

  return [...bySection.values(), ...withoutSection];
}

export function CriminalReferencer() {
  const [entries, setEntries] = useState<ReferencerEntryView[]>(SEED_DATA_SET);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/referencer");
        if (!res.ok) return;
        const data = (await res.json()) as ApiEntry[];
        if (cancelled || !Array.isArray(data)) return;
        setEntries(mergeReferencerEntries(SEED_DATA_SET, data));
      } catch {
        /* keep seed baseline offline / if API unavailable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const found = Array.from(new Set(entries.map((e) => normalizeCategory(e.category)))).sort();
    const preferred = ["investigation", "trial stage", "acquittal"];
    const ordered = [
      ...preferred.filter((c) => found.includes(c)),
      ...found.filter((c) => !preferred.includes(c)),
    ];
    return ordered;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesCategory =
        selectedCategory === "all" || normalizeCategory(entry.category) === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.sectionNumber.toLowerCase().includes(q) ||
        entry.keywords.toLowerCase().includes(q) ||
        entry.shortNote.toLowerCase().includes(q)
      );
    });
  }, [entries, searchQuery, selectedCategory]);

  return (
    <div className="min-h-[70vh] bg-slate-950 p-6 text-slate-100 selection:bg-amber-500/20 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-slate-900 pb-6">
          <div className="mb-3 inline-block rounded bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
            Tool 1 — Criminal Trial Referencer
          </div>
          <h1 className="font-serif text-3xl font-medium text-white">Statutory Query Engine</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cross-reference case thresholds, trial timelines, and procedural codes across Punjab
            subordinate courts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-900 bg-slate-900/40 p-4 md:grid-cols-4">
          <div className="md:col-span-3">
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Search Query Text
            </label>
            <input
              type="text"
              placeholder="Type section number, title, or index keywords (e.g., 497, Bail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white transition focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Category Filter
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 transition focus:border-amber-500 focus:outline-none"
            >
              <option value="all">All Stages</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-800 p-12 text-center text-slate-500 italic">
              No index matches found for the requested legal section criteria.
            </div>
          ) : (
            filteredEntries.map((entry, idx) => {
              const rowKey = entry.id ?? `${entry.sectionNumber}-${idx}`;
              const expanded = expandedKey === rowKey;
              return (
                <div
                  key={rowKey}
                  className="space-y-3 rounded-lg border border-slate-900 bg-slate-950 p-5 transition hover:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-base font-medium text-white">
                        Section {entry.sectionNumber}: {entry.title}
                      </h3>
                      <span className="mt-1 block font-mono text-[10px] tracking-wide text-slate-500 uppercase">
                        Related: {entry.relatedSections || "None"}
                      </span>
                    </div>
                    <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      {categoryLabel(entry.category)}
                    </span>
                  </div>

                  <p className="text-justify text-xs leading-relaxed text-slate-400">
                    {entry.shortNote}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setExpandedKey(expanded ? null : rowKey)}
                      className="flex items-center gap-1 text-xs font-semibold tracking-wider text-amber-400 uppercase transition hover:text-amber-300"
                    >
                      <span>{expanded ? "▼ Hide" : "▶ View"}</span> Procedural Application
                      Checklist
                    </button>

                    {expanded ? (
                      <ul className="mt-3 list-inside list-decimal space-y-2 rounded border border-slate-900 bg-slate-900/30 p-4 text-xs text-slate-400">
                        {entry.checklist.map((item, cIdx) => (
                          <li key={`${rowKey}-c-${cIdx}`} className="pl-1 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
