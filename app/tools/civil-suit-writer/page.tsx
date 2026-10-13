import type { Metadata } from "next";
import { CivilSuitWriter } from "@/components/CivilSuitWriter";
import { LeadGate } from "@/components/LeadGate";
import { CIVIL_SUIT_OPTIONS } from "@/lib/civilOptions";

export const metadata: Metadata = {
  title: "Civil Suit Writer",
  description:
    "Draft Order VII civil plaints and Order 39 temporary injunctions for print.",
};

type PageProps = {
  searchParams?: Promise<{ type?: string | string[] }>;
};

export default async function CivilSuitWriterPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const raw = params.type;
  const typeValue = Array.isArray(raw) ? raw[0] : raw;
  const suitTypeId =
    typeof typeValue === "string" && typeValue.trim()
      ? typeValue.trim()
      : CIVIL_SUIT_OPTIONS[0]?.id ?? "declaratory";

  return (
    <LeadGate
      toolName="civil-suit-writer"
      subType={suitTypeId}
      source="civil-suit-writer"
      matterType={`Civil — ${suitTypeId}`}
    >
      <CivilSuitWriter />
    </LeadGate>
  );
}
