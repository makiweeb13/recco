import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const GuestOnlyRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default GuestOnlyRoutes;
