import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "./loader";

export const PublicRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  // Allow access to reset password page even when authenticated
  const isResetPasswordPage = location.pathname === "/reset-password";
  const isVerifyEmailPage = location.pathname === "/verify-email";
  // If user is authenticated and not on special auth pages, redirect to their dashboard
  if (isAuthenticated && !isResetPasswordPage && !isVerifyEmailPage) {
    if (user?.role === "HR") {
      return <Navigate to="/hr/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  // Not authenticated or on special auth pages - allow access to public routes
  return <Outlet />;
};
