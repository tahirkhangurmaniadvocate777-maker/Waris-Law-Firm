import type { Metadata } from "next";
import { FamilySuitWriter } from "@/components/FamilySuitWriter";
import { LeadGate } from "@/components/LeadGate";

export const metadata: Metadata = {
  title: "Family Suit Writer",
  description: "Draft family court plaints and petitions for print.",
};

export default function FamilySuitWriterPage() {
  return (
    <LeadGate source="family-suit-writer" matterType="Family — suit writer">
      <FamilySuitWriter />
    </LeadGate>
  );
}
