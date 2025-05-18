import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import {
  useDateRangeStore,
  datePresets,
  type PresetItem,
} from "@/store/dateRangeStore";

export const DateRangePicker = () => {
  const { pathname } = useLocation();
  const calendarRef = useRef<HTMLDivElement>(null);

  const {
    dateRange,
    selectedPreset,
    calendarMonth,
    setDateRange,
    setCalendarMonth,
    selectPreset,
    clearSelection,
  } = useDateRangeStore();

  const filteredPresets = useMemo(() => {
    if (pathname.includes("/employee/attendance")) {
      return datePresets.filter(
        (group) => group.category !== "Range" && group.category !== "Day",
      );
    }
    return datePresets;
  }, [pathname]);

  useEffect(() => {
    if (!dateRange) {
      if (pathname.includes("employee/attendance")) {
        for (const group of datePresets) {
          if (group.category === "Week") {
            const weekPreset = group.items.find(
              (item) => item.name === "This Week",
            );
            if (weekPreset) {
              selectPreset(weekPreset);
              break;
            }
          }
        }
      } else {
        // Default to "This Month" for other pages
        const allTimePreset = datePresets[2].items[0];
        if (allTimePreset) {
          selectPreset(allTimePreset);
        }
      }
    }
  }, [pathname, dateRange, selectPreset]);

  const allowedRoutes = [
    "/employee/attendance",
    "/employee/payslips",
    "/hr/active-employee",
    "/hr/reports",
  ];

  const shouldDisplay = allowedRoutes.some((route) => pathname.includes(route));

  const isPresetActive = (preset: PresetItem) => {
    if (!dateRange?.from || !dateRange?.to) return false;

    if (!(dateRange.from instanceof Date) || !(dateRange.to instanceof Date))
      return false;

    const presetRange = preset.getValue();

    try {
      const fromMatch =
        presetRange.from.getFullYear() === dateRange.from.getFullYear() &&
        presetRange.from.getMonth() === dateRange.from.getMonth() &&
        presetRange.from.getDate() === dateRange.from.getDate();

      const toMatch =
        presetRange.to.getFullYear() === dateRange.to.getFullYear() &&
        presetRange.to.getMonth() === dateRange.to.getMonth() &&
        presetRange.to.getDate() === dateRange.to.getDate();

      return fromMatch && toMatch;
    } catch {
      toast.error("Error comparing dates");
      return false;
    }
  };

  const handlePresetSelect = (preset: PresetItem) => {
    selectPreset(preset);

    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  if (!shouldDisplay) return null;

  const formatSafeDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date)) return "";
    try {
      return format(date, "LLL dd, y");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error formatting date: ${error.message}`);
      } else {
        toast.error(`Error formatting date: ${String(error)}`);
      }
      return "";
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-fit justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {dateRange?.from && dateRange?.from instanceof Date ? (
              dateRange.to && dateRange.to instanceof Date ? (
                <>
                  {formatSafeDate(dateRange.from)} -{" "}
                  {formatSafeDate(dateRange.to)}
                  {" |"}
                  <span className="text-muted-foreground text-xs">
                    {selectedPreset?.name}
                  </span>
                </>
              ) : (
                formatSafeDate(dateRange.from)
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="p-3" ref={calendarRef}>
              <Calendar
                mode="range"
                defaultMonth={
                  calendarMonth instanceof Date ? calendarMonth : new Date()
                }
                month={
                  calendarMonth instanceof Date ? calendarMonth : new Date()
                }
                onMonthChange={setCalendarMonth}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </div>
            <div className="border-l p-3">
              <div className="grid grid-cols-2 gap-2">
                {filteredPresets.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <h4 className="text-muted-foreground text-sm font-medium">
                      {group.category}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {group.items.map((preset) => {
                        const isActive = isPresetActive(preset);
                        return (
                          <Button
                            key={preset.name}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            className="justify-start font-normal"
                            onClick={() => handlePresetSelect(preset)}
                          >
                            {preset.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2 p-3">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (dateRange) {
                  // Apply the selected date range (handled by the store)
                }
              }}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
