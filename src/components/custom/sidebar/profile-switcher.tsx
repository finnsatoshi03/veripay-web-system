import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd, UserRound } from "lucide-react";
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

import { formatRole } from "@/lib/helpers/formatters";

export type Role = "HR" | "Employee";

const roles = [
  {
    name: "HR",
    logo: GalleryVerticalEnd,
    role: "HR" as Role,
  },
  {
    name: "Employee",
    logo: UserRound,
    role: "Employee" as Role,
  },
];

export function ProfileSwitcher({
  role,
  disabled = false,
  onRoleChange,
}: {
  role: Role;
  disabled?: boolean;
  onRoleChange?: (role: Role) => void;
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = React.useState(role);

  React.useEffect(() => {
    setActiveRole(role);
  }, [role]);

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);

    if (role === "HR") {
      navigate("/hr/dashboard");
    } else if (role === "Employee") {
      navigate("/employee/dashboard");
    }

    if (onRoleChange) {
      onRoleChange(role);
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
            className="hover:text-sidebar-foreground gap-1 hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent"
          >
            <img
              src="/icons/brand-logo-dark.png"
              alt="Veripay"
              className="flex aspect-square size-8 items-center justify-center rounded-lg"
            />
            <div className="grid flex-1 -space-y-1 text-left text-lg leading-tight">
              <span className="font-logo truncate font-semibold">Veripay</span>
              <span className="truncate text-xs">{formatRole(activeRole)}</span>
            </div>
          </SidebarMenuButton>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="hover:text-sidebar-foreground gap-1 hover:bg-transparent active:bg-transparent"
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
                  <span className="truncate text-xs">
                    {formatRole(activeRole)}
                  </span>
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
                  onClick={() => handleRoleChange(role.role)}
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
