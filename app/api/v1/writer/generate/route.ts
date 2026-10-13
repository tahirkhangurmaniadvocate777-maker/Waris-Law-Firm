import { NextResponse } from "next/server";
import {
  buildCriminalDraft,
  criminalAppOptions,
  type CriminalAppType,
} from "@/lib/criminal";
import { buildCriminalDocxBuffer, docxFilenameFor } from "@/lib/criminal-docx";
import { leadIdFromBody, logUsageServer } from "@/lib/logUsageServer";
import {
  fieldsToCriminalForm,
  normalizeWriterFields,
} from "@/lib/writerFormMap";

const VALID = new Set(criminalAppOptions.map((o) => o.id));

type Body = {
  type?: string;
  fields?: Record<string, unknown>;
  format?: string;
  leadId?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const type = String(body.type ?? "").trim();
  if (!type || !VALID.has(type as CriminalAppType)) {
    return NextResponse.json(
      {
        error: `Unknown criminal application type. Expected one of: ${[...VALID].join(", ")}`,
      },
      { status: 400 },
    );
  }

  const appType = type as CriminalAppType;
  const fields = normalizeWriterFields(body.fields ?? {});
  const form = fieldsToCriminalForm(appType, fields);
  const format = body.format === "json" ? "json" : "docx";

  await logUsageServer({
    leadId: leadIdFromBody(body as Record<string, unknown>),
    toolUsed: "criminal-applications-writer",
    draftType: `${appType}:${format}`,
  });

  const draft = buildCriminalDraft(form);

  if (format === "json") {
    return NextResponse.json({ ok: true, type: appType, draft });
  }

  try {
    const buffer = await buildCriminalDocxBuffer(form);
    const filename = docxFilenameFor(form);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not build .docx";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
