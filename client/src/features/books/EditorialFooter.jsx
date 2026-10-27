/**
 * EditorialFooter renders the bottom colophon and typography specs links.
 */
export function EditorialFooter() {
  return (
    <footer className="border-t border-cream-300 py-10 bg-cream-200/40 text-xs text-ink-600 font-light">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-medium text-ink-900 text-sm">BookLeaf Press</span>
          <span>•</span>
          <span>© 2026 Illustrated Editions Worldwide</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px] tracking-wider uppercase">
          <a href="#colophon" className="hover:text-ink-900 transition-colors">
            Colophon
          </a>
          <a href="#typography" className="hover:text-ink-900 transition-colors">
            Typography Spec
          </a>
          <a href="#press" className="hover:text-ink-900 transition-colors">
            Press Inquiries
          </a>
          <a href="#stockists" className="hover:text-ink-900 transition-colors">
            Stockists
          </a>
        </div>
      </div>
    </footer>
  );
}

export default EditorialFooter;
