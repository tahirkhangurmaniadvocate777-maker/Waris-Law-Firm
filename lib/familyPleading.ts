import { downloadBlob } from "@/lib/criminal-docx";
import type { buildFamilyDraft } from "@/lib/family";

export type FamilyDraft = ReturnType<typeof buildFamilyDraft>;

/** Flatten a structured family draft into CourtPleadingPreview body text. */
export function familyDraftToPleadingContent(draft: FamilyDraft): string {
  const left = draft.leftParty.join("\n");
  const right = draft.rightParty.join("\n");
  const paras = draft.paragraphs.join("\n\n");
  const prayers = draft.prayerItems.map((item) => `- ${item}`).join("\n");

  return [
    draft.courtLine,
    "",
    draft.suitLine,
    "",
    left,
    `... ${draft.leftRole}`,
    "",
    "VERSUS",
    "",
    right,
    `... ${draft.rightRole}`,
    "",
    "RESPECTFULLY SHEWETH:",
    "",
    paras,
    "",
    "PRAYER:",
    draft.prayerIntro,
    prayers,
    "",
    "VERIFICATION:",
    draft.verificationText,
  ].join("\n");
}

export async function downloadFamilyDocx(
  title: string,
  content: string,
  filename: string,
  caseLawCitations?: string[],
) {
  const { AlignmentType, Document, Packer, Paragraph, TextRun } = await import("docx");

  const bodyLines = content.split("\n");
  const citationBlock =
    caseLawCitations && caseLawCitations.length > 0
      ? [
          "",
          "CASE LAW CITATIONS:",
          ...caseLawCitations.map((c, i) => `${i + 1}. ${c}`),
        ]
      : [];

  const allLines = [title, "", ...bodyLines, ...citationBlock];

  const children = allLines.map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.BOTH,
        spacing: { after: line.trim() ? 80 : 40 },
        children: [
          new TextRun({
            text: line || " ",
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}

export function familyDocxFilename(suitType: string): string {
  if (suitType === "khula") return "Suit-Dissolution-of-Marriage-Khula.docx";
  if (suitType === "dower-maintenance") {
    return "Suit-Recovery-of-Dower-and-Maintenance.docx";
  }
  if (suitType === "dowry") {
    return "Suit-Recovery-of-Dowry-Articles-Annexure-B.docx";
  }
  return `Family-Suit-${suitType}.docx`;
}

/** Flatten Annexure-B structured data into printable CourtPleadingPreview text. */
export function annexureToPleadingContent(
  annexure: NonNullable<FamilyDraft["annexure"]>,
): string {
  const jahezLines = annexure.rows
    .map((row) => `${row[0]}.\t${row[1]}\t${row[2]}\tPKR ${row[3]}`)
    .join("\n");
  const bariLines = annexure.bariRows
    .map((row) => `${row[0]}.\t${row[1]}\t${row[2]}\tPKR ${row[3]}`)
    .join("\n");

  return [
    `IN THE COURT OF THE LEARNED FAMILY JUDGE, ${annexure.courtLocation}`,
    "",
    `In the matter of: ${annexure.plaintiffName} ... PLAINTIFF`,
    "VERSUS",
    `${annexure.defendantName} ... DEFENDANT`,
    "",
    "ANNEXURE-B: ITEMIZED LIST OF DOWRY ARTICLES AND BRIDAL GIFTS",
    "",
    "SR.\tITEM\tQTY\tVALUE (PKR)",
    jahezLines,
    `TOTAL EVALUATION OF DOWRY ARTICLES:\tPKR ${annexure.jahezTotal}`,
    "",
    "BRIDAL GIFTS (BARI):",
    bariLines,
    `TOTAL EVALUATION OF BRIDAL GIFTS:\tPKR ${annexure.bariTotal}`,
    `GRAND TOTAL CLAIMED FOR RECOVERY:\tPKR ${annexure.grandTotal}`,
    "",
    "Note: The above-mentioned articles are currently in the illegal possession and custody of the Defendant at the matrimonial home. The values are assessed according to current market utilities.",
  ].join("\n");
}
