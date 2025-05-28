import type { PayrollPeriod as ServicePayrollPeriod } from "../mutations/payroll-service";

export type PayrollStatus = "processed" | "processing" | "scheduled";

export interface PayrollPeriod {
  id: string;
  period: string;
  status: PayrollStatus;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  startDate: string;
  endDate: string;
  rawData?: ServicePayrollPeriod; // Store original service data for dialog
}

export const mockPayrollPeriods: PayrollPeriod[] = [
  {
    id: "1",
    period: "April 16 - April 30, 2025",
    status: "processed",
    employeeCount: 139,
    totalGross: 1482000.0,
    totalDeductions: 276500.0,
    totalNet: 1205500.0,
    startDate: "2025-04-16",
    endDate: "2025-04-30",
  },
  {
    id: "2",
    period: "May 1 - May 15, 2025",
    status: "processed",
    employeeCount: 138,
    totalGross: 1460000.0,
    totalDeductions: 271200.0,
    totalNet: 1188800.0,
    startDate: "2025-05-01",
    endDate: "2025-05-15",
  },
  {
    id: "3",
    period: "May 16 - May 31, 2025",
    status: "processing",
    employeeCount: 138,
    totalGross: 1490000.0,
    totalDeductions: 282900.0,
    totalNet: 1207100.0,
    startDate: "2025-05-16",
    endDate: "2025-05-31",
  },
  {
    id: "4",
    period: "June 1 - June 15, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-06-01",
    endDate: "2025-06-15",
  },
  {
    id: "5",
    period: "June 16 - June 30, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-06-16",
    endDate: "2025-06-30",
  },
  {
    id: "6",
    period: "July 1 - July 15, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-07-01",
    endDate: "2025-07-15",
  },
  {
    id: "7",
    period: "July 16 - July 30, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-07-16",
    endDate: "2025-07-30",
  },
  {
    id: "8",
    period: "August 1 - August 15, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-08-01",
    endDate: "2025-08-15",
  },
  {
    id: "9",
    period: "August 16 - August 30, 2025",
    status: "scheduled",
    employeeCount: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    startDate: "2025-08-16",
    endDate: "2025-08-30",
  },
];
