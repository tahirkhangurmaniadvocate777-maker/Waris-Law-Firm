import type { Metadata } from "next";
import Link from "next/link";
import { firm } from "@/lib/firm";
import { practiceAreas } from "@/lib/practice";

export const metadata: Metadata = { title: "Practice Areas" };

export default function PracticeAreasPage() {
  return (
    <main>
      <section className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-brass-soft uppercase">
            Chambers practice
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Practice areas
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            {firm.firmName} — criminal defence, civil litigation, family disputes, land revenue, and
            FBR / corporate tax advisory from the District Courts, Dera Ghazi Khan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="grid gap-10 md:gap-14">
          {practiceAreas.map((area, index) => (
            <article
              key={area.slug}
              id={area.slug}
              className="grid gap-6 border-b border-line pb-10 last:border-0 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-10"
            >
              <p className="font-serif text-4xl text-brass/80">0{index + 1}</p>
              <div>
                <h2 className="font-serif text-3xl text-navy md:text-4xl">{area.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/75 md:text-base">
                  {area.summary}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-ink/70">{area.details}</p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/80">
                  {area.points.map((point) => (
                    <li key={point} className="before:mr-2 before:text-brass before:content-['—']">
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="inline-flex text-sm font-semibold text-navy underline-offset-4 hover:underline"
                  >
                    Read full practice note
                  </Link>
                  <Link
                    href={area.href}
                    className="inline-flex text-sm font-semibold text-navy-2 underline-offset-4 hover:underline"
                  >
                    {area.cta}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
