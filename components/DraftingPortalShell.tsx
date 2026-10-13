"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { PortalSearch } from "@/components/PortalSearch";
import { FBR_SECP_HUB_PATH } from "@/lib/config/taxGuides";
import { firm } from "@/lib/firm";

type NavItem = {
  label: string;
  href: string;
  match?: { path: string; type?: string; types?: string[] };
};

const criminalPrimary: NavItem[] = [
  {
    label: "FIR Direction (22-A/B)",
    href: "/tools/criminal-applications-writer?type=22A-22B",
    match: { path: "/tools/criminal-applications-writer", type: "22A-22B" },
  },
  {
    label: "Bail (497 / 498)",
    href: "/tools/criminal-applications-writer?type=497",
    match: { path: "/tools/criminal-applications-writer", types: ["497", "498"] },
  },
  {
    label: "Property Release (Superdari)",
    href: "/tools/criminal-applications-writer?type=516A",
    match: { path: "/tools/criminal-applications-writer", type: "516A" },
  },
  {
    label: "Attendance Exemption",
    href: "/tools/criminal-applications-writer?type=EXEMPT-ADJOURN",
    match: { path: "/tools/criminal-applications-writer", type: "EXEMPT-ADJOURN" },
  },
];

const familyPrimary: NavItem[] = [
  {
    label: "Khula / dissolution",
    href: "/tools/family-suit-writer?type=khula",
    match: { path: "/tools/family-suit-writer", type: "khula" },
  },
  {
    label: "Dower & maintenance",
    href: "/tools/family-suit-writer?type=dower-maintenance",
    match: { path: "/tools/family-suit-writer", type: "dower-maintenance" },
  },
  {
    label: "Dowry + Annexure-B",
    href: "/tools/family-suit-writer?type=dowry",
    match: { path: "/tools/family-suit-writer", type: "dowry" },
  },
  {
    label: "Custody of minors",
    href: "/tools/family-suit-writer?type=custody",
    match: { path: "/tools/family-suit-writer", type: "custody" },
  },
  {
    label: "Restitution of conjugal rights",
    href: "/tools/family-suit-writer?type=restitution",
    match: { path: "/tools/family-suit-writer", type: "restitution" },
  },
  {
    label: "Maintenance only",
    href: "/tools/family-suit-writer?type=maintenance-only",
    match: { path: "/tools/family-suit-writer", type: "maintenance-only" },
  },
];

const criminalMore: NavItem[] = [
  {
    label: "Bail u/s 498",
    href: "/tools/criminal-applications-writer?type=498",
    match: { path: "/tools/criminal-applications-writer", type: "498" },
  },
  {
    label: "Dispense attendance",
    href: "/tools/criminal-applications-writer?type=DISPENSE",
    match: { path: "/tools/criminal-applications-writer", type: "DISPENSE" },
  },
  {
    label: "491 r/w 552 (minor recovery)",
    href: "/tools/criminal-applications-writer?type=491-552",
    match: { path: "/tools/criminal-applications-writer", type: "491-552" },
  },
  {
    label: "249-A acquittal",
    href: "/tools/criminal-applications-writer?type=249A",
    match: { path: "/tools/criminal-applications-writer", type: "249A" },
  },
  {
    label: "265-K acquittal",
    href: "/tools/criminal-applications-writer?type=265K",
    match: { path: "/tools/criminal-applications-writer", type: "265K" },
  },
  {
    label: "Criminal Appeal",
    href: "/tools/criminal-applications-writer?type=APPEAL",
    match: { path: "/tools/criminal-applications-writer", type: "APPEAL" },
  },
  {
    label: "Criminal Revision",
    href: "/tools/criminal-applications-writer?type=REVISION",
    match: { path: "/tools/criminal-applications-writer", type: "REVISION" },
  },
  {
    label: "Private Complaint 200",
    href: "/tools/criminal-applications-writer?type=200",
    match: { path: "/tools/criminal-applications-writer", type: "200" },
  },
  {
    label: "NBW (absconding)",
    href: "/tools/criminal-applications-writer?type=NBW",
    match: { path: "/tools/criminal-applications-writer", type: "NBW" },
  },
  {
    label: "216 alteration of charges",
    href: "/tools/criminal-applications-writer?type=216",
    match: { path: "/tools/criminal-applications-writer", type: "216" },
  },
  {
    label: "Non-harassment direction",
    href: "/tools/criminal-applications-writer?type=NONHARASS",
    match: { path: "/tools/criminal-applications-writer", type: "NONHARASS" },
  },
  {
    label: "Court witness summons",
    href: "/tools/criminal-applications-writer?type=court-witness",
    match: { path: "/tools/criminal-applications-writer", type: "court-witness" },
  },
  {
    label: "Medical Board",
    href: "/tools/criminal-applications-writer?type=MEDICAL-BOARD",
    match: { path: "/tools/criminal-applications-writer", type: "MEDICAL-BOARD" },
  },
  {
    label: "Witness summons (evidence)",
    href: "/tools/criminal-applications-writer?type=WITNESS-SUMMONS",
    match: { path: "/tools/criminal-applications-writer", type: "WITNESS-SUMMONS" },
  },
  {
    label: "Summon accused (s.200)",
    href: "/tools/criminal-applications-writer?type=SUMMON200",
    match: { path: "/tools/criminal-applications-writer", type: "SUMMON200" },
  },
  {
    label: "Identification parade",
    href: "/tools/criminal-applications-writer?type=ID-PARADE",
    match: { path: "/tools/criminal-applications-writer", type: "ID-PARADE" },
  },
  {
    label: "Discharge of accused",
    href: "/tools/criminal-applications-writer?type=DISCHARGE-63",
    match: { path: "/tools/criminal-applications-writer", type: "DISCHARGE-63" },
  },
  {
    label: "Habeas corpus (s.491)",
    href: "/tools/criminal-applications-writer?type=HABEAS-491",
    match: { path: "/tools/criminal-applications-writer", type: "HABEAS-491" },
  },
  {
    label: "Recall witness (s.540)",
    href: "/tools/criminal-applications-writer?type=WITNESS-RECALL-540",
    match: { path: "/tools/criminal-applications-writer", type: "WITNESS-RECALL-540" },
  },
  {
    label: "Electronic evidence",
    href: "/tools/criminal-applications-writer?type=E-EVIDENCE-164",
    match: { path: "/tools/criminal-applications-writer", type: "E-EVIDENCE-164" },
  },
  {
    label: "Bail cancellation (497(5))",
    href: "/tools/criminal-applications-writer?type=BAIL-CANCEL-497",
    match: { path: "/tools/criminal-applications-writer", type: "BAIL-CANCEL-497" },
  },
  {
    label: "Perishable property (516-A)",
    href: "/tools/criminal-applications-writer?type=PERISHABLE-516A",
    match: { path: "/tools/criminal-applications-writer", type: "PERISHABLE-516A" },
  },
  {
    label: "Trial severance (s.239)",
    href: "/tools/criminal-applications-writer?type=SEVERANCE-239",
    match: { path: "/tools/criminal-applications-writer", type: "SEVERANCE-239" },
  },
  {
    label: "Sentence suspension (s.426)",
    href: "/tools/criminal-applications-writer?type=SUSPEND-426",
    match: { path: "/tools/criminal-applications-writer", type: "SUSPEND-426" },
  },
];

const familyMore: NavItem[] = [];

const otherTools: NavItem[] = [
  { label: "Case Preparation Analyzer", href: "/tools/case-prep" },
  { label: "Criminal Trial Referencer", href: "/tools/criminal-trial-referencer" },
  { label: "Civil Suit Writer", href: "/tools/civil-suit-writer" },
  { label: "Revenue Applications", href: "/tools/revenue-applications-writer" },
  {
    label: "Agri Partition (Sec. 135)",
    href: "/tools/revenue-applications-writer?type=agri-partition",
    match: { path: "/tools/revenue-applications-writer", type: "agri-partition" },
  },
  { label: "FBR / SECP Practice", href: FBR_SECP_HUB_PATH },
];

function isActive(
  item: NavItem,
  pathname: string,
  typeParam: string | null,
): boolean {
  if (item.match) {
    if (pathname !== item.match.path) return false;
    if (item.match.types?.length) {
      return typeParam != null && item.match.types.includes(typeParam);
    }
    if (item.match.type) {
      return typeParam === item.match.type;
    }
    return !typeParam;
  }
  return pathname === item.href.split("?")[0];
}

function NavLink({
  item,
  pathname,
  typeParam,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  typeParam: string | null;
  onNavigate?: () => void;
}) {
  const active = isActive(item, pathname, typeParam);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`block rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-indigo-500/20 font-medium text-indigo-200 ring-1 ring-indigo-400/30"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {item.label}
    </Link>
  );
}

function PortalNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-700/80 px-5 py-5">
        <Link href="/tools" onClick={onNavigate} className="block">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-indigo-300/80 uppercase">
            Automated Drafting
          </p>
          <p className="mt-1 font-serif text-xl text-white">{firm.name}</p>
          <p className="mt-1 text-xs text-slate-400">District Courts, Dera Ghazi Khan</p>
        </Link>
      </div>

      <PortalSearch onNavigate={onNavigate} />

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Criminal Applications
          </p>
          <div className="space-y-0.5">
            {criminalPrimary.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                typeParam={typeParam}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Family Litigation
          </p>
          <div className="space-y-0.5">
            {familyPrimary.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                typeParam={typeParam}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="mb-2 flex w-full items-center justify-between px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase hover:text-slate-300"
          >
            <span>More tools</span>
            <span className="text-slate-400">{moreOpen ? "−" : "+"}</span>
          </button>
          {moreOpen ? (
            <div className="space-y-3">
              <div>
                <p className="mb-1 px-3 text-[10px] text-slate-600 uppercase">Criminal</p>
                <div className="space-y-0.5">
                  {criminalMore.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      typeParam={typeParam}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
              {familyMore.length ? (
                <div>
                  <p className="mb-1 px-3 text-[10px] text-slate-600 uppercase">Family</p>
                  <div className="space-y-0.5">
                    {familyMore.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        typeParam={typeParam}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="mb-1 px-3 text-[10px] text-slate-600 uppercase">Other</p>
                <div className="space-y-0.5">
                  {otherTools.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      typeParam={typeParam}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      <div className="border-t border-slate-700/80 px-5 py-4">
        <p className="text-sm font-medium text-slate-200">{firm.advocate}</p>
        <p className="mt-0.5 text-xs text-slate-500">{firm.designation}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{firm.emails[0]}</p>
        <a
          className="mt-2 inline-block text-xs text-indigo-300 hover:text-indigo-200"
          href={`https://wa.me/${firm.phones[0].whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp {firm.phones[0].display}
        </a>
      </div>
    </div>
  );
}

export function DraftingPortalShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="no-print relative hidden w-80 shrink-0 bg-slate-900 text-slate-100 md:block">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
          <Suspense fallback={<div className="p-5 text-sm text-slate-500">Loading…</div>}>
            <PortalNav />
          </Suspense>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <div className="no-print fixed bottom-4 left-4 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        >
          Portal menu
        </button>
      </div>

      {mobileOpen ? (
        <div className="no-print fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] bg-slate-900 shadow-xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-200"
              >
                Close
              </button>
            </div>
            <Suspense fallback={null}>
              <PortalNav onNavigate={() => setMobileOpen(false)} />
            </Suspense>
          </aside>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
