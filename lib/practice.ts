import { FBR_SECP_HUB_PATH } from "@/lib/config/taxGuides";
import {
  PRACTICE_AREAS_TEXT,
  type PracticeAreaContent,
  type PracticeAreaSlug,
} from "@/lib/config/websiteContent";

type PracticeAreaCard = PracticeAreaContent & {
  points: string[];
  href: string;
  cta: string;
};

const TOOL_LINKS: Record<PracticeAreaSlug, { href: string; cta: string; points: string[] }> = {
  "criminal-law": {
    href: "/tools/criminal-applications-writer",
    cta: "Open criminal tools",
    points: ["Bail u/s 497 & 498 Cr.P.C.", "249-A / 265-K applications", "Trial stages & referencer"],
  },
  "civil-law": {
    href: "/tools/civil-suit-writer",
    cta: "Open civil suit writer",
    points: ["Order VII plaints", "Injunction & declaration", "Possession & partition"],
  },
  "family-law": {
    href: "/tools/family-suit-writer",
    cta: "Open family suit writer",
    points: ["Khula & dissolution", "Dower & maintenance", "Custody & dowry recovery"],
  },
  "revenue-law": {
    href: "/tools/revenue-applications-writer",
    cta: "Open revenue writer",
    points: ["Mutation & record correction", "Hadd Bandi / demarcation", "Agricultural partition"],
  },
  "tax-corporate": {
    href: FBR_SECP_HUB_PATH,
    cta: "Open tax practice hub",
    points: ["ITR Sec. 114 checklists", "Wealth Sec. 116 notes", "IRIS & SECP portal guides"],
  },
};

/** Marketing cards — copy from websiteContent, CTAs to drafting tools. */
export const practiceAreas: readonly PracticeAreaCard[] = PRACTICE_AREAS_TEXT.map((area) => {
  const links = TOOL_LINKS[area.slug];
  return {
    ...area,
    points: links.points,
    href: links.href,
    cta: links.cta,
  };
});
