import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/custom/header";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
import { useTheme } from "@/components/custom/theme-provider";
import { toast } from "react-hot-toast";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, clearAllData } = useAuthStore();

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("system");
  }, []);

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

  // Show loading or splash screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex-1 overflow-auto px-4 pb-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
