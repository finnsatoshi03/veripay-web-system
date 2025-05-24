import { Link } from "react-router-dom";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Error } from "@/features/error";
import { useUserStore } from "@/store/userStore";

import { AttendanceCalendar } from "./attendance-calendar";
import { useAttendanceOverview } from "../mutations/useAttendanceOverview";

export const AttendanceOverview = () => {
  const { employee } = useUserStore();
  const {
    data: attendanceData,
    isLoading,
    error,
  } = useAttendanceOverview(employee?.id);

  const displayMonth = format(new Date(), "MMMM");

  if (isLoading) {
    return (
      <div className="w-full space-y-2 rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="bg-border -mx-2 h-px px-2" />
        <div className="flex w-full items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-10 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="mb-2 h-10 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="mb-2 h-10 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="bg-border -mx-2 h-px px-2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <Error title="Error loading attendance data" />;
  }

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Attendance Overview - {displayMonth}
        </h2>
        <Link to="/employee/attendance">
          <Button variant="outline" size="sm">
            See all
          </Button>
        </Link>
      </div>
      <div className="bg-border -mx-2 h-px px-2" />
      <div className="flex w-full items-center justify-between">
        <div>
          <p className="text-3xl font-semibold">
            {attendanceData?.averageCheckIn || "N/A"}
          </p>
          <p className="text-muted-foreground text-sm">Average Check-in</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">
            {attendanceData?.mostLateCheckIn || "N/A"}
          </p>
          <p className="text-muted-foreground text-sm">Most Late Check-in</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">
            {attendanceData?.streakEmoji || "🙂"}{" "}
            {attendanceData?.attendanceStreak || 0}
          </p>
          <p className="text-muted-foreground text-sm">Attendance Streak</p>
        </div>
      </div>

      <div className="bg-border -mx-2 h-px px-2" />
      {attendanceData?.attendanceRecords ? (
        <AttendanceCalendar records={attendanceData.attendanceRecords} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No attendance records found</p>
        </div>
      )}
    </div>
  );
};
