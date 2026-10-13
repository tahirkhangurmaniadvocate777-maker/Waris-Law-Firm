"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Global marketing chrome for all routes except `/`.
 * The homepage ships its own full-bleed dark shell + in-hero nav.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="no-print">
        <SiteHeader />
      </div>
      {children}
      <div className="no-print">
        <SiteFooter />
      </div>
    </>
  );
}
