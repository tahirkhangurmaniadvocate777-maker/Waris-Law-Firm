import { NextResponse } from "next/server";
import {
  LAW_PUBLISHER_PRECEDENTS,
  precedentsForFlaws,
  type CasePrepPrecedent,
} from "@/lib/casePrepPrecedents";

export type CasePrepAnalyzeBody = {
  caseId?: string;
  /** Limit detectors: criminal | civil | family | revenue | fbr | all (default). */
  department?: string;
  /** Flexible bag of document texts (merged with top-level fields). */
  documentBundle?: Record<string, unknown>;
  // Criminal (backward compatible)
  firText?: string;
  recoveryMemoText?: string;
  section161Statements?: string;
  medicalReportText?: string;
  bailApplicationText?: string;
  detentionRecordText?: string;
  // Civil
  plaintText?: string;
  injunctionApplicationText?: string;
  // Family
  familyPetitionText?: string;
  dowryAnnexureText?: string;
  // Revenue
  revenueRecordText?: string;
  fardText?: string;
  // FBR
  noticeText?: string;
  wealthStatementText?: string;
};

function asText(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function lower(s: string): string {
  return s.toLowerCase();
}

function hasAny(hay: string, needles: string[]): boolean {
  const h = lower(hay);
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function missingAll(hay: string, needles: string[]): boolean {
  const h = lower(hay);
  return needles.every((n) => !h.includes(n.toLowerCase()));
}

/** Extract khasra / khewat / canal-marla style number tokens for crude mismatch checks. */
function extractLandTokens(text: string): string[] {
  const tokens = new Set<string>();
  const patterns = [
    /\bkhasra\s*(?:no\.?|number|#)?\s*[:\-]?\s*([\d\/\-]+)/gi,
    /\bkhewat\s*(?:no\.?|number|#)?\s*[:\-]?\s*([\d\/\-]+)/gi,
    /\bkhatooni\s*(?:no\.?|number|#)?\s*[:\-]?\s*([\d\/\-]+)/gi,
    /\b(\d+)\s*kanal/gi,
    /\b(\d+)\s*marla/gi,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m[1]) tokens.add(m[1].replace(/\s+/g, ""));
    }
  }
  return [...tokens];
}

function cardinalConflict(a: string, b: string): boolean {
  const pairs: [string, string][] = [
    ["north", "south"],
    ["east", "west"],
    ["شمال", "جنوب"],
  ];
  const al = lower(a);
  const bl = lower(b);
  for (const [x, y] of pairs) {
    if ((al.includes(x) && bl.includes(y) && !al.includes(y)) || (al.includes(y) && bl.includes(x) && !al.includes(x))) {
      // Only flag when one doc leans one way and the other the opposite without both cardinals in each.
      if (al.includes(x) !== bl.includes(x) || al.includes(y) !== bl.includes(y)) {
        return true;
      }
    }
  }
  // khasra number divergence when both mention khasra
  if (hasAny(a, ["khasra"]) && hasAny(b, ["khasra"])) {
    const ta = extractLandTokens(a);
    const tb = extractLandTokens(b);
    if (ta.length && tb.length && ta.some((t) => !tb.includes(t))) return true;
  }
  return false;
}

function deptAllows(department: string | undefined, group: string): boolean {
  const d = (department || "all").toLowerCase();
  return d === "all" || d === group;
}

function detectFlaws(fields: Record<string, string>, department?: string): string[] {
  const flaws: string[] = [];
  const {
    firText,
    recoveryMemoText,
    section161Statements,
    medicalReportText,
    bailApplicationText,
    detentionRecordText,
    plaintText,
    injunctionApplicationText,
    familyPetitionText,
    dowryAnnexureText,
    revenueRecordText,
    fardText,
    noticeText,
    wealthStatementText,
  } = fields;

  // —— CRIMINAL ——
  if (deptAllows(department, "criminal")) {
    if (
      recoveryMemoText &&
      !hasAny(recoveryMemoText, ["independent witness", "respectable inhabitant", "mashir"])
    ) {
      flaws.push("recovery_memo_anomaly");
    }

    if (firText && medicalReportText) {
      const firMentionsFirearm = hasAny(firText, ["firearm", "fire-arm", "pistol", "rifle", "gunshot", "fire"]);
      const medicalShowsBlunt = hasAny(medicalReportText, [
        "blunt weapon",
        "blunt",
        "lacerated",
        "laceration",
      ]);
      if (firMentionsFirearm && medicalShowsBlunt) {
        flaws.push("medical_conflict");
      }
    }

    if (firText && section161Statements) {
      const firDay = hasAny(firText, ["daylight", "day time", "daytime", "broad day"]);
      const s161Night = hasAny(section161Statements, ["night", "darkness", "after sunset"]);
      const firNight = hasAny(firText, ["night", "darkness", "after sunset"]);
      const s161Day = hasAny(section161Statements, ["daylight", "day time", "daytime", "broad day"]);
      if ((firDay && s161Night) || (firNight && s161Day)) {
        flaws.push("witness_contradiction");
      }
    }

    const bailCorpus = [bailApplicationText, firText, detentionRecordText].filter(Boolean).join("\n");
    if (
      bailCorpus &&
      hasAny(bailCorpus, [
        "prohibitory",
        "further inquiry",
        "497(2)",
        "497 (2)",
        "challan pending",
        "investigation pending",
        "bail delay",
        "not yet challaned",
      ])
    ) {
      flaws.push("further_inquiry_497_2");
    }

    const detentionCorpus = [detentionRecordText, firText, bailApplicationText].filter(Boolean).join("\n");
    if (
      detentionCorpus &&
      hasAny(detentionCorpus, [
        "illegal detention",
        "habeas",
        "article 10",
        "art. 10",
        "without remand",
        "incommunicado",
        "section 491",
        "s.491",
        "u/s 491",
      ])
    ) {
      flaws.push("illegal_detention_491");
    }
  }

  // —— CIVIL ——
  if (deptAllows(department, "civil")) {
    if (
      plaintText &&
      hasAny(plaintText, ["declaratory", "section 42", "s.42", "specific relief"]) &&
      missingAll(plaintText, ["mutation", "title deed", "ownership", "sale deed", "registry", "khata"])
    ) {
      flaws.push("title_defect_sra42");
    }

    const inj = injunctionApplicationText || plaintText;
    if (
      inj &&
      hasAny(inj, ["injunction", "order 39", "order xxxix", "temporary injunction", "ad-interim"]) &&
      (missingAll(inj, ["prima facie"]) || missingAll(inj, ["irreparable", "balance of convenience"]))
    ) {
      flaws.push("injunction_balance_o39");
    }

    const boundaryA = plaintText || "";
    const boundaryB = revenueRecordText || fardText || injunctionApplicationText || "";
    if (boundaryA && boundaryB && cardinalConflict(boundaryA, boundaryB)) {
      flaws.push("boundary_conflict");
    } else if (
      plaintText &&
      hasAny(plaintText, ["north", "south", "east", "west", "khasra"]) &&
      hasAny(plaintText, ["mismatch", "encroachment", "boundary dispute", "overlapping"])
    ) {
      flaws.push("boundary_conflict");
    }
  }

  // —— FAMILY ——
  if (deptAllows(department, "family")) {
    const fam = familyPetitionText || "";
    if (
      fam &&
      hasAny(fam, ["dower", "haq mehr", "haq-e-mehr", "mahr"]) &&
      hasAny(fam, ["unpaid", "not paid", "non-payment", "outstanding", "default"])
    ) {
      flaws.push("dower_nonpayment");
    }

    if (
      fam &&
      hasAny(fam, ["custody", "guardianship", "ward", "minor"]) &&
      missingAll(fam, ["best interest", "best interests", "welfare", "welfare of the minor"])
    ) {
      flaws.push("custody_welfare");
    }

    const annex = dowryAnnexureText || fam;
    if (
      annex &&
      hasAny(annex, ["annexure-b", "annexure b", "jahez", "dowry"]) &&
      missingAll(annex, ["valuation", "value", "rs.", "rupees", "price", "amount"])
    ) {
      flaws.push("dowry_inventory_gap");
    }
  }

  // —— REVENUE ——
  if (deptAllows(department, "revenue")) {
    const revA = fardText || revenueRecordText || "";
    const revB = revenueRecordText && fardText ? revenueRecordText : plaintText || "";
    if (revA && revB && revA !== revB) {
      const ta = extractLandTokens(revA);
      const tb = extractLandTokens(revB);
      if (ta.length && tb.length && (ta.some((t) => !tb.includes(t)) || tb.some((t) => !ta.includes(t)))) {
        flaws.push("khasra_khewat_mismatch");
      }
    } else if (
      (fardText || revenueRecordText) &&
      hasAny(fardText || revenueRecordText || "", ["khasra", "khewat", "khatooni", "mauza", "kanal", "marla"]) &&
      hasAny(fardText || revenueRecordText || "", ["mismatch", "inconsistent", "differ", "conflict"])
    ) {
      flaws.push("khasra_khewat_mismatch");
    }

    const partCorpus = [revenueRecordText, fardText, plaintText].filter(Boolean).join("\n");
    if (
      partCorpus &&
      hasAny(partCorpus, [
        "partition",
        "takseem",
        "section 135",
        "s.135",
        "joint holding",
        "joint khata",
        "private partition",
      ]) &&
      hasAny(partCorpus, ["refused", "refusal", "denied", "objected", "title dispute", "stay"])
    ) {
      flaws.push("partition_refusal_135");
    }
  }

  // —— FBR ——
  if (deptAllows(department, "fbr")) {
    if (
      noticeText &&
      hasAny(noticeText, [
        "section 122",
        "s.122",
        "u/s 122",
        "section 177",
        "s.177",
        "u/s 177",
        "iris",
        "withholding",
      ])
    ) {
      flaws.push("section_122_177_notice");
    }

    if (
      wealthStatementText &&
      hasAny(wealthStatementText, ["section 116", "s.116", "u/s 116", "wealth statement", "wealth"]) &&
      missingAll(wealthStatementText, [
        "reconcil",
        "opening wealth",
        "closing wealth",
        "prior year",
        "source of funds",
      ])
    ) {
      flaws.push("wealth_statement_116_gap");
    }
  }

  return [...new Set(flaws)];
}

function buildSynopsis(citations: CasePrepPrecedent[]): string {
  if (!citations.length) {
    return "No heuristic discrepancies matched against the current document bundle. Re-check inputs or expand the text pasted for each department.";
  }
  return citations
    .map((cite, i) => {
      const flawLabel = cite.targetFlaw.replace(/_/g, " ");
      return `${i + 1}. Based on ${cite.citation} (${cite.court}), the opposing position is compromised because the record exhibits a clear ${flawLabel}. ${cite.ratioDecidendi}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CasePrepAnalyzeBody;
    const bundle = body.documentBundle && typeof body.documentBundle === "object" ? body.documentBundle : {};

    const fields: Record<string, string> = {
      firText: asText(body.firText ?? bundle.firText),
      recoveryMemoText: asText(body.recoveryMemoText ?? bundle.recoveryMemoText),
      section161Statements: asText(body.section161Statements ?? bundle.section161Statements),
      medicalReportText: asText(body.medicalReportText ?? bundle.medicalReportText),
      bailApplicationText: asText(body.bailApplicationText ?? bundle.bailApplicationText),
      detentionRecordText: asText(body.detentionRecordText ?? bundle.detentionRecordText),
      plaintText: asText(body.plaintText ?? bundle.plaintText),
      injunctionApplicationText: asText(
        body.injunctionApplicationText ?? bundle.injunctionApplicationText,
      ),
      familyPetitionText: asText(body.familyPetitionText ?? bundle.familyPetitionText),
      dowryAnnexureText: asText(body.dowryAnnexureText ?? bundle.dowryAnnexureText),
      revenueRecordText: asText(body.revenueRecordText ?? bundle.revenueRecordText),
      fardText: asText(body.fardText ?? bundle.fardText),
      noticeText: asText(body.noticeText ?? bundle.noticeText),
      wealthStatementText: asText(body.wealthStatementText ?? bundle.wealthStatementText),
    };

    const extractedFlaws = detectFlaws(fields, body.department);
    const matchingCitations = precedentsForFlaws(extractedFlaws);

    const favorableCaseView = {
      caseId: body.caseId || "TEMP-CASE-01",
      department: body.department || "all",
      detectedDiscrepancies: extractedFlaws.map((f) => f.toUpperCase().replace(/_/g, " ")),
      detectedFlawKeys: extractedFlaws,
      groundedPrecedents: matchingCitations,
      winningArgumentsSynopsis: buildSynopsis(matchingCitations),
      precedentCatalogSize: LAW_PUBLISHER_PRECEDENTS.length,
    };

    return NextResponse.json({ success: true, analysisReport: favorableCaseView });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
