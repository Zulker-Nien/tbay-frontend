import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const UnProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  console.log(location.pathname);

  if (
    isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/register" )
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};
