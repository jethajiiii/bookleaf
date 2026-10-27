import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * AuthorNavHeader renders the top announcement bar and editorial navigation
 * with author profile details and portal routing actions.
 */
export function AuthorNavHeader() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="bg-cream-200/90 border-b border-cream-300 text-ink-600 text-xs py-2 px-4 tracking-wider text-center flex items-center justify-center gap-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
        <span className="font-medium tracking-wide">
          SPRING RELEASE: Limited clothbound collection illustrated by international printmakers
        </span>
        <a
          href="#featured"
          className="underline underline-offset-4 hover:text-ink-900 transition-colors font-semibold"
        >
          Browse Catalogue →
        </a>
      </aside>

      {/* Main Sticky Editorial Navigation */}
      <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Brand Monogram */}
          <Link to="/books" className="flex items-center gap-3 group" title="BookLeaf Illustrated Works">
            <div className="w-9 h-9 border border-ink-900/80 rounded-sm flex items-center justify-center group-hover:bg-ink-900 group-hover:text-cream-100 transition-all duration-300">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 4v16a2 2 0 0 0 2 2h14v-2H6a.5.5 0 0 1-.5-.5V4H4zm4 0h12v14H8V4zm2 2v10h8V6h-8z" />
              </svg>
            </div>
            <span className="font-display tracking-[0.25em] text-sm uppercase font-semibold text-ink-900">
              BookLeaf
            </span>
          </Link>

          {/* Centered Clean Editorial Links */}
          <nav className="hidden md:flex items-center space-x-10 text-[13px] tracking-widest uppercase font-medium text-ink-800">
            <a href="#shelf" className="hover:text-terracotta-600 transition-colors py-1">
              The Shelf
            </a>
            <Link to="/tickets" className="hover:text-terracotta-600 transition-colors py-1">
              Tickets
            </Link>
            <a href="#featured" className="hover:text-terracotta-600 transition-colors py-1">
              Catalogue
            </a>
            <a href="#dispatch" className="hover:text-terracotta-600 transition-colors py-1">
              Dispatch
            </a>
          </nav>

          {/* Action & Author Profile */}
          <div className="flex items-center space-x-3">
            {/* Author Profile dropdown / button */}
            <div className="relative">
              <button
                type="button"
                aria-label="Author Profile"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full border border-ink-800/30 flex items-center justify-center hover:border-ink-900 hover:bg-cream-200 transition-colors text-ink-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-cream-50 border border-cream-300 rounded shadow-xl p-4 text-xs z-50 animate-fade-in">
                  <div className="pb-2 border-b border-cream-200">
                    <p className="font-serif font-semibold text-ink-900">{user?.name || 'Author'}</p>
                    <p className="text-ink-600 font-mono text-[11px] truncate">{user?.email}</p>
                  </div>
                  <div className="py-2 space-y-1">
                    <Link
                      to="/tickets"
                      onClick={() => setProfileOpen(false)}
                      className="block px-2 py-1 text-ink-800 hover:bg-cream-200 rounded transition-colors"
                    >
                      Support Tickets
                    </Link>
                    <Link
                      to="/tickets/new"
                      onClick={() => setProfileOpen(false)}
                      className="block px-2 py-1 text-ink-800 hover:bg-cream-200 rounded transition-colors"
                    >
                      Submit Ticket
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left pt-2 border-t border-cream-200 text-terracotta-600 font-medium hover:underline"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Link
              to="/tickets/new"
              className="text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded-full border border-ink-900 bg-ink-900 text-cream-100 hover:bg-transparent hover:text-ink-900 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default AuthorNavHeader;
