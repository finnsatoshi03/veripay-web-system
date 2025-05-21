import { ScrollArea } from "@/components/ui/scroll-area";

import { EmployeeSummary } from "./components/employee-summary";
import { AttendanceOverview } from "./components/attendance-overview";
import { PayrollSummary } from "./components/payroll-summary";

export default function HrDashboard() {
  return (
    <div className="grid h-full gap-4 !overflow-hidden lg:grid-cols-[0.6fr_1fr] xl:grid-cols-[0.7fr_1fr]">
      {/* First column with scrolling */}
      <ScrollArea className="flex h-full min-h-0">
        <div className="space-y-4">
          <EmployeeSummary />
          <AttendanceOverview />
        </div>
      </ScrollArea>

      <ScrollArea className="flex h-full min-h-0">
        <div className="space-y-4">
          <PayrollSummary />
        </div>
      </ScrollArea>
    </div>
  );
}
