import BookshelfSpines from './BookshelfSpines.jsx';

/**
 * BookshelfHero showcases the curated editions hero headline with the interactive 3D bookshelf.
 */
export function BookshelfHero() {
  return (
    <section className="relative pt-14 pb-28 md:pt-20 md:pb-36 bg-grain overflow-hidden" id="shelf">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header Text Block */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-ink-600 mb-4">
            Curated Hardbound Releases
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-ink-900 leading-[1.18] tracking-tight">
            Illustrated Editions of the Books You Never Forgot
          </h1>
          <p className="mt-6 text-base sm:text-lg font-serif italic text-ink-600 font-light max-w-xl mx-auto leading-relaxed">
            Worlds that only exist once you stop reading and start looking.
          </p>
        </div>

        {/* 3D Bookshelf Centerpiece Container */}
        <div className="bookshelf-stage relative max-w-4xl mx-auto px-4 md:px-0">
          {/* Warm sunlight wall-shadow background */}
          <div className="absolute -inset-x-8 -bottom-10 h-96 pointer-events-none opacity-40 bg-gradient-to-tr from-amber-900/10 via-amber-800/5 to-transparent blur-2xl -rotate-1" />

          {/* 3D Bookshelf with Spines and Hotspots */}
          <BookshelfSpines />
        </div>

        {/* Shelf Action / Interactive cues */}
        <div className="mt-14 flex items-center justify-center gap-6 text-xs text-ink-600 tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            Hover spines to inspect volumes
          </span>
          <span className="text-ink-400">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mustard-500" />
            Interactive author hot-spots active
          </span>
        </div>
      </div>
    </section>
  );
}

export default BookshelfHero;
