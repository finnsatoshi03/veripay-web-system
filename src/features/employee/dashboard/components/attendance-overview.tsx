import { Button } from "@/components/ui/button";

import { mockAttendanceRecords } from "../lib/mock/mock-attendance";
import {
  calculateAverageCheckIn,
  findMostLateCheckIn,
  calculateAttendanceStreak,
} from "../lib/helpers/attendance";

import { AttendanceCalendar } from "./attendance-calendar";

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
        <Button variant="outline" size="sm">
          See all
        </Button>
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
