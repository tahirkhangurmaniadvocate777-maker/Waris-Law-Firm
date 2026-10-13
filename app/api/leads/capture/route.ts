import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const phonePattern = /^[0-9+\-\s()]{7,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Send the details as JSON." }, { status: 400 });
  }

  const fullName = String(body.fullName ?? body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const city = String(body.city ?? "").trim() || undefined;
  const matterType = String(body.matterType ?? "").trim() || null;
  const toolUsed = String(body.toolUsed ?? body.tool ?? "").trim();
  const draftType = String(body.draftType ?? "").trim() || "General Query";

  if (!fullName || !phone || !email) {
    return NextResponse.json(
      { error: "Mandatory identification metrics missing." },
      { status: 422 },
    );
  }
  if (fullName.length < 2 || fullName.length > 80) {
    return NextResponse.json({ error: "Enter the full name." }, { status: 422 });
  }
  if (!phonePattern.test(phone)) {
    return NextResponse.json({ error: "Enter a usable phone number." }, { status: 422 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  const existing =
    (await prisma.lead.findUnique({ where: { phone } })) ??
    (await prisma.lead.findFirst({ where: { email } }));

  const lead = existing
    ? await prisma.lead.update({
        where: { id: existing.id },
        data: {
          fullName,
          phone,
          email,
          ...(city !== undefined ? { city } : {}),
          ...(matterType !== null ? { matterType } : {}),
        },
      })
    : await prisma.lead.create({
        data: { fullName, phone, email, city, matterType },
      });

  if (toolUsed) {
    await prisma.usageLog.create({
      data: {
        leadId: lead.id,
        toolUsed,
        draftType,
      },
    });
  }

  return NextResponse.json({ success: true, leadId: lead.id });
}
