import Link from "next/link";
import { FBR_SECP_HUB_PATH } from "@/lib/config/taxGuides";
import { FIRM_METADATA, PRACTICE_AREAS_TEXT } from "@/lib/config/websiteContent";
import { firm } from "@/lib/firm";

const bySlug = Object.fromEntries(PRACTICE_AREAS_TEXT.map((area) => [area.slug, area]));

/** Curated lower-section cards — titles/summaries grounded in PRACTICE_AREAS_TEXT. */
const practiceGroups = [
  {
    title: bySlug["criminal-law"]?.title ?? "Criminal Law & Defence",
    icon: "⚖️",
    sections: [
      "Trial Referencer (FIR / Bail / Acquittal)",
      "Sec. 497/498 Bail Petitions",
      "Sec. 22-A/B FIR Directions",
      "Sec. 249-A / 265-K Acquittals",
    ],
    link: "/tools/criminal-applications-writer",
  },
  {
    title: "Civil & Family Suits",
    icon: "📜",
    sections: [
      "Declaratory & Injunction Plaints",
      "Khula & Dissolution Suits",
      "Annexure-B Dowry Evaluator",
    ],
    link: "/tools/family-suit-writer",
  },
  {
    title: "Revenue & Tax Advisory",
    icon: "🏛️",
    sections: [
      "Sec. 135 Agri Partition Matrix",
      "Demarcation & Mutation Disputes",
      "FBR IRIS 2.0 / SECP Compliance",
    ],
    link: FBR_SECP_HUB_PATH,
  },
] as const;

const whatsappHref = `https://wa.me/${firm.phones[0].whatsapp}`;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/20">
      {/* 1. BRAND-FIRST HERO VIEWPORT */}
      <section className="relative flex min-h-screen flex-col justify-between border-b border-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-8 md:p-16">
        <header className="z-10 flex w-full items-center justify-between gap-4">
          <div className="font-serif text-sm font-bold tracking-widest text-white uppercase">
            {firm.name}
          </div>
          <nav className="hidden space-x-8 text-xs font-medium tracking-wider text-slate-400 uppercase md:flex">
            <Link href="/practice-areas" className="transition hover:text-amber-400">
              Practice Areas
            </Link>
            <Link href="/about" className="transition hover:text-amber-400">
              About Advocate
            </Link>
            <Link href="/contact" className="transition hover:text-amber-400">
              Contact Chamber
            </Link>
            <Link href="/tools" className="transition hover:text-amber-400">
              Tools
            </Link>
          </nav>
          <Link
            href="/contact"
            className="rounded border border-slate-700 px-3 py-1.5 text-xs font-semibold tracking-wider text-slate-200 uppercase md:hidden"
          >
            Contact
          </Link>
        </header>

        <div className="z-10 my-auto grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-block rounded-full border border-amber-400/10 bg-amber-400/5 px-3 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase">
              District Courts, {firm.defaultCourt}
            </div>
            <h1 className="font-serif text-4xl leading-none font-medium tracking-tight text-white md:text-6xl">
              <span className="block text-amber-400/90">{firm.name}</span>
              <span className="mt-3 block">{firm.advocate}</span>
              <span className="mt-4 block font-sans text-2xl font-light tracking-wide text-slate-400 md:text-3xl">
                {firm.designation}
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-400">
              Providing rigorous criminal defense, property litigation, family law recovery, and
              revenue title dispute counsel across the Punjab legal hierarchy — {firm.firmName}.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/tools"
                className="rounded-md bg-amber-500 px-8 py-4 text-center text-sm font-semibold tracking-wider text-slate-950 uppercase shadow-lg shadow-amber-500/10 transition hover:bg-amber-400"
              >
                Access Drafting Automation Hub
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-800 bg-slate-900/40 px-8 py-4 text-center text-sm font-semibold tracking-wider uppercase transition hover:border-slate-700"
              >
                <span aria-hidden="true">💬</span> Connect via WhatsApp
              </a>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl transition-all duration-700 group-hover:bg-amber-500/10" />
              <div className="font-serif text-8xl leading-none text-slate-700 opacity-40 select-none">
                §
              </div>
              <div className="relative z-10 space-y-4">
                <div className="h-0.5 w-12 bg-amber-500" />
                <h3 className="font-serif text-xl text-white">{firm.firmName}</h3>
                <p className="font-sans text-xs leading-relaxed text-slate-500">
                  {FIRM_METADATA.officeAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="grid grid-cols-1 gap-6 border-t border-slate-900 pt-8 text-xs text-slate-500 sm:grid-cols-3">
          <div>
            <span className="mb-1 block font-medium tracking-wider text-slate-400 uppercase">
              Chamber Phones
            </span>
            <p className="font-mono text-slate-300">
              {firm.phones.map((p) => p.display).join(" | ")}
            </p>
          </div>
          <div>
            <span className="mb-1 block font-medium tracking-wider text-slate-400 uppercase">
              Secure Vault Routing
            </span>
            <p className="font-mono break-all text-slate-300">{firm.emails[0]}</p>
          </div>
          <div className="sm:text-right">
            <span className="mb-1 block font-medium tracking-wider text-slate-400 uppercase">
              Jurisdiction Matrix
            </span>
            <p className="text-slate-300">Punjab Appellate &amp; Subordinate Courts</p>
          </div>
        </footer>
      </section>

      {/* 2. PRACTICE GROUPS — below first viewport; cards allowed here */}
      <section className="mx-auto max-w-7xl space-y-12 px-8 py-24 md:px-16">
        <div className="max-w-2xl">
          <h2 className="mb-2 text-xs font-bold tracking-widest text-amber-500 uppercase">
            Platform Infrastructure
          </h2>
          <p className="font-serif text-2xl text-white md:text-3xl">
            Integrated Automation Suites for Subordinate and Appellate Filings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {practiceGroups.map((group) => (
            <div
              key={group.title}
              className="group flex flex-col justify-between rounded-lg border border-slate-900 bg-slate-950/60 p-6 transition hover:border-slate-800"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded border border-slate-800 bg-slate-900 text-2xl transition group-hover:bg-slate-800">
                  {group.icon}
                </div>
                <h3 className="font-serif text-lg font-medium text-white">{group.title}</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {group.sections.map((section) => (
                    <li key={section} className="flex items-center gap-2">
                      <span className="text-amber-500/60">•</span> {section}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={group.link}
                className="mt-8 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase transition hover:text-amber-300"
              >
                Launch Automation Suite <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 border-t border-slate-900 pt-10 text-xs text-slate-500">
          <Link
            href="/tools/criminal-trial-referencer"
            className="rounded border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-amber-400 transition hover:border-amber-500/60 hover:text-amber-300"
          >
            Criminal Trial Referencer
          </Link>
          {PRACTICE_AREAS_TEXT.map((area) => (
            <Link
              key={area.slug}
              href={`/practice-areas/${area.slug}`}
              className="rounded border border-slate-800 px-3 py-1.5 text-slate-400 transition hover:border-amber-500/40 hover:text-amber-400"
            >
              {area.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
