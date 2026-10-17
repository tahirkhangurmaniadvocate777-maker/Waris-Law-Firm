import { firm } from "@/lib/firm";
import {
  formatLongDate,
  formatPkr,
  parseAmount,
  suitYear,
  textOrBlank,
  todayIso,
} from "@/lib/format";
import type { DraftLanguage } from "@/lib/language";
import {
  familyDraftChromeUrdu,
  familyParagraphsUrdu,
} from "@/lib/urduDraft";

export type FamilySuitType =
  | "khula"
  | "dower-maintenance"
  | "dowry"
  | "custody"
  | "restitution"
  | "maintenance-only";

export const familySuitOptions: { id: FamilySuitType; label: string }[] = [
  { id: "khula", label: "Dissolution of marriage / Khula" },
  { id: "dower-maintenance", label: "Recovery of dower (Mahr) & past/future maintenance" },
  { id: "maintenance-only", label: "Past & future maintenance (plaintiff and minors)" },
  { id: "dowry", label: "Recovery of dowry articles & bridal gifts (+ Annexure-B)" },
  { id: "custody", label: "Custody of minors (Sec. 25 Guardians & Wards Act)" },
  { id: "restitution", label: "Restitution of conjugal rights" },
];

export type FamilyForm = {
  suitType: FamilySuitType;
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
  abuseDescription: string;
  abandonmentDate: string;
  causeDate: string;
  totalDowerAmount: string;
  dowerType: string;
  dowerPaidStatus: string;
  maintenanceStoppedDate: string;
  defendantOccupation: string;
  defendantIncome: string;
  schoolName: string;
  schoolExpense: string;
  pastStart: string;
  pastEnd: string;
  pastRate: string;
  futureRate: string;
  totalPast: string;
  wifeFutureRate: string;
  childFutureRate: string;
  dowerDescription: string;
  bariGoldWeight: string;
  totalDowryValue: string;
  furnitureDesc: string;
  furnitureValue: string;
  electronicsDesc: string;
  electronicsValue: string;
  washingDesc: string;
  washingValue: string;
  goldDesc: string;
  goldQty: string;
  goldValue: string;
  crockeryDesc: string;
  crockeryValue: string;
  beddingDesc: string;
  beddingQty: string;
  beddingValue: string;
  clothesDesc: string;
  clothesQty: string;
  clothesValue: string;
  miscDesc: string;
  miscValue: string;
  bariGoldDesc: string;
  bariGoldQty: string;
  bariGoldValue: string;
  bariDressesDesc: string;
  bariDressesValue: string;
  custodyLossDate: string;
  departureDate: string;
  panchayatDate: string;
  lawyerName: string;
  verificationDate: string;
};

export function emptyFamilyForm(): FamilyForm {
  return {
    suitType: "khula",
    courtLocation: firm.defaultCourt,
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
    abuseDescription: "",
    abandonmentDate: "",
    causeDate: "",
    totalDowerAmount: "",
    dowerType: "Deferred (Mu'awjjal)",
    dowerPaidStatus: "nothing has been paid",
    maintenanceStoppedDate: "",
    defendantOccupation: "",
    defendantIncome: "",
    schoolName: "",
    schoolExpense: "",
    pastStart: "",
    pastEnd: "",
    pastRate: "",
    futureRate: "",
    totalPast: "",
    wifeFutureRate: "",
    childFutureRate: "",
    dowerDescription: "",
    bariGoldWeight: "",
    totalDowryValue: "",
    furnitureDesc: "",
    furnitureValue: "",
    electronicsDesc: "",
    electronicsValue: "",
    washingDesc: "",
    washingValue: "",
    goldDesc: "",
    goldQty: "",
    goldValue: "",
    crockeryDesc: "",
    crockeryValue: "",
    beddingDesc: "",
    beddingQty: "",
    beddingValue: "",
    clothesDesc: "",
    clothesQty: "",
    clothesValue: "",
    miscDesc: "",
    miscValue: "",
    bariGoldDesc: "",
    bariGoldQty: "",
    bariGoldValue: "",
    bariDressesDesc: "",
    bariDressesValue: "",
    custodyLossDate: "",
    departureDate: "",
    panchayatDate: "",
    lawyerName: firm.advocate,
    verificationDate: todayIso(),
  };
}

function partyBlock(form: FamilyForm, role: "plaintiff" | "defendant") {
  if (role === "plaintiff") {
    return [
      `${textOrBlank(form.plaintiffName)} ${textOrBlank(form.plaintiffRelation)}`,
      `Resident of: ${textOrBlank(form.plaintiffAddress)}`,
      `Cell No: ${textOrBlank(form.plaintiffPhone)}`,
    ];
  }
  return [
    `${textOrBlank(form.defendantName)} ${textOrBlank(form.defendantRelation)}`,
    `Resident of: ${textOrBlank(form.defendantAddress)}`,
    `Cell No: ${textOrBlank(form.defendantPhone)}`,
  ];
}

/** Live Annexure-B inventory row (matches FamilyAnnexureBLoop DowryItem). */
export type FamilyDowryItem = {
  id: string;
  description: string;
  quantity: number;
  estimatedValue: number;
};

export type FamilyAnnexureItems = {
  jahez: FamilyDowryItem[];
  bari: FamilyDowryItem[];
};

export function annexureTotals(form: FamilyForm) {
  const jahez =
    parseAmount(form.furnitureValue) +
    parseAmount(form.electronicsValue) +
    parseAmount(form.washingValue) +
    parseAmount(form.goldValue) +
    parseAmount(form.crockeryValue) +
    parseAmount(form.beddingValue) +
    parseAmount(form.clothesValue) +
    parseAmount(form.miscValue);
  const bari = parseAmount(form.bariGoldValue) + parseAmount(form.bariDressesValue);
  return { jahez, bari, grand: jahez + bari };
}

export function annexureTotalsFromItems(items: FamilyAnnexureItems) {
  const jahez = items.jahez.reduce(
    (sum, item) => sum + item.estimatedValue * item.quantity,
    0,
  );
  const bari = items.bari.reduce(
    (sum, item) => sum + item.estimatedValue * item.quantity,
    0,
  );
  return { jahez, bari, grand: jahez + bari };
}

export function buildFamilyDraft(
  form: FamilyForm,
  options?: { annexureItems?: FamilyAnnexureItems; language?: DraftLanguage },
) {
  const language = options?.language ?? "en";
  const year = suitYear(form.verificationDate);
  const suitNo = form.suitNumber.trim() || "___________";
  const courtLine = `IN THE COURT OF THE LEARNED FAMILY JUDGE, ${textOrBlank(form.courtLocation)}`;

  const localize = <T extends {
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
  }>(draft: T): T => {
    if (language !== "ur") return draft;
    const totalsHint =
      form.suitType === "dowry"
        ? formatPkr(form.totalDowryValue)
        : undefined;
    const chrome = familyDraftChromeUrdu(draft, form);
    return {
      ...chrome,
      paragraphs: familyParagraphsUrdu(form, totalsHint),
      prayerItems:
        form.suitType === "khula"
          ? [
              "مدعیہ کے حق میں مدعا علیہ کے خلاف خلع کی بنیاد پر تنسیخِ نکاح کی ڈگری صادر کی جائے۔",
              "کوئی اور مناسب ریلیف جو عدالت مناسب سمجھے عطا کیا جائے۔",
            ]
          : form.suitType === "dower-maintenance"
            ? [
                `نکاح نامہ کے مطابق بقایا مہر ${textOrBlank(form.dowerDescription)} دلایا جائے۔`,
                `نان و نفقہ ماضی بمبلغ ${formatPkr(form.totalPast)} روپے دلایا جائے۔`,
                `مستقبل میں نان و نفقہ مدعیہ بمادہ ${formatPkr(form.wifeFutureRate)} اور ہر نابالغ بمادہ ${formatPkr(form.childFutureRate)} روپے مع دس فیصد سالانہ اضافہ مقرر کیا جائے۔`,
                "کوئی اور مناسب ریلیف عطا کیا جائے۔",
              ]
            : form.suitType === "dowry"
              ? [
                  `سامانِ جہیز و بری یا متبادل مالیت ${totalsHint || formatPkr(form.totalDowryValue)} روپے دلائی جائے۔`,
                  "کوئی اور مناسب ریلیف عطا کیا جائے۔",
                ]
              : draft.prayerItems,
    };
  };

  if (form.suitType === "khula") {
    return localize({
      courtLine,
      suitLine: `Family Suit No. ${suitNo} / ${year}`,
      leftParty: partyBlock(form, "plaintiff"),
      leftRole: "PLAINTIFF",
      rightParty: partyBlock(form, "defendant"),
      rightRole: "DEFENDANT",
      causeTitle: "SUIT FOR DISSOLUTION OF MARRIAGE ON THE BASIS OF KHULA",
      paragraphs: [
        `1. That the marriage between the Plaintiff and the Defendant was solemnized on ${formatLongDate(form.marriageDate)} according to Muslim Rites and Shariah laws. A copy of the Nikahnama is attached herewith.`,
        `2. That out of the wedlock, ${textOrBlank(form.childrenCount)} child/children were born, namely ${textOrBlank(form.childrenDetails)}.`,
        `3. That the behavior of the Defendant towards the Plaintiff became cruel, abusive, and non-serious soon after the marriage, to the extent that ${textOrBlank(form.abuseDescription)}.`,
        `4. That the Defendant has failed to maintain the Plaintiff or provide any financial or emotional support since ${formatLongDate(form.abandonmentDate)}.`,
        "5. That due to the continuous mental torture, physical abuse, and deep hatred created by the Defendant's conduct, the Plaintiff has developed a fixed aversion toward the Defendant and it is completely impossible for her to live with him within the limits prescribed by Allah Almighty.",
        "6. That the Plaintiff is fully ready to forgo her right to deferred dower or return prompt dower received in lieu of obtaining a decree for Khula.",
        `7. That the cause of action arose on ${formatLongDate(form.causeDate)} when the final dispute occurred and the Defendant flatly refused to mend his ways, and within ${textOrBlank(form.courtLocation)} where the Plaintiff currently resides.`,
        "8. That the proper court fee has been affixed on the plaint.",
      ],
      prayerIntro:
        "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favor of the Plaintiff against the Defendant for:",
      prayerItems: [
        "A decree for the Dissolution of Marriage on the basis of Khula may graciously be passed in favor of the Plaintiff against the Defendant.",
        "Any other relief which this Honorable Court deems fit and proper under the circumstances may also be awarded.",
      ],
      signRole: "PLAINTIFF",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: `Verified on Oath at ${textOrBlank(form.courtLocation)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 8 are true and correct to the best of my knowledge and belief, and the rest are based on information received.`,
      annexure: null as null | ReturnType<typeof buildAnnexure>,
    });
  }

  if (form.suitType === "dower-maintenance") {
    return localize({
      courtLine,
      suitLine: `Family Suit No. ${suitNo} / ${year}`,
      leftParty: partyBlock(form, "plaintiff"),
      leftRole: "PLAINTIFF",
      rightParty: partyBlock(form, "defendant"),
      rightRole: "DEFENDANT",
      causeTitle:
        "SUIT FOR THE RECOVERY OF DOWER AND PAST AND FUTURE MAINTENANCE FOR THE PLAINTIFF AND MINORS",
      paragraphs: [
        `1. That the marriage between the Plaintiff and the Defendant was solemnized on ${formatLongDate(form.marriageDate)} according to Muslim Rites and Shariah laws against a fixed dower amount of ${textOrBlank(form.totalDowerAmount)}. A copy of the Nikahnama is attached herewith.`,
        `2. That out of the wedlock, ${textOrBlank(form.childrenCount)} child/children were born, namely ${textOrBlank(form.childrenDetails)}.`,
        `3. That as per Column No. 13 to 16 of the Nikahnama, the dower was fixed as ${textOrBlank(form.dowerType)} out of which ${textOrBlank(form.dowerPaidStatus)}. The Defendant explicitly promised to hand over the dower upon demand but has completely failed to clear his legal obligation.`,
        `4. That the behavior of the Defendant towards the Plaintiff became cruel and abusive soon after the marriage. Ultimately, on ${formatLongDate(form.abandonmentDate)}, the Defendant forcibly ousted the Plaintiff along with the minor children from the matrimonial home.`,
        `5. That the Defendant has failed to maintain the Plaintiff or provide any financial or daily sustenance for the minor children since ${formatLongDate(form.maintenanceStoppedDate)}. The Plaintiff has no independent source of income, whereas the Defendant is running a business of ${textOrBlank(form.defendantOccupation)} / earning a monthly salary of PKR ${formatPkr(form.defendantIncome)}.`,
        `6. That the minor children are studying at ${textOrBlank(form.schoolName)} incurring monthly expenses of PKR ${formatPkr(form.schoolExpense)}.`,
        `7. That the Plaintiff claims past maintenance from ${formatLongDate(form.pastStart)} to ${formatLongDate(form.pastEnd)} at the rate of PKR ${formatPkr(form.pastRate)} per month, and future maintenance at the rate of PKR ${formatPkr(form.futureRate)} per month with a 10% annual increase.`,
        `8. That the cause of action arose on ${formatLongDate(form.causeDate)} when the final demand for Dower and Maintenance was flatly refused by the Defendant.`,
        "9. That the proper court fee has been affixed on the plaint.",
      ],
      prayerIntro:
        "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favor of the Plaintiff against the Defendant for:",
      prayerItems: [
        `The recovery of outstanding Dower (Mahr) as per the Nikahnama, comprising ${textOrBlank(form.dowerDescription)}.`,
        `Past maintenance for the Plaintiff and minor children totaling PKR ${formatPkr(form.totalPast)}.`,
        `Future monthly maintenance for the Plaintiff at PKR ${formatPkr(form.wifeFutureRate)} and for each minor child at PKR ${formatPkr(form.childFutureRate)} per month with a 10% annual increment.`,
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "PLAINTIFF",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: `Verified on Oath at ${textOrBlank(form.courtLocation)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 9 are true and correct to the best of my knowledge and belief, and the rest are based on information received.`,
      annexure: null,
    });
  }

  if (form.suitType === "dowry") {
    const liveItems = options?.annexureItems;
    const totals = liveItems
      ? annexureTotalsFromItems(liveItems)
      : annexureTotals(form);
    const totalDowry = form.totalDowryValue.trim()
      ? formatPkr(form.totalDowryValue)
      : formatPkr(String(totals.jahez || ""));
    return localize({
      courtLine,
      suitLine: `Family Suit No. ${suitNo} / ${year}`,
      leftParty: partyBlock(form, "plaintiff"),
      leftRole: "PLAINTIFF",
      rightParty: partyBlock(form, "defendant"),
      rightRole: "DEFENDANT",
      causeTitle: "SUIT FOR THE RECOVERY OF DOWRY ARTICLES AND BRIDAL GIFTS OR VALUE THEREOF",
      paragraphs: [
        `1. That the marriage between the Plaintiff and the Defendant was solemnized on ${formatLongDate(form.marriageDate)} according to Muslim Rites.`,
        "2. That at the time of marriage, the parents of the Plaintiff handed over valuable dowry articles (Jahez) including furniture, electronics, and gold ornaments to the Defendant, details of which are explicitly recorded in the attached list (Annexure-B).",
        `3. That the Defendant and his family also gifted bridal items (Bari) totaling ${textOrBlank(form.bariGoldWeight)} to the Plaintiff which is her absolute property.`,
        `4. That when the Plaintiff was ousted from the house on ${formatLongDate(form.abandonmentDate)}, the Defendant forcibly retained all the dowry articles and jewelry in his custody and refused to return them despite repeated demands.`,
        `5. That the total estimated value of the unrecovered dowry articles at current market rates is PKR ${totalDowry}.`,
        `6. That the cause of action arose on ${formatLongDate(form.causeDate)} when the Defendant flatly refused to return the items upon final demand, within the jurisdiction of this court.`,
        "7. That the proper court fee has been affixed on the plaint.",
      ],
      prayerIntro:
        "It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree in favor of the Plaintiff against the Defendant for:",
      prayerItems: [
        `The recovery of dowry articles and bridal gifts as per the attached list, or in the alternative, the total market value thereof amounting to PKR ${formatPkr(String(totals.grand || form.totalDowryValue))}.`,
        "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
      ],
      signRole: "PLAINTIFF",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: `Verified on Oath at ${textOrBlank(form.courtLocation)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 7 are true and correct to the best of my knowledge and belief, and the rest are based on information received.`,
      annexure: liveItems
        ? buildAnnexureFromItems(form, liveItems)
        : buildAnnexure(form),
    });
  }

  if (form.suitType === "custody") {
    return localize({
      courtLine: `IN THE COURT OF THE LEARNED FAMILY JUDGE / GUARDIAN JUDGE, ${textOrBlank(form.courtLocation)}`,
      suitLine: `Guardian Petition No. ${suitNo} / ${year}`,
      leftParty: partyBlock(form, "plaintiff"),
      leftRole: "PETITIONER",
      rightParty: partyBlock(form, "defendant"),
      rightRole: "RESPONDENT",
      causeTitle:
        "PETITION UNDER SECTION 25 OF THE GUARDIANS AND WARDS ACT, 1890 FOR THE RECOVERY OF CUSTODY OF MINORS",
      paragraphs: [
        `1. That the Petitioner and the Respondent were married on ${formatLongDate(form.marriageDate)} and out of the wedlock, minor children namely ${textOrBlank(form.childrenDetails)} were born.`,
        `2. That the parties are now living separately / divorced, and the minor children are currently in the forced and illegal custody of the Respondent since ${formatLongDate(form.custodyLossDate)}.`,
        "3. That the Petitioner (mother) is legally entitled to the physical custody (Hizanat) of the minors due to their tender age.",
        "4. That the Respondent is an irresponsible individual, stays out for work all day, and there is no female house member to look after the emotional, mental, and physical well-being of the minors.",
        "5. That the welfare of the minors, which is the paramount consideration of law, lies exclusively with the mother, who can provide a safe, nurturing, and moral educational environment.",
        `6. That the cause of action arose on ${formatLongDate(form.causeDate)} when the Respondent refused to return custody, within the territorial jurisdiction of this Honorable Court where the minors currently reside.`,
      ],
      prayerIntro: "It is, therefore, respectfully prayed that this Honorable Court may graciously accept this petition and:",
      prayerItems: [
        "Direct the Respondent to hand over the permanent physical custody of the minors to the Petitioner.",
        "Grant any other relief which this Honorable Court deems fit and proper.",
      ],
      signRole: "PETITIONER",
      lawyerName: textOrBlank(form.lawyerName),
      verificationText: `Verified on Oath at ${textOrBlank(form.courtLocation)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 6 are true and correct to the best of my knowledge and belief, and the rest are based on information received.`,
      annexure: null,
    });
  }

  // restitution
  return localize({
    courtLine,
    suitLine: `Family Suit No. ${suitNo} / ${year}`,
    leftParty: partyBlock(form, "plaintiff"),
    leftRole: "PLAINTIFF",
    rightParty: partyBlock(form, "defendant"),
    rightRole: "DEFENDANT",
    causeTitle: "SUIT FOR RESTITUTION OF CONJUGAL RIGHTS",
    paragraphs: [
      `1. That the Plaintiff lawfully married the Defendant on ${formatLongDate(form.marriageDate)} according to Muslim Rites and Shariah laws. A copy of the Nikahnama is attached herewith.`,
      "2. That the Plaintiff has always performed his marital obligations with love and care, providing a comfortable home and financial maintenance to the Defendant.",
      `3. That on ${formatLongDate(form.departureDate)}, under the undue influence and instigation of her parents, the Defendant left the matrimonial home without any lawful justification, carrying away personal ornaments.`,
      `4. That the Plaintiff took a formal family elders' delegation (Panchayat) to the Defendant's house on ${formatLongDate(form.panchayatDate)} to reconcile and bring her back, but the Defendant and her family flatly refused.`,
      "5. That the Plaintiff is still willing and ready to keep the Defendant in his house with absolute safety, respect, love, and dignity.",
      `6. That the cause of action arose on ${formatLongDate(form.causeDate)} when the Defendant finally refused to return to the matrimonial home, within the jurisdiction of this court.`,
      "7. That the proper court fee has been affixed on the plaint.",
    ],
    prayerIntro:
      "It is, therefore, respectfully prayed that a decree for Restitution of Conjugal Rights may graciously be passed in favor of the Plaintiff:",
    prayerItems: [
      "Directing the Defendant to return to the matrimonial home of the Plaintiff and live with him as a lawful wife.",
      "Any other relief which this Honorable Court deems fit and proper may also be awarded.",
    ],
    signRole: "PLAINTIFF",
    lawyerName: textOrBlank(form.lawyerName),
    verificationText: `Verified on Oath at ${textOrBlank(form.courtLocation)} on this ${formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 7 are true and correct to the best of my knowledge and belief, and the rest are based on information received.`,
    annexure: null,
  });
}

function buildAnnexure(form: FamilyForm) {
  const totals = annexureTotals(form);
  return {
    courtLocation: textOrBlank(form.courtLocation),
    plaintiffName: textOrBlank(form.plaintiffName),
    defendantName: textOrBlank(form.defendantName),
    rows: [
      ["1", textOrBlank(form.furnitureDesc), "1 Set", formatPkr(form.furnitureValue)],
      ["2", textOrBlank(form.electronicsDesc), "1 Unit", formatPkr(form.electronicsValue)],
      ["3", textOrBlank(form.washingDesc), "1 Unit", formatPkr(form.washingValue)],
      ["4", textOrBlank(form.goldDesc), textOrBlank(form.goldQty), formatPkr(form.goldValue)],
      ["5", textOrBlank(form.crockeryDesc), "1 Set", formatPkr(form.crockeryValue)],
      ["6", textOrBlank(form.beddingDesc), textOrBlank(form.beddingQty), formatPkr(form.beddingValue)],
      ["7", textOrBlank(form.clothesDesc), textOrBlank(form.clothesQty), formatPkr(form.clothesValue)],
      ["8", textOrBlank(form.miscDesc), "L/Sum", formatPkr(form.miscValue)],
    ],
    jahezTotal: formatPkr(String(totals.jahez || form.totalDowryValue)),
    bariRows: [
      ["9", textOrBlank(form.bariGoldDesc), textOrBlank(form.bariGoldQty), formatPkr(form.bariGoldValue)],
      ["10", textOrBlank(form.bariDressesDesc), "1 Set", formatPkr(form.bariDressesValue)],
    ],
    bariTotal: formatPkr(String(totals.bari)),
    grandTotal: formatPkr(String(totals.grand)),
    lawyerName: textOrBlank(form.lawyerName),
  };
}

/** Build Annexure-B rows from live FamilyAnnexureBLoop arrays. */
export function buildAnnexureFromItems(
  form: FamilyForm,
  items: FamilyAnnexureItems,
) {
  const totals = annexureTotalsFromItems(items);
  return {
    courtLocation: textOrBlank(form.courtLocation),
    plaintiffName: textOrBlank(form.plaintiffName),
    defendantName: textOrBlank(form.defendantName),
    rows: items.jahez.map((item, index) => [
      String(index + 1),
      textOrBlank(item.description),
      String(item.quantity),
      formatPkr(String(item.estimatedValue * item.quantity)),
    ]),
    jahezTotal: formatPkr(String(totals.jahez)),
    bariRows: items.bari.map((item, index) => [
      String(items.jahez.length + index + 1),
      textOrBlank(item.description),
      String(item.quantity),
      formatPkr(String(item.estimatedValue * item.quantity)),
    ]),
    bariTotal: formatPkr(String(totals.bari)),
    grandTotal: formatPkr(String(totals.grand)),
    lawyerName: textOrBlank(form.lawyerName),
  };
}
