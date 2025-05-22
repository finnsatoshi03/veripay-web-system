export type ReportPriority = "high" | "normal" | "low";
export type ReportStatus = "to_assign" | "assigned" | "in_progress" | "completed";
export type ReportCategory = "Attendance" | "Payroll" | "Benefits" | "Performance" | "Compliance";

export interface HrReport {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  assignee?: string;
  date: string;
  priority: ReportPriority;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export const mockHrReports: HrReport[] = [
  {
    id: "1",
    category: "Attendance",
    title: "Incorrect Work Hours",
    description: "Logged 6 hours instead of 8. Please verify against shift schedule.",
    date: "04/20/2025",
    priority: "high",
    status: "to_assign",
    createdAt: "2025-04-20T08:00:00Z",
    updatedAt: "2025-04-20T08:00:00Z",
  },
  {
    id: "2",
    category: "Attendance",
    title: "Late Clock-in Pattern",
    description: "Employee consistently clocking in 15 minutes late for the past week.",
    date: "04/20/2025",
    priority: "normal",
    status: "to_assign",
    createdAt: "2025-04-20T09:00:00Z",
    updatedAt: "2025-04-20T09:00:00Z",
  },
  {
    id: "3",
    category: "Payroll",
    title: "Overtime Calculation Discrepancy",
    description: "Logged 10 hours instead of 8. Please verify against shift schedule.",
    date: "05/20/2025",
    priority: "low",
    status: "to_assign",
    createdAt: "2025-05-20T10:00:00Z",
    updatedAt: "2025-05-20T10:00:00Z",
  },
  {
    id: "4",
    category: "Payroll",
    title: "Unreflected Overtime",
    description: "Filed OT not reflected in timesheet. Needs update.",
    assignee: "HR Manager",
    date: "04/18/2025",
    priority: "normal",
    status: "assigned",
    createdAt: "2025-04-18T11:00:00Z",
    updatedAt: "2025-04-18T14:00:00Z",
  },
  {
    id: "5",
    category: "Benefits",
    title: "Insurance Enrollment Issue",
    description: "Employee unable to enroll in health insurance plan.",
    assignee: "Benefits Coordinator",
    date: "05/20/2025",
    priority: "high",
    status: "assigned",
    createdAt: "2025-05-20T12:00:00Z",
    updatedAt: "2025-05-20T15:00:00Z",
  },
  {
    id: "6",
    category: "Performance",
    title: "Review Overdue",
    description: "Annual performance review is 2 weeks overdue.",
    assignee: "Team Lead",
    date: "04/15/2025",
    priority: "normal",
    status: "in_progress",
    createdAt: "2025-04-15T13:00:00Z",
    updatedAt: "2025-04-22T10:00:00Z",
  },
];