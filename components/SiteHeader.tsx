"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { firm } from "@/lib/firm";

const links = [
  { href: "/", label: "Home" },
  { href: "/practice-areas", label: "Practice" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="block min-w-0" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl tracking-wide">{firm.name}</span>
          <span className="mt-0.5 block truncate text-[11px] tracking-[0.14em] text-brass-soft/80 uppercase">
            District Courts · Dera Ghazi Khan
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded border border-white/20 px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          id="site-nav"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-1 border-b border-white/10 bg-navy px-5 py-4 md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm transition ${active ? "text-brass-soft" : "text-white/80 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded bg-brass px-3.5 py-2 text-sm font-semibold text-navy md:mt-0"
          >
            Consult
          </Link>
        </nav>
      </div>
    </header>
  );
}
