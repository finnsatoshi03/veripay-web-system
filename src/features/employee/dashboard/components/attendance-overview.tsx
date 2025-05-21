import { Button } from "@/components/ui/button";

import {
  calculateAverageCheckIn,
  findMostLateCheckIn,
  calculateAttendanceStreak,
} from "../lib/helpers/attendance";
import { mockAttendanceRecords } from "@/features/employee/_lib/mock/mock-attendance";

import { AttendanceCalendar } from "./attendance-calendar";
import { Link } from "react-router-dom";

export const AttendanceOverview = () => {
  // Calculate statistics from mock data
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const averageCheckIn = calculateAverageCheckIn(mockAttendanceRecords);
  const mostLateCheckIn = findMostLateCheckIn(mockAttendanceRecords);

  const { count: streakCount, emoji: streakEmoji } = calculateAttendanceStreak(
    mockAttendanceRecords,
  );

  return (
    <div className="w-full space-y-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Attendance Overview - {currentMonth}
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
          <p className="text-3xl font-semibold">{averageCheckIn}</p>
          <p className="text-muted-foreground text-sm">Average Check-in</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">{mostLateCheckIn}</p>
          <p className="text-muted-foreground text-sm">Most Late Check-in</p>
        </div>
        <div>
          <p className="text-3xl font-semibold">
            {streakEmoji} {streakCount}
          </p>
          <p className="text-muted-foreground text-sm">Attendance Streak</p>
        </div>
      </div>

      <div className="bg-border -mx-2 h-px px-2" />
      <AttendanceCalendar records={mockAttendanceRecords} />
    </div>
  );
};
