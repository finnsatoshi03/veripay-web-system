import { today } from "@/features/employee/_lib/helpers";
import EmployeePayslipsBoard from "./components/employee-payslips-board";
import { Separator } from "@/components/ui/separator";
import { PayslipsSummary } from "./components/payslips-summary";
import { PayslipsStats } from "./components/payslips-stats";

export default function EmployeePayslips() {
  const summaryItems = [
    { label: "Gross Pay", value: "₱16,000.00" },
    { label: "Deductions", value: "₱1,200.00" },
    { label: "Net Pay", value: "₱15,000.00" },
  ];

  // Mock data for payslips stats - replace with actual data
  const payslipsStatsData = {
    netPay: 80,
    deductions: 20,
    paid: 95, // percentage of payslips that are paid
  };

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Employee Payslips</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <PayslipsStats percentages={payslipsStatsData} />
        </div>
        <PayslipsSummary items={summaryItems} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <EmployeePayslipsBoard />
      </div>
    </div>
  );
}