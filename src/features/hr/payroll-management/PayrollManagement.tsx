import { PayrollManagementBoard } from "./components/payroll-management-board";
import { PayrollSummary } from "./components/payroll-summary";
import { today } from "@/features/employee/_lib/helpers";
import { usePayrollSummary } from "./mutations/payroll-service";
import { useSearchParams } from "react-router-dom";

export default function PayrollManagement() {
  const [searchParams] = useSearchParams();
  const { data: payrollData, isLoading } = usePayrollSummary();

  const summaryItems = [
    {
      label: "Last Payroll Date",
      value: isLoading
        ? "Loading..."
        : payrollData?.lastPayrollDate || "No payroll processed yet",
    },
    {
      label: "Next Payroll Date",
      value: isLoading ? "Loading..." : payrollData?.nextPayrollDate || "TBD",
    },
  ];

  // Get payroll ID to open from URL parameters
  const payrollIdToOpen = searchParams.get("open");

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Payroll Management</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
        </div>
        <PayrollSummary items={summaryItems} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <PayrollManagementBoard payrollIdToOpen={payrollIdToOpen} />
      </div>
    </div>
  );
}
