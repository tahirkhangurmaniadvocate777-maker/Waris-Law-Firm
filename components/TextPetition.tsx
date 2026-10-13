import { firm } from "@/lib/firm";
import {
  formatPldGroundsParagraphs,
  type PldCitations,
} from "@/lib/types/drafting";

export function TextPetition({
  courtLine,
  suitLine,
  leftParty,
  leftRole,
  rightParty,
  rightRole,
  causeTitle,
  shewethLabel = "RESPECTFULLY SHEWETH:",
  paragraphs,
  prayerHeading = "PRAYER:",
  prayerIntro,
  prayerItems,
  prayerOutro,
  signRole,
  lawyerName,
  lawyerLines = [firm.designation],
  verificationText,
  pld_citations,
}: {
  courtLine: string;
  suitLine: string;
  leftParty: string[];
  leftRole: string;
  rightParty: string[];
  rightRole: string;
  causeTitle: string;
  shewethLabel?: string;
  paragraphs: string[];
  prayerHeading?: string;
  prayerIntro: string;
  prayerItems: string[];
  prayerOutro?: string;
  signRole: string;
  lawyerName: string;
  lawyerLines?: string[];
  verificationText: string;
  /** Optional PLD / authority citations rendered under Grounds. */
  pld_citations?: PldCitations;
}) {
  const showVerification = Boolean(verificationText.trim());
  const grounds = formatPldGroundsParagraphs(pld_citations);

  return (
    <article className="petition-sheet" id="petition-print">
      <h1 className="petition-court">{courtLine}</h1>
      <hr className="petition-rule" />
      <p className="petition-suitno">{suitLine}</p>

      <div className="party">
        <div>
          {leftParty.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="party-role">... {leftRole}</p>
      </div>

      <p className="versus">VERSUS</p>

      <div className="party">
        <div>
          {rightParty.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="party-role">... {rightRole}</p>
      </div>

      <h2 className="cause-title">{causeTitle}</h2>
      <p className="sheweth">{shewethLabel}</p>
      {paragraphs.map((para, index) => (
        <p key={index} className="pleading-para">
          {para}
        </p>
      ))}

      {grounds.length > 0 ? (
        <>
          <p className="prayer-heading">GROUNDS:</p>
          {grounds.map((para) => (
            <p key={para} className="pleading-para">
              {para}
            </p>
          ))}
        </>
      ) : null}

      <p className="prayer-heading">{prayerHeading}</p>
      <p className="prayer-intro">{prayerIntro}</p>
      <ul className="prayer-list">
        {prayerItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {prayerOutro ? <p className="pleading-para">{prayerOutro}</p> : null}

      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">{signRole}</p>
        <div className="through">
          <p>
            <strong>
              Through Counsel: {lawyerName || firm.advocate}, {firm.designation}
            </strong>
          </p>
          {lawyerLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      {showVerification ? (
        <>
          <p className="verify-heading">VERIFICATION:</p>
          <p className="pleading-para">{verificationText}</p>
          <div className="sign-block">
            <p className="sign-line">_________________</p>
            <p className="sign-role">{signRole}</p>
          </div>
        </>
      ) : null}
    </article>
  );
}
