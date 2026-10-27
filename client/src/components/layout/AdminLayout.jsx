import { NavLink, Outlet } from 'react-router-dom';
import AdminTopBar from './AdminTopBar.jsx';
import EditorialFooter from '../../features/books/EditorialFooter.jsx';

const ADMIN_NAV_ITEMS = [
  { label: 'Ticket Queue', path: '/admin' },
];

/**
 * Editorial AdminLayout wrapping admin views with header, tab bar, and footer.
 */
export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#FFF8F5] flex flex-col font-sans text-[#2B2622]">
      <AdminTopBar />

      {/* Sub-Navigation Tabs */}
      <nav className="bg-[#FCF9F5] border-b border-[#E5DCCE]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8 overflow-x-auto">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `py-3.5 px-1 border-b-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-150 font-sans ${
                  isActive
                    ? 'border-[#3F7F8C] text-[#3F7F8C] font-semibold'
                    : 'border-transparent text-[#55433c] hover:text-[#2B2622] hover:border-[#E5DCCE] font-medium'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8">
        <Outlet />
      </main>

      <EditorialFooter />
    </div>
  );
}

export default AdminLayout;
