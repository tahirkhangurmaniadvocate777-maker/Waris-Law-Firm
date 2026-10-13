import { prisma } from "@/lib/db";

/** Attach a UsageLog to a lead when leadId is present and valid. Never throws. */
export async function logUsageServer(opts: {
  leadId?: string | null;
  toolUsed: string;
  draftType?: string;
}) {
  const leadId = String(opts.leadId ?? "").trim();
  if (!leadId) return;
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return;
    await prisma.usageLog.create({
      data: {
        leadId,
        toolUsed: opts.toolUsed,
        draftType: opts.draftType?.trim() || "General Query",
      },
    });
  } catch {
    /* usage logging should not block generation */
  }
}

export function leadIdFromBody(body: Record<string, unknown> | undefined): string | null {
  if (!body) return null;
  const id = String(body.leadId ?? "").trim();
  return id || null;
}
