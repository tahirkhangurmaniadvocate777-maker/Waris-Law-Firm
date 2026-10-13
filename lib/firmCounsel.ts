import { firm } from "@/lib/firm";

/** Footer line injected into automated .docx templates as `{legal_counsel_footer}`. */
export function legalCounselFooter(): string {
  return firm.name;
}

/** en-PK date string for `{document_generation_date}`. */
export function documentGenerationDate(date = new Date()): string {
  try {
    return date.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
