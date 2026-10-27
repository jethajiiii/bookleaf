import { useState, useMemo } from 'react';
import HeritageBookCard from './HeritageBookCard.jsx';
import BookPreviewModal from './BookPreviewModal.jsx';

const SHOWCASE_EDITIONS = [
  {
    bookCode: 'SHOWCASE-01',
    title: 'Whispers of the Ganges',
    subtitle: 'Tales from the Sacred Riverbank',
    authorName: 'Priya Sharma',
    genre: 'Literary Fiction',
    status: 'Published & Live',
    publicationDate: '2024-01-01',
    mrp: 399,
    description:
      'A contemplative exploration of forgotten folklore along the river Varanasi, adorned with 14 double-spread gouache illustrations.',
  },
  {
    bookCode: 'SHOWCASE-02',
    title: 'Midnight in Mysore',
    subtitle: 'Palaces, Shadows & Incense',
    authorName: 'K. V. Raman',
    genre: 'Historical Intrigue',
    status: 'Published & Live',
    publicationDate: '2023-11-15',
    mrp: 450,
    description:
      'Historical intrigue in South Indian courts during the autumn Dussehra festival, complete with gold stamped cover accents.',
  },
  {
    bookCode: 'SHOWCASE-03',
    title: "The Tea Planter's Daughter",
    subtitle: 'Misty Hills of Munnar',
    authorName: 'Ananya Sen',
    genre: 'Colonial Fiction',
    status: 'New Release',
    publicationDate: '2025-02-10',
    mrp: 425,
    description:
      'Set amidst high altitude cardamom and tea estates; printed with hand-carved botanical woodcuts on heavy deckled paper.',
  },
];

/**
 * HeritageEditionsSection renders the curated editions grid and book preview modal.
 *
 * @param {Object} props
 * @param {Array} props.books Author's books retrieved from API
 */
export function HeritageEditionsSection({ books = [] }) {
  const [selectedBook, setSelectedBook] = useState(null);

  // Combine author's real books with heritage showcase to guarantee full editorial grid
  const displayBooks = useMemo(() => {
    if (!books || books.length === 0) {
      return SHOWCASE_EDITIONS;
    }
    // If author has fewer than 3 books, fill remaining slots with showcase items
    if (books.length < 3) {
      const remainingNeeded = 3 - books.length;
      const fillers = SHOWCASE_EDITIONS.slice(books.length, books.length + remainingNeeded);
      return [...books, ...fillers];
    }
    return books;
  }, [books]);

  return (
    <section className="py-24 border-t border-cream-300 bg-cream-50" id="featured">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-cream-200">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-terracotta-600 font-semibold">
              BookLeaf Press Selection
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-ink-900 mt-2 font-normal">
              Featured Heritage Editions
            </h2>
          </div>
          <p className="text-sm font-serif italic text-ink-600 max-w-md mt-4 md:mt-0">
            Hand-sewn signatures, archival 120gsm Swedish Munken cream paper, and linocut plates
            pulled by master press artisans.
          </p>
        </div>

        {/* Book Editions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {displayBooks.map((book, index) => (
            <HeritageBookCard
              key={book._id || book.bookCode || `book-${index}`}
              book={book}
              index={index}
              onPreview={setSelectedBook}
            />
          ))}
        </div>
      </div>

      {/* Book Preview / Royalty Modal */}
      {selectedBook && (
        <BookPreviewModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </section>
  );
}

export default HeritageEditionsSection;
