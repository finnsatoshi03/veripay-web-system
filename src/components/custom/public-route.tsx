import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "./loader";
import toast from "react-hot-toast";

export const PublicRoute = () => {
  const { user, isAuthenticated, isLoading, clearAllData } = useAuthStore();

  const isPaymentOverdue = false;

  // Handle timeout for infinite loading states
  useEffect(() => {
    if (!isLoading) return;

    const timeoutId = setTimeout(() => {
      // Clear localStorage and auth data if loading persists for 5 seconds
      clearAllData();
      toast.error("Session expired. Please log in again.", {
        duration: 5000,
        position: "top-center",
      });
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, clearAllData]);

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
