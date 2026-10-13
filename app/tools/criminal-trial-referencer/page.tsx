import type { Metadata } from "next";
import { CriminalReferencer } from "@/components/CriminalReferencer";
import { LeadGate } from "@/components/LeadGate";

export const metadata: Metadata = {
  title: "Criminal Trial Referencer",
  description:
    "Search trial stages, CrPC sections, checklists, and procedural notes for Punjab subordinate courts.",
};

export default function CriminalTrialReferencerPage() {
  return (
    <LeadGate source="criminal-trial-referencer" matterType="Criminal — trial referencer">
      <CriminalReferencer />
    </LeadGate>
  );
}
