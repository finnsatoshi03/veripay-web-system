import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavHRItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isAccordion?: boolean;
  isActive?: boolean;
  children?: {
    title: string;
    url: string;
  }[];
};

export type NavHRSection = {
  label: string;
  items: NavHRItem[];
};

export function NavHR({ sections }: { sections: NavHRSection[] }) {
  const { pathname } = useLocation();

  const isActive = (url: string) => {
    return pathname.includes(url);
  };

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) =>
              item.isAccordion ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.children?.map((child) => (
                          <SidebarMenuSubItem
                            key={child.title}
                            className={cn(
                              isActive(child.url) &&
                                "bg-primary text-primary-foreground rounded-md",
                            )}
                          >
                            <SidebarMenuSubButton asChild>
                              <Link to={child.url}>
                                <span>{child.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
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
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
