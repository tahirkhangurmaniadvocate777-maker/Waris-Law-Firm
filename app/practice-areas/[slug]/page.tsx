import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { firm, getPracticeAreaBySlug, PRACTICE_AREAS_TEXT } from "@/lib/firm";
import { practiceAreas } from "@/lib/practice";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRACTICE_AREAS_TEXT.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) return { title: "Practice Area" };
  return {
    title: area.title,
    description: area.summary,
  };
}

export default async function PracticeAreaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) notFound();

  const card = practiceAreas.find((item) => item.slug === slug);

  return (
    <main>
      <section className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-brass-soft uppercase">
            Practice area
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            {area.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            {area.summary}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-sm leading-8 text-ink/80 md:text-base">{area.details}</p>

        {card ? (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/80">
            {card.points.map((point) => (
              <li key={point} className="before:mr-2 before:text-brass before:content-['—']">
                {point}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          {card ? (
            <Link
              href={card.href}
              className="rounded bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-2"
            >
              {card.cta}
            </Link>
          ) : null}
          <Link
            href="/contact"
            className="rounded border border-line bg-white px-5 py-3 text-sm font-semibold text-navy"
          >
            Contact {firm.advocate}
          </Link>
          <Link
            href="/practice-areas"
            className="rounded border border-line bg-white px-5 py-3 text-sm font-medium text-navy"
          >
            All practice areas
          </Link>
        </div>
      </section>
    </main>
  );
}
