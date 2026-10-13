import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { LeadProvider } from "@/components/LeadProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { firm } from "@/lib/firm";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: firm.name,
    template: `%s · ${firm.name}`,
  },
  description: `${firm.advocate}, ${firm.designation}. Criminal, civil, family, revenue, and FBR / corporate tax practice at the District Courts, Dera Ghazi Khan.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <LeadProvider>
          <SiteChrome>{children}</SiteChrome>
        </LeadProvider>
      </body>
    </html>
  );
}
