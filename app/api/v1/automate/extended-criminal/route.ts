import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import createReport from "docx-templates";
import {
  EXTENDED_CRIMINAL_SYSTEM_REGISTRY,
  isExtendedCriminalModuleKey,
} from "@/lib/config/automationRegistry";
import {
  documentGenerationDatePk,
  legalCounselFooterText,
} from "@/lib/extendedCriminalFormData";
import { leadIdFromBody, logUsageServer } from "@/lib/logUsageServer";

export const runtime = "nodejs";

type Body = {
  moduleKey?: string;
  formData?: Record<string, unknown>;
  leadId?: string;
};

function sanitizeFilenamePart(value: string): string {
  const cleaned = value
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 80);
  return cleaned || "Draft";
}

function asStringMap(raw: Record<string, unknown> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw) return out;
  for (const [key, value] of Object.entries(raw)) {
    if (value == null) continue;
    out[key] = String(value);
  }
  return out;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const moduleKey = String(body.moduleKey ?? "").trim();
  if (!moduleKey || !isExtendedCriminalModuleKey(moduleKey)) {
    return NextResponse.json(
      { error: "Unknown moduleKey for extended criminal automation." },
      { status: 400 },
    );
  }

  const module = EXTENDED_CRIMINAL_SYSTEM_REGISTRY[moduleKey];
  const formData = asStringMap(body.formData);

  const missingFields = module.validationFields.filter((field) => {
    const value = formData[field];
    return value == null || String(value).trim() === "";
  });
  if (missingFields.length) {
    return NextResponse.json(
      {
        error: "Missing required validation fields.",
        missingFields: [...missingFields],
      },
      { status: 422 },
    );
  }

  const templatePath = path.join(process.cwd(), module.diskTemplatePath);
  let template: Buffer;
  try {
    template = await fs.readFile(templatePath);
  } catch {
    return NextResponse.json(
      {
        error: `Template not found on disk: ${module.diskTemplatePath}`,
      },
      { status: 404 },
    );
  }

  try {
    await logUsageServer({
      leadId: leadIdFromBody(body as Record<string, unknown>),
      toolUsed: "extended-criminal-automate",
      draftType: moduleKey,
    });

    const report = await createReport({
      template,
      data: {
        ...formData,
        document_generation_date: documentGenerationDatePk(),
        legal_counsel_footer: legalCounselFooterText(),
      },
      cmdDelimiter: ["{", "}"],
    });

    const clientId = sanitizeFilenamePart(
      formData.petitioner_name ||
        formData.appellant_name ||
        formData.case_title ||
        "Draft",
    );
    const filename = `${moduleKey}_${clientId}.docx`;
    const buffer = Buffer.from(report);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[extended-criminal]", err);
    return NextResponse.json(
      { error: "Could not generate extended criminal document." },
      { status: 500 },
    );
  }
}
