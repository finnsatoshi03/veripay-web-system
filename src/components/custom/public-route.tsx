import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "./loader";

export const PublicRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const isPaymentOverdue = true;

  // Show loading screen while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  if (isPaymentOverdue) {
    return <Navigate to="/payment-reminder" replace />;
  }

  // If user is authenticated, redirect to their dashboard based on role
  if (isAuthenticated) {
    if (user?.role === "HR") {
      return <Navigate to="/hr/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  // Not authenticated - allow access to public routes
  return <Outlet />;
};
