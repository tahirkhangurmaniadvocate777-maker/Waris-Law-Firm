import { firm } from "@/lib/firm";
import { formatLongDate, suitYear, textOrBlank, todayIso } from "@/lib/format";

export {
  buildRevenuePartitionDraft,
  emptyPartitionAppData,
  formatRespondentNamesList,
  missingPartitionFields,
  partitionIsValid,
  respondentsFromNamesCsv,
  respondentsToNamesCsv,
  validatePartitionAppData,
  PARTITION_REQUIRED_LABELS,
  type PartitionAppData,
  type PartitionRequiredField,
  type PartitionRespondent,
  type PartitionValidationErrors,
} from "@/lib/revenuePartition";
export {
  REVENUE_CITATIONS,
  appendCitationToGrounds,
  type RevenueCitation,
} from "@/lib/revenueCitations";

export type RevenueType =
  | "correction"
  | "demarcation"
  | "ejectment"
  | "mutation"
  | "agri-partition";

export const revenueOptions: { id: RevenueType; label: string }[] = [
  { id: "correction", label: "Correction of revenue record (Sec. 45 / 53 LRA)" },
  { id: "demarcation", label: "Demarcation / Hadd Bandi (Sec. 117 LRA)" },
  { id: "ejectment", label: "Ejectment / possession (Sec. 85 / 122 LRA)" },
  { id: "mutation", label: "Mutation / Intiqal dispute (Sec. 42 LRA)" },
  { id: "agri-partition", label: "Partition of agricultural land (Sec. 135 LRA)" },
];

export type RevenueForm = {
  appType: RevenueType;
  forum: string;
  district: string;
  tehsil: string;
  mauza: string;
  applicantName: string;
  applicantParentage: string;
  applicantAddress: string;
  respondents: string;
  khasra: string;
  share: string;
  facts: string;
  relief: string;
  lawyerName: string;
  verificationDate: string;
  /** Optional PLD / authority citations under Grounds. */
  pld_citations: string[];
};

export function emptyRevenueForm(): RevenueForm {
  return {
    appType: "correction",
    forum: "Tehsildar / Assistant Commissioner / Collector",
    district: firm.defaultCourt,
    tehsil: "",
    mauza: "",
    applicantName: "",
    applicantParentage: "",
    applicantAddress: "",
    respondents: "",
    khasra: "",
    share: "",
    facts: "",
    relief: "",
    lawyerName: firm.advocate,
    verificationDate: todayIso(),
    pld_citations: [],
  };
}

function titleFor(type: RevenueType) {
  switch (type) {
    case "correction":
      return "APPLICATION FOR CORRECTION OF REVENUE RECORD UNDER SECTIONS 45 / 53 OF THE LAND REVENUE ACT, 1967";
    case "demarcation":
      return "APPLICATION FOR DEMARCATION (HADD BANDI) UNDER SECTION 117 OF THE LAND REVENUE ACT, 1967";
    case "ejectment":
      return "APPLICATION FOR EJECTMENT / POSSESSION UNDER SECTIONS 85 / 122 OF THE LAND REVENUE ACT, 1967";
    case "mutation":
      return "APPLICATION REGARDING MUTATION (INTIQAL) UNDER SECTION 42 OF THE LAND REVENUE ACT, 1967";
    case "agri-partition":
      return "APPLICATION FOR PARTITION OF AGRICULTURAL LAND UNDER SECTION 135 OF THE LAND REVENUE ACT, 1967";
  }
}

export function buildRevenueDraft(form: RevenueForm) {
  const year = suitYear(form.verificationDate);
  const paragraphs = [
    `1. That the applicant is ${textOrBlank(form.applicantName)} ${textOrBlank(form.applicantParentage)}, resident of ${textOrBlank(form.applicantAddress)}, and is a joint owner / interested person in the land situated in Mauza ${textOrBlank(form.mauza)}, Tehsil ${textOrBlank(form.tehsil)}, District ${textOrBlank(form.district)}.`,
    `2. That the land in question bears Khasra No(s). ${textOrBlank(form.khasra)} and the applicant's share is ${textOrBlank(form.share)}.`,
    `3. That the material facts are that ${textOrBlank(form.facts)}.`,
    "4. That copies of Fard Malkiyat / Jamabandi, Khasra Girdawari, and Aksi Shajra are attached / shall be produced.",
    "5. That the matter may proceed through Collector report, field verification by Patwari/Kanungo, and spot inspection as required, with appeal/revision available under Sections 161–164 LRA.",
  ];

  if (form.appType === "agri-partition") {
    paragraphs.push(
      "6. That the applicant seeks partition as Sharik-e-Khata and preparation of Naksha Alif, Naksha Be (Tareeqa-e-Takseem), and Naksha Jeem (Sanad-e-Takseem), culminating in an Instrument of Partition under Section 145 LRA.",
      "7. That if any dispute as to title arises, proceedings may be stayed under Section 141 LRA and parties directed to the Civil Court.",
    );
  } else {
    paragraphs.push("6. That the ends of justice require acceptance of this application.");
  }

  return {
    courtLine: `BEFORE THE ${textOrBlank(form.forum).toUpperCase()}, ${textOrBlank(form.district).toUpperCase()}`,
    suitLine: `Revenue Application No. ___________ / ${year}`,
    leftParty: [
      `${textOrBlank(form.applicantName)} ${textOrBlank(form.applicantParentage)}`,
      `R/o ${textOrBlank(form.applicantAddress)}`,
    ],
    leftRole: "APPLICANT",
    rightParty: [textOrBlank(form.respondents || "Concerned co-sharers / respondents")],
    rightRole: "RESPONDENTS",
    causeTitle: titleFor(form.appType),
    paragraphs,
    prayerIntro: "It is, therefore, respectfully prayed that:",
    prayerItems: [
      form.relief.trim() ||
        "The application may kindly be accepted and necessary revenue proceedings / orders may be passed according to law.",
      form.appType === "agri-partition"
        ? "Naksha Alif, Be, and Jeem may be prepared and Instrument of Partition issued after due process."
        : "Field verification and spot inspection may be ordered if required.",
      "Any other relief which the Authority deems fit may also be granted.",
    ],
    signRole: "APPLICANT",
    lawyerName: textOrBlank(form.lawyerName),
    verificationText: `Verified on Oath at ${textOrBlank(form.district)} on this ${formatLongDate(form.verificationDate)}, that the contents of this application are true and correct to the best of my knowledge and belief.`,
  };
}
