import { useState } from 'react';

/**
 * FolioDispatch renders the monthly press dispatch newsletter subscription component.
 */
export function FolioDispatch() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-16 bg-cream-100 border-t border-cream-300" id="dispatch">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h3 className="font-serif text-2xl text-ink-900">Receive Our Monthly Folio Dispatch</h3>
        <p className="mt-2 text-sm text-ink-600">
          Exclusive announcements for small-batch prints, letterpress releases, and author signings.
        </p>

        {subscribed ? (
          <div className="mt-6 p-3 bg-sage-500/10 border border-sage-500/30 text-sage-600 rounded-full text-xs font-mono max-w-md mx-auto">
            ✓ Thank you for subscribing to the BookLeaf Dispatch
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-cream-50 border border-cream-300 rounded-full px-5 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-ink-900 focus:ring-0"
            />
            <button
              type="submit"
              className="bg-ink-900 text-cream-100 rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-terracotta-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default FolioDispatch;
