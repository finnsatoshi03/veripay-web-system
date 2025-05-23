import { Error } from "@/features/error";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CalendarView } from "./components/calendar-view";
import { AttendanceStats } from "./components/attendance-stats";
import { AttendanceSummary } from "./components/attendance-summary";

import { today } from "../_lib/helpers";
import { useAttendanceHistory } from "./mutations/useAttendanceHistory";

export default function EmployeeAttendance() {
  const { data: attendanceData, isLoading, error } = useAttendanceHistory();

  const summaryItems = attendanceData?.summaryData
    ? [
        {
          label: "Total Attendance",
          value: attendanceData?.summaryData.totalAttendance,
        },
        { label: "Total Hours", value: attendanceData?.summaryData.totalHours },
        {
          label: "Ave. Check-in",
          value: attendanceData?.summaryData.averageCheckIn,
        },
        {
          label: "Ave. Check-out",
          value: attendanceData?.summaryData.averageCheckOut,
        },
      ]
    : [
        { label: "Total Attendance", value: "0 days" },
        { label: "Total Hours", value: "0 hours" },
        { label: "Ave. Check-in", value: "N/A" },
        { label: "Ave. Check-out", value: "N/A" },
      ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading attendance data...
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title={`Error loading attendance data: ${error instanceof Error ? error.message : "Unknown error"}`}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 !overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Attendance History</h1>
            <p className="text-muted-foreground text-sm">{today}</p>
          </div>
          <Separator />
          <AttendanceStats
            percentages={attendanceData?.summaryData.percentages}
          />
        </div>
        <AttendanceSummary items={summaryItems} />
      </div>

      {/* Calendar View */}
      <ScrollArea className="min-h-0 flex-1 overflow-auto">
        <CalendarView
          attendanceData={attendanceData?.attendanceRecords || []}
        />
      </ScrollArea>
    </div>
  );
}
