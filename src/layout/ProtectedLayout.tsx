import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col p-2 pl-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
