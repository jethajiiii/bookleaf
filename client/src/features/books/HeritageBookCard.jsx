import { formatINR } from '../../lib/formatters.js';

const THEMES = [
  {
    bg: 'bg-terracotta-600/90',
    textColor: 'text-cream-100',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-100/80',
    starColor: 'text-amber-200',
    starText: '★ 1st Imp.',
    pillBg: 'bg-terracotta-500/10 text-terracotta-600',
    pattern: 'circles',
    binding: 'Clothbound',
    platesDefault: '14 Plates',
  },
  {
    bg: 'bg-dustyteal-700',
    textColor: 'text-cream-100',
    titleColor: 'text-white',
    subtitleColor: 'text-teal-100/80',
    starColor: 'text-amber-200',
    starText: '★ Signed',
    pillBg: 'bg-dustyteal-500/10 text-dustyteal-600',
    pattern: 'dots',
    binding: 'Quarter-Leather',
    platesDefault: '18 Lithographs',
  },
  {
    bg: 'bg-mustard-500',
    textColor: 'text-ink-900',
    titleColor: 'text-ink-900',
    subtitleColor: 'text-ink-800',
    starColor: 'text-ink-800',
    starText: '★ Limited',
    pillBg: 'bg-mustard-500/20 text-mustard-600',
    pattern: 'frame',
    binding: 'Raw Linen',
    platesDefault: '12 Woodcuts',
  },
  {
    bg: 'bg-sage-600',
    textColor: 'text-cream-100',
    titleColor: 'text-white',
    subtitleColor: 'text-sage-100/80',
    starColor: 'text-amber-200',
    starText: '★ Archival',
    pillBg: 'bg-sage-500/15 text-sage-600',
    pattern: 'circles',
    binding: 'Hardbound Folio',
    platesDefault: '16 Plates',
  },
];

/**
 * HeritageBookCard renders a luxury book cover mock and metadata matching the Stitch design.
 *
 * @param {Object} props
 * @param {Object} props.book Book entity
 * @param {number} props.index Position index for styling
 * @param {Function} props.onPreview Callback when clicking Preview or Order Copy
 */
export function HeritageBookCard({ book, index = 0, onPreview }) {
  if (!book) return null;
  const theme = THEMES[index % THEMES.length];
  const folioNum = String(index + 1).padStart(2, '0');
  const pubYear = book.publicationDate ? new Date(book.publicationDate).getFullYear() : 'In Production';
  const subtitle = book.subtitle || book.genre || 'Hand-pressed Heritage Edition';
  const authorName = book.authorName || 'BookLeaf Author';
  const platesLabel = book.totalCopiesSold ? `${book.totalCopiesSold} Sold` : theme.platesDefault;
  const priceDisplay = book.mrp ? formatINR(book.mrp) : '$48.00';

  return (
    <article className="group flex flex-col justify-between bg-cream-100/70 border border-cream-300 p-8 rounded-sm hover:border-ink-800 transition-all duration-300">
      <div>
        {/* Visual Book Cover Mock */}
        <div
          className={`w-full aspect-[3/4] ${theme.bg} rounded-sm p-6 shadow-md flex flex-col justify-between ${theme.textColor} relative overflow-hidden group-hover:shadow-xl transition-shadow cursor-pointer`}
          onClick={() => onPreview(book)}
        >
          {theme.pattern === 'circles' && (
            <>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 border border-white/20 rounded-full opacity-40 pointer-events-none" />
              <div className="absolute -right-6 -bottom-6 w-48 h-48 border border-white/10 rounded-full opacity-40 pointer-events-none" />
            </>
          )}
          {theme.pattern === 'dots' && (
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          )}
          {theme.pattern === 'frame' && (
            <div className="absolute inset-4 border border-ink-900/20 pointer-events-none" />
          )}

          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase border border-current/30 px-2 py-0.5 rounded-full font-mono">
              Folio Nº {folioNum}
            </span>
            <span className={`text-[11px] font-mono tracking-widest ${theme.starColor}`}>
              {theme.starText}
            </span>
          </div>

          <div className="my-auto text-center px-4 py-8 z-10">
            <h3 className={`font-serif text-2xl tracking-wide leading-snug font-normal ${theme.titleColor}`}>
              {book.title}
            </h3>
            <p className={`text-xs font-serif italic ${theme.subtitleColor} mt-2`}>
              {subtitle}
            </p>
          </div>

          <div className="flex justify-between items-end text-[11px] border-t border-current/20 pt-3 font-mono tracking-wider z-10">
            <span>{authorName}</span>
            <span>{platesLabel}</span>
          </div>
        </div>

        {/* Metadata & Title */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${theme.pillBg}`}>
              {book.status?.includes('In Production') ? 'In Production' : theme.binding}
            </span>
            <span className="text-[11px] font-mono text-ink-400">
              {typeof pubYear === 'number' ? `Published ${pubYear}` : pubYear}
            </span>
          </div>
          <h4 className="font-serif text-xl text-ink-900 group-hover:text-terracotta-600 transition-colors">
            {book.title}
          </h4>
          <p className="text-xs text-ink-600 mt-2 line-clamp-2 leading-relaxed">
            {book.description ||
              `A contemplative exploration adorned with hand-pulled illustrations, archival paper, and custom binding.`}
          </p>
        </div>
      </div>

      {/* Card Bottom CTA */}
      <div className="mt-8 pt-4 border-t border-cream-200 flex items-center justify-between">
        <div>
          <span className="text-xs text-ink-400 block font-mono">Standard Price</span>
          <span className="text-base font-serif font-semibold text-ink-900">{priceDisplay}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPreview(book)}
            className="px-3 py-1.5 text-xs font-medium border border-ink-900/30 rounded-full hover:border-ink-900 transition-colors"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => onPreview(book)}
            className="px-4 py-1.5 text-xs font-medium bg-ink-900 text-cream-100 rounded-full hover:bg-terracotta-600 transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export default HeritageBookCard;
