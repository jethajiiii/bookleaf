import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/ui/Spinner.jsx';

/**
 * Route guard checking authentication state and role access.
 *
 * @param {Object} props
 * @param {string} [props.requiredRole] Optional role requirement ('author' or 'admin')
 * @param {React.ReactNode} props.children
 */
export function ProtectedRoute({ requiredRole, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/books'} replace />;
  }

  return children;
}

export default ProtectedRoute;
