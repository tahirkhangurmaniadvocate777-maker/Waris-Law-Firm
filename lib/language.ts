/** Shared English / Urdu drafting language for automated suit & application writers. */

export type DraftLanguage = "en" | "ur";

export const DRAFT_LANGUAGE_OPTIONS: { id: DraftLanguage; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ur", label: "اردو (Urdu)" },
];

export function isRtl(lang: DraftLanguage): boolean {
  return lang === "ur";
}

export function dirAttr(lang: DraftLanguage): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}

export type PetitionChrome = {
  versus: string;
  sheweth: string;
  prayer: string;
  grounds: string;
  verification: string;
  throughCounsel: string;
  residentOf: string;
  cellNo: string;
};

const CHROME: Record<DraftLanguage, PetitionChrome> = {
  en: {
    versus: "VERSUS",
    sheweth: "RESPECTFULLY SHEWETH:",
    prayer: "PRAYER:",
    grounds: "GROUNDS:",
    verification: "VERIFICATION:",
    throughCounsel: "Through Counsel:",
    residentOf: "Resident of:",
    cellNo: "Cell No:",
  },
  ur: {
    versus: "بنام",
    sheweth: "مستدعی دست بستہ حسبِ ذیل ہے:",
    prayer: "استدعا:",
    grounds: "وجوہات:",
    verification: "تصدیق:",
    throughCounsel: "بذریعہ وکیل:",
    residentOf: "سکونتی:",
    cellNo: "موبائل نمبر:",
  },
};

export function petitionChrome(lang: DraftLanguage): PetitionChrome {
  return CHROME[lang];
}

const ROLE_UR: Record<string, string> = {
  PETITIONER: "سائل",
  PETITIONERS: "سائلین",
  RESPONDENT: "مسئول علیہ",
  RESPONDENTS: "مسئول علیہم",
  PLAINTIFF: "مدعیہ / مدعی",
  DEFENDANT: "مدعا علیہ",
  APPLICANT: "درخواست گزار",
  APPLICANTS: "درخواست گزاران",
  ACCUSED: "ملزم",
  STATE: "ریاست",
  "THE STATE": "ریاست",
};

export function localizeRole(role: string, lang: DraftLanguage): string {
  if (lang !== "ur") return role;
  const key = role.trim().toUpperCase();
  return ROLE_UR[key] ?? role;
}

/** Apply shared chrome / role localization onto a TextPetition-shaped draft. */
export function withPetitionLanguage<
  T extends {
    leftRole: string;
    rightRole: string;
    signRole: string;
    shewethLabel?: string;
    prayerHeading?: string;
  },
>(draft: T, lang: DraftLanguage): T {
  if (lang === "en") return draft;
  const chrome = petitionChrome("ur");
  return {
    ...draft,
    leftRole: localizeRole(draft.leftRole, "ur"),
    rightRole: localizeRole(draft.rightRole, "ur"),
    signRole: localizeRole(draft.signRole, "ur"),
    shewethLabel: chrome.sheweth,
    prayerHeading: chrome.prayer,
  };
}
