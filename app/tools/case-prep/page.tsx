import type { Metadata } from "next";
import CasePreparationConsole from "@/components/CasePreparationConsole";
import { LeadGate } from "@/components/LeadGate";

export const metadata: Metadata = {
  title: "Case Preparation Analyzer",
  description:
    "Heuristic cross-document discrepancy detection with PLD/PLJ precedent matching for criminal, civil, family, revenue, and FBR matters.",
};

export default function CasePrepPage() {
  return (
    <LeadGate source="case-prep" matterType="Case preparation analyzer">
      <div className="mx-auto max-w-5xl px-1 py-2 md:py-4">
        <CasePreparationConsole />
      </div>
    </LeadGate>
  );
}
