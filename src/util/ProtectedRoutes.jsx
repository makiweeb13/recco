import { Outlet, Navigate } from 'react-router-dom'
import useAuth from './useAuth';

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes;