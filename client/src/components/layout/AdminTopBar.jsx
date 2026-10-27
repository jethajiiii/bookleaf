import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';

/**
 * Editorial AdminTopBar with monogram, press typography, and admin profile.
 */
export function AdminTopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#FCF9F5]/95 backdrop-blur-md border-b border-[#E5DCCE]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#3F7F8C] text-white flex items-center justify-center font-editorial text-xl font-medium shadow-sm border border-amber-200/30">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-xl font-semibold text-[#2B2622] tracking-tight leading-tight">
                BookLeaf
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#55433c] font-medium font-sans block">
              Admin Operations
            </span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold text-[#2B2622] block leading-tight font-sans">
                {user.name}
              </span>
              <span className="text-[11px] text-[#3F7F8C] font-medium block">
                Support Admin
              </span>
            </div>
          )}

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="rounded-full text-xs"
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminTopBar;
