import { AnnouncementOverview } from "./components/announcement-overview";
import { AttendanceOverview } from "./components/attendance-overview";

import { RecentPayslip } from "./components/recent-payslip";
import { LeaveSummary } from "./components/leave-summary";
import { ReportsStatus } from "./components/reports-status";

export default function EmployeeDashboard() {
  return (
    <div className="grid h-full min-h-0 flex-1 gap-4 overflow-y-auto lg:grid-cols-[1fr_0.6fr] xl:grid-cols-[1fr_0.4fr]">
      <div className="space-y-4">
        <AttendanceOverview />
        <AnnouncementOverview />
      </div>
      <div className="space-y-4">
        <RecentPayslip />
        <LeaveSummary />
        <ReportsStatus />
      </div>
    </div>
  );
}
