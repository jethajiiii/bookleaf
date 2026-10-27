import { formatINR, formatDate, formatNumber } from '../../lib/formatters.js';

/**
 * Editorial BookSnapshot displays the exact financial & publication facts provided to the AI.
 * Completely null-safe; handles in-production and unlinked tickets gracefully.
 */
export function BookSnapshot({ book }) {
  if (!book) {
    return (
      <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 shadow-soft-card space-y-2">
        <h3 className="font-editorial text-lg font-normal text-[#2B2622] tracking-tight">
          Catalogue Folio Record
        </h3>
        <p className="text-xs text-[#55433c] font-display-italic">
          No registered edition associated with this inquiry (Account-level dispatch).
        </p>
      </div>
    );
  }

  const isInProduction = book.status && !book.status.toLowerCase().includes('published');

  return (
    <div className="bg-[#FCF9F5] border border-[#E5DCCE] rounded-2xl p-6 space-y-4 shadow-soft-card">
      <div className="border-b border-[#E5DCCE] pb-3 flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] text-[#3F7F8C] font-semibold uppercase tracking-widest block font-sans">
            Archived Edition
          </span>
          <h3 className="font-editorial text-xl font-normal text-[#2B2622] tracking-tight leading-tight mt-0.5">
            {book.title}
          </h3>
          <p className="text-[11px] font-mono text-[#55433c]/80 mt-1">
            ISBN: {book.isbn || '—'}
          </p>
        </div>
        <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-full bg-[#FAF5EE] text-[#2B2622] border border-[#E5DCCE] shrink-0 font-mono">
          {book.status || 'Active'}
        </span>
      </div>

      {isInProduction ? (
        <div className="p-3.5 rounded-xl bg-[#FAF5EE] border border-amber-300/40 text-xs text-[#2B2622]">
          <p className="font-editorial font-semibold text-sm">Edition in Production &amp; Proofing</p>
          <p className="text-[11px] text-[#55433c] mt-0.5 font-display-italic">
            Circulation figures and royalty statements materialize upon final press binding.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#E5DCCE]">
              <span className="text-[10px] text-[#55433c] uppercase block tracking-wider font-sans">
                Earned
              </span>
              <span className="font-editorial text-base font-semibold text-[#2B2622] block mt-0.5">
                {formatINR(book.totalRoyaltyEarned)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#E5DCCE]">
              <span className="text-[10px] text-[#55433c] uppercase block tracking-wider font-sans">
                Disbursed
              </span>
              <span className="font-editorial text-base font-semibold text-[#2B2622] block mt-0.5">
                {formatINR(book.royaltyPaid)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-amber-300/50">
              <span className="text-[10px] text-[#C88C35] uppercase font-bold block tracking-wider font-sans">
                Pending
              </span>
              <span className="font-editorial text-base font-bold text-[#984221] block mt-0.5">
                {formatINR(book.royaltyPending)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#55433c] pt-2 border-t border-[#E5DCCE]">
            <div>
              <span>List MRP: </span>
              <span className="font-semibold text-[#2B2622]">{formatINR(book.mrp)}</span>
            </div>
            <div>
              <span>Copies Sold: </span>
              <span className="font-semibold text-[#2B2622]">{formatNumber(book.totalCopiesSold)}</span>
            </div>
            <div>
              <span>Published: </span>
              <span className="font-semibold text-[#2B2622]">{formatDate(book.publicationDate)}</span>
            </div>
            <div>
              <span>Last Payout: </span>
              <span className="font-semibold text-[#2B2622]">{formatDate(book.lastPayoutDate)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSnapshot;
