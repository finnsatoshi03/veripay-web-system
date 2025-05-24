import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CalendarCheck,
  ChartColumnBig,
  FileText,
  LayoutDashboard,
  Megaphone,
  Plane,
  PlaneTakeoff,
  ReceiptText,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useUser } from "@/store/userStore";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

// Types
interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  section?: string;
}

interface SpotlightSearchProps {
  className?: string;
}

// Navigation data extraction
const employeeNavigationItems: NavigationItem[] = [
  // Personal
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: LayoutDashboard,
    description: "View your personal dashboard",
    section: "Personal",
  },
  {
    title: "Profile",
    url: "/employee/profile",
    icon: UserRound,
    description: "Manage your profile information",
    section: "Personal",
  },
  // Work Records
  {
    title: "Attendance",
    url: "/employee/attendance",
    icon: CalendarCheck,
    description: "Track your attendance records",
    section: "Work Records",
  },
  {
    title: "Payslips & Tax Docs",
    url: "/employee/payslips",
    icon: ReceiptText,
    description: "View payslips and tax documents",
    section: "Work Records",
  },
  {
    title: "Reports",
    url: "/employee/reports",
    icon: FileText,
    description: "Access your work reports",
    section: "Work Records",
  },
  // Leave Management
  {
    title: "Leave Overview",
    url: "/employee/leave-overview",
    icon: Plane,
    description: "Manage your leave requests",
    section: "Leave Management",
  },
  {
    title: "Announcements",
    url: "/employee/announcements",
    icon: Megaphone,
    description: "View company announcements",
    section: "Leave Management",
  },
];

const hrNavigationItems: NavigationItem[] = [
  // Overview
  {
    title: "Dashboard",
    url: "/hr/dashboard",
    icon: LayoutDashboard,
    description: "View HR dashboard overview",
    section: "Overview",
  },
  // Employee Operations
  {
    title: "Account Requests",
    url: "/hr/account-requests",
    icon: UsersRound,
    description: "Manage employee account requests",
    section: "Employee Management",
  },
  {
    title: "Add Employee",
    url: "/hr/add-employee",
    icon: UsersRound,
    description: "Add new employees to the system",
    section: "Employee Management",
  },
  {
    title: "Active Employees",
    url: "/hr/active-employee",
    icon: UsersRound,
    description: "View and manage active employees",
    section: "Employee Management",
  },
  {
    title: "Department Assignment",
    url: "/hr/department-assignment",
    icon: UsersRound,
    description: "Assign employees to departments",
    section: "Employee Management",
  },
  // HR Functions
  {
    title: "Reports",
    url: "/hr/reports",
    icon: ChartColumnBig,
    description: "Generate and view HR reports",
    section: "HR Functions",
  },
  {
    title: "Leave Management",
    url: "/hr/leave-management",
    icon: PlaneTakeoff,
    description: "Manage employee leave requests",
    section: "HR Functions",
  },
  {
    title: "Payroll Management",
    url: "/hr/payroll-management",
    icon: Wallet,
    description: "Manage employee payroll",
    section: "HR Functions",
  },
  {
    title: "Announcements",
    url: "/hr/announcements",
    icon: Megaphone,
    description: "Create and manage announcements",
    section: "HR Functions",
  },
];

export const SpotlightSearch = ({ className }: SpotlightSearchProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { role } = useUser();
  const navigate = useNavigate();

  // Get navigation items based on role
  const navigationItems = React.useMemo(() => {
    return role === "HR" ? hrNavigationItems : employeeNavigationItems;
  }, [role]);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers
  const handleOpenSearch = () => {
    setIsOpen(true);
  };

  const handleSelectItem = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenSearch}
        className={cn(
          "text-muted-foreground relative h-9 w-full justify-start text-sm md:w-40 lg:w-64",
          className,
        )}
        aria-label="Open search"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search navigation...</span>
        <kbd className="bg-muted pointer-events-none absolute top-2 right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search navigation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(
            navigationItems.reduce(
              (acc, item) => {
                const section = item.section || "Other";
                if (!acc[section]) acc[section] = [];
                acc[section].push(item);
                return acc;
              },
              {} as Record<string, NavigationItem[]>,
            ),
          ).map(([section, items]) => (
            <CommandGroup key={section} heading={section}>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.url}
                    value={`${item.title} ${item.description}`}
                    onSelect={() => handleSelectItem(item.url)}
                    className="cursor-pointer"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      {item.description && (
                        <span className="text-muted-foreground text-xs">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
