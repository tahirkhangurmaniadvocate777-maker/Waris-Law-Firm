import type { Metadata } from "next";
import { CriminalApplicationsWriter } from "@/components/CriminalApplicationsWriter";
import { LeadGate } from "@/components/LeadGate";

export const metadata: Metadata = {
  title: "Criminal Applications Writer",
  description: "Draft bail, acquittal, and court-witness applications for print.",
};

export default function CriminalApplicationsWriterPage() {
  return (
    <LeadGate source="criminal-applications-writer" matterType="Criminal — applications writer">
      <CriminalApplicationsWriter />
    </LeadGate>
  );
}
