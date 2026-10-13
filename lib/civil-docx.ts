import { promises as fs } from "node:fs";
import path from "node:path";
import createReport from "docx-templates";
import {
  CIVIL_DOCX_FILENAMES,
  CIVIL_TEMPLATE_PATHS,
  civilFormToTemplateData,
  type CivilAutomateType,
  type CivilForm,
} from "@/lib/civil";

export async function buildCivilAutomateDocxBuffer(
  type: CivilAutomateType,
  form: CivilForm,
): Promise<Buffer> {
  const relative = CIVIL_TEMPLATE_PATHS[type];
  const templatePath = path.join(process.cwd(), relative);
  const template = await fs.readFile(templatePath);
  const data = civilFormToTemplateData(form);

  const report = await createReport({
    template,
    data,
    cmdDelimiter: ["{", "}"],
    processLineBreaks: true,
  });

  return Buffer.from(report);
}

export function civilDocxFilenameFor(
  type: CivilAutomateType,
  form?: CivilForm,
): string {
  const base = CIVIL_DOCX_FILENAMES[type];
  const party = form?.plaintiffName?.trim().replace(/\s+/g, "_").slice(0, 40);
  if (!party) return base;
  return base.replace(/\.docx$/i, `_${party}.docx`);
}
