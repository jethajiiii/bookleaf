import { useState, useEffect, useCallback } from 'react';
import { getMyBooks } from '../../api/books.api.js';
import AuthorNavHeader from './AuthorNavHeader.jsx';
import BookshelfHero from './BookshelfHero.jsx';
import HeritageEditionsSection from './HeritageEditionsSection.jsx';
import EditorialQuote from './EditorialQuote.jsx';
import FolioDispatch from './FolioDispatch.jsx';
import EditorialFooter from './EditorialFooter.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Button from '../../components/ui/Button.jsx';

/**
 * MyBooksPage renders the author's books showcase matching the Stitch editorial design.
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
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <AuthorNavHeader />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-ink-600 font-serif italic">Loading the BookLeaf library...</p>
        </div>
        <EditorialFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <AuthorNavHeader />
        <div className="flex-1 max-w-xl mx-auto my-16 p-8 bg-cream-50 border border-terracotta-500/30 rounded text-center space-y-4">
          <div className="w-12 h-12 bg-terracotta-500/10 text-terracotta-600 rounded-full flex items-center justify-center mx-auto text-xl font-serif">
            !
          </div>
          <h3 className="font-serif text-2xl text-ink-900">Unable to load library catalogue</h3>
          <p className="text-sm text-ink-600 font-light">{error}</p>
          <Button variant="primary" size="md" onClick={loadBooks}>
            Retry
          </Button>
        </div>
        <EditorialFooter />
      </div>
    );
  }

  return (
    <div className="bg-cream-100 text-ink-900 font-sans selection:bg-terracotta-500 selection:text-white antialiased min-h-screen flex flex-col">
      <AuthorNavHeader />

      <main className="flex-1">
        <BookshelfHero />
        <HeritageEditionsSection books={books} />
        <EditorialQuote />
        <FolioDispatch />
      </main>

      <EditorialFooter />
    </div>
  );
}

export default MyBooksPage;
