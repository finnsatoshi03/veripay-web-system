import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (user?.role === "HR") {
      return <Outlet />;
    }

    const hasRequiredRole = user && allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      if (user?.role === "EMPLOYEE") {
        return <Navigate to="/employee/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <Outlet />;
};
