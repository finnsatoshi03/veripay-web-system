import { PayrollManagementBoard } from "./components/payroll-management-board";
import { PayrollSummary } from "./components/payroll-summary";
// import PayrollHeader from "./components/PayrollHeader";
import { today } from "@/features/employee/_lib/helpers";
import { getCurrentPayrollPeriod, getNextCutOff } from "./lib/helper/helper";

export default function PayrollManagement() {
  const summaryItems = [
    { label: "Current Payroll Period", value: getCurrentPayrollPeriod() },
    { label: "Next Cut-off", value: getNextCutOff() },
  ];

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      {/* <PayrollHeader /> */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Payroll Management</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
        </div>
        {/* <ActiveSummary items={summaryItems} /> */}
        <PayrollSummary items={summaryItems} />
      </div>

      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        <PayrollManagementBoard />
      </div>
    </div>
  );
}