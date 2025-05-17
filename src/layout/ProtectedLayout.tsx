import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/custom/header";

export default function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">
          <Header />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
