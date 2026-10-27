import { useState } from 'react';

/**
 * BookshelfSpines renders the 2-tier 3D bookshelf structure with interactive
 * book spines, leaning volumes, horizontal stacks, and active hotspots.
 */
export function BookshelfSpines() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const toggleHotspot = (id) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative shadow-slant-left">
      {/* SHELF TIER 1 (TOP) */}
      <div className="relative flex items-end justify-center px-6 sm:px-12 z-20 space-x-1 sm:space-x-1.5 h-44 sm:h-52">
        {/* Hotspot 1: Special Edition Marker */}
        <div
          className="absolute left-1/4 top-2 z-30 group cursor-pointer"
          onClick={() => toggleHotspot('h1')}
        >
          <div className="relative flex items-center justify-center">
            <div className="pulse-ring" />
            <div className="w-3 h-3 bg-terracotta-600 rounded-full shadow-md" />
          </div>
          {/* Interactive Tooltip */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 ${
              activeHotspot === 'h1' ? 'flex' : 'hidden group-hover:flex'
            } flex-col items-center w-48 text-left bg-ink-900 text-cream-100 p-2.5 rounded shadow-xl pointer-events-none text-xs z-50`}
          >
            <span className="text-[10px] text-terracotta-400 font-mono uppercase tracking-wider">
              Spotlight Edition
            </span>
            <span className="font-serif font-medium mt-0.5">The Painted Desert</span>
            <span className="text-[11px] text-cream-300 mt-0.5">Clothbound • Gold Foil</span>
          </div>
        </div>

        {/* Row 1 Spines */}
        <div className="book-spine w-5 sm:w-6 h-40 bg-terracotta-600 rounded-t-sm shadow-book border-l border-white/20 relative" title="The Great Gatsby" />
        <div className="book-spine w-6 sm:w-7 h-44 bg-terracotta-500 rounded-t-sm shadow-book border-l border-white/10 relative" />
        <div className="book-spine w-4 sm:w-5 h-36 bg-mustard-500 rounded-t-sm shadow-book border-l border-white/25 -rotate-2" />
        <div className="book-spine w-5 sm:w-6 h-42 bg-dustyteal-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-6 sm:w-7 h-46 bg-dustyteal-500 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-4 sm:w-5 h-38 bg-sage-500 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-7 sm:w-8 h-48 bg-mustard-400 rounded-t-sm shadow-book border-l border-white/30 flex items-center justify-center">
          <span className="book-ribbon text-[8px] text-ink-900 font-mono tracking-tighter opacity-60">
            CLASSICS
          </span>
        </div>
        <div className="book-spine w-4 sm:w-5 h-40 bg-terracotta-700 rounded-t-sm shadow-book border-l border-white/15" />
        <div className="book-spine w-6 sm:w-7 h-44 bg-dustyteal-700 rounded-t-sm shadow-book border-l border-white/15" />
        <div className="book-spine w-5 sm:w-6 h-42 bg-sage-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-7 sm:w-8 h-46 bg-mustard-500 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-4 sm:w-5 h-36 bg-terracotta-500 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-5 sm:w-6 h-44 bg-dustyteal-500 rounded-t-sm shadow-book border-l border-white/20 rotate-1" />
        <div className="book-spine w-6 sm:w-7 h-40 bg-mustard-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-4 sm:w-5 h-38 bg-sage-500 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-5 sm:w-6 h-46 bg-terracotta-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-6 sm:w-7 h-42 bg-dustyteal-600 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-5 sm:w-6 h-44 bg-mustard-400 rounded-t-sm shadow-book border-l border-white/30 rotate-6 translate-x-1" />
      </div>

      {/* Top Shelf Plank (Wood) */}
      <div className="relative z-20">
        <div className="h-3.5 sm:h-4 w-full wood-grain rounded-sm shadow-md" />
        <div className="h-2 w-full wood-shelf-bevel opacity-90" />
      </div>

      {/* SHELF TIER 2 (BOTTOM) */}
      <div className="relative flex items-end justify-center px-6 sm:px-12 z-10 space-x-1 sm:space-x-1.5 h-44 sm:h-52 -mt-1 pt-4">
        {/* Hotspot 2: Author Showcase Marker */}
        <div
          className="absolute right-1/3 top-6 z-30 group cursor-pointer"
          onClick={() => toggleHotspot('h2')}
        >
          <div className="relative flex items-center justify-center">
            <div className="pulse-ring" />
            <div className="w-3 h-3 bg-mustard-500 rounded-full shadow-md" />
          </div>
          {/* Interactive Tooltip */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 ${
              activeHotspot === 'h2' ? 'flex' : 'hidden group-hover:flex'
            } flex-col items-center w-52 text-left bg-ink-900 text-cream-100 p-2.5 rounded shadow-xl pointer-events-none text-xs z-50`}
          >
            <span className="text-[10px] text-mustard-400 font-mono uppercase tracking-wider">
              Author Archive
            </span>
            <span className="font-serif font-medium mt-0.5">Priya Sharma&apos;s Works</span>
            <span className="text-[11px] text-cream-300 mt-0.5">3 Hand-pressed Volumes</span>
          </div>
        </div>

        {/* Row 2 Spines */}
        <div className="book-spine w-6 sm:w-7 h-46 bg-dustyteal-700 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-5 sm:w-6 h-42 bg-terracotta-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-6 sm:w-7 h-44 bg-mustard-500 rounded-t-sm shadow-book border-l border-white/25" />
        <div className="book-spine w-4 sm:w-5 h-38 bg-sage-500 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-7 sm:w-8 h-48 bg-terracotta-500 rounded-t-sm shadow-book border-l border-white/30" />
        {/* Horizontal Stack */}
        <div className="flex flex-col justify-end items-center pb-0 space-y-1 mx-1">
          <div className="w-14 sm:w-16 h-3.5 bg-dustyteal-600 rounded-sm shadow-sm border-t border-white/20" />
          <div className="w-16 sm:w-18 h-4 bg-terracotta-600 rounded-sm shadow-sm border-t border-white/20" />
        </div>
        <div className="book-spine w-5 sm:w-6 h-40 bg-mustard-400 rounded-t-sm shadow-book border-l border-white/15" />
        <div className="book-spine w-4 sm:w-5 h-44 bg-sage-600 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-6 sm:w-7 h-46 bg-dustyteal-500 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-5 sm:w-6 h-42 bg-mustard-500 rounded-t-sm shadow-book border-l border-white/15" />
        <div className="book-spine w-7 sm:w-8 h-44 bg-terracotta-600 rounded-t-sm shadow-book border-l border-white/25" />
        <div className="book-spine w-4 sm:w-5 h-38 bg-sage-500 rounded-t-sm shadow-book border-l border-white/10" />
        <div className="book-spine w-6 sm:w-7 h-46 bg-dustyteal-600 rounded-t-sm shadow-book border-l border-white/20" />
        <div className="book-spine w-5 sm:w-6 h-42 bg-mustard-600 rounded-t-sm shadow-book border-l border-white/15" />
        <div className="book-spine w-6 sm:w-7 h-44 bg-terracotta-700 rounded-t-sm shadow-book border-l border-white/10 rotate-3" />
      </div>

      {/* Bottom Shelf Plank (Wood) */}
      <div className="relative z-10">
        <div className="h-4 sm:h-5 w-full wood-grain rounded-sm shadow-shelf" />
        <div className="h-2 w-full wood-shelf-bevel opacity-90" />
      </div>

      {/* Ambient shadow beneath whole shelf */}
      <div className="w-11/12 mx-auto h-8 bg-amber-950/20 blur-xl -mt-2 rounded-full" />
    </div>
  );
}

export default BookshelfSpines;
