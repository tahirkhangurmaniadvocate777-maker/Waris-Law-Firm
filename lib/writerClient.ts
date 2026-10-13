import { downloadBlob } from "@/lib/criminal-docx";
import type { ExtendedCriminalModuleKey } from "@/lib/config/automationRegistry";
import {
  DOC_FILENAMES,
  normalizeWriterFields,
} from "@/lib/writerFormMap";
import type { CriminalAppType } from "@/lib/criminal";

export type WriterGenerateJson = {
  ok: true;
  draft: unknown;
  type: string;
};

export type WriterSubmitResult =
  | { ok: true; format: "docx"; filename: string }
  | { ok: true; format: "json"; data: WriterGenerateJson };

function filenameFromDisposition(header: string | null, fallback: string) {
  if (!header) return fallback;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim());
    } catch {
      return star[1].trim();
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain?.[1]?.trim() || fallback;
}

async function throwIfNotOk(response: Response, fallback: string) {
  if (response.ok) return;
  let message = fallback;
  try {
    const body = (await response.json()) as {
      error?: string;
      missingFields?: string[];
    };
    if (body.error) {
      message = body.missingFields?.length
        ? `${body.error} Missing: ${body.missingFields.join(", ")}`
        : body.error;
    }
  } catch {
    /* ignore */
  }
  throw new Error(message);
}

/**
 * POST form data to `/api/v1/writer/generate`.
 * Accepts a form element, FormData, or plain object of fields.
 */
export async function submitWriterForm(
  type: string,
  fields: FormData | HTMLFormElement | Record<string, unknown> | object,
  format: "docx" | "json" = "docx",
): Promise<WriterSubmitResult> {
  const normalized = normalizeWriterFields(fields);
  const leadId =
    typeof window !== "undefined" ? localStorage.getItem("waris_lead_id") : null;
  const response = await fetch("/api/v1/writer/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, fields: normalized, format, leadId }),
  });

  await throwIfNotOk(response, `Generation failed (${response.status})`);

  if (format === "json") {
    const data = (await response.json()) as WriterGenerateJson;
    return { ok: true, format: "json", data };
  }

  const blob = await response.blob();
  const fallback =
    DOC_FILENAMES[type as CriminalAppType] ?? `Criminal-${type}.docx`;
  const filename = filenameFromDisposition(
    response.headers.get("Content-Disposition"),
    fallback,
  );
  downloadBlob(blob, filename);
  return { ok: true, format: "docx", filename };
}

/**
 * POST to `/api/v1/automate/extended-criminal` for registry-backed modules.
 */
export async function submitExtendedCriminalDocx(
  moduleKey: ExtendedCriminalModuleKey,
  formData: Record<string, string>,
): Promise<WriterSubmitResult> {
  const leadId =
    typeof window !== "undefined" ? localStorage.getItem("waris_lead_id") : null;
  const response = await fetch("/api/v1/automate/extended-criminal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleKey, formData, leadId }),
  });

  await throwIfNotOk(
    response,
    `Extended criminal generation failed (${response.status})`,
  );

  const blob = await response.blob();
  const filename = filenameFromDisposition(
    response.headers.get("Content-Disposition"),
    `${moduleKey}_Draft.docx`,
  );
  downloadBlob(blob, filename);
  return { ok: true, format: "docx", filename };
}

/**
 * POST to `/api/v1/automate/civil` for permanent / temporary injunction modules.
 * Streams .docx download without page reload.
 */
export async function submitCivilAutomateDocx(
  type: string,
  fields: Record<string, unknown>,
  options?: {
    case_law_citations?: string[];
    pld_citations?: string[];
  },
): Promise<WriterSubmitResult> {
  const leadId =
    typeof window !== "undefined" ? localStorage.getItem("waris_lead_id") : null;
  const response = await fetch("/api/v1/automate/civil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      fields,
      case_law_citations: options?.case_law_citations,
      pld_citations: options?.pld_citations,
      leadId,
    }),
  });

  await throwIfNotOk(response, `Civil generation failed (${response.status})`);

  const blob = await response.blob();
  const filename = filenameFromDisposition(
    response.headers.get("Content-Disposition"),
    `Civil-${type}.docx`,
  );
  downloadBlob(blob, filename);
  return { ok: true, format: "docx", filename };
}
