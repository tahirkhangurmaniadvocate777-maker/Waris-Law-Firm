import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const toolUsed = String(body.toolUsed ?? body.tool ?? "").trim();
  const draftType = String(body.draftType ?? "").trim() || "General Query";
  const leadId = String(body.leadId ?? "").trim();

  if (!toolUsed) {
    return NextResponse.json({ error: "Tool is required." }, { status: 400 });
  }
  if (!leadId) {
    return NextResponse.json({ error: "leadId is required." }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return NextResponse.json({ error: "Unknown lead." }, { status: 404 });
  }

  await prisma.usageLog.create({
    data: { leadId, toolUsed, draftType },
  });
  return NextResponse.json({ ok: true });
}
