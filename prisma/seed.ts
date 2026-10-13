import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const entries = [
  {
    id: "seed-154",
    category: "Investigation",
    sectionNumber: "154",
    title: "First Information Report (FIR) — Investigation Stage",
    keywords: "FIR, police station, cognizable offence, investigation, CrPC 154, 156, 157, 161, 167",
    shortNote:
      "Section 154 Cr.P.C. governs recording of information relating to the commission of a cognizable offence. The FIR sets the foundation of the prosecution case: nominate accused carefully, note time/place of occurrence, and preserve the earliest version of facts. Delay in lodging, improvements in later statements, and conflict with medical/site evidence are classic defence themes. After registration, investigation proceeds under sections 156–173 (including statements under 161, remand under 167, and final report/challan under 173).",
    relatedSections: "CrPC 155, 156, 157, 161, 167, 169, 170, 173; PPC offence sections as nominated",
    checklistJson: JSON.stringify([
      "Obtain certified copy of FIR and diary numbers",
      "Check nomination / unknown accused wording",
      "Note date/time of occurrence vs FIR lodging delay",
      "Compare FIR facts with 161 statements and medical evidence",
      "Record arrest / custody status and remand orders",
      "Track investigation progress toward challan (173)",
    ]),
  },
  {
    id: "seed-540",
    category: "Evidence",
    sectionNumber: "540",
    title: "Court’s Power to Summon / Examine / Recall Witnesses",
    keywords: "540 CrPC, recall witness, summon witness, examine any person, evidence, cross-examination, PW, DW",
    shortNote:
      "Section 540 Cr.P.C. empowers the court to summon any person as a witness, or examine any person in attendance, or recall and re-examine any person already examined, if his evidence appears essential to the just decision of the case. Applications under 540 are used to fill material gaps, confront improvements, or place documents/persons whose testimony the prosecution omitted. Courts balance fair trial against delay and fishing expeditions — plead necessity, materiality, and prejudice if the power is refused.",
    relatedSections: "CrPC 161, 164, 244, 265-F, 342; Qanun-e-Shahadat Order (relevant articles on examination)",
    checklistJson: JSON.stringify([
      "Identify missing material witness or document",
      "State why evidence is essential to a just decision",
      "Annex prior application history / prosecution omissions",
      "Prepare focused examination points (not a roving inquiry)",
      "Address delay / stage of trial in grounds",
      "Seek fixed date and production directions",
    ]),
  },
  {
    id: "seed-249-A",
    category: "Acquittal",
    sectionNumber: "249-A",
    title: "Acquittal at Any Stage — Magistrate (249-A Cr.P.C.)",
    keywords: "249-A, acquittal, groundless charge, no probability of conviction, magistrate, discharge, CrPC",
    shortNote:
      "Section 249-A Cr.P.C. enables a Magistrate to acquit the accused at any stage of the case if, after hearing the prosecutor and the accused and for reasons to be recorded, the charge is groundless or there is no probability of the accused being convicted of any offence. Typical grounds include absence of incriminating material connecting the accused, fatal contradictions with the FIR, failed recoveries, or a record that makes conviction impossible. Pair with a careful reading of the challan and prosecution evidence already on file. Sessions counterpart practice is often framed under section 265-K.",
    relatedSections: "CrPC 249, 249-A, 265-K, 265-D; related PPC sections; bail interplay under 497",
    checklistJson: JSON.stringify([
      "File written application with concise grounds",
      "Annex FIR, challan extracts, and key contradictions",
      "Argue charge is groundless OR zero probability of conviction",
      "Highlight lack of recovery / identification / medical link",
      "Request recorded reasons and immediate acquittal",
      "Prepare alternate prayer (further inquiry / bail) if needed",
    ]),
  },
] as const;

async function main() {
  let upserted = 0;
  for (const entry of entries) {
    await prisma.referencerEntry.upsert({
      where: { id: entry.id },
      create: { ...entry },
      update: {
        category: entry.category,
        sectionNumber: entry.sectionNumber,
        title: entry.title,
        keywords: entry.keywords,
        shortNote: entry.shortNote,
        relatedSections: entry.relatedSections,
        checklistJson: entry.checklistJson,
      },
    });
    upserted += 1;
  }

  const total = await prisma.referencerEntry.count();
  console.log(`Upserted ${upserted} core ReferencerEntry rows (seed-154, seed-540, seed-249-A).`);
  console.log(`ReferencerEntry total in DB: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
