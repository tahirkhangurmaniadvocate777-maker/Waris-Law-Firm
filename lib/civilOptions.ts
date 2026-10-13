export interface CivilSuitOption {
  id: string;
  label: string;
  statute: string;
  defaultFacts: string;
  defaultPrayer: string;
}

export const CIVIL_SUIT_OPTIONS: CivilSuitOption[] = [
  {
    id: "declaratory",
    label: "Suit for Declaration",
    statute: "Section 42, Specific Relief Act 1877",
    defaultFacts:
      "That the Plaintiff is the absolute owner in lawful possession of the suit property, but the Defendant is unlawfully attempting to alter public revenue entries / mutation logs to challenge the legal rights of the Plaintiff.",
    defaultPrayer:
      "A decree for declaration to the effect that the Plaintiff is the absolute and lawful owner in possession of the suit property, and that any mutation, entry, or document executed to the contrary is illegal, null, and void ab-initio.",
  },
  {
    id: "injunction",
    label: "Suit for Permanent & Mandatory Injunction",
    statute: "Sections 53-55, Specific Relief Act 1877",
    defaultFacts:
      "That the Defendant is a stranger to the suit property and has no legal title, but is aggressively interfering, threatening forcible dispossession, and attempting to raise illegal constructions over the suit land.",
    defaultPrayer:
      "A decree for permanent injunction restraining the Defendant, their agents, and assigns from interfering with the lawful possession of the Plaintiff, and from causing forcible dispossession or structural alterations.",
  },
  {
    id: "specific-performance",
    label: "Suit for Specific Performance of Contract",
    statute: "Section 12, Specific Relief Act 1877",
    defaultFacts:
      "That an agreement to sell was validly executed between the parties, and the Plaintiff paid the consideration amount. However, the Defendant is now evasive and refusing to execute the formal registered sale deed.",
    defaultPrayer:
      "A decree for specific performance of contract directing the Defendant to execute and register the formal sale deed in favor of the Plaintiff, failing which this Honourable Court may execute the same through an appointed local commissioner.",
  },
  {
    id: "possession-mesne",
    label: "Suit for Possession & Mesne Profits",
    statute: "Sections 8 & 9, Specific Relief Act 1877",
    defaultFacts:
      "That the Plaintiff was unlawfully and without their consent dispossessed by the Defendant from the suit property otherwise than in due course of law within the statutory limitation timeframe.",
    defaultPrayer:
      "A decree for recovery of physical possession of the suit property, along with mesne profits calculated from the date of illegal occupation up to the actual hand-over of vacant possession.",
  },
  {
    id: "cancellation-doc",
    label: "Suit for Cancellation of Documents",
    statute: "Section 39, Specific Relief Act 1877",
    defaultFacts:
      "That the contested mutation / gift deed / sale deed was obtained by the Defendant through active fraud, misrepresentation, impersonation, and without any valid consideration or consent of the true owner.",
    defaultPrayer:
      "A decree for cancellation of the contested fraudulent document/deed, ordering the same to be voided and directed to the Sub-Registrar / Tehsildar for structural removal from official records.",
  },
  {
    id: "urban-partition",
    label: "Suit for Urban / Built-up Property Partition",
    statute: "Partition Act 1893 (CPC Order XX Rule 18)",
    defaultFacts:
      "That the suit property is a joint urban built-up structure. Since a private partition is impossible without structural layout damage, the property needs evaluation for auction sale or internal distribution.",
    defaultPrayer:
      "A preliminary decree for partition fixing the legal shares of the parties, followed by the appointment of a local commission to separate the property or conduct an open auction for distribution of proceeds.",
  },
  {
    id: "damages",
    label: "Suit for Damages / Torts",
    statute: "Code of Civil Procedure, 1908 & general principles of tort",
    defaultFacts:
      "That by reason of the wrongful acts, negligence, and illegal conduct of the Defendant, the Plaintiff has suffered actionable injury, loss of reputation, and quantifiable pecuniary damage.",
    defaultPrayer:
      "A decree for damages / compensation in the sum claimed, together with costs of the suit and any further sum this Honourable Court deems just and equitable.",
  },
  {
    id: "other",
    label: "Other / Custom Suit Title",
    statute: "Code of Civil Procedure, 1908",
    defaultFacts:
      "That the material facts giving rise to the present cause of action are as set out in the following paragraphs, and the Plaintiff seeks the civil relief described in the prayer.",
    defaultPrayer:
      "A decree granting the civil relief claimed in the cause title, with costs, and any other relief this Honourable Court deems fit and proper.",
  },
];

export function getCivilSuitOption(id: string): CivilSuitOption | undefined {
  return CIVIL_SUIT_OPTIONS.find((s) => s.id === id);
}

export const CIVIL_PLAINT_MODE = "plaint" as const;
export const CIVIL_TEMP_INJUNCTION_MODE = "temporary-injunction-o39" as const;

export type CivilWriterMode =
  | (typeof CIVIL_SUIT_OPTIONS)[number]["id"]
  | typeof CIVIL_TEMP_INJUNCTION_MODE;
