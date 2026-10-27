import Badge from '../../components/ui/Badge.jsx';
import { formatDate, formatINR, formatNumber } from '../../lib/formatters.js';

/**
 * Renders metadata metrics, financial counters, and platform distribution for published books.
 *
 * @param {Object} props
 * @param {Object} props.book
 */
export function BookRoyaltyGrid({ book }) {
  const isFullyPaid = book.royaltyPending === 0 && book.royaltyPaid > 0;
  const isNeverPaid = book.royaltyPaid === 0 && !book.lastPayoutDate;

  return (
    <div className="space-y-4 mt-2">
      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-card-border text-xs">
        <div>
          <span className="block text-charcoal-muted">ISBN</span>
          <span className="font-mono font-medium text-charcoal truncate block">
            {book.isbn || '—'}
          </span>
        </div>
        <div>
          <span className="block text-charcoal-muted">Published</span>
          <span className="font-medium text-charcoal block">
            {formatDate(book.publicationDate)}
          </span>
        </div>
        <div>
          <span className="block text-charcoal-muted">MRP</span>
          <span className="font-medium text-charcoal block">{formatINR(book.mrp)}</span>
        </div>
        <div>
          <span className="block text-charcoal-muted">Copies Sold</span>
          <span className="font-medium text-charcoal block">
            {formatNumber(book.totalCopiesSold)}
          </span>
        </div>
      </div>

      {/* Financial Grid: Earned / Paid / Pending */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-cream/70 rounded-xl p-2.5 border border-card-border">
          <span className="block text-[11px] text-charcoal-muted uppercase tracking-wider">
            Earned
          </span>
          <span className="text-sm font-semibold text-charcoal">
            {formatINR(book.totalRoyaltyEarned)}
          </span>
        </div>

        <div className="bg-cream/70 rounded-xl p-2.5 border border-card-border">
          <span className="block text-[11px] text-charcoal-muted uppercase tracking-wider">
            Paid
          </span>
          <span className="text-sm font-semibold text-charcoal">
            {formatINR(book.royaltyPaid)}
          </span>
        </div>

        <div
          className={`rounded-xl p-2.5 border ${
            book.royaltyPending > 0
              ? 'bg-mustard-light border-mustard/40 text-mustard-dark ring-1 ring-mustard/30'
              : 'bg-cream/70 border-card-border text-charcoal'
          }`}
        >
          <span className="block text-[11px] text-charcoal-muted uppercase tracking-wider">
            Pending
          </span>
          {isFullyPaid ? (
            <span className="text-xs font-bold text-sage-dark bg-sage-light px-2 py-0.5 rounded-full inline-block mt-0.5">
              Fully paid
            </span>
          ) : (
            <span
              className={`text-sm font-bold ${
                book.royaltyPending > 0 ? 'text-mustard-dark' : 'text-charcoal'
              }`}
            >
              {formatINR(book.royaltyPending)}
            </span>
          )}
        </div>
      </div>

      {/* Last Payout & Platforms */}
      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-charcoal-light">
          <span className="text-charcoal-muted">Last Payout: </span>
          {isNeverPaid ? (
            <span className="font-medium text-charcoal-muted italic">No payout yet</span>
          ) : (
            <span className="font-medium text-charcoal">{formatDate(book.lastPayoutDate)}</span>
          )}
        </div>

        {Array.isArray(book.availableOn) && book.availableOn.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.availableOn.map((platform) => (
              <Badge key={platform} variant="teal" className="text-[10px] px-2">
                {platform}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookRoyaltyGrid;
