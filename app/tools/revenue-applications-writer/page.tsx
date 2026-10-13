import type { Metadata } from "next";
import { LeadGate } from "@/components/LeadGate";
import { RevenueApplicationsWriter } from "@/components/RevenueApplicationsWriter";

export const metadata: Metadata = {
  title: "Revenue Applications Writer",
  description: "Draft Land Revenue Act applications for print.",
};

export default function RevenueApplicationsWriterPage() {
  return (
    <LeadGate source="revenue-applications-writer" matterType="Revenue — applications writer">
      <RevenueApplicationsWriter />
    </LeadGate>
  );
}
