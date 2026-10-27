import ProductionStepper from './ProductionStepper.jsx';
import BookRoyaltyGrid from './BookRoyaltyGrid.jsx';
import Badge from '../../components/ui/Badge.jsx';

/**
 * BookPreviewModal displays detailed production or royalty facts for a selected book.
 *
 * @param {Object} props
 * @param {Object|null} props.book The selected book entity
 * @param {Function} props.onClose Callback to close the modal
 */
export function BookPreviewModal({ book, onClose }) {
  if (!book) return null;

  const isInProduction =
    Boolean(book.status?.toLowerCase().includes('in production')) ||
    book.publicationDate === null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-cream-50 border border-cream-300 w-full max-w-2xl rounded-lg shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-cream-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={isInProduction ? 'terracotta' : 'sage'}>
                {book.status}
              </Badge>
              {book.genre && (
                <span className="text-xs font-mono text-ink-600">{book.genre}</span>
              )}
            </div>
            <h3 className="font-serif text-2xl font-normal text-ink-900">{book.title}</h3>
            <p className="text-xs font-mono text-ink-600 mt-0.5">
              Code: {book.bookCode || '—'} • ISBN: {book.isbn || 'Pending'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-ink-600 hover:text-ink-900 hover:bg-cream-200 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isInProduction ? (
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-600">
              Manuscript Production Workflow
            </h4>
            <ProductionStepper status={book.status} />
            <div className="bg-cream-100 p-4 rounded border border-cream-300 text-center">
              <p className="text-xs text-ink-600 italic">
                Sales statistics, retail links, and quarterly royalty statements will activate
                automatically upon publication.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-ink-600">
              Commercial & Royalty Overview
            </h4>
            <BookRoyaltyGrid book={book} />
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-cream-300 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-ink-900 text-cream-100 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookPreviewModal;
