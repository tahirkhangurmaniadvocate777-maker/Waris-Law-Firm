/**
 * Generate {brace}-placeholder .docx templates for EXTENDED_CRIMINAL_SYSTEM_REGISTRY.
 * Compatible with docx-templates createReport (cmdDelimiter ['{','}']).
 *
 * Usage: node scripts/generate-extended-criminal-docx.mjs
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
const OUT = path.join(ROOT, "templates", "criminal");
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

const HABEAS = [
  p(
    "IN THE COURT OF THE HONORABLE SESSIONS JUDGE / EX-OFFICIO JUSTICE OF THE PEACE, {court_city}",
    { bold: true, center: true, after: 160 },
  ),
  p("Criminal Miscellaneous (Habeas Corpus) Application No. _________ / 2026", {
    center: true,
    after: 200,
  }),
  p("{petitioner_name} son of {petitioner_parentage},", { after: 40 }),
  p("Resident of {petitioner_address}, {petitioner_city}.", { after: 40 }),
  p("... PETITIONER", { bold: true, after: 160 }),
  p("VERSUS", { bold: true, center: true, after: 160 }),
  p("1. The Station House Officer (SHO),", { after: 40 }),
  p("   Police Station {police_station}, District {court_city}.", { after: 80 }),
  p("2. {private_respondent_name_or_Police_Officer}", { after: 40 }),
  p(
    "   [Designation/Rank if applicable], Police Station {police_station}.",
    { after: 40 },
  ),
  p("... RESPONDENTS", { bold: true, after: 200 }),
  p(
    "APPLICATION UNDER SECTION 491 OF THE CODE OF CRIMINAL PROCEDURE, 1898 FOR THE ISSUANCE OF A WRIT OF HABEAS CORPUS FOR THE IMMEDIATE RECOVERY AND RELEASE OF THE DETENU NAMELY {detenu_name}, WHO HAS BEEN ILLEGALLY CONFINED IN AN UNAUTHORIZED LOCKUP BY THE RESPONDENTS.",
    { bold: true, underline: true, after: 200 },
  ),
  p("Respectfully Sheweth:", { bold: true, italics: true, after: 160 }),
  p(
    "1. That the petitioner is a law-abiding citizen, a permanent resident of {petitioner_city}, and is the {relationship_to_detenu} of the detenu, namely {detenu_name} son of {detenu_parentage}.",
  ),
  p(
    "2. That on dated {abduction_date} at approximately {abduction_time}, Respondent No. 2 along with secondary police officials unlawfully raided the house of the detenu and took him into physical custody without any lawful authority, judicial warrant, or registered First Information Report (FIR).",
  ),
  p(
    "3. That the detenu has been kept in an unauthorized, secret, and unregistered cell at Police Station {police_station} for the past {detention_duration_hours} hours without being produced before any judicial magistrate, which is a flagrant violation of Article 10 of the Constitution of Pakistan, 1973.",
  ),
  p(
    "4. That the petitioner visited the police station and discovered that the respondents are subjecting the detenu to severe physical torture and mental coercion to extort illegal gratification and bribe money amounting to PKR {extortion_demanded_amount}/-.",
  ),
  p(
    "5. That the life, physical safety, and fundamental liberty of the detenu are in imminent, grave danger at the hands of the respondents. The confinement is entirely mala-fide, unlawful, and an abuse of official police powers.",
  ),
  p("PRAYER:", { bold: true, center: true, before: 160, after: 120 }),
  p(
    "It is, therefore, most respectfully prayed that this emergency application may be accepted and this Honorable Court may graciously be pleased to:",
  ),
  p(
    "a. Appoint a Court Bailiff with explicit directions to conduct an immediate, surprise raid at Police Station {police_station} (including all hidden quarters and private rooms) to locate, recover, and produce the detenu before this Honorable Court.",
  ),
  p(
    "b. Direct the immediate release of the detenu from the unlawful, unauthorized custody of the respondents, in the interest of absolute justice and human liberty.",
  ),
  blank(160),
  p("Petitioner: ______________________", { after: 80 }),
  p("Through:", { after: 80 }),
  p("{legal_counsel_footer}", { bold: true, after: 40 }),
  p("Advocates & Legal Consultants", { after: 40 }),
  p("Office: Waris Law Firm, Dera Ghazi Khan", { after: 40 }),
];

function simplePetition({ courtLine, causeTitle, paragraphs, prayerItems, fieldsNote }) {
  return [
    p(courtLine, { bold: true, center: true, after: 160 }),
    p(causeTitle, { bold: true, underline: true, after: 200 }),
    p("Respectfully Sheweth:", { bold: true, italics: true, after: 160 }),
    ...paragraphs.map((t) => p(t)),
    p("PRAYER", { bold: true, center: true, before: 160, after: 120 }),
    p(
      "It is, therefore, most respectfully prayed that this Honorable Court may graciously be pleased to:",
    ),
    ...prayerItems.map((t) => p(`•  ${t}`)),
    blank(160),
    p("APPLICANT", { bold: true, after: 80 }),
    p("Through:", { after: 80 }),
    p("{legal_counsel_footer}", { bold: true, after: 40 }),
    p("Generated: {document_generation_date}", { italics: true, after: 40 }),
    p(fieldsNote, { italics: true, after: 40 }),
  ];
}

const TEMPLATES = [
  {
    file: "habeas_corpus_491.docx",
    children: HABEAS,
  },
  {
    file: "accused_discharge_63.docx",
    children: simplePetition({
      courtLine:
        "IN THE COURT OF THE ILLAQA MAGISTRATE / SESSIONS JUDGE, {court_city}",
      causeTitle:
        "APPLICATION FOR DISCHARGE OF ACCUSED FROM POLICE CUSTODY (SECTIONS 63 & 167 Cr.P.C.)",
      paragraphs: [
        "1. That the applicant namely {petitioner_name} is detained in FIR No. {fir_number} dated {fir_date}, Police Station {police_station}, {court_city}.",
        "2. That the remand anomalies are as under: {remand_anomalies}.",
        "3. That continued police custody is unlawful and liable to be terminated under sections 63 and 167 Cr.P.C.",
      ],
      prayerItems: [
        "Discharge / release the applicant from police custody.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      fieldsNote: "Fields: court_city, police_station, fir_number, fir_date, petitioner_name, remand_anomalies",
    }),
  },
  {
    file: "perishable_property_516a.docx",
    children: simplePetition({
      courtLine: "IN THE COURT OF THE HONORABLE ILLAQA MAGISTRATE, {court_city}",
      causeTitle:
        "APPLICATION FOR DISPOSAL AND IMMEDIATE AUCTION OF PERISHABLE SEIZED PROPERTY (SECTION 516-A PROVISO Cr.P.C.)",
      paragraphs: [
        "1. That perishable property has been seized at Police Station {police_station}, {court_city}.",
        "2. That the property is described as: {property_description}.",
        "3. That decay / diminution is probable: {decay_probability_justification}.",
      ],
      prayerItems: [
        "Order immediate auction / disposal under the proviso to section 516-A Cr.P.C.",
        "Direct deposit of sale proceeds in accordance with law.",
      ],
      fieldsNote:
        "Fields: court_city, police_station, property_description, decay_probability_justification",
    }),
  },
  {
    file: "witness_recall_540.docx",
    children: simplePetition({
      courtLine:
        "IN THE COURT OF THE ILLAQA MAGISTRATE / SESSIONS JUDGE, {court_city}",
      causeTitle:
        "APPLICATION FOR RECALLING AND RE-EXAMINATION OF PROSECUTION WITNESS (SECTION 540 Cr.P.C.)",
      paragraphs: [
        "1. That the matter titled {case_title} is pending at {court_city}.",
        "2. That witness namely {witness_name} requires recall and re-examination.",
        "3. That the omissions / contradictions are: {omission_contradiction_details}.",
      ],
      prayerItems: [
        "Recall and re-examine the said witness under section 540 Cr.P.C.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      fieldsNote:
        "Fields: court_city, case_title, witness_name, omission_contradiction_details",
    }),
  },
  {
    file: "trial_severance_239.docx",
    children: simplePetition({
      courtLine:
        "IN THE COURT OF THE ILLAQA MAGISTRATE / SESSIONS JUDGE, {court_city}",
      causeTitle:
        "APPLICATION FOR SEPARATION OF TRIALS AND SEVERANCE OF CHARGES (SECTION 239 Cr.P.C.)",
      paragraphs: [
        "1. That the matter titled {case_title} is pending at {court_city}.",
        "2. That co-accused namely {co_accused_name} is being tried jointly.",
        "3. That conflicting defence grounds are: {conflicting_defense_grounds}.",
      ],
      prayerItems: [
        "Order separation of trials and severance of charges.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      fieldsNote:
        "Fields: court_city, case_title, co_accused_name, conflicting_defense_grounds",
    }),
  },
  {
    file: "electronic_evidence_164.docx",
    children: simplePetition({
      courtLine:
        "IN THE COURT OF THE ILLAQA MAGISTRATE / SESSIONS JUDGE, {court_city}",
      causeTitle:
        "APPLICATION FOR PRODUCTION AND ADMISSIBILITY OF SECONDARY ELECTRONIC EVIDENCE (ARTICLE 164 QSO, 1984)",
      paragraphs: [
        "1. That the matter titled {case_title} is pending at {court_city}.",
        "2. That the media type is: {media_type_cctv_audio}.",
        "3. That device / source verification is: {device_source_verification}.",
      ],
      prayerItems: [
        "Permit production and admissibility of the secondary electronic evidence.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      fieldsNote:
        "Fields: court_city, case_title, media_type_cctv_audio, device_source_verification",
    }),
  },
  {
    file: "bail_cancellation_497.docx",
    children: simplePetition({
      courtLine: "IN THE COURT OF THE LEARNED SESSIONS JUDGE, {court_city}",
      causeTitle:
        "APPLICATION FOR THE CANCELLATION AND REVOCATION OF GRANTED BAIL (SECTION 497(5) Cr.P.C.)",
      paragraphs: [
        "1. That the accused namely {accused_name} was enlarged on bail in FIR No. {fir_number}, Police Station {police_station}, {court_city}.",
        "2. That witness tampering / misuse particulars are: {witness_tampering_particulars}.",
        "3. That the bail is liable to be cancelled under section 497(5) Cr.P.C.",
      ],
      prayerItems: [
        "Cancel and revoke the bail granted to the accused and remand him to custody.",
        "Any other relief which this Honorable Court deems fit may also be awarded.",
      ],
      fieldsNote:
        "Fields: court_city, police_station, fir_number, accused_name, witness_tampering_particulars",
    }),
  },
  {
    file: "sentence_suspension_426.docx",
    children: simplePetition({
      courtLine: "IN THE COURT OF THE {appellate_court_name}, {court_city}",
      causeTitle:
        "APPLICATION FOR SUSPENSION OF SENTENCE PENDING ADJUDICATION OF CRIMINAL APPEAL (SECTION 426 Cr.P.C.)",
      paragraphs: [
        "1. That the appellant namely {appellant_name} has preferred Criminal Appeal No. {appeal_number} at {court_city}.",
        "2. That the sentence duration is {sentence_duration}.",
        "3. That section 426 Cr.P.C. empowers this Honorable Court to suspend the sentence pending appeal.",
      ],
      prayerItems: [
        "Suspend the sentence pending final adjudication of the appeal.",
        "Release the appellant on bail / bonds to the satisfaction of this Court.",
      ],
      fieldsNote:
        "Fields: appellate_court_name, court_city, appellant_name, sentence_duration, appeal_number",
    }),
  },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(path.join(OUT, "docx"), { recursive: true });
  for (const tpl of TEMPLATES) {
    const buffer = await Packer.toBuffer(makeDoc(tpl.children));
    const rootPath = path.join(OUT, tpl.file);
    const docxPath = path.join(OUT, "docx", tpl.file);
    fs.writeFileSync(rootPath, buffer);
    fs.writeFileSync(docxPath, buffer);
    console.log("Wrote", path.relative(ROOT, rootPath));
    console.log("Wrote", path.relative(ROOT, docxPath));
  }
  console.log(`\nGenerated ${TEMPLATES.length} extended criminal template(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
