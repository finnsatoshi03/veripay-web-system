import { today } from "@/features/employee/_lib/helpers";
import ActiveEmployeeBoard from "./components/active-employee-board";
import { Separator } from "@/components/ui/separator";
import { AttendanceStats } from "@/features/employee/attendance/components/attendance-stats";

export default function HrAccountRequests() {
  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
            <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Active Employee</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <AttendanceStats />
        </div>
      </div>


      <div className="relative h-full min-h-0 flex-1 overflow-auto">
        {/* <AccountRequestsBoard /> */}
        <ActiveEmployeeBoard />
      </div>
    </div>
  );
}
