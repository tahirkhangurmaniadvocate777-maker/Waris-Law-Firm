import Link from "next/link";
import { disclaimer, firm } from "@/lib/firm";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-navy text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl text-white">{firm.name}</p>
          <p className="mt-1 text-xs text-white/55">{firm.firmName}</p>
          <p className="mt-2 text-sm text-brass-soft">{firm.advocate}</p>
          <p className="text-sm">{firm.designation}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/practice-areas" className="hover:text-white">
              Practice
            </Link>
            <Link href="/tools" className="hover:text-white">
              Tools
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div className="text-sm leading-7">
          {firm.officeLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <a
            href={firm.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-brass-soft hover:underline"
          >
            Open chambers map
          </a>
          <div className="mt-3 space-y-1">
            {firm.phones.map((phone) => (
              <p key={phone.tel}>
                <a className="text-white hover:underline" href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
                {" · "}
                <a
                  className="text-brass-soft hover:underline"
                  href={`https://wa.me/${phone.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </p>
            ))}
          </div>
          <div className="mt-3 space-y-1">
            {firm.emails.map((email) => (
              <p key={email}>
                <a className="break-all text-brass-soft hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            ))}
          </div>
        </div>

        <p className="text-sm leading-7 text-white/65">{disclaimer}</p>
      </div>
    </footer>
  );
}
