import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CalendarView } from "./components/calendar-view";
import { AttendanceStats } from "./components/attendance-stats";
import { AttendanceSummary } from "./components/attendance-summary";

import { today } from "../_lib/helpers";

export default function EmployeeAttendance() {
  const summaryItems = [
    { label: "Total Attendance", value: "5 days" },
    { label: "Total Hours", value: "40 hours" },
    { label: "Ave. Check-in", value: "08:00 AM" },
    { label: "Ave. Check-out", value: "05:00 PM" },
  ];

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Attendance History</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <AttendanceStats />
        </div>
        <AttendanceSummary items={summaryItems} />
      </div>

      {/* Calendar View */}
      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        <CalendarView />
      </ScrollArea>
    </div>
  );
}
