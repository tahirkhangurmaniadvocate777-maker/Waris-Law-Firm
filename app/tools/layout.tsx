import { DraftingPortalShell } from "@/components/DraftingPortalShell";
import { LeadProvider } from "@/components/LeadProvider";

/**
 * Tools hub shell — nested LeadProvider with gateTools enforces
 * name / phone / email capture before generate / print workflows.
 */
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <LeadProvider gateTools>
      <DraftingPortalShell>{children}</DraftingPortalShell>
    </LeadProvider>
  );
}
