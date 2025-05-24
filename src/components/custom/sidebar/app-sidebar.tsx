import * as React from "react";
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

import { useUser } from "@/store/userStore";

const employeeNavData = [
  {
    label: "Personal",
    menuItems: [
      {
        title: "Dashboard",
        url: "/employee/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        url: "/employee/profile",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Work Records",
    menuItems: [
      {
        title: "Attendance",
        url: "/employee/attendance",
        icon: CalendarCheck,
      },
      {
        title: "Payslips & Tax Docs",
        url: "/employee/payslips",
        icon: ReceiptText,
      },
      {
        title: "Reports",
        url: "/employee/reports",
        icon: FileText,
      },
    ],
  },
  {
    label: "Leave Management",
    menuItems: [
      {
        title: "Leave Overview",
        url: "/employee/leave-overview",
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
        url: "/hr/dashboard",
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
            url: "/hr/account-requests",
          },
          {
            title: "Add Employee",
            url: "/hr/add-employee",
          },
          {
            title: "Active Employees",
            url: "/hr/active-employee",
          },
          {
            title: "Department Assignment",
            url: "/hr/department-assignment",
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
        url: "/hr/reports",
        icon: ChartColumnBig,
      },
      {
        title: "Leave Management",
        url: "/hr/leave-management",
        icon: PlaneTakeoff,
      },
      {
        title: "Payroll Management",
        url: "/hr/payroll-management",
        icon: Wallet,
      },
      {
        title: "Announcements",
        url: "/hr/announcements",
        icon: Megaphone,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { fullName, email, role: userRole, profile } = useUser();

  const role = userRole as Role;
  const [activeRole, setActiveRole] = React.useState<Role>(role);

  React.useEffect(() => {
    setActiveRole(role);
  }, [role]);

  const isHRUser = role === "HR";

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
  };

  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader>
        <ProfileSwitcher
          role={role as Role}
          disabled={!isHRUser}
          onRoleChange={handleRoleChange}
        />
      </SidebarHeader>
      <SidebarContent>
        {activeRole === "HR" ? (
          <NavHR sections={hrNavData} />
        ) : (
          <NavEmployee items={employeeNavData} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: fullName || "User",
            email: email || "",
            avatar: profile?.profile_image || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
