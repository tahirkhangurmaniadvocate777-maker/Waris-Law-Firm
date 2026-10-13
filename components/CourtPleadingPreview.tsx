import { disclaimer, firm } from "@/lib/firm";
import {
  formatPldGroundsParagraphs,
  normalizePldCitations,
  type PldCitations,
} from "@/lib/types/drafting";

export type CourtPleadingPreviewProps = {
  /** Cause-title / heading shown centered above the body. */
  title: string;
  /** Pre-formatted pleading body (whitespace preserved). */
  content: string;
  lawyerName?: string;
  firmAddress?: string;
  /**
   * Optional PLD / authority citations rendered as numbered paragraphs
   * under a Grounds heading after the main content.
   */
  pld_citations?: PldCitations;
  /** Alias accepted by some writers. */
  caseLawCitations?: string[];
};

const DEFAULT_FIRM_ADDRESS = [
  firm.officeAddress,
  firm.phones.map((p) => p.display).join(" · "),
]
  .filter(Boolean)
  .join(" — ");

/**
 * Court-ready pleading surface: serif type, amber paper on screen,
 * white pages in print, 2-inch stamp margin, counsel signature block.
 */
export default function CourtPleadingPreview({
  title,
  content,
  lawyerName = firm.advocate,
  firmAddress = DEFAULT_FIRM_ADDRESS,
  pld_citations,
  caseLawCitations,
}: CourtPleadingPreviewProps) {
  const citations = [
    ...normalizePldCitations(pld_citations),
    ...(caseLawCitations ?? []).map((c) => c.trim()).filter(Boolean),
  ];
  const grounds = formatPldGroundsParagraphs(citations);

  return (
    <article
      id="petition-print"
      className="court-pleading-sheet mx-auto min-h-[11in] max-w-[8.5in] border border-stone-300 bg-amber-50 font-serif text-justify text-sm leading-relaxed text-stone-900 shadow-inner print:border-0 print:bg-white print:shadow-none"
    >
      {/* 2-inch top clearance for court stamps / fee stamps */}
      <div className="court-pleading-stamp-margin" aria-hidden="true" />

      <div className="px-10 pb-10 print:px-0 print:pb-0">
        <h2 className="mb-6 border-b-2 border-stone-800 pb-2 text-center text-lg font-bold tracking-wider uppercase">
          {title}
        </h2>

        <div className="whitespace-pre-line leading-[1.65]">{content}</div>

        {grounds.length > 0 ? (
          <section className="mt-8">
            <p className="mb-3 font-bold tracking-wide uppercase">Grounds</p>
            {grounds.map((para) => (
              <p key={para} className="mb-2 text-justify leading-[1.65]">
                {para}
              </p>
            ))}
          </section>
        ) : null}

        <div className="mt-12 text-right text-xs">
          <p className="font-bold">
            Through Counsel: {lawyerName}, {firm.designation}
          </p>
          <p className="mt-4 inline-block min-w-[220px] border-t border-stone-400 pt-1 font-sans text-[10px] font-semibold tracking-wide text-stone-800 uppercase">
            {lawyerName}
          </p>
          <p className="mt-0.5 font-sans text-[10px] text-stone-500">{firmAddress}</p>
          <p className="mt-1 font-sans text-[10px] text-stone-500">{firm.name}</p>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-4 text-center font-sans text-[9px] text-stone-400 print:block">
          {disclaimer}
        </div>
      </div>
    </article>
  );
}
