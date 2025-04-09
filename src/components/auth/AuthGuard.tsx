
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthGuard = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Could replace with a loading spinner
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Outlet />;
};

export default AuthGuard;
