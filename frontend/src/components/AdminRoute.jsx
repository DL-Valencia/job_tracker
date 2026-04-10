import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && !isSuperAdmin) {
      toast.error('Access denied. Super Admin privileges required.');
    }
  }, [loading, isAuthenticated, isSuperAdmin]);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
