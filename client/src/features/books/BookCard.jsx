import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import ProductionStepper from './ProductionStepper.jsx';
import BookRoyaltyGrid from './BookRoyaltyGrid.jsx';

/**
 * Renders a single book card with metadata, royalty counters, or production stepper.
 *
 * @param {Object} props
 * @param {Object} props.book Book entity
 */
export function BookCard({ book }) {
  if (!book) return null;

  const isInProduction =
    Boolean(book.status?.toLowerCase().includes('in production')) ||
    book.publicationDate === null;

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Header: Status Chip & Genre */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={isInProduction ? 'terracotta' : 'sage'}
            className="font-medium"
          >
            {book.status}
          </Badge>
          {book.genre && (
            <span className="text-xs text-charcoal-muted font-medium truncate">
              {book.genre}
            </span>
          )}
        </div>

        {/* Book Title */}
        <h3 className="font-serif text-xl font-semibold text-charcoal mb-3 tracking-tight">
          {book.title}
        </h3>

        {/* In-Production Book Layout */}
        {isInProduction ? (
          <div className="mt-2 space-y-4">
            <div className="text-xs text-charcoal-light flex items-center gap-1.5">
              <span className="text-charcoal-muted">ISBN:</span>
              <span className="font-mono font-medium text-charcoal">{book.isbn || '—'}</span>
            </div>

            <ProductionStepper status={book.status} />

            <div className="bg-cream p-3.5 rounded-xl border border-card-border text-center">
              <p className="text-xs text-charcoal-light font-medium italic">
                Sales and royalty details appear after publication
              </p>
            </div>
          </div>
        ) : (
          /* Published Book Layout */
          <BookRoyaltyGrid book={book} />
        )}
      </div>
    </Card>
  );
}

export default BookCard;
