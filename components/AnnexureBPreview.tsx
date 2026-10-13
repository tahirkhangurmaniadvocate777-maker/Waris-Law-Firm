type Annexure = {
  courtLocation: string;
  plaintiffName: string;
  defendantName: string;
  rows: string[][];
  jahezTotal: string;
  bariRows: string[][];
  bariTotal: string;
  grandTotal: string;
  lawyerName: string;
};

export function AnnexureBPreview({ annexure }: { annexure: Annexure }) {
  return (
    <article className="petition-sheet mt-6" id="annexure-print">
      <h1 className="petition-court">
        IN THE COURT OF THE LEARNED FAMILY JUDGE, {annexure.courtLocation}
      </h1>
      <p className="mt-4 text-sm">
        In the matter of: {annexure.plaintiffName} ... PLAINTIFF
      </p>
      <p className="versus">VERSUS</p>
      <p className="text-sm">{annexure.defendantName} ... DEFENDANT</p>
      <h2 className="cause-title">
        ANNEXURE-B: ITEMIZED LIST OF DOWRY ARTICLES (JAHEZ) AND BRIDAL GIFTS (BARI)
      </h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1 text-left">SR.</th>
            <th className="border border-black px-2 py-1 text-left">ITEM</th>
            <th className="border border-black px-2 py-1 text-left">QTY</th>
            <th className="border border-black px-2 py-1 text-left">VALUE (PKR)</th>
          </tr>
        </thead>
        <tbody>
          {annexure.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className="border border-black px-2 py-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="border border-black px-2 py-1 font-bold">
              TOTAL EVALUATION OF DOWRY ARTICLES
            </td>
            <td className="border border-black px-2 py-1 font-bold">{annexure.jahezTotal}</td>
          </tr>
          {annexure.bariRows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} className="border border-black px-2 py-1">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="border border-black px-2 py-1 font-bold">
              TOTAL EVALUATION OF BRIDAL GIFTS
            </td>
            <td className="border border-black px-2 py-1 font-bold">{annexure.bariTotal}</td>
          </tr>
          <tr>
            <td colSpan={3} className="border border-black px-2 py-1 font-bold">
              GRAND TOTAL CLAIMED FOR RECOVERY
            </td>
            <td className="border border-black px-2 py-1 font-bold">{annexure.grandTotal}</td>
          </tr>
        </tbody>
      </table>
      <p className="pleading-para mt-4">
        Note: The above-mentioned articles are currently in the illegal possession and custody of
        the Defendant at the matrimonial home. The values are assessed according to current market
        utilities.
      </p>
      <div className="sign-block">
        <p className="sign-line">_________________</p>
        <p className="sign-role">PLAINTIFF</p>
        <div className="through">
          <p>Through:</p>
          <p>{annexure.lawyerName}</p>
          <p>Advocate</p>
        </div>
      </div>
    </article>
  );
}
