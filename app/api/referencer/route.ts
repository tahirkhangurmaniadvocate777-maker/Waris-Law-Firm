import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Public read of ReferencerEntry rows for the Criminal Trial Referencer UI. */
export async function GET() {
  try {
    const entries = await prisma.referencerEntry.findMany({
      orderBy: [{ category: "asc" }, { title: "asc" }],
      select: {
        id: true,
        category: true,
        sectionNumber: true,
        title: true,
        keywords: true,
        shortNote: true,
        relatedSections: true,
        checklistJson: true,
      },
    });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
