import { useLocation, NavLink, Outlet } from 'react-router-dom';
import AuthorNavHeader from '../../features/books/AuthorNavHeader.jsx';
import EditorialFooter from '../../features/books/EditorialFooter.jsx';

const NAV_ITEMS = [
  { label: 'My Books', path: '/books' },
  { label: 'Support Tickets', path: '/tickets' },
  { label: 'Submit Ticket', path: '/tickets/new' },
];

/**
 * AuthorLayout wraps author views with editorial header and sub-navigation.
 * The books page is rendered full-bleed; other pages get the portal sub-nav.
 */
export function AuthorLayout() {
  const location = useLocation();
  const isBooksPage = location.pathname === '/books' || location.pathname === '/';

  if (isBooksPage) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <AuthorNavHeader />

      {/* Sub-navigation tabs */}
      <nav className="bg-cream-50 border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `py-3.5 px-1 border-b-2 text-[13px] tracking-wide whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'border-ink-900 text-ink-900 font-semibold'
                    : 'border-transparent text-ink-600 hover:text-ink-900 hover:border-cream-300 font-medium'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-10">
        <Outlet />
      </main>

      <EditorialFooter />
    </div>
  );
}

export default AuthorLayout;
