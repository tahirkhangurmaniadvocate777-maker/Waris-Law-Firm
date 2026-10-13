import type { Metadata } from "next";
import { FbrSecpHub } from "@/components/FbrSecpHub";
import { LeadGate } from "@/components/LeadGate";

export const metadata: Metadata = {
  title: "FBR / SECP Practice Hub",
  description:
    "Interactive FBR Iris, SECP eZfile, and AOP partnership checklists with official portal links.",
};

export default function FbrSecpPracticePage() {
  return (
    <LeadGate source="fbr-secp-practice" matterType="Income Tax Return — practice hub">
      <FbrSecpHub />
    </LeadGate>
  );
}
