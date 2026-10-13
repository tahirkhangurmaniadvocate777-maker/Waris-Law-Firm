import { NextResponse } from "next/server";
import {
  CIVIL_AUTOMATE_TYPES,
  emptyCivilForm,
  isCivilAutomateType,
  needsPropertyBoundaryValidation,
  validatePropertyBoundaries,
  type CivilAutomateType,
  type CivilForm,
  type PropertyBoundaryField,
} from "@/lib/civil";
import { buildCivilAutomateDocxBuffer, civilDocxFilenameFor } from "@/lib/civil-docx";
import { normalizeCaseLawCitations } from "@/lib/caseLawCitations";
import { leadIdFromBody, logUsageServer } from "@/lib/logUsageServer";

export const runtime = "nodejs";

type Body = {
  type?: string;
  fields?: Record<string, unknown>;
  case_law_citations?: unknown;
  pld_citations?: unknown;
  format?: string;
};

function asString(value: unknown): string {
  if (value == null) return "";
  return String(value);
}

function fieldsToCivilForm(
  type: CivilAutomateType,
  fields: Record<string, unknown>,
  citations: string[],
): CivilForm {
  const base = emptyCivilForm();
  return {
    ...base,
    suitType: type,
    courtClass: asString(fields.court_class ?? fields.courtClass) || base.courtClass,
    district: asString(fields.district) || base.district,
    plaintiffName: asString(fields.plaintiff_name ?? fields.plaintiffName),
    plaintiffParentage: asString(
      fields.plaintiff_parentage ?? fields.plaintiffParentage,
    ),
    plaintiffAddress: asString(
      fields.plaintiff_address ?? fields.plaintiffAddress,
    ),
    defendantName: asString(fields.defendant_name ?? fields.defendantName),
    defendantParentage: asString(
      fields.defendant_parentage ?? fields.defendantParentage,
    ),
    defendantAddress: asString(
      fields.defendant_address ?? fields.defendantAddress,
    ),
    facts: asString(fields.facts),
    causeDate: asString(fields.cause_date ?? fields.causeDate),
    causeEvent: asString(fields.cause_event ?? fields.causeEvent),
    suitValue: asString(fields.suit_value ?? fields.suitValue),
    courtFee: asString(fields.court_fee ?? fields.courtFee),
    propertyDesc: asString(fields.property_desc ?? fields.propertyDesc),
    relief: asString(fields.relief),
    lawyerName: asString(fields.lawyer_name ?? fields.lawyerName) || base.lawyerName,
    verificationDate:
      asString(fields.verification_date ?? fields.verificationDate) ||
      base.verificationDate,
    property_address: asString(fields.property_address),
    boundary_north: asString(fields.boundary_north),
    boundary_south: asString(fields.boundary_south),
    boundary_east: asString(fields.boundary_east),
    boundary_west: asString(fields.boundary_west),
    khasra_khewat: asString(fields.khasra_khewat),
    area_measurement: asString(fields.area_measurement),
    ownership_basis: asString(fields.ownership_basis),
    case_law_citations: citations,
    pld_citations_text: asString(fields.pld_citations_text),
    pendingSuitNumber: asString(
      fields.pending_suit_number ?? fields.pendingSuitNumber,
    ),
    pendingSuitTitle: asString(
      fields.pending_suit_title ?? fields.pendingSuitTitle,
    ),
    threatenedAct: asString(fields.threatened_act ?? fields.threatenedAct),
    primaFacieCase: asString(fields.prima_facie_case ?? fields.primaFacieCase),
    irreparableInjury: asString(
      fields.irreparable_injury ?? fields.irreparableInjury,
    ),
    balanceOfConvenience: asString(
      fields.balance_of_convenience ?? fields.balanceOfConvenience,
    ),
  };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const type = String(body.type ?? "").trim();
  if (!type || !isCivilAutomateType(type)) {
    return NextResponse.json(
      {
        error: `Unknown civil automate type. Expected one of: ${CIVIL_AUTOMATE_TYPES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const fields = (body.fields ?? {}) as Record<string, unknown>;
  const citations = [
    ...normalizeCaseLawCitations(body.case_law_citations),
    ...normalizeCaseLawCitations(body.pld_citations),
    ...normalizeCaseLawCitations(fields.case_law_citations),
    ...normalizeCaseLawCitations(fields.pld_citations),
  ];

  const form = fieldsToCivilForm(type, fields, citations);

  if (needsPropertyBoundaryValidation(type)) {
    const check = validatePropertyBoundaries(form);
    if (!check.ok) {
      return NextResponse.json(
        {
          error: "Missing required property boundary fields.",
          missingFields: check.missingFields as PropertyBoundaryField[],
        },
        { status: 422 },
      );
    }
  }

  await logUsageServer({
    leadId: leadIdFromBody(body as Record<string, unknown>),
    toolUsed: "civil-suit-writer",
    draftType: `${type}:docx`,
  });

  try {
    const buffer = await buildCivilAutomateDocxBuffer(type, form);
    const filename = civilDocxFilenameFor(type, form);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[automate/civil]", err);
    const message =
      err instanceof Error ? err.message : "Could not generate civil document.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
