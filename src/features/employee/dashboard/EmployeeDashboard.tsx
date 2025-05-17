import { ScrollArea } from "@/components/ui/scroll-area";

import { AnnouncementOverview } from "./components/announcement-overview";
import { AttendanceOverview } from "./components/attendance-overview";
import { RecentPayslip } from "./components/recent-payslip";
import { LeaveSummary } from "./components/leave-summary";
import { ReportsStatus } from "./components/reports-status";

export default function EmployeeDashboard() {
  return (
    <div className="grid h-full gap-4 !overflow-hidden lg:grid-cols-[1fr_0.6fr] xl:grid-cols-[1fr_0.4fr]">
      {/* First column with scrolling */}
      <ScrollArea className="flex h-full min-h-0">
        <div className="space-y-4">
          <AttendanceOverview />
          <AnnouncementOverview />
        </div>
      </ScrollArea>

      {/* Second column with scrolling */}
      <ScrollArea className="flex h-full min-h-0">
        <div className="space-y-4">
          <RecentPayslip />
          <LeaveSummary />
          <ReportsStatus />
        </div>
      </ScrollArea>
    </div>
  );
}
