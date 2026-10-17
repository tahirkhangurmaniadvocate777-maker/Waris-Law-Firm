import {
  dirAttr,
  localizeRole,
  petitionChrome,
  type DraftLanguage,
} from "@/lib/language";
import {
  childrenParagraph,
  formatLongDate,
  formatPkr,
  meansClause,
  suitYear,
  textOrBlank,
  type MaintenanceForm,
} from "@/lib/maintenance";

export function PetitionPreview({
  form,
  language = "en",
}: {
  form: MaintenanceForm;
  language?: DraftLanguage;
}) {
  const year = suitYear(form.verificationDate);
  const suitNo = form.suitNumber.trim() || "___________";
  const chrome = petitionChrome(language);
  const plaintiffRole = localizeRole("PLAINTIFF", language);
  const defendantRole = localizeRole("DEFENDANT", language);

  if (language === "ur") {
    return (
      <article
        className="petition-sheet"
        id="petition-print"
        dir={dirAttr("ur")}
        lang="ur"
      >
        <h1 className="petition-court">
          عدالت جناب فیملی جج صاحب، {textOrBlank(form.courtLocation)}
        </h1>
        <hr className="petition-rule" />
        <p className="petition-suitno">
          فیملی مقدمہ نمبر {suitNo} / {year}
        </p>

        <div className="party">
          <div>
            <p>
              {textOrBlank(form.plaintiffName)} {textOrBlank(form.plaintiffRelation)}
            </p>
            <p>
              {chrome.residentOf} {textOrBlank(form.plaintiffAddress)}
            </p>
            <p>
              {chrome.cellNo} {textOrBlank(form.plaintiffPhone)}
            </p>
          </div>
          <p className="party-role">... {plaintiffRole}</p>
        </div>

        <p className="versus">{chrome.versus}</p>

        <div className="party">
          <div>
            <p>
              {textOrBlank(form.defendantName)} {textOrBlank(form.defendantRelation)}
            </p>
            <p>
              {chrome.residentOf} {textOrBlank(form.defendantAddress)}
            </p>
            <p>
              {chrome.cellNo} {textOrBlank(form.defendantPhone)}
            </p>
          </div>
          <p className="party-role">... {defendantRole}</p>
        </div>

        <h2 className="cause-title">
          دعویٰ برائے نان و نفقہ ماضی و مستقبل برائے مدعیہ و نابالغ بچے
        </h2>

        <p className="sheweth">{chrome.sheweth}</p>

        <p className="pleading-para">
          ۱۔ یہ کہ رشتہ ازدواج مابین مدعیہ اور مدعا علیہ مورخہ{" "}
          {formatLongDate(form.marriageDate)} کو بمطابق شرع محمدیؐ منعقد ہوا تھا۔ نکاح نامہ ہمراہ
          منسلک ہے۔
        </p>
        <p className="pleading-para">
          ۲۔ یہ کہ ازواجی تعلق سے {textOrBlank(form.childrenCount)} اولاد پیدا ہوئی:{" "}
          {textOrBlank(form.childrenDetails)}۔
        </p>
        <p className="pleading-para">
          ۳۔ یہ کہ مدعا علیہ نے مدعیہ و نابالغ بچوں کو مورخہ {formatLongDate(form.abandonmentDate)}{" "}
          کو زوجی گھر سے بے دخل کر دیا اور روزمرہ نان و نفقہ، طبی علاج اور تعلیمی اخراجات فراہم کرنے
          میں مکمل ناکام ہے۔
        </p>
        <p className="pleading-para">
          ۴۔ یہ کہ مدعا علیہ صاحب حیثیت شخص ہے، پیشہ / آمدن:{" "}
          {textOrBlank(form.defendantOccupation)} / تقریباً {formatPkr(form.defendantIncome)} روپے
          ماہانہ، جبکہ مدعیہ کے پاس کوئی آزاد ذریعہ آمدن نہیں۔
        </p>
        <p className="pleading-para">
          ۵۔ یہ کہ نابالغ بچے {textOrBlank(form.schoolName)} میں زیر تعلیم ہیں جن کا ماہانہ خرچ{" "}
          {formatPkr(form.schoolExpense)} روپے ہے جو مدعیہ تنہا برداشت نہیں کر سکتی۔
        </p>
        <p className="pleading-para">
          ۶۔ یہ کہ مدعیہ نان و نفقہ ماضی از {formatLongDate(form.pastStart)} تا{" "}
          {formatLongDate(form.pastEnd)} بمادہ {formatPkr(form.pastRate)} روپے اور مستقبل بمادہ{" "}
          {formatPkr(form.futureRate)} روپے مع دس فیصد سالانہ اضافہ کا مطالبہ کرتی ہے۔
        </p>
        <p className="pleading-para">
          ۷۔ یہ کہ سببِ دعویٰ مورخہ {formatLongDate(form.causeDate)} کو پیدا ہوا جب مدعا علیہ نے مالی
          تعاون مکمل بند کر دیا۔
        </p>
        <p className="pleading-para">۸۔ یہ کہ مناسب کورٹ فیس چسپاں کی گئی ہے۔</p>

        <p className="prayer-heading">{chrome.prayer}</p>
        <p className="prayer-intro">
          لہٰذا استدعا ہے کہ یہ عدالت گرامی مدعیہ کے حق میں مدعا علیہ کے خلاف ڈگری صادر فرمائے:
        </p>
        <ul className="prayer-list">
          <li>
            نان و نفقہ ماضی بمبلغ {formatPkr(form.totalPast)} روپے دلایا جائے۔
          </li>
          <li>
            مستقبل میں نان و نفقہ مدعیہ بمادہ {formatPkr(form.wifeFutureRate)} اور ہر نابالغ بمادہ{" "}
            {formatPkr(form.childFutureRate)} روپے مع دس فیصد سالانہ اضافہ مقرر کیا جائے۔
          </li>
          <li>کوئی اور مناسب ریلیف عطا کیا جائے۔</li>
        </ul>

        <div className="sign-block">
          <p className="sign-line">_________________</p>
          <p className="sign-role">{plaintiffRole}</p>
          <div className="through">
            <p>{chrome.throughCounsel}</p>
            <p>{textOrBlank(form.lawyerName)}</p>
            <p>ایڈووکیٹ</p>
          </div>
        </div>

        <p className="verify-heading">{chrome.verification}</p>
        <p className="pleading-para">
          تصدیق بذریعہ حلف بمقام {textOrBlank(form.courtLocation)} مورخہ{" "}
          {formatLongDate(form.verificationDate)} کہ مندرجات صحیح و درست ہیں۔
        </p>

        <div className="sign-block">
          <p className="sign-line">_________________</p>
          <p className="sign-role">{plaintiffRole}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="petition-sheet" id="petition-print" dir="ltr" lang="en">
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
          <p>
            {chrome.residentOf} {textOrBlank(form.plaintiffAddress)}
          </p>
          <p>
            {chrome.cellNo} {textOrBlank(form.plaintiffPhone)}
          </p>
        </div>
        <p className="party-role">... {plaintiffRole}</p>
      </div>

      <p className="versus">{chrome.versus}</p>

      <div className="party">
        <div>
          <p>
            {textOrBlank(form.defendantName)} {textOrBlank(form.defendantRelation)}
          </p>
          <p>
            {chrome.residentOf} {textOrBlank(form.defendantAddress)}
          </p>
          <p>
            {chrome.cellNo} {textOrBlank(form.defendantPhone)}
          </p>
        </div>
        <p className="party-role">... {defendantRole}</p>
      </div>

      <h2 className="cause-title">
        Suit for the recovery of past &amp; future maintenance for plaintiff and minors
      </h2>

      <p className="sheweth">{chrome.sheweth}</p>

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

      <p className="prayer-heading">{chrome.prayer}</p>
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
        <p className="sign-role">{plaintiffRole}</p>
        <div className="through">
          <p>{chrome.throughCounsel}</p>
          <p>{textOrBlank(form.lawyerName)}</p>
          <p>Advocate</p>
        </div>
      </div>

      <p className="verify-heading">{chrome.verification}</p>
      <p className="pleading-para">
        Verified on Oath at {textOrBlank(form.courtLocation)} on this{" "}
        {formatLongDate(form.verificationDate)}, that the contents of paragraphs 1 to 8 are true and
        correct to the best of my knowledge and belief, and the rest are based on information
        received.
      </p>

      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">{plaintiffRole}</p>
      </div>
    </article>
  );
}
