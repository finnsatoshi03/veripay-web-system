import { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  startOfDay,
  addHours,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  isSameMonth,
  isSameDay,
  differenceInDays,
  parseISO,
} from "date-fns";
import { useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { attendance_config } from "@/lib/configs/hr-config";
import type { Attendance_record } from "@/lib/types";
import { formatTime } from "@/lib/helpers/formatters";

import { useDateRangeStore, datePresets } from "@/store/dateRangeStore";
import { mockAttendanceRecords } from "@/features/employee/_lib/mock/mock-attendance";

type CalendarViewProps = {
  attendanceData?: Attendance_record[];
};

type ViewType = "week" | "month" | "year";

export const CalendarView = ({
  attendanceData = mockAttendanceRecords,
}: CalendarViewProps) => {
  const { pathname } = useLocation();
  const { dateRange, selectedPreset, selectPreset } = useDateRangeStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Determine view type based on selected preset
  const getViewTypeFromDateRange = (): ViewType => {
    if (!dateRange?.from || !dateRange?.to) return "week";

    const daysDifference = differenceInDays(dateRange.to, dateRange.from);

    if (daysDifference <= 7) return "week";
    if (daysDifference <= 31) return "month";
    return "year";
  };

  const viewType = getViewTypeFromDateRange();

  // Modify date presets for attendance route
  useEffect(() => {
    if (pathname.includes("/employee/attendance")) {
      const filteredPresets = [...datePresets];

      // Get the "This Week" preset as default
      let defaultPreset;
      for (const group of filteredPresets) {
        if (group.category === "Week") {
          defaultPreset = group.items.find((item) => item.name === "This Week");
          if (defaultPreset) break;
        }
      }

      // Select week view by default if no preset is selected
      if (!selectedPreset && defaultPreset) {
        selectPreset(defaultPreset);
      }
    }
  }, [pathname, selectedPreset, selectPreset]);

  useEffect(() => {
    if (dateRange?.from) {
      setCurrentDate(dateRange.from);
    }
  }, [dateRange?.from]);

  const isLate = (timeIn: string | undefined) => {
    if (!timeIn) return false;
    const configTimeIn = attendance_config.time_in;
    return timeIn > configTimeIn;
  };

  const getAttendanceForDate = (date: Date) => {
    return attendanceData.find((attendance) =>
      isSameDay(parseISO(attendance.date), date),
    );
  };

  const getAttendanceStatusClass = (
    attendance: Attendance_record | undefined,
  ) => {
    if (!attendance) return "bg-slate-100/50 border-slate-200";
    if (attendance.status === "on-leave")
      return "bg-yellow-100/50 border-yellow-300";
    if (!attendance.time_in || !attendance.time_out)
      return "bg-red-100/50 border-red-300";
    return isLate(attendance.time_in)
      ? "bg-secondary/20 border-secondary"
      : "bg-primary/20 border-primary";
  };

  const getTimeRangeClass = (attendance: Attendance_record | undefined) => {
    if (!attendance || !attendance.time_in || !attendance.time_out) return "";
    if (attendance.status === "on-leave") return "bg-yellow-100/30";
    return isLate(attendance.time_in) ? "bg-secondary/10" : "bg-primary/10";
  };

  const getAttendanceStatusText = (
    attendance: Attendance_record | undefined,
  ) => {
    if (!attendance) return "No record";
    if (attendance.status === "on-leave") return "On leave";
    if (!attendance.time_in || !attendance.time_out) return "Absent";
    return isLate(attendance.time_in) ? "Late" : "On time";
  };

  const calculateHourPosition = (timeString: string | undefined) => {
    if (!timeString) return 0;

    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      // Position is relative to 6 AM (our start time)
      return hours - 6 + minutes / 60;
    } catch {
      return 0;
    }
  };

  const getMinutePercentage = (timeString: string | undefined) => {
    if (!timeString) return 0;
    try {
      const minutes = parseInt(timeString.split(":")[1], 10);
      return (minutes / 60) * 100;
    } catch {
      return 0;
    }
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Hours from 6 AM to 8 PM
    const hours = eachHourOfInterval({
      start: addHours(startOfDay(currentDate), 6),
      end: addHours(startOfDay(currentDate), 20),
    });

    return (
      <div className="flex w-full flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="border-r"></div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`p-2 ${idx !== days.length - 1 && "border-r"}`}
            >
              <div className="text-muted-foreground text-xs font-medium uppercase">
                {format(day, "EEE")}
              </div>
              <div className="text-xl">{format(day, "d")}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8">
          {/* Time labels */}
          <div className="border-r">
            {hours.map((hour, idx) => (
              <div
                key={idx}
                className="text-muted-foreground flex h-12 items-start justify-end border-b p-1 pr-2 text-xs"
              >
                {format(hour, "h a")}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="col-span-7 grid w-full grid-cols-7">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="relative border-r last:border-r-0">
                {hours.map((_, hourIdx) => (
                  <div key={hourIdx} className="relative h-12 border-b">
                    {/* Empty cell for the grid */}
                  </div>
                ))}

                {/* Render attendance spans as overlays */}
                {(() => {
                  const attendance = getAttendanceForDate(day);
                  if (!attendance) return null;

                  const isAbsent = !attendance.time_in && !attendance.time_out;
                  if (isAbsent || attendance.status === "on-leave") {
                    return (
                      <div
                        className={cn(
                          "absolute right-0 left-0 z-10 border-l-4 px-2 py-1",
                          getAttendanceStatusClass(attendance),
                        )}
                        style={{
                          top: "0",
                          height: "48px", // Just one row height
                        }}
                      >
                        <span className="text-sm font-medium">
                          {getAttendanceStatusText(attendance)}
                        </span>
                      </div>
                    );
                  }

                  if (!attendance.time_in || !attendance.time_out) return null;

                  const timeInHour = calculateHourPosition(attendance.time_in);
                  const timeOutHour = calculateHourPosition(
                    attendance.time_out,
                  );

                  const timeInMinutePercent = getMinutePercentage(
                    attendance.time_in,
                  );
                  const timeOutMinutePercent = getMinutePercentage(
                    attendance.time_out,
                  );

                  const timeInTop = Math.floor(timeInHour) * 48; // 48px per hour (h-12)
                  const timeOutTop = Math.floor(timeOutHour) * 48;

                  const timeInOffset = (timeInMinutePercent / 100) * 48;
                  const timeOutOffset = (timeOutMinutePercent / 100) * 48;

                  const statusClass = getAttendanceStatusClass(attendance);
                  const timeRangeClass = getTimeRangeClass(attendance);
                  const isEmployeeLate = isLate(attendance.time_in);

                  return (
                    <>
                      {/* Time In Marker */}
                      <div
                        className={cn(
                          "absolute left-0 z-20 h-fit rounded-r border-l-4 px-1",
                          statusClass,
                        )}
                        style={{
                          top: `${timeInTop + timeInOffset}px`,
                        }}
                      >
                        <div className="text-xs">
                          <span className="ml-1 flex flex-col pr-1 font-medium">
                            {isEmployeeLate && (
                              <span className="text-secondary font-medium">
                                Late
                              </span>
                            )}
                            {!isEmployeeLate && (
                              <span className="text-primary font-medium">
                                On time
                              </span>
                            )}
                            {formatTime(attendance.time_in)}
                          </span>
                        </div>
                      </div>

                      {/* Time Out Marker */}
                      <div
                        className={cn(
                          "absolute right-0 z-20 rounded-l border-r-4 px-1 text-right",
                          statusClass,
                        )}
                        style={{
                          top: `${timeOutTop + timeOutOffset}px`,
                          height: "20px",
                        }}
                      >
                        <div className="text-xs whitespace-nowrap">
                          <span className="font-medium">
                            {formatTime(attendance.time_out)}
                          </span>
                        </div>
                      </div>

                      {/* Time Span */}
                      {timeInHour < timeOutHour && (
                        <div
                          className={cn(
                            "absolute right-0 left-0 z-10",
                            timeRangeClass,
                          )}
                          style={{
                            top: `${timeInTop + timeInOffset}px`,
                            height: `${timeOutTop + timeOutOffset - (timeInTop + timeInOffset)}px`,
                          }}
                        />
                      )}
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="w-full">
        <div className="mb-2 grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div
              key={i}
              className="py-2 text-center text-xs font-medium uppercase"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const attendance = getAttendanceForDate(day);
            const statusClass = getAttendanceStatusClass(attendance);

            return (
              <div
                key={i}
                className={cn(
                  "h-24 rounded-md border p-1",
                  !isSameMonth(day, monthStart) && "bg-muted opacity-30",
                  isSameDay(day, new Date()) && "bg-accent",
                )}
              >
                <div className="text-right">{format(day, "d")}</div>
                {attendance && (
                  <div
                    className={cn(
                      "mt-1 rounded border-l-4 p-1 text-xs",
                      statusClass,
                    )}
                  >
                    <div className="font-medium">
                      {getAttendanceStatusText(attendance)}
                    </div>
                    {attendance.time_in && attendance.time_out && (
                      <div>
                        {formatTime(attendance.time_in)} -{" "}
                        {formatTime(attendance.time_out)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return (
      <div className="grid w-full grid-cols-3 gap-4">
        {months.map((month, i) => (
          <div key={i} className="rounded-md border p-2">
            <div className="mb-2 text-center font-medium">
              {format(month, "MMMM")}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {eachDayOfInterval({
                start: startOfWeek(startOfMonth(month)),
                end: endOfWeek(endOfMonth(month)),
              }).map((day, dayIdx) => {
                const isCurrentMonth = isSameMonth(day, month);
                const hasAttendance = getAttendanceForDate(day);
                const statusClass = getAttendanceStatusClass(hasAttendance);

                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "rounded border-l-4 p-1 text-center text-xs",
                      !isCurrentMonth && "opacity-30",
                      hasAttendance && statusClass,
                      isSameDay(day, new Date()) && "border-accent",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-auto">
        {viewType === "week" && renderWeekView()}
        {viewType === "month" && renderMonthView()}
        {viewType === "year" && renderYearView()}
      </div>
    </div>
  );
};
