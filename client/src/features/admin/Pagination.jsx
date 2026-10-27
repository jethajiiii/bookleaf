import Button from '../../components/ui/Button.jsx';

/**
 * Reusable Pagination controls for queue listings.
 */
export function Pagination({ page = 1, totalPages = 1, total = 0, onPageChange }) {
  if (totalPages <= 1 && total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted px-2 py-3">
      <div>
        Showing page <span className="font-semibold text-charcoal">{page}</span> of{' '}
        <span className="font-semibold text-charcoal">{totalPages}</span> ({total} total tickets)
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-2 font-mono font-medium text-charcoal">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
