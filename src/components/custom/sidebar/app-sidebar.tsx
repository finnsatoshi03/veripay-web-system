import * as React from "react";
import {
  CalendarCheck,
  ChartColumnBig,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  Megaphone,
  Plane,
  PlaneTakeoff,
  ReceiptText,
  UserRound,
  UsersRound,
  Wallet,
} from "lucide-react";

import { NavEmployee } from "@/components/custom/sidebar/nav-employee";
import { NavHR, type NavHRSection } from "@/components/custom/sidebar/nav-hr";
import { NavUser } from "@/components/custom/sidebar/nav-user";
import {
  ProfileSwitcher,
  type Role,
} from "@/components/custom/sidebar/profile-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const userData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  roles: [
    {
      name: "HR",
      logo: GalleryVerticalEnd,
      role: "hr" as Role,
    },
    {
      name: "Employee",
      logo: UserRound,
      role: "employee" as Role,
    },
  ],
};

const employeeNavData = [
  {
    label: "Personal",
    menuItems: [
      {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        url: "#",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Work Records",
    menuItems: [
      {
        title: "Attendance",
        url: "#",
        icon: CalendarCheck,
      },
      {
        title: "Payslips & Tax Docs",
        url: "#",
        icon: ReceiptText,
      },
      {
        title: "Reports",
        url: "#",
        icon: FileText,
      },
    ],
  },
  {
    label: "Leave Management",
    menuItems: [
      {
        title: "Leave Overview",
        url: "#",
        icon: Plane,
      },
    ],
  },
];

const hrNavData: NavHRSection[] = [
  {
    label: "Overview & Statistics",
    items: [
      {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Employee Operations",
    items: [
      {
        title: "Employee Management",
        url: "#",
        icon: UsersRound,
        isAccordion: true,
        isActive: true,
        children: [
          {
            title: "Account Requests",
            url: "#",
          },
          {
            title: "Add Employee",
            url: "#",
          },
          {
            title: "Active Employees",
            url: "#",
          },
          {
            title: "Department Assignment",
            url: "#",
          },
          {
            title: "Role Management",
            url: "#",
          },
        ],
      },
    ],
  },
  {
    label: "HR Functions",
    items: [
      {
        title: "Reports",
        url: "#",
        icon: ChartColumnBig,
      },
      {
        title: "Leave Management",
        url: "#",
        icon: PlaneTakeoff,
      },
      {
        title: "Payroll Management",
        url: "#",
        icon: Wallet,
      },
      {
        title: "Announcements",
        url: "#",
        icon: Megaphone,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeRole, setActiveRole] = React.useState<Role>("hr");
  // Always enable the profile switcher for HR users
  // In a real app, this would come from authentication
  const isHRUser = true;

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
  };

  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader>
        <ProfileSwitcher
          roles={userData.roles}
          disabled={!isHRUser}
          onRoleChange={handleRoleChange}
        />
      </SidebarHeader>
      <SidebarContent>
        {activeRole === "hr" ? (
          <NavHR sections={hrNavData} />
        ) : (
          <NavEmployee items={employeeNavData} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
