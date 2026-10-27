import { useState, useEffect, useCallback } from 'react';
import { getMyBooks } from '../../api/books.api.js';
import BookCard from './BookCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';

/**
 * MyBooksPage renders the author's collection of books with loading, empty, and error states.
 */
export function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve your books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getMyBooks()
      .then((data) => {
        if (!ignore) setBooks(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Failed to retrieve your books. Please try again.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-charcoal-light font-medium">Loading your book catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-card border border-terracotta/30 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 bg-terracotta-light text-terracotta rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h3 className="font-serif text-lg font-medium text-charcoal">Unable to load books</h3>
        <p className="text-sm text-charcoal-light">{error}</p>
        <Button variant="primary" size="md" onClick={loadBooks}>
          Retry
        </Button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12">
        <EmptyState
          title="No books linked to your account"
          description="You currently do not have any published or in-production books under this author profile. Contact BookLeaf support if you believe this is an error."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal tracking-tight">
            My Books
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Track your published titles, live distribution channels, and in-production manuscripts.
          </p>
        </div>
        <div className="text-xs font-medium text-charcoal-muted bg-card px-3 py-1.5 rounded-full border border-card-border self-start sm:self-auto">
          {books.length} {books.length === 1 ? 'Title' : 'Titles'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {books.map((book) => (
          <BookCard key={book._id || book.bookCode || book.isbn} book={book} />
        ))}
      </div>
    </div>
  );
}

export default MyBooksPage;
