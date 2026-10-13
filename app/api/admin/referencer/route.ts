import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

function checklistToJson(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "[]";
  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    return JSON.stringify(
      trimmed
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
    );
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await prisma.referencerEntry.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, string>;
  const entry = await prisma.referencerEntry.create({
    data: {
      title: String(body.title ?? "").trim(),
      category: String(body.category ?? "").trim(),
      sectionNumber: String(body.sectionNumber ?? body.section ?? "").trim() || null,
      keywords: String(body.keywords ?? "").trim(),
      shortNote: String(body.shortNote ?? body.summary ?? body.notes ?? "").trim(),
      relatedSections: String(body.relatedSections ?? body.related ?? "").trim() || null,
      checklistJson: checklistToJson(String(body.checklistJson ?? body.checklist ?? "")),
    },
  });
  return NextResponse.json(entry);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, string>;
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const entry = await prisma.referencerEntry.update({
    where: { id },
    data: {
      title: String(body.title ?? "").trim(),
      category: String(body.category ?? "").trim(),
      sectionNumber: String(body.sectionNumber ?? body.section ?? "").trim() || null,
      keywords: String(body.keywords ?? "").trim(),
      shortNote: String(body.shortNote ?? body.summary ?? body.notes ?? "").trim(),
      relatedSections: String(body.relatedSections ?? body.related ?? "").trim() || null,
      checklistJson: checklistToJson(String(body.checklistJson ?? body.checklist ?? "")),
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.referencerEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
