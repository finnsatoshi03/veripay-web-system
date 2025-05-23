import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  startOfWeek as startOfWeekFn,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LeaveRequest } from "@/features/hr/_lib/types";

type LeaveCalendarProps = {
  leaveRequests: LeaveRequest[];
};

type LeaveSpan = {
  leave: LeaveRequest;
  startDay: number; // day index in the grid
  endDay: number; // day index in the grid
  week: number; // week row
  colStart: number; // column start (0-6)
  colSpan: number; // how many columns it spans
};

export const LeaveCalendar = ({ leaveRequests }: LeaveCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeekFn(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getApprovedLeaves = () => {
    return leaveRequests.filter((leave) => leave.status === "approved");
  };

  const calculateLeaveSpans = (): LeaveSpan[] => {
    const approvedLeaves = getApprovedLeaves();
    const spans: LeaveSpan[] = [];

    approvedLeaves.forEach((leave) => {
      const leaveStart = parseISO(leave.start_date);
      const leaveEnd = parseISO(leave.end_date);

      // Find all days this leave appears in our calendar grid
      const leaveDays: number[] = [];
      days.forEach((day, index) => {
        if (day >= leaveStart && day <= leaveEnd) {
          leaveDays.push(index);
        }
      });

      if (leaveDays.length === 0) return;

      // Group consecutive days into spans (handles week boundaries)
      let currentSpanStart = leaveDays[0];
      let currentSpanEnd = leaveDays[0];

      for (let i = 1; i <= leaveDays.length; i++) {
        const currentDay = leaveDays[i];
        const previousDay = leaveDays[i - 1];

        // Check if we're at the end or there's a week break
        const isEndOfSpan =
          i === leaveDays.length ||
          currentDay !== previousDay + 1 ||
          Math.floor(previousDay / 7) !== Math.floor(currentDay / 7);

        if (isEndOfSpan) {
          const week = Math.floor(currentSpanStart / 7);
          const colStart = currentSpanStart % 7;
          const colEnd = currentSpanEnd % 7;
          const colSpan = colEnd - colStart + 1;

          spans.push({
            leave,
            startDay: currentSpanStart,
            endDay: currentSpanEnd,
            week,
            colStart,
            colSpan,
          });

          if (i < leaveDays.length) {
            currentSpanStart = currentDay;
            currentSpanEnd = currentDay;
          }
        } else {
          currentSpanEnd = currentDay;
        }
      }
    });

    return spans;
  };

  const getLeaveColor = (leaveType: string) => {
    switch (leaveType.toLowerCase()) {
      case "vacation leave":
      case "vacation":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "sick leave":
      case "sick":
        return "bg-red-100 border-red-300 text-red-800";
      case "emergency leave":
      case "emergency":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "bereavement leave":
      case "bereavement":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const leaveSpans = calculateLeaveSpans();

  return (
    <div className="w-full space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="w-full">
        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div
              key={i}
              className="text-muted-foreground py-2 text-center text-xs font-medium uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid with relative positioning for absolute spans */}
        <div className="relative">
          {/* Base calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={i}
                  className={cn(
                    "relative min-h-[100px] rounded-md border p-1",
                    !isCurrentMonth && "bg-muted/30 opacity-50",
                    isToday && "bg-accent border-accent-foreground",
                  )}
                >
                  <div className="text-right text-sm font-medium">
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Absolute positioned leave spans */}
          {leaveSpans.map((span, index) => {
            const leaveColor = getLeaveColor(span.leave.leave_type_id.name);
            const isFirstSpan =
              leaveSpans.findIndex((s) => s.leave.id === span.leave.id) ===
              index;

            return (
              <div
                key={`${span.leave.id}-${span.week}-${span.colStart}`}
                className={cn(
                  "absolute z-10 flex items-center rounded px-2 py-1 text-xs font-medium",
                  leaveColor,
                  "border-l-4",
                )}
                style={{
                  top: `${span.week * 104 + 28}px`, // 100px min-height + 4px gap + 28px for day number
                  left: `${(span.colStart * 100) / 7 + span.colStart * 0.25}%`,
                  width: `${(span.colSpan * 100) / 7 - 0.125}%`,
                  height: "20px",
                }}
              >
                <span className="truncate">
                  {isFirstSpan && (
                    <>
                      {span.leave.employee_id.user_id.user_profiles.first_name}{" "}
                      {span.leave.employee_id.user_id.user_profiles.last_name}
                      {span.colSpan >= 3 && (
                        <span className="ml-1 opacity-75">
                          ({span.leave.leave_type_id.name})
                        </span>
                      )}
                    </>
                  )}
                  {!isFirstSpan && span.colSpan >= 2 && (
                    <span className="opacity-75">
                      {span.leave.leave_type_id.name}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
