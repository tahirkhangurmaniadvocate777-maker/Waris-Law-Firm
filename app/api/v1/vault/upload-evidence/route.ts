import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { saveEvidenceToVault } from "@/lib/legalUpload";

export const runtime = "nodejs";

function optionalField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const evidence = formData.get("evidence_file");

    if (!(evidence instanceof File) || evidence.size === 0) {
      return NextResponse.json(
        { success: false, message: "No file object received." },
        { status: 400 },
      );
    }

    const saved = await saveEvidenceToVault(evidence);

    const caseTitle = optionalField(formData, "case_title");
    const firNumber = optionalField(formData, "fir_number");
    const moduleKey = optionalField(formData, "moduleKey");

    return NextResponse.json({
      success: true,
      message: "Legal evidence document uploaded and encrypted in firm vault successfully.",
      savedFilename: saved.savedFilename,
      absoluteVaultPath: saved.absoluteVaultPath,
      ...(caseTitle ? { case_title: caseTitle } : {}),
      ...(firNumber ? { fir_number: firNumber } : {}),
      ...(moduleKey ? { moduleKey } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    const status = message.includes("Invalid document format") || message.includes("15MB") ? 400 : 500;
    if (status === 400) {
      return NextResponse.json({ success: false, error: message }, { status });
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
