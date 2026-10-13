export const BLANK = "_______________";

export type MaintenanceForm = {
  courtLocation: string;
  suitNumber: string;
  plaintiffName: string;
  plaintiffRelation: string;
  plaintiffAddress: string;
  plaintiffPhone: string;
  defendantName: string;
  defendantRelation: string;
  defendantAddress: string;
  defendantPhone: string;
  marriageDate: string;
  childrenCount: string;
  childrenDetails: string;
  abandonmentDate: string;
  defendantOccupation: string;
  defendantIncome: string;
  schoolName: string;
  schoolExpense: string;
  pastStart: string;
  pastEnd: string;
  pastRate: string;
  futureRate: string;
  causeDate: string;
  totalPast: string;
  wifeFutureRate: string;
  childFutureRate: string;
  lawyerName: string;
  verificationDate: string;
};

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function emptyMaintenanceForm(lawyerName: string, courtLocation: string): MaintenanceForm {
  return {
    courtLocation,
    suitNumber: "",
    plaintiffName: "",
    plaintiffRelation: "",
    plaintiffAddress: "",
    plaintiffPhone: "",
    defendantName: "",
    defendantRelation: "",
    defendantAddress: "",
    defendantPhone: "",
    marriageDate: "",
    childrenCount: "",
    childrenDetails: "",
    abandonmentDate: "",
    defendantOccupation: "",
    defendantIncome: "",
    schoolName: "",
    schoolExpense: "",
    pastStart: "",
    pastEnd: "",
    pastRate: "",
    futureRate: "",
    causeDate: "",
    totalPast: "",
    wifeFutureRate: "",
    childFutureRate: "",
    lawyerName,
    verificationDate: todayIso(),
  };
}

export function textOrBlank(value: string) {
  const trimmed = value.trim();
  return trimmed || BLANK;
}

export function formatLongDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return textOrBlank(iso);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return BLANK;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPkr(raw: string) {
  const cleaned = raw.replace(/,/g, "").trim();
  if (!cleaned) return BLANK;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount)) return cleaned;
  return amount.toLocaleString("en-PK");
}

export function suitYear(verificationDate: string) {
  const match = /^(\d{4})/.exec(verificationDate.trim());
  return match?.[1] ?? "2026";
}

export function suggestPastTotal(start: string, end: string, rate: string) {
  const startMatch = /^(\d{4})-(\d{2})/.exec(start);
  const endMatch = /^(\d{4})-(\d{2})/.exec(end);
  const rateAmount = Number(rate.replace(/,/g, "").trim());
  if (!startMatch || !endMatch || !Number.isFinite(rateAmount) || rateAmount <= 0) return null;

  const months =
    (Number(endMatch[1]) - Number(startMatch[1])) * 12 +
    (Number(endMatch[2]) - Number(startMatch[2])) +
    1;

  if (months <= 0) return null;
  return { months, total: months * rateAmount };
}

export function childrenParagraph(countRaw: string, detailsRaw: string) {
  const count = countRaw.trim();
  const details = textOrBlank(detailsRaw);
  const numeric = Number(count);

  if (count && numeric === 1) {
    return `That out of the wedlock, 1 child was born, namely ${details}.`;
  }

  if (count && Number.isFinite(numeric) && numeric > 1) {
    return `That out of the wedlock, ${numeric} children were born, namely ${details}.`;
  }

  return `That out of the wedlock, ${textOrBlank(count)} child/children were born, namely ${details}.`;
}

export function meansClause(occupationRaw: string, incomeRaw: string) {
  const occupation = occupationRaw.trim();
  const income = incomeRaw.trim();

  if (occupation && income) {
    return `running a business of ${occupation} / earning a monthly salary of PKR ${formatPkr(income)}`;
  }
  if (occupation) return `running a business of ${occupation}`;
  if (income) return `earning a monthly salary of PKR ${formatPkr(income)}`;
  return `running a business of ${BLANK} / earning a monthly salary of PKR ${BLANK}`;
}
