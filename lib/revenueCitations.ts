export type RevenueCitation = {
  id: string;
  citation: string;
  title: string;
  text: string;
};

/** Authoritative partition / LRA authorities for Sec. 135 drafts. */
export const REVENUE_CITATIONS: RevenueCitation[] = [
  {
    id: "pld-2019-sc-318",
    citation: "PLD 2019 Supreme Court 318",
    title: "Jurisdiction Stay on Title Disputes (u/s 141 LRA)",
    text: "Held: When a bona fide question of title arises in partition proceedings, the Revenue Court must hold its hands and stay proceedings until a competent Civil Court determines ownership rights.",
  },
  {
    id: "scmr-2022-1143",
    citation: "2022 SCMR 1143",
    title: "Frivolous Title Objections in Takseem Matters",
    text: "Held: Mere assertion of title without prima facie documentary proof cannot defeat partition proceedings. Frivolous objections aimed at delaying joint khata distribution should be summarily rejected.",
  },
  {
    id: "pld-2015-lahore-412",
    citation: "PLD 2015 Lahore 412",
    title: "Mode of Partition Timeline (Naksha Alif, Be, Jeem)",
    text: "Held: Revenue authorities must strictly adhere to statutory timelines for compiling Naksha Alif, Tareeq-e-Takseem (Naksha Be), and the final Sanad (Naksha Jeem) without unnecessary delays.",
  },
];

export function formatCitationParagraph(matched: RevenueCitation): string {
  return `As per ${matched.citation} (${matched.title}), it is respectfully submitted that ${matched.text.toLowerCase()}`;
}

export function appendCitationToGrounds(
  existing: string,
  citationId: string,
): string {
  const matched = REVENUE_CITATIONS.find((c) => c.id === citationId);
  if (!matched) return existing;
  const paragraph = formatCitationParagraph(matched);
  const trimmed = existing.trim();
  return trimmed
    ? `${trimmed}\n\nLegal Precedent: ${paragraph}`
    : paragraph;
}
