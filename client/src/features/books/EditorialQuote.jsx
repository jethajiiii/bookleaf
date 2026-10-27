/**
 * EditorialQuote renders the quote banner celebrating book arts and illustration.
 */
export function EditorialQuote() {
  return (
    <section className="py-20 bg-cream-200/50 border-t border-cream-300">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-3xl text-terracotta-600 font-serif italic">“</span>
        <blockquote className="text-2xl md:text-3xl font-serif text-ink-900 leading-snug italic font-light -mt-4">
          A book unread is a silence; but an illustrated book forgotten is a door sealed with gold
          leaf. We reopen those quiet halls.
        </blockquote>
        <p className="mt-6 text-xs uppercase tracking-widest text-ink-600 font-medium">
          — BookLeaf Editorial Guild, Florence &amp; Jaipur
        </p>
      </div>
    </section>
  );
}

export default EditorialQuote;
