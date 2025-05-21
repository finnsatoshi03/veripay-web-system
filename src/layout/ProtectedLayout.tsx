import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/custom/header";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading or splash screen while checking authentication
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
