import type { CriminalAffidavit } from "@/lib/criminal";

export function CriminalAffidavitPreview({ affidavit }: { affidavit: CriminalAffidavit }) {
  return (
    <article className="petition-sheet mt-6" id="affidavit-print">
      <h1 className="petition-court">{affidavit.courtLine}</h1>
      <hr className="petition-rule" />
      <p className="petition-suitno">{affidavit.suitLine}</p>

      <p className="pleading-para">{affidavit.matterLeft}</p>
      <p className="versus">VERSUS</p>
      <p className="pleading-para">{affidavit.matterRight}</p>

      <h2 className="cause-title">{affidavit.causeTitle}</h2>
      <p className="pleading-para">{affidavit.introText}</p>
      {affidavit.paragraphs.map((para, index) => (
        <p key={index} className="pleading-para">
          {para}
        </p>
      ))}

      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">{affidavit.deponentRole}</p>
      </div>

      <p className="verify-heading">VERIFICATION</p>
      <p className="pleading-para">{affidavit.verificationText}</p>
      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">{affidavit.deponentRole}</p>
      </div>
    </article>
  );
}
