import Link from "next/link";
import type { Metadata } from "next";
import { PortalSearch } from "@/components/PortalSearch";
import { FBR_SECP_HUB_PATH } from "@/lib/config/taxGuides";

export const metadata: Metadata = { title: "Drafting Portal" };

const quickLinks = [
  {
    label: "Criminal Trial Referencer",
    detail: "Statutory query engine — FIR 154, bail 497, acquittal 249-A, and trial checklists.",
    href: "/tools/criminal-trial-referencer",
  },
  {
    label: "FIR Direction (22-A/B)",
    detail: "Direction to register an FIR before the Ex-Officio Justice of Peace.",
    href: "/tools/criminal-applications-writer?type=22A-22B",
  },
  {
    label: "Bail (497 / 498)",
    detail: "Post-arrest bail and anticipatory / 498 applications.",
    href: "/tools/criminal-applications-writer?type=497",
  },
  {
    label: "Superdari (516-A)",
    detail: "Release of property on Superdari.",
    href: "/tools/criminal-applications-writer?type=516A",
  },
  {
    label: "Attendance exemption",
    detail: "Exemption from appearance and adjournment.",
    href: "/tools/criminal-applications-writer?type=EXEMPT-ADJOURN",
  },
  {
    label: "Dissolution & Dower",
    detail: "Family Court plaint for dower and maintenance.",
    href: "/tools/family-suit-writer?type=dower-maintenance",
  },
  {
    label: "Dowry Annexure-B",
    detail: "Dowry recovery with Annexure-B schedule.",
    href: "/tools/family-suit-writer?type=dowry",
  },
  {
    label: "FBR / SECP Practice Hub",
    detail: "Sec. 114 return documents, SECP incorporation steps, and official portal links.",
    href: FBR_SECP_HUB_PATH,
  },
  {
    label: "Case Preparation Analyzer",
    detail:
      "Heuristic FIR / MLC / revenue / FBR discrepancy scan with precedent matching (advisory only).",
    href: "/tools/case-prep",
  },
];

export default function ToolsPage() {
  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-indigo-600 uppercase">
          Waris Law Firm
        </p>
        <h1 className="mt-2 font-serif text-3xl text-slate-900 md:text-4xl">
          Automated Drafting Portal
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Search any law field or drafting tool, or pick a quick link below. Fill the form, preview
          the pleading, print or save as PDF, and — where available — download a compiled .docx.
        </p>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Search tools
          </p>
          <PortalSearch variant="light" />
          <p className="mt-2 text-xs text-slate-400">
            Examples: bail, 22-A, khula, mutation, FBR, declaration
          </p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block h-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-slate-500">
          Open additional criminal and family templates from{" "}
          <span className="font-medium text-slate-700">More tools</span> in the sidebar (or Portal
          menu on phone).
        </p>
      </div>
    </main>
  );
}
