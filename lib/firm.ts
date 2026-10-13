import {
  FIRM_METADATA,
  PRACTICE_AREAS_TEXT,
  phoneToTelHref,
  phoneToWhatsApp,
} from "@/lib/config/websiteContent";

/** Short trading name for nav / hero (first segment of firmName). */
const shortFirmName = FIRM_METADATA.firmName.split("/")[0]?.trim() || FIRM_METADATA.firmName;

/** Address split for multi-line chambers blocks. */
const officeLines = (() => {
  const addr = FIRM_METADATA.officeAddress;
  const blockIdx = addr.indexOf("Quaid-E-Azam");
  if (blockIdx > 0) {
    return [
      addr.slice(0, blockIdx).replace(/,\s*$/, "").trim() + ",",
      addr.slice(blockIdx).trim(),
    ] as const;
  }
  return [addr] as const;
})();

/**
 * Runtime firm object used across layouts, pleadings, and contact UI.
 * Sourced from `FIRM_METADATA` — do not hardcode conflicting contact strings elsewhere.
 */
export const firm = {
  name: shortFirmName,
  /** Full brand string from website content (e.g. Waris Law Firm / Waris Law Office). */
  firmName: FIRM_METADATA.firmName,
  advocate: FIRM_METADATA.advocateName,
  designation: FIRM_METADATA.title,
  officeAddress: FIRM_METADATA.officeAddress,
  officeLines: [...officeLines],
  officeLocation: FIRM_METADATA.officeLocation,
  /** Google Maps place pin / directions for the chambers. */
  mapsUrl: (() => {
    const { lat, lng } = FIRM_METADATA.officeLocation;
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
  })(),
  /** Embeddable map iframe src (no API key required). */
  mapsEmbedUrl: (() => {
    const { lat, lng, zoom } = FIRM_METADATA.officeLocation;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
  })(),
  phones: FIRM_METADATA.phones.map((display) => ({
    display,
    tel: phoneToTelHref(display),
    whatsapp: phoneToWhatsApp(display),
  })),
  emails: [...FIRM_METADATA.emails],
  practice: PRACTICE_AREAS_TEXT.map((area) => area.title),
  defaultCourt: "Dera Ghazi Khan",
  tagline: "Advocacy and court drafting from the District Courts, Dera Ghazi Khan.",
} as const;

export const disclaimer =
  "Drafts and guides on this site are assistance only. Checking the facts, settling the court fee, and filing remain the responsibility of the party or the advocate.";

export {
  FIRM_METADATA,
  PRACTICE_AREAS_TEXT,
  getPracticeAreaBySlug,
  phoneToDigits,
  phoneToTelHref,
  phoneToWhatsApp,
  type FirmMetadata,
  type PracticeAreaContent,
  type PracticeAreaSlug,
} from "@/lib/config/websiteContent";
