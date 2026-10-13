import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { OfficeMap } from "@/components/OfficeMap";
import { firm } from "@/lib/firm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-brass-soft uppercase">Chambers</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">Contact</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 md:text-base">
            Reach {firm.advocate} at the District Courts, Dera Ghazi Khan, or send an inquiry for
            the office.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:gap-14 md:py-16">
        <div>
          <p className="text-sm font-medium text-navy">{firm.advocate}</p>
          <p className="text-sm text-ink/65">{firm.designation}</p>

          <div className="mt-6 text-sm leading-7">
            {firm.officeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <a
              href={firm.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-medium text-navy underline-offset-4 hover:underline"
            >
              View on map
            </a>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            {firm.phones.map((phone) => (
              <p key={phone.tel}>
                <a className="font-medium text-navy" href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
                <span className="text-ink/35"> · </span>
                <a
                  className="text-navy-2"
                  href={`https://wa.me/${phone.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            ))}
          </div>

          <div className="mt-6 space-y-1 text-sm">
            {firm.emails.map((email) => (
              <p key={email}>
                <a className="break-all text-navy-2" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            ))}
          </div>
        </div>

        <ContactForm />
      </section>

      <OfficeMap className="mx-auto max-w-6xl px-5 pb-16 md:pb-20" />
    </main>
  );
}
