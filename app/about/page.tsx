import type { Metadata } from "next";
import Link from "next/link";
import { firm } from "@/lib/firm";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-brass-soft uppercase">About</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{firm.advocate}</h1>
          <p className="mt-4 text-brass-soft">{firm.designation}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-16">
        <div className="space-y-5 text-sm leading-8 text-ink/80 md:text-base">
          <p>
            {firm.firmName} practices from chambers at {firm.officeAddress}. The firm appears in
            criminal trials, civil suits, family petitions, revenue proceedings, and FBR / corporate
            tax advisory matters under {firm.advocate}, {firm.designation}.
          </p>
          <p>
            Public drafting tools on this website help parties and practitioners prepare print-ready
            pleadings and applications. Every draft remains subject to professional review before
            filing.
          </p>
          <Link
            href="/contact"
            className="inline-flex rounded bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-2"
          >
            Contact the office
          </Link>
        </div>

        <aside className="border-t border-line pt-6 text-sm leading-7 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">Chambers</p>
          <div className="mt-4 space-y-1">
            {firm.officeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-5 space-y-1">
            {firm.phones.map((phone) => (
              <p key={phone.tel}>
                <a className="font-medium text-navy" href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
              </p>
            ))}
          </div>
          <p className="mt-4 break-all">
            <a className="text-navy-2" href={`mailto:${firm.emails[0]}`}>
              {firm.emails[0]}
            </a>
          </p>
        </aside>
      </section>
    </main>
  );
}
