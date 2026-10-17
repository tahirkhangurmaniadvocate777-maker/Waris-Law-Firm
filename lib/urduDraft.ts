/**
 * Urdu structural / body text for automated drafting tools.
 * Party names and free-text facts stay as entered by counsel.
 */

import { formatLongDate, textOrBlank } from "@/lib/format";
import {
  localizeRole,
  petitionChrome,
  type DraftLanguage,
  withPetitionLanguage,
} from "@/lib/language";
import type { CivilPlaintData } from "@/lib/civil";
import { CIVIL_SUIT_OPTIONS } from "@/lib/civilOptions";
import type { CriminalDraft, CriminalForm } from "@/lib/criminal";
import type { FamilyForm } from "@/lib/family";
import { formatPkr, suitYear } from "@/lib/format";
import type { RevenueForm } from "@/lib/revenue";
import { firm } from "@/lib/firm";

function blank(v: string) {
  return textOrBlank(v);
}

/* ─── Criminal ─── */

const CRIMINAL_CAUSE_UR: Partial<Record<CriminalForm["appType"], string>> = {
  "497": "ضابطہ فوجداری کی دفعہ ۴۹۷ کے تحت ضمانت بعد از گرفتاری کی درخواست",
  "498": "ضابطہ فوجداری کی دفعہ ۴۹۸ کے تحت ضمانت قبل از گرفتاری کی درخواست",
  "249A": "ضابطہ فوجداری کی دفعہ ۲۴۹۔اے کے تحت بریت / خارجگی کی درخواست",
  "265K": "ضابطہ فوجداری کی دفعہ ۲۶۵۔کے کے تحت بریت کی درخواست",
  "22A-22B":
    "ضابطہ فوجداری کی دفعات ۲۲۔اے و ۲۲۔بی کے تحت ایف آئی آر درج کرانے کی ہدایت کی درخواست",
  "516A": "ضابطہ فوجداری کی دفعہ ۵۱۶۔اے کے تحت سپرداری کی درخواست",
  "491-552": "ضابطہ فوجداری کی دفعات ۴۹۱ و ۵۵۲ کے تحت نابالغ کی بازیافت کی درخواست",
  "HABEAS-491": "ضابطہ فوجداری کی دفعہ ۴۹۱ کے تحت ہیبیز کارپس کی درخواست",
  NBW: "ناقابل ضمانت وارنٹ گرفتاری منسوخ / موخر کرانے کی درخواست",
  DISPENSE: "ذاتی حاضری سے استثنٰی کی درخواست",
  "216": "الزام میں ترمیم کی درخواست",
  NONHARASS: "ہراساں نہ کیے جانے کی ہدایت کی درخواست",
  APPEAL: "فوجداری اپیل",
  REVISION: "فوجداری نظرثانی",
  "200": "ضابطہ فوجداری کی دفعہ ۲۰۰ کے تحت شکایت",
};

export function criminalDraftInLanguage(
  draft: CriminalDraft,
  form: CriminalForm,
  lang: DraftLanguage,
): CriminalDraft {
  if (lang === "en") return draft;
  const chrome = petitionChrome("ur");
  const cause =
    CRIMINAL_CAUSE_UR[form.appType] ??
    "ضابطہ فوجداری کے تحت استدعا / درخواست";

  const fir =
    form.firNo.trim() || form.policeStation.trim()
      ? `ایف آئی آر نمبر ${blank(form.firNo)} مورخہ ${formatLongDate(form.firDate)} زیر دفعہ ${blank(form.offenses)} ${blank(form.offenseLaw)}، تھانہ ${blank(form.policeStation)}، ضلع ${blank(form.district)}`
      : "";

  const paragraphs = [
    `۱۔ یہ کہ سائل / درخواست گزار ${blank(form.petitionerName)} ولد/زوجہ ${blank(form.petitionerFather)}، سکونتی ${blank(form.petitionerAddress)}، پاکستان کا پرامن شہری ہے۔`,
    fir
      ? `۲۔ یہ کہ زیرہ زیرہ مقدمہ ${fir} میں درج / زیر عمل ہے۔`
      : `۲۔ یہ کہ موجودہ معاملہ اس عدالت کے دائرہ اختیار میں ہے۔`,
    `۳۔ یہ کہ سائل بے گناہ ہے اور اسے غلط طور پر ملوث کیا گیا ہے؛ مقدمے کے حالات مزید تفتیش کے متقاضی ہیں۔`,
    form.extraGrounds.trim()
      ? `۴۔ یہ کہ ${form.extraGrounds.trim()}`
      : `۴۔ یہ کہ سائل کی رہائی / مطلوبہ ریلیف سے استغاثہ کو کوئی نقصان نہیں ہوگا اور سائل عدالت کے کسی بھی حکم کی تعمیل کا پابند رہے گا۔`,
    `۵۔ یہ کہ سائل کے پاس یہی مناسب و موثر قانونی چارہ جوئی ہے۔`,
  ];

  const localized = withPetitionLanguage(
    {
      ...draft,
      courtLine: `عدالت جناب ${blank(form.courtTitle)} صاحب، ${blank(form.district)}`,
      suitLine: `فوجداری درخواست نمبر ___________ / ${suitYear(form.verificationDate)}`,
      causeTitle: cause,
      shewethLabel: chrome.sheweth,
      prayerHeading: chrome.prayer,
      paragraphs,
      prayerIntro:
        "لہٰذا استدعا ہے کہ یہ عدالت گرامی درج ذیل حکم صادر فرمائے:",
      prayerItems: [
        "زیر نظر درخواست منظور کی جائے۔",
        "سائل کو قانون کے مطابق مطلوبہ ریلیف عطا کیا جائے۔",
        "کوئی اور مناسب حکم جو عدالت مناسب سمجھے صادر فرمایا جائے۔",
      ],
      verificationText: `تصدیق بذریعہ حلف بمقام ${blank(form.district)} مورخہ ${formatLongDate(form.verificationDate)} کہ مندرجات درخواست صحیح و درست ہیں جو میرے علم و یقین کے مطابق ہیں۔`,
    },
    "ur",
  );

  return localized;
}

/* ─── Civil plaint (string body) ─── */

export function buildCivilPlaintDraftUrdu(data: CivilPlaintData): string {
  const selectedSuit = CIVIL_SUIT_OPTIONS.find((s) => s.id === data.suit_type_id);
  const titleOfSuit = selectedSuit
    ? selectedSuit.label
    : "دیوانی مقدمہ";
  const year = new Date().getFullYear();
  const customFacts = data.facts_paragraphs.map((p) => p.trim()).filter(Boolean);
  const customBlock = customFacts
    .map((para, i) => `${i + 3}۔ ${para}`)
    .join("\n\n");
  const causeIdx = customFacts.length + 3;
  const jurIdx = customFacts.length + 4;
  const valIdx = customFacts.length + 5;

  return `
عدالت جناب ${data.court_forum} صاحب،
بمقام ${data.district}

دیوانی مقدمہ نمبر ___________ بابت ${year}

۱۔ ${(data.plaintiff_name || "_______________").toUpperCase()}، شناختی کارڈ: ${data.plaintiff_cnic || "xxxxx-xxxxxxx-x"}، سکونتی ${data.plaintiff_address || "_______________"}۔ فون: ${data.plaintiff_phone || "_______________"}
                                                        ...مدعی

                                    بنام

۱۔ ${(data.defendant_name || "_______________").toUpperCase()}، سکونتی ${data.defendant_address || "_______________"}۔
                                                        ...مدعا علیہ

${titleOfSuit}

مستدعی دست بستہ حسبِ ذیل ہے:

۱۔ یہ کہ زیر نظر مقدمے کا موضوع غیر منقولہ جائیداد حسبِ ذیل ہے: ${data.property_description || "_______________"}۔

۲۔ ${selectedSuit?.defaultFacts ?? "یہ کہ مقدمے کے مادی حقائق حسبِ ذیل ہیں۔"}

${customBlock ? `${customBlock}\n` : ""}
${causeIdx}۔ سببِ دعویٰ: یہ کہ سببِ دعویٰ مدعی کے حق میں مدعا علیہ کے خلاف مورخہ ${data.cause_of_action_date || "_______________"} کو پیدا ہوا جب مدعا علیہ نے جائز مطالبات تسلیم کرنے سے انکار کر دیا۔

${jurIdx}۔ دائرہ اختیار: یہ کہ متنازعہ جائیداد ضلع ${data.district || "_______________"} میں واقع ہے اور یہ عدالت مکمل طور پر مجاز ہے۔

${valIdx}۔ مالیت و کورٹ فیس: یہ کہ مقدمے کی مالیت روپے ${data.suit_valuation || "_______________"}/- مقرر کی گئی ہے اور کورٹ فیس روپے ${data.court_fee_paid || "_______________"}/- ادا / چسپاں کی گئی ہے۔

استدعا:

لہٰذا استدعا ہے کہ یہ عدالت گرامی مدعی کے حق میں مدعا علیہ کے خلاف ڈگری صادر فرمائے:

الف) ${selectedSuit?.defaultPrayer ?? "سببِ عنوان میں مطلوبہ ریلیف عطا کیا جائے۔"}

ب) کوئی اور مناسب و متبادل حکم جو عدالت انصاف کے تقاضوں کے عین مطابق سمجھے۔

مدعی
بذریعہ وکیل: ${firm.advocate}، ${firm.designation}
`.trim();
}

/* ─── Revenue ─── */

export function revenueDraftInLanguage(
  draft: ReturnType<typeof import("@/lib/revenue").buildRevenueDraft>,
  form: RevenueForm,
  lang: DraftLanguage,
) {
  if (lang === "en") return draft;
  const chrome = petitionChrome("ur");
  const year = suitYear(form.verificationDate);
  const titleUr: Record<RevenueForm["appType"], string> = {
    correction: "لینڈ ریونیو ایکٹ ۱۹۶۷ کی دفعات ۴۵ / ۵۳ کے تحت ریکارڈِ مالیت کی درستگی کی درخواست",
    demarcation: "لینڈ ریونیو ایکٹ ۱۹۶۷ کی دفعہ ۱۱۷ کے تحت حد بندی کی درخواست",
    ejectment: "لینڈ ریونیو ایکٹ ۱۹۶۷ کی دفعات ۸۵ / ۱۲۲ کے تحت بے دخلی / قبضہ کی درخواست",
    mutation: "لینڈ ریونیو ایکٹ ۱۹۶۷ کی دفعہ ۴۲ کے تحت انتقال کے تنازع کی درخواست",
    "agri-partition": "لینڈ ریونیو ایکٹ ۱۹۶۷ کی دفعہ ۱۳۵ کے تحت زرعی تقسیم کی درخواست",
  };

  return withPetitionLanguage(
    {
      ...draft,
      courtLine: `بخدمت جناب ${blank(form.forum)}، ${blank(form.district)}`,
      suitLine: `ریونیو درخواست نمبر ___________ / ${year}`,
      causeTitle: titleUr[form.appType],
      shewethLabel: chrome.sheweth,
      prayerHeading: chrome.prayer,
      paragraphs: [
        `۱۔ یہ کہ درخواست گزار ${blank(form.applicantName)} ${blank(form.applicantParentage)}، سکونتی ${blank(form.applicantAddress)}، موضع ${blank(form.mauza)}، تحصیل ${blank(form.tehsil)}، ضلع ${blank(form.district)} میں واقع زمین کا شریک / مفاد رکھنے والا شخص ہے۔`,
        `۲۔ یہ کہ مذکورہ زمین خسرہ نمبر ${blank(form.khasra)} پر مشتمل ہے اور درخواست گزار کا حصہ ${blank(form.share)} ہے۔`,
        `۳۔ یہ کہ مادی حقائق یہ ہیں کہ ${blank(form.facts)}۔`,
        `۴۔ یہ کہ فردِ ملکیت / جمع بندی، خسرہ گرداوری اور عکسی شجرہ ہمراہ پیش کیے جائیں گے / کیے گئے ہیں۔`,
        `۵۔ یہ کہ معاملہ پٹواری / کاننگو کی تصدیق اور موقعہ معائنہ کے ذریعے آگے بڑھایا جا سکتا ہے۔`,
        form.appType === "agri-partition"
          ? `۶۔ یہ کہ درخواست گزار بطور شریکِ کھاتہ نقشہ الف / بے / جیم کی تیاری اور سندِ تقسیم کا طالب ہے۔`
          : `۶۔ یہ کہ انصاف کے تقاضے درخواست کی منظوری کے متقاضی ہیں۔`,
      ],
      prayerIntro: "لہٰذا استدعا ہے کہ:",
      prayerItems: [
        form.relief.trim() ||
          "درخواست منظور کر کے قانون کے مطابق ضروری ریونیو کارروائی / حکم صادر فرمایا جائے۔",
        form.appType === "agri-partition"
          ? "نقشہ الف، بے اور جیم تیار کیے جائیں اور باقاعدہ کارروائی کے بعد سندِ تقسیم جاری کی جائے۔"
          : "ضرورت پڑنے پر فیلڈ تصدیق و موقعہ معائنہ کا حکم دیا جائے۔",
        "کوئی اور مناسب حکم جو اتھارٹی مناسب سمجھے صادر فرمایا جائے۔",
      ],
      verificationText: `تصدیق بذریعہ حلف بمقام ${blank(form.district)} مورخہ ${formatLongDate(form.verificationDate)} کہ مندرجات درخواست صحیح و درست ہیں۔`,
    },
    "ur",
  );
}

/* ─── Family draft overlay helpers used by family.ts callers ─── */

export function familyCauseTitleUrdu(suitType: FamilyForm["suitType"]): string {
  switch (suitType) {
    case "khula":
      return "دعویٰ برائے تنسیخِ نکاح بطریقِ خلع";
    case "dower-maintenance":
      return "دعویٰ برائے حصولِ مہر و نان و نفقہ ماضی و مستقبل";
    case "dowry":
      return "دعویٰ برائے دلا پانے سامانِ جہیز و بری جائیداد یا مالیت زرِ نقد";
    case "custody":
      return "درخواست برائے حضانت / سرپرستی (گارڈینز اینڈ وارڈز ایکٹ)";
    case "restitution":
      return "دعویٰ برائے بحالی حقوق زوجیت";
    case "maintenance-only":
      return "دعویٰ برائے نان و نفقہ ماضی و مستقبل";
    default:
      return "فیملی مقدمہ";
  }
}

export function familyDraftChromeUrdu<
  T extends {
    courtLine: string;
    suitLine: string;
    leftRole: string;
    rightRole: string;
    signRole: string;
    causeTitle: string;
    prayerIntro: string;
    verificationText: string;
    paragraphs: string[];
    prayerItems: string[];
  },
>(draft: T, form: FamilyForm): T {
  const year = suitYear(form.verificationDate);
  const suitNo = form.suitNumber.trim() || "___________";
  return {
    ...draft,
    courtLine: `عدالت جناب فیملی جج صاحب، ${blank(form.courtLocation)}`,
    suitLine: `فیملی مقدمہ نمبر ${suitNo} / ${year}`,
    leftRole: localizeRole("PLAINTIFF", "ur"),
    rightRole: localizeRole("DEFENDANT", "ur"),
    signRole: localizeRole("PLAINTIFF", "ur"),
    causeTitle: familyCauseTitleUrdu(form.suitType),
    prayerIntro:
      "لہٰذا استدعا ہے کہ یہ عدالت گرامی مدعیہ کے حق میں مدعا علیہ کے خلاف درج ذیل ڈگری / حکم صادر فرمائے:",
    verificationText: `تصدیق بذریعہ حلف بمقام ${blank(form.courtLocation)} مورخہ ${formatLongDate(form.verificationDate)} کہ مندرجات صحیح و درست ہیں جو میرے علم و یقین کے مطابق ہیں۔`,
  };
}

export function familyParagraphsUrdu(form: FamilyForm, totalDowry?: string): string[] {
  if (form.suitType === "khula") {
    return [
      `۱۔ یہ کہ رشتہ ازدواج مابین مدعیہ اور مدعا علیہ مورخہ ${formatLongDate(form.marriageDate)} کو بمطابق شرع محمدیؐ منعقد ہوا تھا۔ نکاح نامہ ہمراہ منسلک ہے۔`,
      `۲۔ یہ کہ ازواجی تعلق سے ${blank(form.childrenCount)} اولاد پیدا ہوئی جن کے اسماء ${blank(form.childrenDetails)} ہیں۔`,
      `۳۔ یہ کہ نکاح کے بعد مدعا علیہ کا رویہ ظالمانہ و غیر ذمہ دارانہ ہو گیا یہاں تک کہ ${blank(form.abuseDescription)}۔`,
      `۴۔ یہ کہ مدعا علیہ مورخہ ${formatLongDate(form.abandonmentDate)} سے مدعیہ کا نان و نفقہ اور مالی و جذباتی تعاون فراہم کرنے میں ناکام ہے۔`,
      `۵۔ یہ کہ مسلسل ذہنی اذیت و نفرت کے باعث مدعیہ کو مدعا علیہ سے شدید نفرت پیدا ہو چکی ہے اور حدودِ اللہ میں رہتے ہوئے ازدواجی زندگی ناممکن ہے۔`,
      `۶۔ یہ کہ مدعیہ خلع کے عوض مؤخر مہر سے دستبردار / عجل مہر واپس کرنے پر تیار ہے۔`,
      `۷۔ یہ کہ سببِ دعویٰ مورخہ ${formatLongDate(form.causeDate)} کو پیدا ہوا اور مدعیہ اس وقت ${blank(form.courtLocation)} میں مقیم ہے۔`,
      `۸۔ یہ کہ مناسب کورٹ فیس چسپاں کی گئی ہے۔`,
    ];
  }
  if (form.suitType === "dower-maintenance") {
    return [
      `۱۔ یہ کہ نکاح مورخہ ${formatLongDate(form.marriageDate)} کو بمقابلہ مہر ${blank(form.totalDowerAmount)} منعقد ہوا۔`,
      `۲۔ یہ کہ ازواجی تعلق سے ${blank(form.childrenCount)} اولاد پیدا ہوئی: ${blank(form.childrenDetails)}۔`,
      `۳۔ یہ کہ نکاح نامہ کے مطابق مہر ${blank(form.dowerType)} طے ہوا جس میں سے ${blank(form.dowerPaidStatus)}۔`,
      `۴۔ یہ کہ مورخہ ${formatLongDate(form.abandonmentDate)} کو مدعا علیہ نے مدعیہ و نابالغ بچوں کو زوجی گھر سے بے دخل کر دیا۔`,
      `۵۔ یہ کہ مورخہ ${formatLongDate(form.maintenanceStoppedDate)} سے نان و نفقہ بند ہے؛ مدعا علیہ ${blank(form.defendantOccupation)} کرتا / ماہانہ آمدن تقریباً ${formatPkr(form.defendantIncome)} روپے ہے۔`,
      `۶۔ یہ کہ نابالغ بچے ${blank(form.schoolName)} میں زیر تعلیم ہیں جن کا ماہانہ خرچ ${formatPkr(form.schoolExpense)} روپے ہے۔`,
      `۷۔ یہ کہ مدعیہ نان و نفقہ ماضی از ${formatLongDate(form.pastStart)} تا ${formatLongDate(form.pastEnd)} بمادہ ${formatPkr(form.pastRate)} روپے اور مستقبل بمادہ ${formatPkr(form.futureRate)} روپے مع دس فیصد سالانہ اضافہ کا مطالبہ کرتی ہے۔`,
      `۸۔ یہ کہ سببِ دعویٰ مورخہ ${formatLongDate(form.causeDate)} کو پیدا ہوا۔`,
      `۹۔ یہ کہ مناسب کورٹ فیس چسپاں کی گئی ہے۔`,
    ];
  }
  if (form.suitType === "dowry") {
    return [
      `۱۔ یہ کہ نکاح مورخہ ${formatLongDate(form.marriageDate)} کو بمطابق شرع محمدیؐ منعقد ہوا۔`,
      `۲۔ یہ کہ وقتِ نکاح والدینِ مدعیہ نے قیمتی سامانِ جہیز مدعا علیہ کے سپرد کیا جس کی تفصیل Annexure-B میں ہے۔`,
      `۳۔ یہ کہ مدعا علیہ و اہلِ خانہ نے بری / تحائف ${blank(form.bariGoldWeight)} بھی دیے جو مدعیہ کی ملکیتِ خالص ہیں۔`,
      `۴۔ یہ کہ مورخہ ${formatLongDate(form.abandonmentDate)} کو بے دخلی کے وقت مدعا علیہ نے تمام سامان غیر قانونی طور پر روک لیا۔`,
      `۵۔ یہ کہ غیر موصول سامان کی تخمینی مالیت بمطابق مارکیٹ ریٹ ${totalDowry || blank(form.totalDowryValue)} روپے ہے۔`,
      `۶۔ یہ کہ سببِ دعویٰ مورخہ ${formatLongDate(form.causeDate)} کو پیدا ہوا۔`,
      `۷۔ یہ کہ مناسب کورٹ فیس چسپاں کی گئی ہے۔`,
    ];
  }
  return [
    `۱۔ یہ کہ فریقین کے مابین قانونی رشتہ / معاملہ موجود ہے۔`,
    `۲۔ یہ کہ سببِ دعویٰ مورخہ ${formatLongDate(form.causeDate)} کو پیدا ہوا۔`,
    `۳۔ یہ کہ یہ عدالت مجاز ہے اور مناسب کورٹ فیس چسپاں کی گئی ہے۔`,
  ];
}
