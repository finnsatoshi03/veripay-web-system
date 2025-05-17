import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type Role = "hr" | "employee";

export function ProfileSwitcher({
  roles,
  disabled = false,
  onRoleChange,
}: {
  roles: {
    name: string;
    logo: React.ElementType;
    role: Role;
  }[];
  disabled?: boolean;
  onRoleChange?: (role: Role) => void;
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = React.useState(roles[0]);

  const handleRoleChange = (role: (typeof roles)[0]) => {
    setActiveRole(role);

    if (role.role === "hr") {
      navigate("/hr/dashboard");
    } else if (role.role === "employee") {
      navigate("/employee/dashboard");
    }

    if (onRoleChange) {
      onRoleChange(role.role);
    }
  };

  if (!activeRole) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {disabled ? (
          <SidebarMenuButton
            size="lg"
            className="gap-1 hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent"
          >
            <img
              src="/icons/brand-logo-dark.png"
              alt="Veripay"
              className="flex aspect-square size-8 items-center justify-center rounded-lg"
            />
            <div className="grid flex-1 -space-y-1 text-left text-lg leading-tight">
              <span className="font-logo truncate font-semibold">Veripay</span>
              <span className="truncate text-xs">{activeRole.role}</span>
            </div>
          </SidebarMenuButton>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="gap-1 hover:bg-transparent active:bg-transparent"
              >
                <img
                  src="/icons/brand-logo-dark.png"
                  alt="Veripay"
                  className="flex aspect-square size-8 items-center justify-center rounded-lg"
                />
                <div className="grid flex-1 -space-y-1 text-left text-lg leading-tight">
                  <span className="font-logo truncate font-semibold">
                    Veripay
                  </span>
                  <span className="truncate text-xs">{activeRole.role}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Roles
              </DropdownMenuLabel>
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role.name}
                  onClick={() => handleRoleChange(role)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <role.logo className="size-4 shrink-0" />
                  </div>
                  {role.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
