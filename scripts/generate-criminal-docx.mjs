/**
 * Generate Word (.docx) court-petition templates for Criminal Applications Writer.
 * Placeholders use {{snake_case}} tokens matching templates/criminal/*.txt and form fields in lib/criminal.ts.
 *
 * Usage: node scripts/generate-criminal-docx.mjs
 * Or:    npm run generate:criminal-docx
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  UnderlineType,
  WidthType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "templates", "criminal", "docx");

const FONT = "Times New Roman";
const SIZE = 24; // 12pt (half-points)
const SIZE_SM = 22;
const PAGE_WIDTH = 12240;
const MARGIN = 1080;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function p(text, opts = {}) {
  const {
    bold = false,
    center = false,
    underline = false,
    italics = false,
    size = SIZE,
    after = 120,
    before = 0,
    indent = 0,
  } = opts;
  return new Paragraph({
    alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after, before, line: 276 },
    indent: indent ? { left: indent } : undefined,
    children: [
      new TextRun({
        text,
        font: FONT,
        size,
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

/** Two-column party block: left identity / right role */
function partyBlock(partyLines, role) {
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [Math.floor(CONTENT_WIDTH * 0.72), Math.floor(CONTENT_WIDTH * 0.28)],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: Math.floor(CONTENT_WIDTH * 0.72), type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: partyLines.map(
              (line, i) =>
                new Paragraph({
                  spacing: { after: i === partyLines.length - 1 ? 60 : 20 },
                  children: [new TextRun({ text: line, font: FONT, size: SIZE })],
                }),
            ),
          }),
          new TableCell({
            width: { size: Math.floor(CONTENT_WIDTH * 0.28), type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `... ${role}`,
                    font: FONT,
                    size: SIZE,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function versusLine() {
  return p("VERSUS", { bold: true, center: true, after: 160, before: 80 });
}

function causeTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200, before: 160, line: 276 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: SIZE,
        bold: true,
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });
}

function prayerBullets(items) {
  return items.map(
    (item) =>
      new Paragraph({
        spacing: { after: 80, line: 276 },
        indent: { left: 360 },
        children: [
          new TextRun({ text: `•  ${item}`, font: FONT, size: SIZE }),
        ],
      }),
  );
}

function counselFooter(signRole, throughLabel = "Through:", counselToken = "{{legal_counsel_footer}}") {
  return [
    blank(200),
    p(signRole, { bold: true, after: 40 }),
    p(throughLabel, { after: 80 }),
    ...counselToken.split("\n").map((line) => p(line, { after: 40 })),
  ];
}

/**
 * Standard petition document from a template descriptor.
 * @typedef {{
 *   file: string,
 *   courtLine: string,
 *   suitLines?: string[],
 *   leftParty: string[],
 *   leftRole: string,
 *   rightParty: string[],
 *   rightRole: string,
 *   skipVersus?: boolean,
 *   causeTitle: string,
 *   sheweth?: string,
 *   paragraphs: string[],
 *   prayerHeading?: string,
 *   prayerIntro: string,
 *   prayerItems: string[],
 *   prayerOutro?: string,
 *   signRole: string,
 *   throughLabel?: string,
 *   counsel?: string,
 *   verificationText?: string,
 *   affidavit?: object | null,
 * }} TemplateDef
 */
function buildPetitionChildren(tpl) {
  const children = [
    p(tpl.courtLine, { bold: true, center: true, after: 160 }),
    ...(tpl.suitLines || []).map((line, i, arr) =>
      p(line, { center: true, after: i === arr.length - 1 ? 200 : 40 }),
    ),
    partyBlock(tpl.leftParty, tpl.leftRole),
  ];

  if (!tpl.skipVersus) {
    children.push(versusLine());
    children.push(partyBlock(tpl.rightParty, tpl.rightRole));
  } else if (tpl.rightParty?.length) {
    children.push(blank(60));
    children.push(partyBlock(tpl.rightParty, tpl.rightRole));
  }

  children.push(causeTitle(tpl.causeTitle));
  children.push(p(tpl.sheweth ?? "Respectfully Sheweth:", { bold: true, italics: true, after: 160 }));

  for (const para of tpl.paragraphs) {
    const lines = String(para).split("\n");
    lines.forEach((line, i) => {
      children.push(
        p(line, {
          after: i === lines.length - 1 ? 120 : 40,
          indent: i > 0 ? 360 : 0,
        }),
      );
    });
  }

  children.push(p(tpl.prayerHeading ?? "PRAYER", { bold: true, center: true, before: 160, after: 120 }));
  children.push(p(tpl.prayerIntro, { after: 120 }));
  children.push(...prayerBullets(tpl.prayerItems));
  if (tpl.prayerOutro) {
    children.push(blank(80));
    children.push(p(tpl.prayerOutro, { after: 120 }));
  }

  children.push(
    ...counselFooter(
      tpl.signRole,
      tpl.throughLabel ?? "Through:",
      tpl.counsel ?? "{{legal_counsel_footer}}",
    ),
  );

  if (tpl.verificationText) {
    children.push(blank(200));
    children.push(p("VERIFICATION", { bold: true, after: 80 }));
    children.push(p(tpl.verificationText, { after: 120 }));
    children.push(p(tpl.signRole, { bold: true, after: 40 }));
  }

  if (tpl.affidavit) {
    const a = tpl.affidavit;
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
    );
    children.push(p(a.courtLine, { bold: true, center: true, after: 120 }));
    children.push(p(a.suitLine, { center: true, after: 160 }));
    children.push(p(a.matterLeft, { after: 40 }));
    children.push(p("VERSUS", { bold: true, center: true, after: 40 }));
    children.push(p(a.matterRight, { after: 160 }));
    children.push(p(a.causeTitle, { bold: true, center: true, underline: true, after: 160 }));
    children.push(p(a.introText, { after: 160 }));
    for (const para of a.paragraphs) {
      children.push(p(para, { after: 120 }));
    }
    children.push(blank(200));
    children.push(p(a.deponentRole, { bold: true, after: 200 }));
    children.push(p("VERIFICATION", { bold: true, after: 80 }));
    children.push(p(a.verificationText, { after: 120 }));
    children.push(p(a.deponentRole, { bold: true, after: 40 }));
  }

  return children;
}

function makeDoc(tpl) {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: 15840 },
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
          },
        },
        children: buildPetitionChildren(tpl),
      },
    ],
  });
}

/** @type {TemplateDef[]} */
const TEMPLATES = [
  // —— Reference: 22-A / 22-B ——
  {
    file: "22a-22b-fir-direction.docx",
    courtLine:
      "IN THE COURT OF THE HONORABLE SESSIONS JUDGE / EX-OFFICIO JUSTICE OF PEACE, {{court_city}}",
    suitLines: ["Criminal Misc. Application No. _________ / {{year}}"],
    leftParty: [
      "{{petitioner_name}} son of {{petitioner_parentage}},",
      "Resident of {{petitioner_address}}.",
    ],
    leftRole: "PETITIONER",
    rightParty: [
      "1. The Station House Officer (SHO), Police Station {{police_station}}.",
      "2. {{proposed_accused_name}} son of {{proposed_accused_parentage}},",
      "   Resident of {{proposed_accused_address}}.",
    ],
    rightRole: "RESPONDENTS",
    causeTitle:
      "APPLICATION UNDER SECTIONS 22-A & 22-B OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR DIRECTION TO THE RESPONDENT NO. 1 TO REGISTER A FORMAL CRIMINAL CASE (FIR) AGAINST RESPONDENT NO. 2.",
    paragraphs: [
      "1. That the Petitioner is a peaceful and law-abiding citizen of Pakistan and a permanent resident of {{petitioner_city}}.",
      "2. That on {{occurrence_date}}, Respondent No. 2, with unknown accomplices, committed {{offense_description}} against the Petitioner.",
      "3. That the said act constitutes a cognizable offense under the Pakistan Penal Code (PPC) and attracts registration of a formal First Information Report.",
      "4. That the Petitioner approached the Station House Officer, Police Station {{police_station}}, on {{approach_date}} through a written application seeking registration of an FIR; however, the police refused to register the case and thereby failed in their duty under Section 154 of the Code of Criminal Procedure, 1898.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Accept the instant application.",
      "Direct Respondent No. 1 to register a formal criminal case (FIR) under Section 154 Cr.P.C. against Respondent No. 2.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "PETITIONER",
  },

  // —— 491 / 552 (with affidavit) ——
  {
    file: "491-552-minor-recovery.docx",
    courtLine: "IN THE COURT OF {{court_title}}, {{district}}",
    suitLines: ["Criminal Misc. Application No. _________ / {{year}}"],
    leftParty: [
      "1.  {{petitioner_name}}",
      "    S/O, D/O, W/O {{petitioner_father}}, {{petitioner_caste}} by caste,",
      "    R/O {{petitioner_address}}, Tehsil & District {{district}}.",
    ],
    leftRole: "Petitioner",
    rightParty: [
      "1.  The State",
      "    Through Station House Officer (SHO), Police Station {{police_station}}, {{district}}.",
      "2.  {{respondent2_name}}",
      "    S/O {{respondent2_father}}, {{respondent2_caste}} by caste.",
      "3.  {{respondent3_name}}",
      "    S/O {{respondent3_father}}, {{respondent3_caste}} by caste.",
      "    Both R/O {{respondents_address}}, Tehsil & District {{district}}.",
    ],
    rightRole: "Respondents",
    causeTitle:
      "APPLICATION UNDER SECTION 491 READ WITH SECTION 552 OF THE CODE OF CRIMINAL PROCEDURE, 1898 (CrPC) FOR THE IMMEDIATE RECOVERY AND RESTORATION OF THE MINOR DETENUE NAMELY: {{minor_name}} FROM THE ILLEGAL, FORCEFUL, AND UNLAWFUL DETENTION OF THE RESPONDENTS NO. 2 & 3.",
    paragraphs: [
      "1.  That the Petitioner is a law-abiding citizen of Pakistan, residing at the address mentioned above, and is the natural, legal, and biological parent ({{parent_role}}) of the minor detenue namely {{minor_name}}, aged about {{minor_age}} years.",
      "2.  That the minor detenue was residing comfortably, peacefully, and under the absolute loving care, financial guardianship, and direct supervision of the Petitioner at their lawful residence, where the minor's educational, emotional, and physical needs were being fully met.",
      "3.  That on {{incident_date}} at about {{incident_time}}, the Respondents No. 2 and 3, driven by ulterior motives and high-handedness, unlawfully formed a group, trespassed into the Petitioner's house, and through sheer physical intimidation, threats, and dynamic coercion, executed a sudden and forceful removal of the minor child, abruptly snatching the minor away from the lawful custody of the Petitioner.",
      "4.  That following this aggressive displacement, the Petitioner along with respectable elders of the locality and family mediators went to the residential house of the Respondents No. 2 and 3 on {{visit_date}} to inquire about the minor's well-being and exercise parental rights. However, the Respondents flagrantly demonstrated a strict and vehement refusal to let the parent visit, locking the minor inside a room and turning the Petitioner away with severe threats of physical violence and dire consequences should the Petitioner ever return to see the minor.",
      "5.  That the continuous and absolute denial of parental access, paired with the hostile domestic atmosphere maintained by the Respondents, constitutes an ongoing act of illegal, unauthorized, and punitive confinement of the minor child, severely alienating them from their natural guardian.",
      "6.  That the minor detenue is of tender age and entirely dependent upon the Petitioner for emotional security, nutrition, and daily care; the psychological trauma of this abrupt isolation has gravely endangered the minor's mental and physical health, putting their overall welfare in imminent danger.",
      "7.  That the Respondents possess absolutely no legal right, title, decree, or superior guardian status under any law to forcibly retain the minor child away from their living biological parent.",
      "8.  That the matter dictates extreme urgency as the child's life, safety, and psychological equilibrium are at stake, making the slower, technical remedies of the Family or Guardian Courts completely inadequate for immediate relief.",
    ],
    prayerIntro:
      "Under the circumstances respectfully detailed above, it is most humbly prayed that this Honorable Court may graciously display immediate intervention in the interest of justice and direct Respondent No. 1 (SHO) to:",
    prayerItems: [
      "Locate and recover the minor detenue namely {{minor_name}} immediately from the unlawful, forceful clutches and custody of Respondents No. 2 & 3.",
      "Produce the minor detenue safely before this Honorable Court.",
      "Restore and hand over the absolute custody of the minor detenue to the Petitioner, ensuring their safety and the preservation of their legal welfare.",
    ],
    prayerOutro:
      "Any other relief that this Honorable Court deems fit and proper under the facts of the case may also be generously awarded.",
    signRole: "PETITIONER",
    counsel: "{{advocate_name}}\nAdvocate High Court,\nDistrict Courts, Dera Ghazi Khan.",
    affidavit: {
      courtLine: "BEFORE THE {{court_title}}, {{district}}",
      suitLine: "Criminal Misc. Application No. _________ / {{year}}",
      matterLeft: "{{petitioner_name}}",
      matterRight: "SHO & Others",
      causeTitle: "AFFIDAVIT",
      introText:
        "I, {{petitioner_name}} S/O, D/O, W/O {{petitioner_father}}, {{petitioner_caste}} by caste, R/O {{petitioner_address}}, Tehsil & District {{district}}, do hereby solemnly affirm and declare on oath as under:",
      paragraphs: [
        "1.  That the deponent is the Petitioner in the accompanying main application and is thoroughly conversant with all the underlying facts and circumstances narrated therein.",
        "2.  That the contents of paragraphs No. 1 to 8 of the accompanying application are true and correct to the best of my personal knowledge, information, and belief, and nothing material has been concealed, suppressed, or distorted therein.",
      ],
      deponentRole: "DEPONENT",
      verificationText:
        "Verified on Oath at {{district}} on this {{verification_day}} day of {{verification_month}} {{verification_year}}, that all the assertions made in the above affidavit are absolutely true and correct to the best of my knowledge, and no part of it is false.",
    },
  },

  // —— 516-A Superdari ——
  {
    file: "516a-superdari.docx",
    courtLine: "IN THE COURT OF THE HONORABLE ILLAQA MAGISTRATE, {{court_city}}",
    suitLines: [
      "In the matter of: State VS {{accused_name}}",
      "Case FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: [
      "{{applicant_name}} son of {{applicant_parentage}},",
      "Resident of {{applicant_address}}.",
    ],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION 516-A OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE RELEASE OF {{property_type}} ON SUPARDARI TO THE APPLICANT.",
    paragraphs: [
      "1. That the police of Police Station {{police_station}} took custody of the Applicant's property namely {{property_detailed_description}} (Chassis No: {{chassis_number}}, Engine No: {{engine_number}}) in the above-mentioned case.",
      "2. That the Applicant is the absolute and lawful owner of the said property and requires the same for daily livelihood.",
      "3. That if the said property remains parked in the open compound of the Police Station, it is liable to be destroyed by weather and other natural elements, causing irreparable loss to the Applicant.",
      "4. That the Applicant undertakes to produce the said property before this Honorable Court or any competent authority whenever so required.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Release the above-mentioned property on Superdari in favour of the Applicant against reliable surety bonds.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },

  // —— NBW ——
  {
    file: "nbw-absconding-arrest.docx",
    courtLine:
      "IN THE COURT OF THE HONORABLE ILLAQA MAGISTRATE / SESSIONS JUDGE, {{court_city}}",
    suitLines: ["Application in FIR No. {{fir_number}} / {{year}}"],
    leftParty: ["{{complainant_name}}"],
    leftRole: "COMPLAINANT",
    rightParty: ["{{accused_name}}"],
    rightRole: "ACCUSED",
    causeTitle:
      "APPLICATION FOR ISSUANCE OF NON-BAILABLE ARREST WARRANTS AND INTERVENTION FOR THE ARREST OF THE ABSCONDING ACCUSED.",
    paragraphs: [
      "1. That the above-titled criminal trial case is pending adjudication before this Honorable Court.",
      "2. That despite clear nominations and descriptions inside FIR No. {{fir_number}}, the accused is deliberately hiding, evading process, and absconding from the law.",
      "3. That the local police are neglecting their duty to arrest the culprit, causing immense prejudice to the prosecution's case.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Issue Non-Bailable Warrants (NBW) and direct the concerned hierarchy to cause the immediate arrest of the accused.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "COMPLAINANT",
  },

  // —— Dispense personal attendance ——
  {
    file: "dispense-personal-attendance.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "Case Title: State VS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT / ACCUSED",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION {{dispensation_section}} OF THE CODE OF CRIMINAL PROCEDURE, 1898 TO DISPENSE WITH PERSONAL ATTENDANCE OF THE ACCUSED TODAY.",
    paragraphs: [
      "1. That the applicant / accused has been regular in attending this Honorable Court on each and every date of hearing.",
      "2. That today the applicant / accused is incapable of remaining present due to {{reason_for_absence_medical_or_travel}}.",
      "3. That the applicant / accused is properly represented by counsel and no delay in the proceedings shall be occasioned by the present request.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Dispense with the personal attendance of the accused for today.",
      "Permit the pleader / counsel to represent the accused in the proceedings.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "ACCUSED",
    throughLabel: "Through Counsel:",
  },

  // —— 216 Alteration of charges ——
  {
    file: "216-alteration-of-charges.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION 216 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR ALTERATION / MODIFICATION OF CHARGES.",
    paragraphs: [
      "1. That this Honorable Court framed charges on {{charge_framing_date}} under section {{current_charge_sections}}.",
      "2. That the charge of section {{faulty_section}} is redundant; no evidence, recovery, or medical material matches that offense in the police report.",
      "3. That the charge sheet requires structural modification so as to match the statutory elements available on the record.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Accept the instant application and alter / modify the charges in the interest of justice.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },

  // —— Non-harassment ——
  {
    file: "non-harassment-direction.docx",
    courtLine:
      "IN THE COURT OF THE HONORABLE SESSIONS JUDGE / JUSTICE OF PEACE, {{court_city}}",
    suitLines: ["Criminal Misc. Application No. _________ / {{year}}"],
    leftParty: ["{{petitioner_name}}"],
    leftRole: "PETITIONER / SAIEL",
    rightParty: [
      "1. The SHO, Police Station {{police_station}}.",
      "2. {{private_respondent_name}}.",
    ],
    rightRole: "RESPONDENTS",
    causeTitle:
      "APPLICATION SEEKING EXPLICIT DIRECTION TO THE RESPONDENT NO. 1 NOT TO DETER, HARASS, OR COERCE THE PETITIONER / SAIEL ILLEGALLY.",
    paragraphs: [
      "1. That the Petitioner is a peaceful law-abiding citizen and holds an independent professional identity.",
      "2. That due to underlying rivalries regarding {{dispute_brief_context}}, Respondent No. 2 is using political connections to influence Respondent No. 1.",
      "3. That the local police are conducting illegal raids, tracking the Petitioner, and causing immense humiliation without any lawful cause or registered FIR.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Direct Respondent No. 1 not to harass, deter, or create unlawful pressure on the Petitioner or his family.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "PETITIONER",
  },

  // —— Criminal Appeal ——
  {
    file: "criminal-appeal-conviction.docx",
    courtLine: "IN THE HONORABLE {{appellate_court_name}}, {{court_city}}",
    suitLines: ["Criminal Appeal No. _________ / {{year}}"],
    leftParty: [
      "{{appellant_name}} son of {{appellant_parentage}},",
      "Currently confined in Central Jail {{jail_location}}.",
    ],
    leftRole: "APPELLANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "CRIMINAL APPEAL UNDER SECTION {{appeal_statute_section}} OF THE CODE OF CRIMINAL PROCEDURE, 1898 AGAINST JUDGMENT OF CONVICTION DATED {{judgment_date}} IN FIR NO. {{fir_number}}.",
    paragraphs: [
      "1. That the Appellant was tried by {{trial_judge_title}} and was erroneously convicted and sentenced to {{sentence_duration}} under {{conviction_sections}}.",
      "2. That the impugned judgment is against the law, the weight of evidence, and the settled principles of justice.",
      "3. That the prosecution failed to produce independent eyewitnesses, and the alleged recovery was engineered.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Accept the instant appeal.",
      "Set aside the conviction and sentence recorded against the Appellant.",
      "Acquit the Appellant of the charge.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPELLANT",
  },

  // —— 439 Revision ——
  {
    file: "439-criminal-revision.docx",
    courtLine: "IN THE HONORABLE SESSIONS COURT / HIGH COURT, {{court_city}}",
    suitLines: ["Criminal Revision No. _________ / {{year}}"],
    leftParty: ["{{petitioner_name}}"],
    leftRole: "PETITIONER",
    rightParty: ["1. The State", "2. {{respondent_name}}"],
    rightRole: "RESPONDENTS",
    causeTitle:
      "CRIMINAL REVISION PETITION UNDER SECTION 439 / 439-A OF THE CODE OF CRIMINAL PROCEDURE, 1898 AGAINST THE ILLEGAL ORDER DATED {{order_date}} PASSED BY THE LOWER COURT.",
    paragraphs: [
      "1. That the lower court on {{order_date}} arbitrarily dismissed the application for {{application_nature}}.",
      "2. That the impugned order suffers from patent illegality, procedural irregularity, and the lower court exceeded its jurisdiction.",
      "3. That the order has resulted in a severe miscarriage of justice.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Allow the instant revision petition.",
      "Summon the records of the lower court.",
      "Declare the impugned order null and void.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "PETITIONER",
  },

  // —— 200 Private complaint ——
  {
    file: "200-private-complaint.docx",
    courtLine: "IN THE COURT OF THE HONORABLE ILLAQA MAGISTRATE, {{court_city}}",
    suitLines: ["Private Complaint No. _________ / {{year}}"],
    leftParty: [
      "{{complainant_name}} son of {{complainant_parentage}},",
      "Resident of {{complainant_address}}.",
    ],
    leftRole: "COMPLAINANT",
    rightParty: [
      "1. {{accused_1_name}} son of {{accused_1_parentage}}.",
      "2. {{accused_2_name}} son of {{accused_2_parentage}}.",
    ],
    rightRole: "ACCUSED PERSONS",
    causeTitle:
      "PRIVATE COMPLAINT UNDER SECTION 200 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE TRIAL OF THE ACCUSED PERSONS UNDER SECTIONS {{offense_sections}} OF THE PAKISTAN PENAL CODE (PPC).",
    paragraphs: [
      "1. That the facts giving rise to this complaint are that on {{occurrence_date}}, the accused persons pre-planned and committed the offense of {{detailed_crime_acts}}.",
      "2. That the complainant approached the local police station to file an FIR, but due to the high political status of the accused, the police refused to lodge the case.",
      "3. That the complainant has reliable eyewitnesses, namely {{witness_1}} and {{witness_2}}, to prove the guilt of the accused.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Summon the accused persons to face trial and punish them in accordance with the law.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "COMPLAINANT",
  },

  // —— Summon accused (private complaint) ——
  {
    file: "summon-accused-private-complaint.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "{{complainant_name}} VERSUS {{accused_name}}",
      "Private Complaint under Section 200 CrPC",
    ],
    leftParty: ["{{complainant_name}}"],
    leftRole: "COMPLAINANT",
    rightParty: ["{{accused_name}}"],
    rightRole: "ACCUSED",
    causeTitle:
      "APPLICATION SEEKING THE SUMMONING OF THE ACCUSED TO FACE TRIAL CASE PROCEEDINGS.",
    paragraphs: [
      "1. That the complainant has recorded his initial preliminary statement under Section 200 CrPC before this Honorable Court.",
      "2. That the preliminary evidence and eye-witness accounts establish a solid prima-facie case against the named accused.",
      "3. That sufficient grounds exist to proceed with a formal trial path.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Issue formal summons / warrants to compel the attendance of the accused.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "COMPLAINANT",
  },

  // —— Witness summons ——
  {
    file: "witness-summons-evidence.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "Case Title: State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle: "APPLICATION FOR SUMMONING OF RELEVANT WITNESSES TO RECORD EVIDENCE.",
    paragraphs: [
      "1. That the above-titled trial case is fixed before this Honorable Court for recording of evidence.",
      "2. That the testimony of the following witnesses is vital for just decision of the case:\n   a. {{witness_1_name}}, Resident of {{witness_1_address}}\n   b. {{witness_2_name}}, Resident of {{witness_2_address}}",
      "3. That without the intervention of this Honorable Court, the said witnesses cannot appear independently to record their evidence.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Issue formal witness summons for attendance of the above-named witnesses on the next date of hearing.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },

  // —— Medical board ——
  {
    file: "medical-board-reexamination.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: ["State VERSUS {{accused_name}}", "{{fir_caption_line}}"],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION SEEKING THE CONSTITUTION OF A STANDING MEDICAL BOARD FOR THE RE-EXAMINATION OF THE ALLEGED INJURIES OF THE COMPLAINANT.",
    paragraphs: [
      "1. That the initial Medico-Legal Certificate (MLC) is fabricated / biased and does not align with the actual physical impacts.",
      "2. That the complainant has exaggerated minor scratches into severe fractures in order to attract prohibitory clauses.",
      "3. That an independent Medical Board assessment is critical for just decision of the case.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Direct the Health Department / Medical Superintendent, District Hospital, to constitute a Standing Medical Board to re-examine the complainant.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },

  // —— Exemption / adjournment ——
  {
    file: "exemption-adjournment.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION FOR EXEMPTION FROM PERSONAL APPEARANCE AND ADJOURNMENT OF THE CASE",
    paragraphs: [
      "1. That the above-titled trial case is fixed for hearing before this Honorable Court today.",
      "2. That the applicant / accused is unable to appear due to {{sudden_emergency_reason}}.",
      "3. That the absence is unintentional and the applicant undertakes that the same shall not delay the proceedings.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Exempt the personal appearance of the applicant / accused for today.",
      "Mark the presence of the applicant through counsel.",
      "Adjourn the case to a future date convenient to this Honorable Court.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
    throughLabel: "Through Counsel:",
  },

  // —— Older modules (no prior .txt; placeholders aligned to lib/criminal.ts) ——
  {
    file: "497-bail-post-arrest.docx",
    courtLine:
      "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["Bail Application No. _____ / {{year}}"],
    leftParty: [
      "{{petitioner_name}}",
      "S/o {{petitioner_father}}, R/o {{petitioner_address}}",
    ],
    leftRole: "PETITIONER",
    rightParty: [
      "1. The State",
      "2. {{complainant_name}} S/o {{complainant_father}}",
    ],
    rightRole: "RESPONDENTS",
    causeTitle: "APPLICATION UNDER SECTION 497 Cr.P.C. FOR GRANT OF POST-ARREST BAIL",
    paragraphs: [
      "1. That the applicant was falsely implicated in the above-titled FIR and was arrested on {{arrest_date}}.",
      "2. That the applicant is currently in judicial custody at {{jail_name}}.",
      "3. FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}, {{district}}.",
      "GROUNDS:",
      "a) That the allegation in the FIR is false, baseless, and fabricated due to prior enmity.",
      "b) That the case against the applicant requires further inquiry under Section 497(2) Cr.P.C.",
      "c) That no recovery has been effected from the applicant, nor was the applicant named in the prompt FIR.",
      "d) That the applicant is a peaceful citizen with no prior criminal record and is ready to furnish reliable surety.",
      "e) {{extra_grounds}}",
    ],
    prayerIntro:
      "In light of the above, it is respectfully prayed that post-arrest bail may kindly be granted to the applicant during the pendency of the trial.",
    prayerItems: [
      "Post-arrest bail may kindly be granted to the applicant on furnishing reliable surety.",
      "Any other relief which this Honorable Court deems fit may also be awarded.",
    ],
    signRole: "PETITIONER",
    counsel: "{{lawyer_name}}\nAdvocate,\nDistrict Courts, Dera Ghazi Khan.",
    verificationText:
      "Verified on Oath at {{district}} on this {{verification_date}}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  },

  {
    file: "498-bail-directions.docx",
    courtLine: "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["Application No. _____ / {{year}}"],
    leftParty: [
      "{{petitioner_name}}",
      "S/o {{petitioner_father}}, R/o {{petitioner_address}}",
    ],
    leftRole: "PETITIONER",
    rightParty: ["The State", "through P.S. {{police_station}}"],
    rightRole: "RESPONDENT",
    causeTitle: "APPLICATION UNDER SECTION 498 Cr.P.C.",
    paragraphs: [
      "1. That the petitioner apprehends arrest / seeks bail directions in FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}.",
      "2. That the petitioner has been falsely implicated due to mala fide intention and prior enmity.",
      "3. That the petitioner undertakes to join the investigation and abide by all conditions imposed by this Honorable Court.",
      "4. {{extra_grounds}}",
    ],
    prayerIntro: "It is, therefore, respectfully prayed that:",
    prayerItems: [
      "Appropriate directions under section 498 Cr.P.C. may kindly be issued in favour of the petitioner.",
      "Any other relief which this Honorable Court deems fit may also be awarded.",
    ],
    signRole: "PETITIONER",
    counsel: "{{lawyer_name}}\nAdvocate,\nDistrict Courts, Dera Ghazi Khan.",
    verificationText:
      "Verified on Oath at {{district}} on this {{verification_date}}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  },

  {
    file: "249a-acquittal.docx",
    courtLine: "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["The State VERSUS {{accused_name}}"],
    leftParty: ["{{petitioner_name}}", "S/o {{petitioner_father}}"],
    leftRole: "APPLICANT / ACCUSED",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION 249-A Cr.P.C. FOR ACQUITTAL OF APPLICANT/ACCUSED",
    paragraphs: [
      "1. That the above mentioned case (FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}, {{district}}) is pending adjudication before this Honorable Court and fixed for today.",
      "2. That the allegations leveled against the applicant are false, frivolous and ill founded.",
      "3. That the applicant has not committed any offence mentioned in the FIR.",
      "4. That the petitioner is not nominated in the FIR rather he was nominated in supplementary statement. Furthermore, no Identification Parade was conducted.",
      "5. That no material exists on basis of which the applicant could be convicted. Continuation of the trial against the applicant is exercise in futility and amount to waste the precious time of this Honourable court.",
      "GROUNDS:",
      "a) That the charge against the applicant is groundless and can be found so at any stage of the trial.",
      "b) That there is no incriminating material available on the record against the applicant.",
      "c) That there is zero probability of ultimate conviction of the applicant; continuation of the trial amounts to an exercise in futility.",
      "d) {{extra_grounds}}",
    ],
    prayerIntro:
      "It is therefore respectfully prayed that the instant petition may kindly be accepted and the accused be acquitted from the charge.",
    prayerItems: [
      "Acquittal under section 249-A Cr.P.C. may graciously be ordered.",
      "Any other relief which this Honorable Court deems fit may also be awarded.",
    ],
    signRole: "APPLICANT",
    counsel: "{{lawyer_name}}\nAdvocate,\nDistrict Courts, Dera Ghazi Khan.",
    verificationText:
      "Verified on Oath at {{district}} on this {{verification_date}}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  },

  {
    file: "265k-acquittal.docx",
    courtLine: "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["The State VERSUS {{accused_name}}"],
    leftParty: ["{{petitioner_name}}", "S/o {{petitioner_father}}"],
    leftRole: "APPLICANT / ACCUSED",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION 265-K Cr.P.C. FOR ACQUITTAL OF APPLICANT/ACCUSED",
    paragraphs: [
      "1. That the above mentioned case (FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}, {{district}}) is pending adjudication before this Honorable Court and fixed for today.",
      "2. That the allegations leveled against the applicant are false, frivolous and ill founded.",
      "3. That the applicant has not committed any offence mentioned in the FIR.",
      "4. That the petitioner is not nominated in the FIR rather he was nominated in supplementary statement. Furthermore, no Identification Parade was conducted.",
      "5. That no material exists on basis of which the applicant could be convicted. Continuation of the trial against the applicant is exercise in futility and amount to waste the precious time of this Honourable court.",
      "GROUNDS:",
      "a) That the charge against the applicant is groundless and can be found so at any stage of the trial.",
      "b) That there is no incriminating material available on the record against the applicant.",
      "c) That there is zero probability of ultimate conviction of the applicant; continuation of the trial amounts to an exercise in futility.",
      "d) {{extra_grounds}}",
    ],
    prayerIntro:
      "It is therefore respectfully prayed that the instant petition may kindly be accepted and the accused be acquitted from the charge.",
    prayerItems: [
      "Acquittal under section 265-K Cr.P.C. may graciously be ordered.",
      "Any other relief which this Honorable Court deems fit may also be awarded.",
    ],
    signRole: "APPLICANT",
    counsel: "{{lawyer_name}}\nAdvocate,\nDistrict Courts, Dera Ghazi Khan.",
    verificationText:
      "Verified on Oath at {{district}} on this {{verification_date}}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  },

  {
    file: "court-witness-summons.docx",
    courtLine: "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["Application in FIR No. {{fir_number}} / {{year}}"],
    leftParty: [
      "{{petitioner_name}}",
      "S/o {{petitioner_father}}, R/o {{petitioner_address}}",
    ],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle: "APPLICATION FOR SUMMONING OF WITNESS AS COURT WITNESS",
    paragraphs: [
      "1. That the above titled case (FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}, {{district}}) is pending before this Honorable Court.",
      "2. That the evidence of {{witness_name}} is essential for just decision of the case.",
      "3. That the said witness is required as Court Witness for the purpose that {{witness_purpose}}.",
      "4. That summoning of the said witness shall advance the cause of justice and cause no prejudice to either side.",
    ],
    prayerIntro: "It is, therefore, respectfully prayed that:",
    prayerItems: [
      "This Honorable Court may graciously summon {{witness_name}} as Court Witness.",
      "Any other relief which this Honorable Court deems fit may also be awarded.",
    ],
    signRole: "APPLICANT",
    counsel: "{{lawyer_name}}\nAdvocate,\nDistrict Courts, Dera Ghazi Khan.",
    verificationText:
      "Verified on Oath at {{district}} on this {{verification_date}}, that the contents of this application are true and correct to the best of my knowledge and belief.",
  },

  // —— Additional modules (also written to templates/criminal/*.docx) ——
  {
    file: "identification_parade.docx",
    rootFile: "identification_parade.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT / COMPLAINANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle: "APPLICATION FOR HOLDING OF IDENTIFICATION PARADE OF THE ACCUSED PERSON(S)",
    paragraphs: [
      "1. That the above-titled case is pending investigation / trial before the competent forum.",
      "2. That the accused {{accused_name}} was not previously known to the eye-witnesses, and a fair identification parade is necessary for just decision of the case.",
      "3. That the proposed parade particulars are as under: {{offense_description}}.",
      "4. That the ends of justice require that an identification parade be conducted in accordance with law and settled practice.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Direct that an identification parade of the accused be held under proper judicial / magisterial supervision.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },
  {
    file: "accused_discharge_63.docx",
    rootFile: "accused_discharge_63.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT / ACCUSED",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION FOR DISCHARGE OF THE ACCUSED UNDER SECTION {{discharge_section}} OF THE CODE OF CRIMINAL PROCEDURE, 1898",
    paragraphs: [
      "1. That the above-titled case is pending before this Honorable Court.",
      "2. That the charge against the applicant / accused is groundless and there is no sufficient ground for proceeding.",
      "3. That continuation of the proceedings would amount to abuse of the process of law.",
      "4. {{extra_grounds}}",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Discharge the applicant / accused from the charge under section {{discharge_section}} Cr.P.C.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },
  {
    file: "habeas_corpus_491.docx",
    rootFile: "habeas_corpus_491.docx",
    courtLine: "IN THE COURT OF THE {{court_tier_name}}, {{court_city}}",
    suitLines: ["Criminal Misc. Application No. _________ / {{year}}"],
    leftParty: [
      "{{petitioner_name}} son of {{petitioner_parentage}},",
      "Resident of {{petitioner_address}}.",
    ],
    leftRole: "PETITIONER",
    rightParty: [
      "1. The Station House Officer (SHO), Police Station {{police_station}}.",
      "2. {{respondent_name}}.",
    ],
    rightRole: "RESPONDENTS",
    causeTitle:
      "APPLICATION UNDER SECTION 491 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR PRODUCTION OF THE DETENUE NAMELY {{detenue_name}} AND FOR HIS / HER RELEASE FROM ILLEGAL DETENTION",
    paragraphs: [
      "1. That the Petitioner is a law-abiding citizen and is closely related to / concerned with the detenue namely {{detenue_name}}.",
      "2. That the detenue is being illegally confined / detained at {{detention_place}} without lawful authority.",
      "3. That on {{occurrence_date}}, the detenue was taken into custody / confined in the circumstances that {{offense_description}}.",
      "4. That the detention is illegal, without remand, and in violation of Articles 9 and 10 of the Constitution of the Islamic Republic of Pakistan, 1973.",
      "5. That the slower ordinary remedies are inadequate; immediate production under section 491 Cr.P.C. is necessary.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Direct Respondent No. 1 to produce the detenue namely {{detenue_name}} before this Honorable Court forthwith.",
      "Declare the detention illegal and order release / restoration of the detenue to liberty.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "PETITIONER",
  },
  {
    file: "witness_recall_540.docx",
    rootFile: "witness_recall_540.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION UNDER SECTION 540 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR RECALL OF WITNESS",
    paragraphs: [
      "1. That the above-titled trial case is pending adjudication before this Honorable Court.",
      "2. That witness namely {{witness_name}} has already been examined / partly examined, and his / her recall is essential for just decision of the case.",
      "3. That the purpose of recall is that {{witness_purpose}}.",
      "4. That section 540 Cr.P.C. empowers this Honorable Court to recall any witness at any stage if his evidence appears essential.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Recall witness {{witness_name}} under section 540 Cr.P.C. and permit further examination / cross-examination.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },
  {
    file: "electronic_evidence_164.docx",
    rootFile: "electronic_evidence_164.docx",
    courtLine: "IN THE COURT OF THE HONORABLE {{court_tier_name}}, {{court_city}}",
    suitLines: [
      "State VERSUS {{accused_name}}",
      "FIR No. {{fir_number}}, Police Station: {{police_station}}",
    ],
    leftParty: ["{{applicant_name}}", "S/o {{applicant_parentage}}"],
    leftRole: "APPLICANT",
    rightParty: ["The State"],
    rightRole: "RESPONDENT",
    causeTitle:
      "APPLICATION FOR RECORDING / PRODUCTION OF ELECTRONIC EVIDENCE UNDER {{electronic_evidence_section}}",
    paragraphs: [
      "1. That the above-titled case is pending before this Honorable Court and electronic material is vital for just decision.",
      "2. That the electronic evidence / media sought to be produced is: {{electronic_media_desc}}.",
      "3. That production and formal recording of the said electronic evidence is necessary to establish the prosecution / defence case.",
      "4. That the applicant undertakes to produce the original devices / certified copies and to facilitate forensic examination if so directed.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Permit production and formal recording of the electronic evidence on the record.",
      "Issue such directions for custody, cloning, or forensic examination as may be necessary.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },
  {
    file: "bail_cancellation_497.docx",
    rootFile: "bail_cancellation_497.docx",
    courtLine: "IN THE COURT OF THE {{court_title}}, {{district}}",
    suitLines: ["Bail Cancellation Application No. _____ / {{year}}"],
    leftParty: ["{{complainant_name}} S/o {{complainant_father}}"],
    leftRole: "APPLICANT / COMPLAINANT",
    rightParty: [
      "1. The State",
      "2. {{accused_name}} (accused enlarged on bail)",
    ],
    rightRole: "RESPONDENTS",
    causeTitle:
      "APPLICATION UNDER SECTION 497 Cr.P.C. FOR CANCELLATION OF BAIL GRANTED TO THE ACCUSED",
    paragraphs: [
      "1. That the accused was enlarged on bail in FIR No. {{fir_number}} dated {{fir_date}} under section {{offenses}} {{offense_law}}, P.S. {{police_station}}, vide order dated {{order_date}}.",
      "2. That after grant of bail, the accused has misused the concession of bail / is tampering with evidence / is absconding from trial / is threatening the prosecution witnesses.",
      "3. That the grounds for cancellation are: {{extra_grounds}}.",
      "4. That in the interest of justice, the bail order is liable to be recalled and cancelled.",
    ],
    prayerIntro:
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    prayerItems: [
      "Cancel the bail granted to the accused and remand him to custody.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "APPLICANT",
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const criminalRoot = path.join(ROOT, "templates", "criminal");
  fs.mkdirSync(criminalRoot, { recursive: true });
  const created = [];

  for (const tpl of TEMPLATES) {
    const doc = makeDoc(tpl);
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(OUT_DIR, tpl.file);
    fs.writeFileSync(outPath, buffer);
    created.push(outPath);
    console.log("Wrote", path.relative(ROOT, outPath));

    if (tpl.rootFile) {
      const rootPath = path.join(criminalRoot, tpl.rootFile);
      fs.writeFileSync(rootPath, buffer);
      created.push(rootPath);
      console.log("Wrote", path.relative(ROOT, rootPath));
    }
  }

  console.log(`\nGenerated ${created.length} .docx file(s) (docx/ + root paths where set)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
