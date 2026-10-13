import {
  childrenParagraph,
  formatLongDate,
  formatPkr,
  meansClause,
  suitYear,
  textOrBlank,
  type MaintenanceForm,
} from "@/lib/maintenance";

export function PetitionPreview({ form }: { form: MaintenanceForm }) {
  const year = suitYear(form.verificationDate);
  const suitNo = form.suitNumber.trim() || "___________";

  return (
    <article className="petition-sheet" id="petition-print">
      <h1 className="petition-court">
        In the Court of the Learned Family Judge, {textOrBlank(form.courtLocation)}
      </h1>
      <hr className="petition-rule" />
      <p className="petition-suitno">
        Family Suit No. {suitNo} / {year}
      </p>

      <div className="party">
        <div>
          <p>
            {textOrBlank(form.plaintiffName)} {textOrBlank(form.plaintiffRelation)}
          </p>
          <p>Resident of: {textOrBlank(form.plaintiffAddress)}</p>
          <p>Cell No: {textOrBlank(form.plaintiffPhone)}</p>
        </div>
        <p className="party-role">... PLAINTIFF</p>
      </div>

      <p className="versus">VERSUS</p>

      <div className="party">
        <div>
          <p>
            {textOrBlank(form.defendantName)} {textOrBlank(form.defendantRelation)}
          </p>
          <p>Resident of: {textOrBlank(form.defendantAddress)}</p>
          <p>Cell No: {textOrBlank(form.defendantPhone)}</p>
        </div>
        <p className="party-role">... DEFENDANT</p>
      </div>

      <h2 className="cause-title">
        Suit for the recovery of past &amp; future maintenance for plaintiff and minors
      </h2>

      <p className="sheweth">RESPECTFULLY SHEWETH:</p>

      <p className="pleading-para">
        1. That the marriage between the Plaintiff and the Defendant was solemnized on{" "}
        {formatLongDate(form.marriageDate)} according to Muslim Rites. A copy of the Nikahnama is
        attached herewith.
      </p>
      <p className="pleading-para">2. {childrenParagraph(form.childrenCount, form.childrenDetails)}</p>
      <p className="pleading-para">
        3. That the Defendant turned the Plaintiff and the minor children out of the matrimonial
        house on {formatLongDate(form.abandonmentDate)} and has completely failed to provide any
        daily sustenance, food, medical care, or educational expenses.
      </p>
      <p className="pleading-para">
        4. That the Defendant is a man of status and means,{" "}
        {meansClause(form.defendantOccupation, form.defendantIncome)}, and has ample resources to
        maintain his family, while the Plaintiff has no independent source of income.
      </p>
      <p className="pleading-para">
        5. That the minor children are studying at {textOrBlank(form.schoolName)} incurring monthly
        expenses of PKR {formatPkr(form.schoolExpense)} which the Plaintiff cannot afford alone.
      </p>
      <p className="pleading-para">
        6. That the Plaintiff claims past maintenance for herself and the minors from{" "}
        {formatLongDate(form.pastStart)} to {formatLongDate(form.pastEnd)} at the rate of PKR{" "}
        {formatPkr(form.pastRate)} per month, and future maintenance at the rate of PKR{" "}
        {formatPkr(form.futureRate)} per month with a 10% annual increase.
      </p>
      <p className="pleading-para">
        7. That the cause of action arose on {formatLongDate(form.causeDate)} when the Defendant
        completely stopped financial support, within the territorial jurisdiction of this Honorable
        Court where the Plaintiff resides.
      </p>
      <p className="pleading-para">8. That the proper court fee has been affixed on the plaint.</p>

      <p className="prayer-heading">PRAYER:</p>
      <p className="prayer-intro">
        It is, therefore, respectfully prayed that this Honorable Court may graciously pass a decree
        in favor of the Plaintiff against the Defendant for:
      </p>
      <ul className="prayer-list">
        <li>Past maintenance for the Plaintiff and minors totaling PKR {formatPkr(form.totalPast)}.</li>
        <li>
          Future monthly maintenance for Plaintiff at the rate of PKR {formatPkr(form.wifeFutureRate)}{" "}
          and for each minor child at PKR {formatPkr(form.childFutureRate)} with a 10% annual
          increment until their legal entitlement.
        </li>
        <li>Any other relief which this Honorable Court deems fit and proper may also be awarded.</li>
      </ul>

      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">PLAINTIFF</p>
        <div className="through">
          <p>Through:</p>
          <p>{textOrBlank(form.lawyerName)}</p>
          <p>Advocate</p>
        </div>
      </div>

      <p className="verify-heading">VERIFICATION:</p>
      <p className="pleading-para">
        Verified on Oath at {textOrBlank(form.courtLocation)} on this{" "}
        {formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 8 are true and
        correct to the best of my knowledge and belief, and the rest are based on information
        received.
      </p>

      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">PLAINTIFF</p>
      </div>
    </article>
  );
}
