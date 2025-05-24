export type PayslipStatus = "Paid" | "Generated" | "Voided";

export interface EmployeePayslip {
  id: string;
  period: string;
  netPay: number;
  status: PayslipStatus;
  datePaid: string;
  employeeName?: string;
  employeeId?: string;
}

export const mockEmployeePayslips: EmployeePayslip[] = [
  {
    id: "1",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "2",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Generated",
    datePaid: "April 30",
  },
  {
    id: "3",
    period: "April 15-30, 2025",
    netPay: 1000,
    status: "Voided",
    datePaid: "April 30",
  },
  {
    id: "4",
    period: "April 01-15, 2025",
    netPay: 150,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "5",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "6",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "7",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "8",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
  {
    id: "9",
    period: "April 15-30, 2025",
    netPay: 15000,
    status: "Paid",
    datePaid: "April 30",
  },
];