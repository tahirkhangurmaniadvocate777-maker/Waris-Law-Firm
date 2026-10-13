import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  type IParagraphOptions,
} from "docx";
import {
  buildCriminalDraft,
  type CriminalDraft,
  type CriminalForm,
} from "@/lib/criminal";
import { firm } from "@/lib/firm";
import { DOC_FILENAMES } from "@/lib/writerFormMap";

function run(text: string, opts?: { bold?: boolean; italics?: boolean }) {
  return new TextRun({
    text,
    bold: opts?.bold,
    italics: opts?.italics,
    font: "Times New Roman",
    size: 24,
  });
}

function p(
  text: string,
  opts?: { bold?: boolean; center?: boolean; gap?: number; italics?: boolean },
) {
  const options: IParagraphOptions = {
    alignment: opts?.center ? AlignmentType.CENTER : AlignmentType.BOTH,
    spacing: { after: opts?.gap ?? 200 },
    children: [run(text, { bold: opts?.bold, italics: opts?.italics })],
  };
  return new Paragraph(options);
}

function blankLine() {
  return new Paragraph({
    spacing: { after: 120 },
    children: [run("")],
  });
}

function draftToParagraphs(form: CriminalForm, draft: CriminalDraft): Paragraph[] {
  const counsel = form.lawyerName.trim() || firm.advocate;
  const lawyerLines = draft.lawyerLines?.length
    ? draft.lawyerLines
    : [`${firm.designation},`, "District Courts, Dera Ghazi Khan."];

  const suitLines = draft.suitLine.split("\n").filter(Boolean);
  const children: Paragraph[] = [
    p(draft.courtLine, { bold: true, center: true, gap: 120 }),
    ...suitLines.map((line, i) =>
      p(line, { center: true, gap: i === suitLines.length - 1 ? 280 : 60 }),
    ),
    ...draft.leftParty.map((line) => p(line, { gap: 60 })),
    p(`… ${draft.leftRole}`, { bold: true, gap: 200 }),
    p("VERSUS", { bold: true, center: true, gap: 200 }),
    ...draft.rightParty.map((line) => p(line, { gap: 60 })),
    p(`… ${draft.rightRole}`, { bold: true, gap: 280 }),
    p(draft.causeTitle, { bold: true, center: true, gap: 280 }),
    p(draft.shewethLabel ?? "Respectfully Sheweth:", { bold: true, italics: true, gap: 200 }),
    ...draft.paragraphs.map((para) => p(para, { gap: 200 })),
    blankLine(),
    p(draft.prayerHeading ?? "PRAYER", { bold: true, center: true, gap: 200 }),
    p(draft.prayerIntro, { gap: 160 }),
    ...draft.prayerItems.map((item) => p(`•  ${item}`, { gap: 120 })),
  ];

  if (draft.prayerOutro) {
    children.push(blankLine());
    children.push(p(draft.prayerOutro, { gap: 160 }));
  }

  children.push(blankLine());
  children.push(p(draft.signRole, { bold: true, gap: 80 }));
  children.push(p("Through:", { gap: 80 }));
  children.push(p(counsel, { bold: true, gap: 40 }));
  for (const line of lawyerLines) {
    children.push(p(line, { gap: 40 }));
  }

  if (draft.verificationText.trim()) {
    children.push(blankLine());
    children.push(p("VERIFICATION", { bold: true, gap: 120 }));
    children.push(p(draft.verificationText, { gap: 160 }));
    children.push(p(draft.signRole, { bold: true, gap: 80 }));
  }

  if (draft.affidavit) {
    const a = draft.affidavit;
    children.push(blankLine());
    children.push(blankLine());
    children.push(p(a.courtLine, { bold: true, center: true, gap: 120 }));
    children.push(p(a.suitLine, { center: true, gap: 160 }));
    children.push(p(a.matterLeft, { gap: 60 }));
    children.push(p("VERSUS", { bold: true, center: true, gap: 80 }));
    children.push(p(a.matterRight, { gap: 160 }));
    children.push(p(a.causeTitle, { bold: true, center: true, gap: 200 }));
    children.push(p(a.introText, { gap: 160 }));
    for (const para of a.paragraphs) {
      children.push(p(para, { gap: 140 }));
    }
    children.push(blankLine());
    children.push(p(a.deponentRole, { bold: true, gap: 120 }));
    children.push(p("VERIFICATION", { bold: true, gap: 100 }));
    children.push(p(a.verificationText, { gap: 140 }));
    children.push(p(a.deponentRole, { bold: true, gap: 80 }));
  }

  return children;
}

function makeDocument(children: Paragraph[]) {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });
}

/** Build a .docx Buffer for any criminal application type (server-safe). */
export async function buildCriminalDocxBuffer(form: CriminalForm): Promise<Buffer> {
  const draft = buildCriminalDraft(form);
  const doc = makeDocument(draftToParagraphs(form, draft));
  return Buffer.from(await Packer.toBuffer(doc));
}

/** Build a .docx Blob for any criminal application type (browser). */
export async function buildCriminalDocx(form: CriminalForm): Promise<Blob> {
  const draft = buildCriminalDraft(form);
  const doc = makeDocument(draftToParagraphs(form, draft));
  return Packer.toBlob(doc);
}

/** @deprecated Prefer buildCriminalDocx — kept for existing FIR panel callers. */
export async function buildFirDirectionDocx(form: CriminalForm): Promise<Blob> {
  return buildCriminalDocx({ ...form, appType: "22A-22B" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function docxFilenameFor(form: CriminalForm): string {
  return DOC_FILENAMES[form.appType] ?? `Criminal-${form.appType}.docx`;
}
