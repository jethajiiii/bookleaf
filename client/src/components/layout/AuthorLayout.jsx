import { NavLink, Outlet } from 'react-router-dom';
import TopBar from './TopBar.jsx';

const NAV_ITEMS = [
  { label: 'My Books', path: '/books' },
  { label: 'Support Tickets', path: '/tickets' },
  { label: 'Submit Ticket', path: '/tickets/new' },
];

/**
 * AuthorLayout wraps author views with TopBar, sub-navigation tabs, and page container.
 */
export function AuthorLayout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar />

      {/* Sub-Navigation Tabs */}
      <nav className="bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `py-3.5 px-1 border-b-2 text-sm whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'border-terracotta text-terracotta font-semibold'
                    : 'border-transparent text-charcoal-light hover:text-charcoal hover:border-card-border font-medium'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthorLayout;
