/**
 * Generate {brace}-placeholder .docx templates for Civil injunction automate.
 * Compatible with docx-templates createReport (cmdDelimiter ['{','}']).
 *
 * Usage: node scripts/generate-civil-docx.mjs
 * Or:    npm run generate:civil-docx
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "templates", "civil");
const FONT = "Times New Roman";
const SIZE = 24;

function p(text, opts = {}) {
  const {
    bold = false,
    center = false,
    italics = false,
    underline = false,
    after = 120,
    before = 0,
  } = opts;
  return new Paragraph({
    alignment: center ? AlignmentType.CENTER : AlignmentType.BOTH,
    spacing: { after, before, line: 276 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: SIZE,
        bold,
        italics,
        underline: underline ? { type: UnderlineType.SINGLE } : undefined,
      }),
    ],
  });
}

function blank(after = 80) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function makeDoc(children) {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
          },
        },
        children,
      },
    ],
  });
}

const PERMANENT = [
  p("IN THE COURT OF {court_class}, {district}", {
    bold: true,
    center: true,
    after: 160,
  }),
  p("Civil Suit No. ___________ / {suit_year}", { center: true, after: 200 }),
  p("{plaintiff_name} {plaintiff_parentage},", { after: 40 }),
  p("Resident of: {plaintiff_address}", { after: 40 }),
  p("... PLAINTIFF", { bold: true, after: 160 }),
  p("VERSUS", { bold: true, center: true, after: 160 }),
  p("{defendant_name} {defendant_parentage},", { after: 40 }),
  p("Resident of: {defendant_address}", { after: 40 }),
  p("... DEFENDANT", { bold: true, after: 200 }),
  p(
    "SUIT FOR DECLARATION AND PERMANENT INJUNCTION UNDER THE SPECIFIC RELIEF ACT, 1877",
    { bold: true, underline: true, after: 200 },
  ),
  p("RESPECTFULLY SHEWETH:", { bold: true, italics: true, after: 160 }),
  p(
    "1. That the plaintiff is {plaintiff_name} {plaintiff_parentage}, resident of {plaintiff_address}, and the defendant is {defendant_name} {defendant_parentage}, resident of {defendant_address}.",
  ),
  p("2. That the material facts giving rise to this suit are that {facts}."),
  p(
    "3. That the suit property is situated at {property_address}, measuring {area_measurement}, comprised in Khasra/Khewat/Khata {khasra_khewat}, bounded as under: North — {boundary_north}; South — {boundary_south}; East — {boundary_east}; West — {boundary_west}. The plaintiff's ownership / title is based on {ownership_basis}.",
  ),
  p(
    "4. That the defendant has denied or clouded the plaintiff's legal character / right to the said property and threatens acts of interference, alienation, and/or dispossession.",
  ),
  p(
    "5. That the cause of action accrued on {cause_date} when {cause_event}, and continues within the territorial jurisdiction of this Honorable Court.",
  ),
  p(
    "6. That this Honorable Court has territorial and pecuniary jurisdiction to try the present suit.",
  ),
  p(
    "7. That the suit is valued at PKR {suit_value} for the purposes of jurisdiction and court fee, and proper court fee of PKR {court_fee} has been affixed.",
  ),
  p(
    "8. That the plaintiff has not filed any other suit regarding the same cause of action.",
  ),
  blank(80),
  p("{grounds_section}", { after: 160 }),
  p("PRAYER:", { bold: true, center: true, before: 120, after: 120 }),
  p(
    "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favour of the plaintiff against the defendant for:",
  ),
  p(
    "a. A decree of declaration of the plaintiff's title / legal character in respect of the suit property, and a decree of permanent injunction restraining the defendant, agents, and servants from interfering with the plaintiff's possession, alienating, or otherwise dealing with the suit property. {relief}",
  ),
  p("b. {case_law_prayer}"),
  p("c. Costs of the suit may also be awarded."),
  p(
    "d. Any other relief which this Honorable Court deems fit and proper may also be awarded.",
  ),
  blank(160),
  p("PLAINTIFF", { bold: true, after: 80 }),
  p("Through:", { after: 80 }),
  p("{lawyer_name}", { bold: true, after: 40 }),
  p("{legal_counsel_footer}", { after: 40 }),
  p("Generated: {document_generation_date}", { italics: true, after: 80 }),
  blank(80),
  p("VERIFICATION", { bold: true, after: 100 }),
  p(
    "Verified on Oath at {district} on this {verification_date}, that the contents of the foregoing paragraphs are true and correct to the best of my knowledge and belief, and the rest are based on information received.",
  ),
  blank(80),
  p("PLAINTIFF", { bold: true, after: 40 }),
];

const TEMPORARY = [
  p("IN THE COURT OF {court_class}, {district}", {
    bold: true,
    center: true,
    after: 160,
  }),
  p("{pending_suit_number}", { center: true, after: 80 }),
  p("(In re: {pending_suit_title})", { center: true, after: 200 }),
  p("{plaintiff_name} {plaintiff_parentage},", { after: 40 }),
  p("Resident of: {plaintiff_address}", { after: 40 }),
  p("... APPLICANT / PLAINTIFF", { bold: true, after: 160 }),
  p("VERSUS", { bold: true, center: true, after: 160 }),
  p("{defendant_name} {defendant_parentage},", { after: 40 }),
  p("Resident of: {defendant_address}", { after: 40 }),
  p("... RESPONDENT / DEFENDANT", { bold: true, after: 200 }),
  p(
    "APPLICATION FOR TEMPORARY INJUNCTION UNDER ORDER XXXIX RULES 1 AND 2 OF THE CODE OF CIVIL PROCEDURE, 1908",
    { bold: true, underline: true, after: 200 },
  ),
  p("Respectfully Sheweth:", { bold: true, italics: true, after: 160 }),
  p(
    "1. That the applicant / plaintiff is {plaintiff_name} {plaintiff_parentage}, resident of {plaintiff_address}, and the respondent / defendant is {defendant_name} {defendant_parentage}, resident of {defendant_address}.",
  ),
  p(
    "2. That the applicant has filed / is prosecuting {pending_suit_number} titled {pending_suit_title} before this Honorable Court.",
  ),
  p(
    "3. That the suit property is situated at {property_address}, measuring {area_measurement}, comprised in Khasra/Khewat/Khata {khasra_khewat}, bounded as under: North — {boundary_north}; South — {boundary_south}; East — {boundary_east}; West — {boundary_west}. The applicant's ownership / title is based on {ownership_basis}.",
  ),
  p("4. That the respondent threatens to {threatened_act}."),
  p(
    "5. That the applicant has a strong prima facie case in as much as {prima_facie_case}.",
  ),
  p(
    "6. That if the temporary injunction is not granted, the applicant shall suffer irreparable injury, namely {irreparable_injury}.",
  ),
  p(
    "7. That the balance of convenience lies in favour of the applicant because {balance_of_convenience}.",
  ),
  p(
    "8. That the cause of action accrued on {cause_date} when {cause_event}, and continues.",
  ),
  p(
    "9. That this application is made bona fide and in the interest of justice under Order XXXIX Rules 1 and 2 of the Code of Civil Procedure, 1908.",
  ),
  blank(80),
  p("{case_law_grounds}", { after: 160 }),
  p("PRAYER", { bold: true, center: true, before: 120, after: 120 }),
  p(
    "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
  ),
  p(
    "a. Restrain the respondent, agents, and servants, by way of temporary injunction under Order XXXIX Rules 1 and 2 CPC, from interfering with the applicant's possession, alienating, transferring, charging, or changing the nature of the suit property pending disposal of the main suit. {relief}",
  ),
  p("b. {case_law_prayer}"),
  p(
    "c. Any other relief which this Honorable Court deems fit and proper may also be awarded.",
  ),
  blank(160),
  p("APPLICANT", { bold: true, after: 80 }),
  p("Through:", { after: 80 }),
  p("{lawyer_name}", { bold: true, after: 40 }),
  p("{legal_counsel_footer}", { after: 40 }),
  p("Generated: {document_generation_date}", { italics: true, after: 80 }),
  blank(80),
  p("VERIFICATION", { bold: true, after: 100 }),
  p(
    "Verified on Oath at {district} on this {verification_date}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  ),
  blank(80),
  p("APPLICANT", { bold: true, after: 40 }),
];

const TEMPLATES = [
  { file: "permanent_injunction_declaratory.docx", children: PERMANENT },
  { file: "temporary_injunction_o39_r1_r2.docx", children: TEMPORARY },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.join(OUT, "precedents"), { recursive: true });

  for (const tpl of TEMPLATES) {
    const buffer = await Packer.toBuffer(makeDoc(tpl.children));
    const outPath = path.join(OUT, tpl.file);
    fs.writeFileSync(outPath, buffer);
    console.log("Wrote", path.relative(ROOT, outPath));
  }

  // Text masters for review (same placeholders).
  const masters = [
    {
      file: "permanent_injunction_declaratory.txt",
      note: "Plaint for Permanent Injunction & Declaratory Suit (Specific Relief Act)",
    },
    {
      file: "temporary_injunction_o39_r1_r2.txt",
      note: "Application for Temporary Injunction (Order 39 Rules 1 & 2 CPC)",
    },
  ];
  for (const m of masters) {
    fs.writeFileSync(
      path.join(OUT, m.file),
      `# ${m.note}\n# Placeholders use {snake_case} for docx-templates.\n# Generate .docx via: npm run generate:civil-docx\n`,
      "utf8",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
