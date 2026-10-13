import { firm } from "@/lib/firm";

type OfficeMapProps = {
  className?: string;
};

export function OfficeMap({ className = "" }: OfficeMapProps) {
  return (
    <section className={className} aria-labelledby="office-map-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-navy-2/70 uppercase">
            Chambers location
          </p>
          <h2 id="office-map-heading" className="mt-2 font-serif text-2xl text-navy md:text-3xl">
            Waris Law Office
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">
            {firm.officeAddress}
          </p>
        </div>
        <a
          href={firm.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy underline-offset-4 hover:text-navy-2 hover:underline"
        >
          Open in Google Maps
          <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="mt-6 overflow-hidden border border-line bg-stone shadow-[0_24px_60px_-40px_rgba(11,28,44,0.55)]">
        <iframe
          title={`Map: ${firm.officeLocation.label}`}
          src={firm.mapsEmbedUrl}
          className="block h-[min(26rem,70vh)] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
