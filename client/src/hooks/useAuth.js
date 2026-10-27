import { useContext } from 'react';
import { AuthContext } from '../context/authContextDef.js';

/**
 * Hook to access authentication context state and operations.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
