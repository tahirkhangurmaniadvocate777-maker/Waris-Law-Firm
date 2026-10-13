import { CIVIL_SUIT_OPTIONS } from "@/lib/civilOptions";
import { EXTENDED_CRIMINAL_SYSTEM_REGISTRY } from "@/lib/config/automationRegistry";
import {
  FBR_SECP_HUB_PATH,
  REGULATORY_REGISTRY,
} from "@/lib/config/taxGuides";
import { criminalAppOptions } from "@/lib/criminal";
import { familySuitOptions } from "@/lib/family";
import { practiceAreas } from "@/lib/practice";
import { revenueOptions } from "@/lib/revenue";

export type LawField =
  | "Criminal"
  | "Family"
  | "Civil"
  | "Revenue"
  | "Tax & Corporate"
  | "Practice"
  | "Tools";

export type PortalSearchEntry = {
  id: string;
  label: string;
  href: string;
  field: LawField;
  keywords: string;
};

function entry(
  id: string,
  label: string,
  href: string,
  field: LawField,
  keywords: string[] = [],
): PortalSearchEntry {
  return {
    id,
    label,
    href,
    field,
    keywords: keywords.join(" ").toLowerCase(),
  };
}

const fixedTools: PortalSearchEntry[] = [
  entry(
    "tool-case-prep",
    "Case Preparation Analyzer",
    "/tools/case-prep",
    "Tools",
    ["fir", "mlc", "discrepancy", "precedent", "advisory"],
  ),
  entry(
    "tool-referencer",
    "Criminal Trial Referencer",
    "/tools/criminal-trial-referencer",
    "Criminal",
    ["fir", "154", "bail", "497", "249-a", "checklist", "statute", "ppc", "crpc"],
  ),
  entry(
    "tool-civil",
    "Civil Suit Writer",
    "/tools/civil-suit-writer",
    "Civil",
    ["cpc", "plaint", "order vii", "specific relief"],
  ),
  entry(
    "tool-revenue",
    "Revenue Applications Writer",
    "/tools/revenue-applications-writer",
    "Revenue",
    ["lra", "land revenue", "patwari", "mutation", "khasra"],
  ),
  entry(
    "tool-fbr-secp",
    "FBR / SECP Practice Hub",
    FBR_SECP_HUB_PATH,
    "Tax & Corporate",
    ["iris", "itr", "secp", "company", "tax", "atl"],
  ),
];

const criminalEntries: PortalSearchEntry[] = criminalAppOptions.map((opt) => {
  const extended = Object.values(EXTENDED_CRIMINAL_SYSTEM_REGISTRY).find(
    (mod) => mod.writerTypeId === opt.id,
  );
  return entry(
    `criminal-${opt.id}`,
    opt.label,
    `/tools/criminal-applications-writer?type=${opt.id}`,
    "Criminal",
    [
      opt.id,
      "criminal",
      "cr.p.c",
      "crpc",
      "ppc",
      extended?.statutorySection ?? "",
      extended?.englishHeader ?? "",
    ],
  );
});

const familyEntries: PortalSearchEntry[] = familySuitOptions.map((opt) =>
  entry(
    `family-${opt.id}`,
    opt.label,
    `/tools/family-suit-writer?type=${opt.id}`,
    "Family",
    [
      opt.id,
      "family",
      "matrimonial",
      "nikahnama",
      "family court",
      "guardians",
      "wards",
    ],
  ),
);

const civilEntries: PortalSearchEntry[] = CIVIL_SUIT_OPTIONS.map((opt) =>
  entry(
    `civil-${opt.id}`,
    opt.label,
    `/tools/civil-suit-writer?type=${opt.id}`,
    "Civil",
    [opt.id, opt.statute, "civil", "cpc", "plaint", "specific relief"],
  ),
).concat(
  entry(
    "civil-temp-injunction",
    "Temporary Injunction (Order XXXIX)",
    "/tools/civil-suit-writer?type=temporary-injunction-o39",
    "Civil",
    ["o39", "injunction", "stay", "irreparable", "cpc"],
  ),
);

const revenueEntries: PortalSearchEntry[] = revenueOptions.map((opt) =>
  entry(
    `revenue-${opt.id}`,
    opt.label,
    `/tools/revenue-applications-writer?type=${opt.id}`,
    "Revenue",
    [
      opt.id,
      "revenue",
      "lra",
      "land revenue",
      "tehsildar",
      "collector",
      "mauza",
      "jamabandi",
    ],
  ),
);

const taxEntries: PortalSearchEntry[] = Object.values(REGULATORY_REGISTRY).map(
  (guide) =>
    entry(
      `tax-${guide.id}`,
      guide.title,
      FBR_SECP_HUB_PATH,
      "Tax & Corporate",
      [
        guide.tabLabel,
        guide.portalName,
        guide.lawContext,
        "fbr",
        "secp",
        "tax",
        "corporate",
      ],
    ),
);

const practiceEntries: PortalSearchEntry[] = practiceAreas.map((area) =>
  entry(`practice-${area.slug}`, area.title, area.href, "Practice", [
    area.slug,
    area.summary,
    ...area.points,
    "practice area",
    "law field",
  ]),
);

/** Deduplicate by href, keeping the first (more specific) label. */
function dedupeByHref(items: PortalSearchEntry[]): PortalSearchEntry[] {
  const seen = new Set<string>();
  const out: PortalSearchEntry[] = [];
  for (const item of items) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    out.push(item);
  }
  return out;
}

export const PORTAL_SEARCH_CATALOG: readonly PortalSearchEntry[] = dedupeByHref([
  ...practiceEntries,
  ...criminalEntries,
  ...familyEntries,
  ...civilEntries,
  ...revenueEntries,
  ...taxEntries,
  ...fixedTools,
]);

const FIELD_ORDER: LawField[] = [
  "Practice",
  "Criminal",
  "Family",
  "Civil",
  "Revenue",
  "Tax & Corporate",
  "Tools",
];

export function searchPortalCatalog(
  query: string,
  limit = 40,
): PortalSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = PORTAL_SEARCH_CATALOG.map((item) => {
    const haystack = `${item.label} ${item.field} ${item.keywords}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (item.label.toLowerCase().includes(token)) score += 4;
      else if (item.field.toLowerCase().includes(token)) score += 3;
      else if (haystack.includes(token)) score += 1;
      else return null;
    }
    if (item.label.toLowerCase().startsWith(q)) score += 2;
    return { item, score };
  }).filter((row): row is { item: PortalSearchEntry; score: number } => row != null);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const fieldDiff =
      FIELD_ORDER.indexOf(a.item.field) - FIELD_ORDER.indexOf(b.item.field);
    if (fieldDiff !== 0) return fieldDiff;
    return a.item.label.localeCompare(b.item.label);
  });

  return scored.slice(0, limit).map((row) => row.item);
}

export function groupSearchResults(
  results: PortalSearchEntry[],
): { field: LawField; items: PortalSearchEntry[] }[] {
  const map = new Map<LawField, PortalSearchEntry[]>();
  for (const item of results) {
    const list = map.get(item.field) ?? [];
    list.push(item);
    map.set(item.field, list);
  }
  return FIELD_ORDER.filter((field) => map.has(field)).map((field) => ({
    field,
    items: map.get(field)!,
  }));
}
