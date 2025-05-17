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

const WEEKDAYS = ["Su", "M", "T", "W", "Th", "F", "Sa"];

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  attendanceStatus?: "present" | "absent" | "on-leave" | null;
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

  return (
    <div className="w-full">
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, index) => (
          <DayCell key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

function DayCell({ day }: { day: CalendarDay }) {
  if (!day.isCurrentMonth) {
    return <div className="h-16 w-full" />;
  }

  return (
    <div
      className={cn(
        "relative flex h-16 w-full items-center justify-center rounded-lg text-xs font-medium",
        day.isWeekend
          ? "bg-primary/20"
          : day.isFutureDate
            ? "bg-primary/10"
            : day.attendanceStatus === "on-leave"
              ? "bg-amber-200"
              : day.attendanceStatus === "present"
                ? "bg-primary text-primary-foreground"
                : "bg-rose-300",
        day.isToday && "text-secondary font-bold",
      )}
    >
      {format(day.date, "d")}
      {day.isToday && (
        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-current"></div>
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
      attendanceStatus: null,
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

    let attendanceStatus: CalendarDay["attendanceStatus"];

    if (record) {
      if (record.status) {
        attendanceStatus = record.status;
      } else if (record.time_in || record.time_out) {
        attendanceStatus = "present";
      } else {
        attendanceStatus = "absent";
      }
    } else {
      attendanceStatus = dayIsFuture ? null : "absent";
    }

    daysInCalendar.push({
      date,
      isCurrentMonth: true,
      attendanceStatus,
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
      attendanceStatus: null,
    });
  }

  return daysInCalendar;
}
