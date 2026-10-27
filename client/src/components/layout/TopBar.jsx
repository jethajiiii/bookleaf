import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';

/**
 * TopBar component for BookLeaf Portal header branding and user profile.
 */
export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            B
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-charcoal tracking-tight block leading-tight">
              BookLeaf
            </span>
            <span className="text-[10px] text-terracotta font-semibold uppercase tracking-wider block">
              Author Portal
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:block text-right">
              <span className="text-sm font-semibold text-charcoal block leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-charcoal-muted font-mono block">
                {user.authorCode || user.email}
              </span>
            </div>
          )}

          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="text-charcoal-light">
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
