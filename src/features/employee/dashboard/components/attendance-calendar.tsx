import { useMemo } from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  getDay,
  isFuture,
  isToday,
} from "date-fns";

import type { Attendance_record } from "@/lib/types";
import { cn } from "@/lib/utils";
import { attendance_config } from "@/lib/configs/hr-config";

const WEEKDAYS = ["Su", "M", "T", "W", "Th", "F", "Sa"];

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  attendance?: Attendance_record;
  isToday: boolean;
  isWeekend: boolean;
  isFutureDate: boolean;
};

interface AttendanceCalendarProps {
  records: Attendance_record[];
  month?: Date;
}

export function AttendanceCalendar({
  records,
  month = new Date(),
}: AttendanceCalendarProps) {
  const calendar = useMemo(
    () => buildCalendar(month, records),
    [month, records],
  );

  const isLate = (timeIn: string | undefined) => {
    if (!timeIn) return false;
    const configTimeIn = attendance_config.time_in;
    return timeIn > configTimeIn;
  };

  const getAttendanceStatusClass = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return "opacity-0";
    if (day.isFutureDate) return "bg-muted/30";

    const { attendance } = day;
    if (!attendance) return "bg-slate-100/50 border-slate-200";
    if (attendance.status === "on-leave")
      return "bg-yellow-100/50 border-yellow-300";
    if (!attendance.time_in || !attendance.time_out)
      return "bg-red-100/50 border-red-300";

    return isLate(attendance.time_in)
      ? "bg-secondary/20 border-secondary"
      : "bg-primary/20 border-primary";
  };

  const getAttendanceStatusText = (day: CalendarDay) => {
    if (!day.isCurrentMonth || day.isFutureDate) return "";

    const { attendance } = day;
    if (!attendance) return "";
    if (attendance.status === "on-leave") return "On leave";
    if (!attendance.time_in || !attendance.time_out) return "Absent";

    return isLate(attendance.time_in) ? "Late" : "On time";
  };

  return (
    <div className="w-full">
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium uppercase"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            statusClass={getAttendanceStatusClass(day)}
            statusText={getAttendanceStatusText(day)}
          />
        ))}
      </div>
    </div>
  );
}

function DayCell({
  day,
  statusClass,
  statusText,
}: {
  day: CalendarDay;
  statusClass: string;
  statusText: string;
}) {
  if (!day.isCurrentMonth) {
    return <div className="h-24 rounded-md border p-1 opacity-0" />;
  }

  return (
    <div
      className={cn(
        "h-24 rounded-md border p-1",
        day.isWeekend && !day.attendance && "bg-muted/10",
        day.isToday && "bg-accent",
      )}
    >
      <div className="text-right font-medium">{format(day.date, "d")}</div>

      {/* Show attendance status */}
      {(day.attendance || !day.isFutureDate) && (
        <div className={cn("mt-1 rounded border-l-4 p-1 text-xs", statusClass)}>
          <div className="font-medium">{statusText}</div>
        </div>
      )}
    </div>
  );
}

function buildCalendar(
  month: Date,
  records: Attendance_record[],
): CalendarDay[] {
  const firstDayOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);
  const firstDayIndex = getDay(firstDayOfMonth);
  const daysInCalendar: CalendarDay[] = [];

  const recordsByDate = records.reduce<Record<string, Attendance_record>>(
    (acc, record) => {
      const dateStr = record.date.includes("T")
        ? record.date.split("T")[0]
        : record.date;
      acc[dateStr] = record;
      return acc;
    },
    {},
  );

  for (let i = 0; i < firstDayIndex; i++) {
    daysInCalendar.push({
      date: addDays(firstDayOfMonth, i - firstDayIndex),
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false,
      isFutureDate: false,
    });
  }

  for (let day = 0; day < lastDayOfMonth.getDate(); day++) {
    const date = addDays(firstDayOfMonth, day);
    const dateStr = format(date, "yyyy-MM-dd");
    const record = recordsByDate[dateStr];
    const dayIsFuture = isFuture(date);
    const dayIsToday = isToday(date);
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    daysInCalendar.push({
      date,
      isCurrentMonth: true,
      attendance: record,
      isToday: dayIsToday,
      isWeekend,
      isFutureDate: dayIsFuture,
    });
  }

  const totalCells = Math.ceil(daysInCalendar.length / 7) * 7;
  const remainingCells = totalCells - daysInCalendar.length;

  for (let i = 1; i <= remainingCells; i++) {
    daysInCalendar.push({
      date: addDays(lastDayOfMonth, i),
      isCurrentMonth: false,
      isToday: false,
      isWeekend: false,
      isFutureDate: true,
    });
  }

  return daysInCalendar;
}
