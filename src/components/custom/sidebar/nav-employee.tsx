import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavEmployee({
  items,
}: {
  items: {
    label: string;
    menuItems: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  const { pathname } = useLocation();

  const isActive = (url: string) => {
    return pathname.includes(url);
  };

  return (
    <>
      {items.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.menuItems.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  isActive(item.url) &&
                    "bg-primary text-primary-foreground rounded-md",
                )}
              >
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
